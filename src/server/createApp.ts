import express from "express";
import z from "zod";
import { getRegistrationOptions } from "./getRegistrationoptions.ts";
import { createDb } from "./createDb.ts";
import { dbHandlerBuilder } from "./dbHandler.ts";
import { randomUUID } from "crypto";
import { existsSync, unlinkSync } from "fs";
import { migrateDb } from "./migrateDb.ts";
import {
  verifyRegistrationResponse,
  type VerifiedRegistrationResponse,
} from "@simplewebauthn/server";
import { relyingParty } from "./relyingParty.ts";

export function createApp() {
  const app = express();
  const PORT = 3000;
  const dbPath = "./src/server/db/db.sqlite";
  if (existsSync(dbPath)) unlinkSync(dbPath);
  const dbHandler = dbHandlerBuilder(migrateDb(createDb(dbPath)));

  app.use(express.json());

  app.get("/api/helloworld", (req, res) => {
    res.json({ hello: "world" });
  });

  app.post("/api/register/options", async (req, res) => {
    const { data, error } = z.object({ email: z.string() }).safeParse(req.body);

    if (error) return res.status(400).json(error);

    const registrationOptions = await getRegistrationOptions(data.email);

    const user = {
      id: randomUUID(),
      email: data.email,
      passkeyOptionsJson: JSON.stringify(registrationOptions),
    };
    dbHandler.insertUser({
      ...user,
      registrationStatus: "IN_PROGRESS",
    });
    return res.json(user);
  });

  app.post("api/register/verify", async (req, res) => {
    // TODO this should probably come from an HTTP-Only Token or sth. like that
    const { data, error: payloadError } = z
      .object({ userId: z.string() })
      .safeParse(req.body);
    if (payloadError) return res.status(400).json(payloadError);

    const user = dbHandler.getUserById(data.userId);
    const passkeyOptionsJson = JSON.parse(user.passkeyOptionsJson ?? "null");
    const { error, data: challenge } = z
      .string()
      .safeParse(passkeyOptionsJson.challenge);
    if (error) return res.status(404).json(error);

    let verification: VerifiedRegistrationResponse;
    try {
      verification = await verifyRegistrationResponse({
        response: req.body, // return value of @simplewebauthn/browser/startRegistration()
        expectedChallenge: challenge,
        expectedOrigin: relyingParty.origin,
        expectedRPID: relyingParty.id,
      });
    } catch (error) {
      console.error(error);
      return res.status(400).send({ error });
    }

    // TODO mark user as registrationStatus = complete

    return res.status(201).send(verification);
  });

  app.get("api/register/status", async (req, res) => {
    // TODO this should probably come from an HTTP-Only Token or sth. like that
    const { data, error } = z.object({ email: z.string() }).safeParse(req.body);
    if (error) return res.status(400).json(error);
    const registrationStatus = dbHandler.getRegistrationStatusByEmail(
      data.email,
    );

    return res.send({ registrationStatus });
  });

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });

  return app;
}

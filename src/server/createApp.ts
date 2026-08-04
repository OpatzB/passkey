import express from "express";
import z from "zod";
import { getRegistrationOptions } from "./getRegistrationoptions.ts";
import { createDb } from "./createDb.ts";
import { dbHandlerBuilder } from "./dbHandler.ts";
import { randomUUID } from "crypto";
import { existsSync, unlinkSync } from "fs";
import { migrateDb } from "./migrateDb.ts";

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
    // TODO (not needed for POC)
    // attach temporary cedentials to this email address
    dbHandler.prepareUserRegistration({
      id: randomUUID(),
      email: data.email,
      passkeyOptionsJson: JSON.stringify(registrationOptions),
    });
    // TODO
    // persist registrationOptions.challenge to DB
    return res.json(registrationOptions);
  });

  app.post("api/register/verify", async (req, res) => {
    // TODO this should probably come from an HTTP-Only Token or sth. like that
    const { email } = z.object({ email: z.string() }).parse(req.body);
    const registrationOptions = await getRegistrationOptions(email);
    return res.json(registrationOptions);
  });

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });

  return app;
}

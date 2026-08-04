// app.test.js
import { afterAll, aroundEach, describe, expect, it } from "vitest";
import { createDb } from "./createDb";
import { dbHandlerBuilder } from "./dbHandler";
import { migrateDb } from "./migrateDb";

describe("DB handler", () => {
  const db = migrateDb(createDb(":memory:"));
  const { getUserById, insertUser, getRegistrationStatusByEmail } =
    dbHandlerBuilder(db);

  const testUser = {
    id: "1",
    email: "Jim@Jim.Jim",
    passkeyOptionsJson: "mockJson",
    registrationStatus: "IN_PROGRESS",
  } as const;

  afterAll(() => {
    db.close();
  });

  aroundEach(async (runTest) => {
    db.exec("BEGIN TRANSACTION");
    try {
      await runTest();
      db.exec("ROLLBACK");
    } catch (error) {
      db.exec("ROLLBACK");
      throw error;
    }
  });

  it("getUserById", async () => {
    insertUser(testUser);
    const res = getUserById(testUser.id);

    expect(res).toEqual(testUser);
  });

  it("getRegistrationStatusByEmail", async () => {
    insertUser(testUser);
    const res = getRegistrationStatusByEmail(testUser.email);

    expect(res).toEqual(testUser.registrationStatus);
  });

  it("getRegistrationStatusByEmail - find no user", async () => {
    // insertUser(testUser);
    const res = getRegistrationStatusByEmail(testUser.email);

    expect(res).toEqual("NON_EXISTING");
  });
});

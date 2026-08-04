// app.test.js
import { afterAll, aroundEach, describe, expect, it } from "vitest";
import { createDb } from "./createDb";
import { dbHandlerBuilder } from "./dbHandler";
import { migrateDb } from "./migrateDb";

describe("DB handler", () => {
  const db = migrateDb(createDb(":memory:"));
  const { getUserById, prepareUserRegistration } = dbHandlerBuilder(db);

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

  it("write and read user", async () => {
    const testUser = {
      id: "1",
      email: "Jim@Jim.Jim",
      passkeyOptionsJson: "mockJson",
    };

    prepareUserRegistration(testUser);
    const res = getUserById(testUser.id);

    expect(res).toEqual(testUser);
  });
});

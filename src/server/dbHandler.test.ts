// app.test.js
import { afterAll, aroundEach, describe, expect, it } from "vitest";
import { createDb } from "./createDb";
import { dbHandlerBuilder } from "./dbHandler";
import { migrateDb } from "./migrateDb";
import type { User } from "./zod";

describe("DB handler", () => {
  const db = migrateDb(createDb(":memory:"));
  const { getUserById, addUser } = dbHandlerBuilder(db);

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
    const testUser: User = { id: 1, name: "Jim" };

    addUser(testUser);
    const res = getUserById(testUser.id);

    expect(res).toEqual(testUser);
  });
});

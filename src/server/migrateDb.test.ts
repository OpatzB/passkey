// app.test.js
import { existsSync, unlinkSync } from "fs";
import { afterEach, beforeEach, describe, it } from "vitest";
import { createDb } from "./createDb";
import { migrateDb } from "./migrateDb";

describe("DB migration", () => {
  let db = null as unknown as ReturnType<typeof createDb>;
  const path = "./src/server/db/db_test.sqlite";

  beforeEach(() => {
    if (existsSync(path)) unlinkSync(path);

    db = createDb(path);
  });

  afterEach(() => {
    db.close();
  });

  it("initialises DB schmea", async () => {
    migrateDb(db);
  });
});

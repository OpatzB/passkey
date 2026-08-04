import { type Database } from "better-sqlite3";

export function migrateDb(db: Database) {
  db.exec(`
        CREATE TABLE users (
          id INTEGER PRIMARY KEY,
          name TEXT NOT NULL
        );
    `);

  return db;
}

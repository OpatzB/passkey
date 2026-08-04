import { type Database } from "better-sqlite3";

const migrations = [
  `
    CREATE TABLE user (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      passkeyOptionsJson TEXT,
      registrationStatus TEXT
    );
  `,
  `
    CREATE TABLE passkey (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      publicKey BLOB NOT NULL,
      webauthnUserID TEXT NOT NULL,
      counter INTEGER NOT NULL,
      deviceType TEXT NOT NULL,
      backedUp BOOLEAN,
      transports TEXT NOT NUll,
      FOREIGN KEY (user_id) REFERENCES user(id)
    );
  `,
];

export function migrateDb(db: Database) {
  migrations.forEach((migration) => db.exec(migration));
  return db;
}

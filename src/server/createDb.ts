import sqlite3, { type Options } from "better-sqlite3";

export function createDb(path: string | ":memory:", options?: Options) {
  const db = sqlite3(path, options);
  db.pragma("journal_mode = WAL");

  return db;
}

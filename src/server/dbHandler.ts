import type { Database } from "better-sqlite3";
import { userSchema, type User } from "./zod";

export function dbHandlerBuilder(db: Database) {
  return {
    getUserById: (id: User["id"]) => {
      const query = db.prepare("SELECT * FROM users WHERE id = ?");
      const user = query.get(id);
      return userSchema.parse(user);
    },
    addUser: (user: User) => {
      const query = db.prepare(
        "INSERT INTO users (id, name) VALUES (@id, @name)",
      );
      return query.run(user);
    },
  } as const;
}

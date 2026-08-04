import type { Database } from "better-sqlite3";
import { userSchema, type User } from "./zod.ts";

export function dbHandlerBuilder(db: Database) {
  return {
    getUserById: (id: User["id"]) => {
      const query = db.prepare("SELECT * FROM user WHERE id = ?");
      const user = query.get(id);
      return userSchema.parse(user);
    },
    prepareUserRegistration: (user: Required<User>) => {
      const query = db.prepare(
        "INSERT INTO user (id, email, passkeyOptionsJson) VALUES (@id, @email, @passkeyOptionsJson)",
      );
      return query.run(user);
    },
  } as const;
}

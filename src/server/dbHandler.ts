import type { Database } from "better-sqlite3";
import { userSchema, type User } from "./zod.ts";

export function dbHandlerBuilder(db: Database) {
  return {
    getUserById: (id: User["id"]) => {
      const query = db.prepare("SELECT * FROM user WHERE id = ?");
      const user = query.get(id);
      return userSchema.parse(user);
    },
    getRegistrationStatusByEmail: (email: User["email"]) => {
      const query = db.prepare("SELECT * FROM user WHERE email = ?");
      const user = query.get(email);
      return userSchema.parse(user).registrationStatus ?? "NON_EXISTING";
    },
    insertUser: (user: Required<User>) => {
      const query = db.prepare(
        "INSERT INTO user (id, email, passkeyOptionsJson, registrationStatus) VALUES (@id, @email, @passkeyOptionsJson, @registrationStatus)",
      );
      return query.run(user);
    },
  } as const;
}

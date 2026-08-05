import type { Database } from "better-sqlite3";
import { userSchema, type User } from "./zod.ts";
import z from "zod";

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
      return (
        userSchema.or(z.undefined()).parse(user)?.registrationStatus ??
        "NON_EXISTING"
      );
    },
    insertUser: (user: Required<User>) => {
      const query = db.prepare(
        "INSERT INTO user (id, email, passkeyOptionsJson, registrationStatus) VALUES (@id, @email, @passkeyOptionsJson, @registrationStatus)",
      );
      return query.run(user);
    },
    updateUserById: (
      user: Required<Pick<User, "id" | "registrationStatus">>,
    ) => {
      const query = db.prepare(
        "UPDATE user SET registrationStatus = ? WHERE id = ?",
      );
      return query.run(user.registrationStatus, user.id);
    },
  } as const;
}

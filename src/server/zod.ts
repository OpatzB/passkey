import z from "zod";

export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  passkeyOptionsJson: z.optional(z.string()),
});

export type User = z.infer<typeof userSchema>;

import z from "zod";

export const registrationStatusSchema = z
  .literal("IN_PROGRESS")
  .or(z.literal("COMPLETE").or(z.literal("NON_EXISTING")));
export type RegistrationStatus = z.infer<typeof registrationStatusSchema>;

export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  passkeyOptionsJson: z.optional(z.string()),
  registrationStatus: z.optional(registrationStatusSchema),
});

export type User = z.infer<typeof userSchema>;

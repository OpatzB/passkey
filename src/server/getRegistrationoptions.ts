import { generateRegistrationOptions } from "@simplewebauthn/server";
import { relyingParty } from "./relyingParty.ts";

export async function getRegistrationOptions(email: string) {
  const options: PublicKeyCredentialCreationOptionsJSON =
    await generateRegistrationOptions({
      rpName: relyingParty.name,
      rpID: relyingParty.id,
      userName: email,
      // Don't prompt users for additional information about the authenticator
      // (Recommended for smoother UX)
      attestationType: "none",
      authenticatorSelection: {
        // Defaults
        residentKey: "preferred",
        userVerification: "required",
        // Optional
        authenticatorAttachment: "platform",
      },
    });

  return options;
}

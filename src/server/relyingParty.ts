import { globals } from "../globals.ts";

export const relyingParty = {
  /**
   * Human-readable title for your website
   */
  name: "Passkey POC",
  /**
   * A unique identifier for your website. 'localhost' is okay for
   * local dev
   */
  id: globals.domain,
  /**
   * The URL at which registrations and authentications should occur.
   * 'http://localhost' and 'http://localhost:PORT' are also valid.
   * Do NOT include any trailing /
   */
  origin: globals.baseUrl,
};

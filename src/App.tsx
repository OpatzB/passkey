import { useGetRegistrationStatus } from "./hooks/useGetRegistrationStatus.ts";
import { useGetRegistrationOptions } from "./hooks/useGetRegistrationOptions.ts";
import { useState } from "react";
import { useDebounce } from "./hooks/useDebounce.ts";
import z from "zod";
import { startRegistration } from "@simplewebauthn/browser";
import { useVerifyRegistration } from "./hooks/useVerifyRegistration.ts";

export function App() {
  const [email, setEmail] = useState("");
  const debouncedEmail = useDebounce(email, 1000);

  const { data: registrationStatus } = useGetRegistrationStatus(debouncedEmail);
  return (
    <div>
      {(registrationStatus === "NON_EXISTING" || !registrationStatus) && (
        <RegisterMenu
          email={email}
          debouncedEmail={debouncedEmail}
          setEmail={setEmail}
        />
      )}
      {registrationStatus === "IN_PROGRESS" && "Registration in progress ..."}
      {registrationStatus === "COMPLETE" && "You are now registered!"}
    </div>
  );
}

function RegisterMenu(props: {
  email: string;
  debouncedEmail: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
}) {
  const getRegistrationOptions = useGetRegistrationOptions();
  const verifyRegistration = useVerifyRegistration();

  const { data: registrationStatus } = useGetRegistrationStatus(
    props.debouncedEmail,
  );

  const onRegister = async () => {
    if (
      (registrationStatus === "NON_EXISTING" || !registrationStatus) &&
      props.email
    ) {
      const resOptions = await getRegistrationOptions.mutateAsync(props.email);
      const optionsStr = z
        .object({ passkeyOptionsJson: z.string() })
        .parse(resOptions).passkeyOptionsJson;
      const optionsJSON = JSON.parse(optionsStr);
      const authenticatorResponse = await startRegistration({
        optionsJSON,
      });
      console.log("authenticatorResponse", authenticatorResponse);
      verifyRegistration.mutateAsync({
        userId: resOptions.id,
        authenticatorResponse,
      });
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="email"
        onChange={(e) => props.setEmail(e.target.value)}
      />
      <button type="button" onClick={onRegister}>
        Register
      </button>
    </div>
  );
}

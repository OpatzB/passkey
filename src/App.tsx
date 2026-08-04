import { useGetRegistrationStatus } from "./hooks/useGetRegistrationStatus.ts";
import { useGetRegistrationOptions } from "./hooks/useGetRegistrationOptions.ts";
import { useState } from "react";
import { useDebounce } from "./hooks/useDebounce.ts";

export function App() {
  const [email, setEmail] = useState("");
  const debouncedEmail = useDebounce(email, 1000);

  const { data: registrationStatus } = useGetRegistrationStatus(debouncedEmail);
  console.log("registrationStatus", registrationStatus);
  return (
    <div>
      {(registrationStatus === "NON_EXISTING" || !registrationStatus) && (
        <RegisterMenu email={email} setEmail={setEmail} />
      )}
      {registrationStatus === "IN_PROGRESS" && "Registration in progress ..."}
      {registrationStatus === "COMPLETE" && "You are now registered!"}
    </div>
  );
}

function RegisterMenu(props: {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
}) {
  const getRegistrationOptions = useGetRegistrationOptions();

  const { data: registrationStatus } = useGetRegistrationStatus(props.email);

  const onRegister = async () => {
    if (
      (registrationStatus === "NON_EXISTING" || !registrationStatus) &&
      props.email
    ) {
      await getRegistrationOptions.mutateAsync(props.email);
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

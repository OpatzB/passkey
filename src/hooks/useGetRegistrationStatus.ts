import { useQuery } from "@tanstack/react-query";
import { globals } from "../globals";
import { registrationStatusSchema, type User } from "../server/zod";
import z from "zod";

export function useGetRegistrationStatus(email: User["email"]) {
  return useQuery({
    queryKey: ["register", "status", email],
    queryFn: async () => {
      if (!email) return "NON_EXISTING" as const;

      const response = await fetch(`${globals.apiUrl}/register/status`, {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok", response.e);
      }
      const data = await response.json();
      return z
        .object({ registrationStatus: registrationStatusSchema })
        .parse(data).registrationStatus;
    },
    placeholderData: "NON_EXISTING" as const,
  });
}

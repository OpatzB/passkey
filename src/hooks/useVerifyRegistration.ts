import { useMutation, useQueryClient } from "@tanstack/react-query";
import { globals } from "../globals";
import type { User } from "../server/zod";
import type { RegistrationResponseJSON } from "@simplewebauthn/browser";

export function useVerifyRegistration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      userId: User["id"];
      authenticatorResponse: RegistrationResponseJSON;
    }) => {
      const response = await fetch(`${globals.apiUrl}/register/verify`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["register", "status"] });
    },
  });
}

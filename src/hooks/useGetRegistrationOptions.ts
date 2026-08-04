import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userSchema, type User } from "../server/zod";
import { globals } from "../globals";

export function useGetRegistrationOptions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (email: User["email"]) => {
      const response = await fetch(`${globals.apiUrl}/register/options`, {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return userSchema.parse(data);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["register", "status"] });
      console.log("onSuccress: ", res);
    },
  });
}

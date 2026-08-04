import z from "zod";
import "./App.css";
import { useQuery } from "@tanstack/react-query";
import { globals } from "./globals.ts";
import type { User } from "./server/zod.ts";

export function App() {
  const { data, isLoading } = useGetHelloWorld();
  useGetRegistrationOtions("foo@bar.com");

  return isLoading ? "loading..." : data?.hello;
}

function useGetHelloWorld() {
  return useQuery({
    queryKey: ["helloworld"],
    queryFn: async () => {
      const response = await fetch(`${globals.apiUrl}/helloworld`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      return z.object({ hello: z.string() }).parse(data);
    },
  });
}

function useGetRegistrationOtions(email: User["email"]) {
  return useQuery({
    queryKey: ["register", "options"],
    queryFn: async () => {
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
      return data;
    },
  });
}

import { useQuery } from "@tanstack/react-query";
import { globals } from "../globals";
import z from "zod";

export function useGetHelloWorld() {
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

import z from "zod";
import "./App.css";
import { useQuery } from "@tanstack/react-query";
import { globals } from "./globals";

export function App() {
  const { data, isLoading } = useGetHelloWorld();

  return isLoading ? "loading..." : data?.hello;
}

function useGetHelloWorld() {
  return useQuery({
    queryKey: ["api", "helloworld"],
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

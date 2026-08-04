import z from "zod";

const port = z.string().parse(import.meta.env.VITE_PORT);
const baseUrl = `http://localhost:${port}`;
const apiUrl = `${baseUrl}/api`;

export const globals = {
  port,
  baseUrl,
  apiUrl,
} as const;

import z from "zod";

const port = z.string().parse(process.env.VITE_PORT);
const domain = `localhost:${port}`;
const baseUrl = `http://${domain}`;
const apiUrl = `${baseUrl}/api`;

export const globals = {
  port,
  domain,
  baseUrl,
  apiUrl,
} as const;

import { defineConfig, loadEnv } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "VITE_");

  return {
    plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
    define: {
      "process.env.VITE_PORT": JSON.stringify(env.VITE_PORT),
    },
    server: {
      port: Number(env.VITE_PORT),
      proxy: {
        "/api": {
          target: "http://localhost:3000", // Backend server URL
          changeOrigin: false, // Modifies the Host header to match target
          // rewrite: (path) => path.replace(/^\/api/, ""), // Optional: strips '/api' prefix
        },
      },
    },
  };
});

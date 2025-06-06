import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      "Service-Worker-Allowed": "/",
    },
  },
  preview: {
    allowedHosts: ["bishell.online"],
  },
  publicDir: "public",
});

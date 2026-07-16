import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// LabBench — brand hub for the interactive engineering tools suite
export default defineConfig({
  server: { host: "::", port: 5185 },
  plugins: [react()],
});

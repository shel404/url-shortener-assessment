/// <reference types="vitest" />
import { defineConfig } from "vite";
import type { UserConfig as ViteConfig } from "vite";
import type { UserConfig as VitestConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
  },
} as ViteConfig & VitestConfig);

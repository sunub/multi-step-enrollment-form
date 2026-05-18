import path from "node:path";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { defineConfig } from "vitest/config";

const alias = {
  "@shared/mock": path.resolve(__dirname, "./packages/mock/main.ts"),
  "@shared/design-system": path.resolve(
    __dirname,
    "./packages/design-system/src/index.ts",
  ),
  "@shared/types": path.resolve(__dirname, "./packages/types/main.ts"),
};

export default defineConfig({
  plugins: [vanillaExtractPlugin()],
  resolve: {
    alias,
  },
  test: {
    name: "unit",
    include: [
      "src/**/*.{test,spec}.{ts,tsx}",
      "tests/unit/**/*.{test,spec}.{ts,tsx}",
      "packages/*/src/**/*.{test,spec}.{ts,tsx}",
    ],
    exclude: ["node_modules/**", "dist/**"],
    globals: true,
    environment: "jsdom",
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary", "json", "html", "lcovonly"],
      thresholds: {
        lines: 60,
        branches: 60,
        functions: 63,
        statements: 60,
      },
    },
    setupFiles: ["./tests/setup.ts"],
  },
});

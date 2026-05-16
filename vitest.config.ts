import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [vanillaExtractPlugin()],
	test: {
		name: "unit",
		include: [
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

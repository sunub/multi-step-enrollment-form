import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [],
	resolve: {
		tsconfigPaths: true,
	},
	test: {
		name: "unit",
		include: ["tests/unit/**/*.{test,spec}.{ts,tsx}"],
		exclude: ["node_modules/**", "dist/**"],
		globals: true,
		environment: "node",
		coverage: {
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

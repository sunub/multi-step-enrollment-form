import { defineConfig } from "tsup";

export default defineConfig({
	entry: {
		main: "main.ts",
		server: "src/server.ts",
		standalone: "src/standalone.ts",
	},
	format: ["esm"],
	dts: true,
	clean: true,
	tsconfig: "./tsconfig.json",
});

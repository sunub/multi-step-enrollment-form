import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { startMockServer } from "./server";

function parseEnvValue(rawValue: string) {
	const trimmed = rawValue.trim();
	if (
		(trimmed.startsWith('"') && trimmed.endsWith('"')) ||
		(trimmed.startsWith("'") && trimmed.endsWith("'"))
	) {
		return trimmed.slice(1, -1);
	}

	return trimmed;
}

function loadRootEnvFiles() {
	const currentDir = dirname(fileURLToPath(import.meta.url));
	const workspaceRoot = resolve(currentDir, "../../..");
	const envFiles = [
		resolve(workspaceRoot, ".env"),
		resolve(workspaceRoot, ".env.local"),
	];

	for (const envFile of envFiles) {
		if (!existsSync(envFile)) continue;

		const content = readFileSync(envFile, "utf8");
		for (const line of content.split(/\r?\n/)) {
			const normalized = line.trim();
			if (!normalized || normalized.startsWith("#")) continue;

			const exportLine = normalized.startsWith("export ")
				? normalized.slice(7).trim()
				: normalized;
			const separatorIndex = exportLine.indexOf("=");
			if (separatorIndex === -1) continue;

			const key = exportLine.slice(0, separatorIndex).trim();
			if (!key || process.env[key] !== undefined) continue;

			const rawValue = exportLine.slice(separatorIndex + 1);
			process.env[key] = parseEnvValue(rawValue);
		}
	}
}

loadRootEnvFiles();

const server = await startMockServer();
const address = server.address();

if (address && typeof address !== "string") {
	console.log(
		`Mock server listening on http://${address.address}:${address.port}`,
	);
}

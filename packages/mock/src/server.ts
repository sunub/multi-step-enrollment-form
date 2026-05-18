import type { Server } from "node:http";
import { createMockApp } from "./server/createMockApp";

export interface MockServerOptions {
	host?: string;
	port?: number;
}

export async function startMockServer(
	options: MockServerOptions = {},
): Promise<Server> {
	const host = options.host ?? process.env.MOCK_SERVER_HOST ?? "127.0.0.1";
	const port =
		options.port ??
		Number(process.env.MOCK_SERVER_PORT ?? process.env.PORT ?? 3101);

	const app = createMockApp();

	return new Promise((resolve) => {
		const server = app.listen(port, host, () => {
			resolve(server);
		});
	});
}

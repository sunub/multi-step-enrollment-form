import { startMockServer } from "./server";

const server = await startMockServer();
const address = server.address();

if (address && typeof address !== "string") {
	console.log(
		`Mock server listening on http://${address.address}:${address.port}`,
	);
}

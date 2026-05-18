import express, { type Express } from "express";
import { getFilteredCoursesGenerator } from "../courses/service";
import { submitEnrollment } from "../enrollments/service";
import { toMockErrorBody } from "../errors";

function getRandomErrorPercentage() {
	const rawPercentage = process.env.RANDOM_ERROR_PERCENTAGE;
	return rawPercentage !== undefined ? Number(rawPercentage) : 10;
}

export function createMockApp(): Express {
	const app = express();

	app.use((request, response, next) => {
		const requestOrigin = request.headers.origin;

		if (requestOrigin) {
			response.setHeader("Access-Control-Allow-Origin", requestOrigin);
			response.append("Vary", "Origin");
		} else {
			response.setHeader("Access-Control-Allow-Origin", "*");
		}

		response.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
		response.setHeader("Access-Control-Allow-Headers", "Content-Type");

		if (request.method === "OPTIONS") {
			response.sendStatus(204);
			return;
		}

		next();
	});

	app.use(express.json());

	app.get("/health", (_request, response) => {
		response.status(200).json({ status: "ok" });
	});

	app.get("/api/courses", (request, response) => {
		const category =
			typeof request.query.category === "string"
				? request.query.category
				: null;

		response.setHeader("Content-Type", "application/x-ndjson");

		for (const course of getFilteredCoursesGenerator(category)) {
			response.write(`${JSON.stringify(course)}\n`);
		}

		response.end();
	});

	app.post("/api/enrollments", async (request, response) => {
		try {
			const result = await submitEnrollment(request.body, {
				delayMs: 1000,
				demoUserId: process.env.DEMO_USER_ID,
				random: Math.random,
				randomErrorPercentage: getRandomErrorPercentage(),
			});

			response.status(200).json(result);
		} catch (error) {
			const result = toMockErrorBody(error);
			response.status(result.status).json(result.body);
		}
	});

	return app;
}

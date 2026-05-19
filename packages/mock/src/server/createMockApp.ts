import express, { type Express } from "express";
import { getFilteredCoursesGenerator } from "../courses/service";
import { getMockEnrollmentConfig } from "../enrollments/config";
import { submitEnrollment } from "../enrollments/service";
import { ServerError, toMockErrorBody } from "../errors";

function shouldFailCoursesRequest(
	randomErrorPercentage: number,
	random: () => number,
) {
	return random() * 100 < randomErrorPercentage;
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
		try {
			const category =
				typeof request.query.category === "string"
					? request.query.category
					: null;
			const config = getMockEnrollmentConfig(process.env);

			if (shouldFailCoursesRequest(config.randomErrorPercentage, Math.random)) {
				throw new ServerError("강의 목록을 불러오는데 실패했습니다.");
			}

			response.setHeader("Content-Type", "application/x-ndjson");

			for (const course of getFilteredCoursesGenerator(category)) {
				response.write(`${JSON.stringify(course)}\n`);
			}

			response.end();
		} catch (error) {
			const result = toMockErrorBody(error);
			response.status(result.status).json(result.body);
		}
	});

	app.post("/api/enrollments", async (request, response) => {
		try {
			const result = await submitEnrollment(request.body, {
				config: getMockEnrollmentConfig(process.env),
				delayMs: 1000,
				random: Math.random,
			});

			response.status(200).json(result);
		} catch (error) {
			const result = toMockErrorBody(error);
			response.status(result.status).json(result.body);
		}
	});

	return app;
}

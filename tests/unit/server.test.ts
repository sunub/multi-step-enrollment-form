import type { Server } from "node:http";
import { CourseSchema } from "@shared/types";
import {
	afterAll,
	afterEach,
	beforeAll,
	describe,
	expect,
	test,
	vi,
} from "vitest";
import type { z } from "zod";
import {
	Courses,
	createMockApp,
	getMockEnrollmentConfig,
} from "../../packages/mock/main";

type Course = z.infer<typeof CourseSchema>;

async function* streamToAsyncIterable(stream: ReadableStream<Uint8Array>) {
	const reader = stream.getReader();
	const decoder = new TextDecoder();
	let buffer = "";

	try {
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;

			buffer += decoder.decode(value, { stream: true });
			const lines = buffer.split("\n");
			buffer = lines.pop() || "";

			for (const line of lines) {
				if (line.trim()) {
					yield JSON.parse(line);
				}
			}
		}
	} finally {
		reader.releaseLock();
	}
}

describe("모의 서버 및 스트리밍 핸들러 테스트", () => {
	let server: Server;
	let apiUrl: string;

	beforeAll(async () => {
		const app = createMockApp();

		server = await new Promise<Server>((resolve) => {
			const nextServer = app.listen(0, "127.0.0.1", () => {
				resolve(nextServer);
			});
		});

		const address = server.address();
		if (!address || typeof address === "string") {
			throw new Error("테스트용 모킹 서버 주소를 확인할 수 없습니다.");
		}

		apiUrl = `http://${address.address}:${address.port}/api`;
	});

	afterAll(async () => {
		await new Promise<void>((resolve, reject) => {
			server.close((error) => {
				if (error) {
					reject(error);
					return;
				}

				resolve();
			});
		});
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	describe("GET /api/courses - 강의 목록 스트리밍 및 지연 평가 조회", () => {
		test("브라우저 cross-origin 요청을 위해 CORS 헤더를 반환해야 한다", async () => {
			const origin = "http://localhost:3000";
			const response = await fetch(`${apiUrl}/courses?category=development`, {
				headers: {
					Origin: origin,
				},
			});

			expect(response.status).toBe(200);
			expect(response.headers.get("Access-Control-Allow-Origin")).toBe(origin);
			expect(response.headers.get("Vary")).toContain("Origin");
		});

		test("CORS preflight 요청에 204로 응답해야 한다", async () => {
			const origin = "http://localhost:3000";
			const response = await fetch(`${apiUrl}/courses?category=development`, {
				method: "OPTIONS",
				headers: {
					Origin: origin,
					"Access-Control-Request-Method": "GET",
				},
			});

			expect(response.status).toBe(204);
			expect(response.headers.get("Access-Control-Allow-Origin")).toBe(origin);
			expect(response.headers.get("Access-Control-Allow-Methods")).toBe(
				"GET,POST,OPTIONS",
			);
			expect(response.headers.get("Access-Control-Allow-Headers")).toBe(
				"Content-Type",
			);
		});

		test("데이터를 NDJSON 스트림으로 반환하고 Async Iterator로 읽을 수 있어야 한다", async () => {
			const response = await fetch(`${apiUrl}/courses`);

			expect(response.status).toBe(200);
			expect(response.headers.get("Content-Type")).toBe("application/x-ndjson");
			expect(response.body).not.toBeNull();
			if (!response.body) {
				throw new Error("응답 본문이 비어 있습니다.");
			}

			const items: Course[] = [];
			for await (const course of streamToAsyncIterable(response.body)) {
				items.push(CourseSchema.parse(course));
				if (items.length >= 5) break;
			}

			expect(items.length).toBe(5);
			expect(items[0]).toHaveProperty("id");
			expect(items[0]).toHaveProperty("title");
		});

		test("페이지네이션 요청 시 올바른 구간의 데이터를 반환해야 한다 (지연 평가 시뮬레이션)", async () => {
			const category = "development";
			const page = 2;
			const limit = 10;
			const skip = (page - 1) * limit;

			const response = await fetch(`${apiUrl}/courses?category=${category}`);
			if (!response.body) {
				throw new Error("응답 본문이 비어 있습니다.");
			}
			const items: Course[] = [];
			let currentIndex = 0;

			for await (const course of streamToAsyncIterable(response.body)) {
				if (currentIndex >= skip && items.length < limit) {
					items.push(CourseSchema.parse(course));
				}
				currentIndex++;
				if (items.length >= limit) break;
			}

			expect(items.length).toBeLessThanOrEqual(limit);
			items.forEach((course) => {
				expect(course.category).toBe(category);
			});
		});

		test("RANDOM_ERROR_PERCENTAGE=0이면 강의 목록 요청은 실패하지 않아야 한다", async () => {
			vi.stubEnv("RANDOM_ERROR_PERCENTAGE", "0");
			const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0);

			const response = await fetch(`${apiUrl}/courses?category=development`);

			expect(response.status).toBe(200);
			expect(response.headers.get("Content-Type")).toBe("application/x-ndjson");

			randomSpy.mockRestore();
		});

		test("RANDOM_ERROR_PERCENTAGE=100이면 강의 목록 요청은 항상 실패해야 한다", async () => {
			vi.stubEnv("RANDOM_ERROR_PERCENTAGE", "100");
			const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0);

			const response = await fetch(`${apiUrl}/courses?category=development`);
			const data = await response.json();

			expect(response.status).toBe(500);
			expect(data.code).toBe("SERVER_ERROR");
			expect(data.message).toBe("강의 목록을 불러오는데 실패했습니다.");

			randomSpy.mockRestore();
		});

		test("RANDOM_ERROR_PERCENTAGE=30이면 설정한 확률 기준으로만 강의 목록 요청이 실패해야 한다", async () => {
			vi.stubEnv("RANDOM_ERROR_PERCENTAGE", "30");
			const failSpy = vi.spyOn(Math, "random").mockReturnValue(0.2);

			const failedResponse = await fetch(
				`${apiUrl}/courses?category=development`,
			);
			const failedData = await failedResponse.json();

			expect(failedResponse.status).toBe(500);
			expect(failedData.code).toBe("SERVER_ERROR");

			failSpy.mockRestore();

			const successSpy = vi.spyOn(Math, "random").mockReturnValue(0.31);

			const successResponse = await fetch(
				`${apiUrl}/courses?category=development`,
			);

			expect(successResponse.status).toBe(200);
			expect(successResponse.headers.get("Content-Type")).toBe(
				"application/x-ndjson",
			);

			successSpy.mockRestore();
		});
	});

	describe("POST /api/enrollments - 수강 신청", () => {
		const availableCourse =
			Courses.courses.find((c) => c.currentEnrollment < c.maxCapacity) ||
			Courses.courses[0];

		const validPersonalData = {
			courseId: availableCourse.id,
			type: "personal",
			applicant: {
				name: "홍길동",
				email: "test@example.com",
				phone: "010-1234-5678",
				motivation: "열심히 배우겠습니다.",
			},
			agreedToTerms: true,
		};

		test("개인 수강 신청이 성공적으로 완료되어야 한다", async () => {
			const response = await fetch(`${apiUrl}/enrollments`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(validPersonalData),
			});
			const data = await response.json();

			expect(response.status).toBe(200);
			expect(data).toHaveProperty("enrollmentId");
			expect(data.status).toBe("confirmed");
		});

		test("유효하지 않은 입력값 전송 시 400 에러를 반환해야 한다", async () => {
			const invalidData = {
				...validPersonalData,
				applicant: { ...validPersonalData.applicant, email: "invalid-email" },
			};

			const response = await fetch(`${apiUrl}/enrollments`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(invalidData),
			});
			const data = await response.json();

			expect(response.status).toBe(400);
			expect(data.code).toBe("INVALID_INPUT");
		});

		test("MOCK_ENROLLMENT_SCENARIO=1이면 모든 요청에 INVALID_INPUT을 강제해야 한다", async () => {
			vi.stubEnv("MOCK_ENROLLMENT_SCENARIO", "1");

			const response = await fetch(`${apiUrl}/enrollments`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(validPersonalData),
			});
			const data = await response.json();

			expect(response.status).toBe(400);
			expect(data.code).toBe("INVALID_INPUT");
		});

		test("MOCK_ENROLLMENT_SCENARIO=2이면 모든 요청에 COURSE_FULL을 강제해야 한다", async () => {
			vi.stubEnv("MOCK_ENROLLMENT_SCENARIO", "2");

			const response = await fetch(`${apiUrl}/enrollments`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(validPersonalData),
			});
			const data = await response.json();

			expect(response.status).toBe(409);
			expect(data.code).toBe("COURSE_FULL");
		});

		test("MOCK_ENROLLMENT_SCENARIO=0이면 정상 흐름으로 처리되어야 한다", async () => {
			vi.stubEnv("MOCK_ENROLLMENT_SCENARIO", "0");

			const response = await fetch(`${apiUrl}/enrollments`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(validPersonalData),
			});
			const data = await response.json();

			expect(response.status).toBe(200);
			expect(data.status).toBe("confirmed");
		});

		test("중복 신청 이메일은 별도 유저 설정 없이 DUPLICATE_ENROLLMENT를 반환해야 한다", async () => {
			const response = await fetch(`${apiUrl}/enrollments`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...validPersonalData,
					applicant: {
						...validPersonalData.applicant,
						email: "duplicate@test.com",
					},
				}),
			});
			const data = await response.json();

			expect(response.status).toBe(409);
			expect(data.code).toBe("DUPLICATE_ENROLLMENT");
		});

		test("잘못된 MOCK_ENROLLMENT_SCENARIO 값은 즉시 서버 에러가 되어야 한다", async () => {
			vi.stubEnv("MOCK_ENROLLMENT_SCENARIO", "9");

			const response = await fetch(`${apiUrl}/enrollments`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(validPersonalData),
			});
			const data = await response.json();

			expect(response.status).toBe(500);
			expect(data.code).toBe("SERVER_ERROR");
		});

		test("잘못된 RANDOM_ERROR_PERCENTAGE 값은 강의 목록 요청에서 즉시 서버 에러가 되어야 한다", async () => {
			vi.stubEnv("RANDOM_ERROR_PERCENTAGE", "abc");

			const response = await fetch(`${apiUrl}/courses?category=development`);
			const data = await response.json();

			expect(response.status).toBe(500);
			expect(data.code).toBe("SERVER_ERROR");
		});
	});

	describe("mock enrollment config", () => {
		test("MOCK_ENROLLMENT_SCENARIO=0은 강제 에러가 없어야 한다", () => {
			const config = getMockEnrollmentConfig({
				MOCK_ENROLLMENT_SCENARIO: "0",
			});

			expect(config.forcedScenario).toBeNull();
		});

		test("MOCK_ENROLLMENT_SCENARIO=1은 INVALID_INPUT으로 매핑되어야 한다", () => {
			const config = getMockEnrollmentConfig({
				MOCK_ENROLLMENT_SCENARIO: "1",
			});

			expect(config.forcedScenario).toBe("INVALID_INPUT");
		});

		test("MOCK_ENROLLMENT_SCENARIO=2는 COURSE_FULL로 매핑되어야 한다", () => {
			const config = getMockEnrollmentConfig({
				MOCK_ENROLLMENT_SCENARIO: "2",
			});

			expect(config.forcedScenario).toBe("COURSE_FULL");
		});

		test("RANDOM_ERROR_PERCENTAGE=0은 랜덤 실패를 비활성화해야 한다", () => {
			const config = getMockEnrollmentConfig({
				RANDOM_ERROR_PERCENTAGE: "0",
			});

			expect(config.randomErrorPercentage).toBe(0);
		});

		test("RANDOM_ERROR_PERCENTAGE=100은 항상 랜덤 실패 후보가 되어야 한다", () => {
			const config = getMockEnrollmentConfig({
				RANDOM_ERROR_PERCENTAGE: "100",
			});

			expect(config.randomErrorPercentage).toBe(100);
		});

		test("RANDOM_ERROR_PERCENTAGE는 0에서 100 사이로 보정되어야 한다", () => {
			const highConfig = getMockEnrollmentConfig({
				RANDOM_ERROR_PERCENTAGE: "150",
			});
			const lowConfig = getMockEnrollmentConfig({
				RANDOM_ERROR_PERCENTAGE: "-10",
			});

			expect(highConfig.randomErrorPercentage).toBe(100);
			expect(lowConfig.randomErrorPercentage).toBe(0);
		});

		test("잘못된 숫자는 에러를 던져야 한다", () => {
			expect(() =>
				getMockEnrollmentConfig({
					MOCK_ENROLLMENT_SCENARIO: "3",
				}),
			).toThrowError("MOCK_ENROLLMENT_SCENARIO must be 0, 1, or 2.");
		});

		test("잘못된 RANDOM_ERROR_PERCENTAGE는 에러를 던져야 한다", () => {
			expect(() =>
				getMockEnrollmentConfig({
					RANDOM_ERROR_PERCENTAGE: "NaN",
				}),
			).toThrowError(
				"RANDOM_ERROR_PERCENTAGE must be a number between 0 and 100.",
			);
		});
	});
});

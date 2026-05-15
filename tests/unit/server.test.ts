import type { CourseSchema } from "@shared/types";
import { beforeEach, describe, expect, test, vi } from "vitest";
import type { z } from "zod";

type Course = z.infer<typeof CourseSchema>;

describe("MSW 모의 서버 및 핸들러 테스트", () => {
	const API_URL = "https://example.com/api";

	beforeEach(() => {
		// 테스트마다 랜덤 에러 확률을 0으로 초기화
		vi.stubEnv("RANDOM_ERROR_PERCENTAGE", "0");
	});

	describe("GET /api/courses - 강의 목록 조회", () => {
		test("전체 강의 목록과 카테고리 목록을 반환해야 한다", async () => {
			const response = await fetch(`${API_URL}/courses`);
			const data = await response.json();

			expect(response.status).toBe(200);
			expect(data).toHaveProperty("courses");
			expect(data).toHaveProperty("categories");
			expect(Array.isArray(data.courses)).toBe(true);
			expect(data.courses.length).toBeGreaterThan(0);
		});

		test("카테고리 필터링이 올바르게 동작해야 한다", async () => {
			const category = "development";
			const response = await fetch(`${API_URL}/courses?category=${category}`);
			const data = (await response.json()) as { courses: Course[] };

			expect(response.status).toBe(200);
			data.courses.forEach((course) => {
				expect(course.category).toBe(category);
			});
		});
	});

	describe("POST /api/enrollments - 수강 신청", () => {
		const validPersonalData = {
			courseId: "course-0001",
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
			const response = await fetch(`${API_URL}/enrollments`, {
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

			const response = await fetch(`${API_URL}/enrollments`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(invalidData),
			});
			const data = await response.json();

			expect(response.status).toBe(400);
			expect(data.code).toBe("INVALID_INPUT");
			expect(data.details).toHaveProperty("applicant.email");
		});

		test("강의 정원이 초과된 경우 409 에러를 반환해야 한다", async () => {
			const fullCourseData = {
				...validPersonalData,
				courseId: "course-0022",
			};

			const response = await fetch(`${API_URL}/enrollments`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(fullCourseData),
			});
			const data = await response.json();

			expect(response.status).toBe(409);
			expect(data.code).toBe("COURSE_FULL");
		});

		test("중복 신청 시 409 에러를 반환해야 한다 (이메일 시뮬레이션)", async () => {
			const duplicateData = {
				...validPersonalData,
				applicant: {
					...validPersonalData.applicant,
					email: "duplicate@test.com",
				},
			};

			const response = await fetch(`${API_URL}/enrollments`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(duplicateData),
			});
			const data = await response.json();

			expect(response.status).toBe(409);
			expect(data.code).toBe("DUPLICATE_ENROLLMENT");
		});

		test("RANDOM_ERROR_PERCENTAGE 설정에 따라 랜덤 에러를 반환해야 한다", async () => {
			// 에러 발생 확률을 100%로 강제 설정
			vi.stubEnv("RANDOM_ERROR_PERCENTAGE", "100");

			const response = await fetch(`${API_URL}/enrollments`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(validPersonalData),
			});
			const data = await response.json();

			expect([400, 409]).toContain(response.status);
			expect(["INVALID_INPUT", "COURSE_FULL"]).toContain(data.code);
			expect(data.message).toContain("랜덤 에러");
		});
	});
});

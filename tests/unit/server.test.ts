import type { Server } from "node:http";
import { CourseSchema } from "@shared/types";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from "vitest";
import type { z } from "zod";
import { Courses, createMockApp, DemoUsers } from "../../packages/mock/main";

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

  beforeEach(() => {
    vi.stubEnv("RANDOM_ERROR_PERCENTAGE", "0");
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

    test("DEMO_USER_ID=user-0001이면 가이드의 성공 시나리오대로 동작해야 한다", async () => {
      const successCase = DemoUsers._testGuide.cases.유저1_성공;
      vi.stubEnv("DEMO_USER_ID", successCase.env.DEMO_USER_ID);

      const response = await fetch(`${apiUrl}/enrollments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(successCase.requestPayload),
      });
      const data = await response.json();

      expect(response.status).toBe(successCase.expectedStatus);
      expect(data.status).toBe("confirmed");
    });

    test("DEMO_USER_ID=user-0002이면 항상 COURSE_FULL 에러가 발생해야 한다", async () => {
      const fullCase = DemoUsers._testGuide.cases.유저2_정원초과;
      vi.stubEnv("DEMO_USER_ID", fullCase.env.DEMO_USER_ID);

      const response = await fetch(`${apiUrl}/enrollments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fullCase.requestPayload),
      });
      const data = await response.json();

      expect(response.status).toBe(fullCase.expectedStatus);
      expect(data.code).toBe(fullCase.expectedCode);
    });

    test("DEMO_USER_ID=user-0003이면 항상 DUPLICATE_ENROLLMENT 에러가 발생해야 한다", async () => {
      const duplicateCase = DemoUsers._testGuide.cases.유저3_중복신청;
      vi.stubEnv("DEMO_USER_ID", duplicateCase.env.DEMO_USER_ID);

      const response = await fetch(`${apiUrl}/enrollments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(duplicateCase.requestPayload),
      });
      const data = await response.json();

      expect(response.status).toBe(duplicateCase.expectedStatus);
      expect(data.code).toBe(duplicateCase.expectedCode);
    });

    test("DEMO_USER_ID가 있어도 잘못된 입력은 INVALID_INPUT이 우선되어야 한다", async () => {
      const duplicateCase = DemoUsers._testGuide.cases.유저3_중복신청;
      vi.stubEnv("DEMO_USER_ID", duplicateCase.env.DEMO_USER_ID);

      const response = await fetch(`${apiUrl}/enrollments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...duplicateCase.requestPayload,
          applicant: {
            ...duplicateCase.requestPayload.applicant,
            email: "invalid-email",
          },
        }),
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.code).toBe("INVALID_INPUT");
    });
  });
});

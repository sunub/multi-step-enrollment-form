import {
	GroupEnrollmentRequestSchema,
	PersonalEnrollmentRequestSchema,
} from "@shared/types";
import { Courses } from "../db/models/Courses";
import { DemoUsers } from "../db/models/DemoUsers";
import {
	CourseFullError,
	DuplicateEnrollmentError,
	InvalidInputError,
	type MockErrorBody,
	NotFoundError,
} from "../errors";

export interface MockEnrollmentSuccessBody {
	enrollmentId: string;
	status: "confirmed";
	enrolledAt: string;
}

export type MockEnrollmentErrorBody = MockErrorBody;

export type MockEnrollmentResponse =
	| MockEnrollmentSuccessBody
	| MockEnrollmentErrorBody;

export interface SubmitEnrollmentOptions {
	delayMs?: number;
	now?: () => Date;
	random?: () => number;
	randomErrorPercentage?: number;
	demoUserId?: string;
}

function createFieldErrors(issues: { message: string; path: PropertyKey[] }[]) {
	const fieldErrors: Record<string, string> = {};

	for (const issue of issues) {
		fieldErrors[issue.path.map(String).join(".")] = issue.message;
	}

	return fieldErrors;
}

function resolveDemoUser(demoUserId?: string) {
	if (!demoUserId) {
		return null;
	}

	return DemoUsers.users.find((user) => user.id === demoUserId) ?? null;
}

function applyDemoUserScenario(demoUserId?: string) {
	switch (demoUserId) {
		case "user-0002":
			throw new CourseFullError("정원이 초과되었습니다.");
		case "user-0003":
			throw new DuplicateEnrollmentError("이미 신청된 강의입니다.");
		default:
			return;
	}
}

export async function submitEnrollment(
	body: unknown,
	options: SubmitEnrollmentOptions = {},
): Promise<MockEnrollmentSuccessBody> {
	const now = options.now ?? (() => new Date());
	const random = options.random ?? Math.random;
	const delayMs = options.delayMs ?? 0;
	const randomErrorPercentage = options.randomErrorPercentage ?? 10;
	const demoUserId = options.demoUserId;

	const isGroup =
		typeof body === "object" &&
		body !== null &&
		"type" in body &&
		body.type === "group";

	const schema = isGroup
		? GroupEnrollmentRequestSchema
		: PersonalEnrollmentRequestSchema;
	const parsed = schema.safeParse(body);

	if (!parsed.success) {
		throw new InvalidInputError(
			"입력값이 올바르지 않습니다.",
			createFieldErrors(parsed.error.issues),
		);
	}

	const data = parsed.data;
	const demoUser = resolveDemoUser(demoUserId);

	if (demoUser && data.applicant.email !== demoUser.email) {
		throw new InvalidInputError("입력값이 올바르지 않습니다.", {
			"applicant.email":
				"DEMO_USER_ID에 지정된 데모 유저 이메일과 신청자 이메일이 일치해야 합니다.",
		});
	}

	if (demoUser) {
		applyDemoUserScenario(demoUser.id);
	} else if (random() * 100 < randomErrorPercentage) {
		const errorType = random() > 0.5 ? "COURSE_FULL" : "INVALID_INPUT";

		if (errorType === "COURSE_FULL") {
			throw new CourseFullError("랜덤 에러: 정원이 초과되었습니다.");
		}

		throw new InvalidInputError("랜덤 에러: 입력값이 올바르지 않습니다.", {
			form: "서버 측에서 무작위로 발생한 검증 오류입니다.",
		});
	}

	if (data.applicant.email === "duplicate@test.com") {
		throw new DuplicateEnrollmentError("이미 신청된 강의입니다.");
	}

	const course = Courses.courses.find(
		(candidate) => candidate.id === data.courseId,
	);
	if (!course) {
		throw new NotFoundError("강의를 찾을 수 없습니다.");
	}

	const requestedHeadCount = data.type === "group" ? data.group.headCount : 1;
	if (course.currentEnrollment + requestedHeadCount > course.maxCapacity) {
		throw new CourseFullError("정원이 초과되었습니다.");
	}

	if (delayMs > 0) {
		await new Promise((resolve) => {
			setTimeout(resolve, delayMs);
		});
	}

	return {
		enrollmentId: `enr-${random().toString(36).substring(2, 11)}`,
		status: "confirmed",
		enrolledAt: now().toISOString(),
	};
}

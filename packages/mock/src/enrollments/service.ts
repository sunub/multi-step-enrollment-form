import {
	GroupEnrollmentRequestSchema,
	PersonalEnrollmentRequestSchema,
} from "@shared/types";
import { Courses } from "../db/models/Courses";
import {
	CourseFullError,
	DuplicateEnrollmentError,
	InvalidInputError,
	type MockErrorBody,
	NotFoundError,
} from "../errors";
import type { MockEnrollmentConfig } from "./config";
import { applyMockEnrollmentScenario } from "./scenarios";

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
	config?: MockEnrollmentConfig;
}

function createFieldErrors(issues: { message: string; path: PropertyKey[] }[]) {
	const fieldErrors: Record<string, string> = {};

	for (const issue of issues) {
		fieldErrors[issue.path.map(String).join(".")] = issue.message;
	}

	return fieldErrors;
}

function resolveConfiguredScenario(options: SubmitEnrollmentOptions) {
	const config = options.config;
	if (!config) {
		return null;
	}

	if (config.forcedScenario) {
		return config.forcedScenario;
	}

	return null;
}

export async function submitEnrollment(
	body: unknown,
	options: SubmitEnrollmentOptions = {},
): Promise<MockEnrollmentSuccessBody> {
	const now = options.now ?? (() => new Date());
	const random = options.random ?? Math.random;
	const delayMs = options.delayMs ?? 0;

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
	const configuredScenario = resolveConfiguredScenario(options);
	if (configuredScenario) {
		applyMockEnrollmentScenario(configuredScenario);
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

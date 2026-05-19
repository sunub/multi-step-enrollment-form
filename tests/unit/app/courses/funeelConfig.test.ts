import { describe, expect, it } from "vitest";
import {
	type CoursesFunnelState,
	canAccessReview,
	hasSelectedCourse,
	steps,
} from "@/app/courses/funeelConfig";
import type { EnrollmentFormData } from "@/src/enrollment";
import {
	groupRegistrationInitialData,
	individualRegistrationInitialData,
} from "@/src/enrollment/atoms";

const selectedCourse = {
	id: "course-1",
	title: "React Deep Dive",
	price: 120000,
	startDate: "2026-06-01T00:00:00.000Z",
	category: "development" as const,
};

function createState(
	overrides?: Partial<CoursesFunnelState>,
): CoursesFunnelState {
	return {
		enrollmentForm: {
			courseId: "",
			selectedCourse: null,
			type: "personal",
			applicant: { name: "", email: "", phone: "" },
		},
		individualRegistration: individualRegistrationInitialData,
		groupRegistration: groupRegistrationInitialData,
		...overrides,
	};
}

function getActiveStepIds(state: CoursesFunnelState) {
	return steps
		.filter((step) => !step.shouldRender || step.shouldRender(state))
		.map((step) => step.id);
}

describe("courses funnel config", () => {
	it("allows only the first step without a selected course", () => {
		const state = createState();

		expect(getActiveStepIds(state)).toEqual(["course-selection"]);
		expect(hasSelectedCourse(state.enrollmentForm)).toBe(false);
	});

	it("allows the personal registration step after course selection", () => {
		const enrollmentForm: EnrollmentFormData = {
			courseId: selectedCourse.id,
			selectedCourse,
			type: "personal",
			applicant: { name: "", email: "", phone: "" },
		};

		expect(getActiveStepIds(createState({ enrollmentForm }))).toEqual([
			"course-selection",
			"individual-member-registration",
		]);
	});

	it("allows the group registration step after course selection", () => {
		const enrollmentForm: EnrollmentFormData = {
			courseId: selectedCourse.id,
			selectedCourse,
			type: "group",
			applicant: { name: "", email: "", phone: "" },
		};

		expect(getActiveStepIds(createState({ enrollmentForm }))).toEqual([
			"course-selection",
			"group-member-registration",
		]);
	});

	it("blocks review until personal registration data passes schema validation", () => {
		const enrollmentForm: EnrollmentFormData = {
			courseId: selectedCourse.id,
			selectedCourse,
			type: "personal",
			applicant: { name: "", email: "", phone: "" },
		};

		expect(
			canAccessReview(
				createState({
					enrollmentForm,
					individualRegistration: {
						...individualRegistrationInitialData,
						name: "가",
					},
				}),
			),
		).toBe(false);

		expect(
			getActiveStepIds(
				createState({
					enrollmentForm,
					individualRegistration: {
						name: "홍길동",
						email: "hong@example.com",
						phone: "01012345678",
						motivation: "",
					},
				}),
			),
		).toEqual(["course-selection", "individual-member-registration", "review"]);
	});

	it("blocks review until group registration data passes schema validation", () => {
		const enrollmentForm: EnrollmentFormData = {
			courseId: selectedCourse.id,
			selectedCourse,
			type: "group",
			applicant: { name: "", email: "", phone: "" },
		};

		expect(
			canAccessReview(
				createState({
					enrollmentForm,
					groupRegistration: {
						...groupRegistrationInitialData,
						representative: {
							...groupRegistrationInitialData.representative,
							name: "홍길동",
						},
					},
				}),
			),
		).toBe(false);

		expect(
			getActiveStepIds(
				createState({
					enrollmentForm,
					groupRegistration: {
						representative: {
							name: "홍길동",
							email: "ceo@example.com",
							phone: "01012345678",
							motivation: "",
						},
						groupInfo: {
							groupName: "오픈AI 스터디",
							managerName: "김담당",
							participantCount: 2,
						},
						participants: [
							{ name: "이참가", email: "user1@example.com" },
							{ name: "박참가", email: "user2@example.com" },
						],
					},
				}),
			),
		).toEqual(["course-selection", "group-member-registration", "review"]);
	});
});

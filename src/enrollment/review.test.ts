import { describe, expect, it } from "vitest";
import type { GroupApplicationData } from "../components/GroupRegistrationStep/types";
import type { IndividualApplicationData } from "../components/IndividualRegistration/types";
import type { EnrollmentFormData } from "./atoms";
import {
	createEnrollmentRequestPayload,
	createEnrollmentReviewModel,
} from "./review";

const baseEnrollmentFormData: EnrollmentFormData = {
	courseId: "course-1",
	selectedCourse: {
		id: "course-1",
		title: "Advanced UI Engineering",
		price: 180000,
		startDate: "2026-08-01T00:00:00.000Z",
		category: "development",
	},
	type: "personal",
	applicant: {
		name: "",
		email: "",
		phone: "",
	},
};

const baseIndividualRegistration: IndividualApplicationData = {
	name: "홍길동",
	email: "hong@example.com",
	phone: "010-1234-5678",
	motivation: "실무 역량을 키우고 싶습니다.",
};

const baseGroupRegistration: GroupApplicationData = {
	representative: {
		name: "김대표",
		email: "leader@example.com",
		phone: "010-9999-1111",
		motivation: "팀 전체 역량 강화를 원합니다.",
	},
	groupInfo: {
		groupName: "Acme Corp",
		managerName: "박담당",
		participantCount: 2,
	},
	participants: [
		{ name: "참가자1", email: "member1@example.com" },
		{ name: "참가자2", email: "member2@example.com" },
	],
};

describe("enrollment review helpers", () => {
	it("creates a personal review model and request payload from atom state", () => {
		const reviewModel = createEnrollmentReviewModel({
			enrollmentForm: baseEnrollmentFormData,
			groupRegistration: baseGroupRegistration,
			individualRegistration: baseIndividualRegistration,
		});
		const payload = createEnrollmentRequestPayload(
			{
				enrollmentForm: baseEnrollmentFormData,
				groupRegistration: baseGroupRegistration,
				individualRegistration: baseIndividualRegistration,
			},
			true,
		);

		expect(reviewModel.course?.title).toBe("Advanced UI Engineering");
		expect(reviewModel.applicant.type).toBe("personal");
		// expect(reviewModel.applicant.fields).toEqual([
		//   { label: "성명", value: "홍길동" },
		//   { label: "이메일", value: "hong@example.com" },
		//   { label: "연락처", value: "010-1234-5678" },
		// ]);
		expect(payload).toEqual({
			courseId: "course-1",
			type: "personal",
			applicant: {
				name: "홍길동",
				email: "hong@example.com",
				phone: "010-1234-5678",
				motivation: "실무 역량을 키우고 싶습니다.",
			},
			agreedToTerms: true,
		});
	});

	it("maps group atom state to the server contract without leaking UI field names", () => {
		const enrollmentForm: EnrollmentFormData = {
			...baseEnrollmentFormData,
			type: "group",
		};
		const reviewModel = createEnrollmentReviewModel({
			enrollmentForm,
			groupRegistration: baseGroupRegistration,
			individualRegistration: baseIndividualRegistration,
		});
		const payload = createEnrollmentRequestPayload(
			{
				enrollmentForm,
				groupRegistration: baseGroupRegistration,
				individualRegistration: baseIndividualRegistration,
			},
			true,
		);

		expect(reviewModel.applicant.type).toBe("group");
		// expect(reviewModel.applicant.participants).toHaveLength(2);
		expect(payload).toEqual({
			courseId: "course-1",
			type: "group",
			applicant: {
				name: "김대표",
				email: "leader@example.com",
				phone: "010-9999-1111",
				motivation: "팀 전체 역량 강화를 원합니다.",
			},
			group: {
				organizationName: "Acme Corp",
				headCount: 2,
				participants: [
					{ name: "참가자1", email: "member1@example.com" },
					{ name: "참가자2", email: "member2@example.com" },
				],
				contactPerson: "박담당",
			},
			agreedToTerms: true,
		});
		expect(payload).not.toHaveProperty("groupInfo");
	});
});

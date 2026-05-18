import type { CourseCategoryType } from "@shared/types";
import type { GroupApplicationData } from "../components/GroupRegistrationStep/types";
import type { IndividualApplicationData } from "../components/IndividualRegistration/types";
import type { EnrollmentFormData } from "./atoms";

const categoryLabelMap: Record<CourseCategoryType, string> = {
	development: "개발",
	design: "디자인",
	marketing: "마케팅",
	business: "비즈니스",
};

const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
	timeZone: "UTC",
	year: "numeric",
	month: "2-digit",
	day: "2-digit",
});

export interface EnrollmentReviewSource {
	enrollmentForm: EnrollmentFormData;
	groupRegistration: GroupApplicationData;
	individualRegistration: IndividualApplicationData;
}

export interface ReviewField {
	label: string;
	value: string;
}

export interface ReviewParticipant {
	name: string;
	email: string;
}

export interface CourseReviewModel {
	id: string;
	title: string;
	category: CourseCategoryType;
	categoryLabel: string;
	startDateLabel: string;
	priceLabel: string;
}

export interface PersonalApplicantReviewModel {
	type: "personal";
	title: string;
	fields: ReviewField[];
	motivation?: string;
}

export interface GroupApplicantReviewModel {
	type: "group";
	title: string;
	groupFields: ReviewField[];
	representativeFields: ReviewField[];
	participants: ReviewParticipant[];
	motivation?: string;
}

export type ApplicantReviewModel =
	| PersonalApplicantReviewModel
	| GroupApplicantReviewModel;

export interface EnrollmentReviewModel {
	course: CourseReviewModel | null;
	applicant: ApplicantReviewModel;
	isReadyToSubmit: boolean;
}

export interface PersonalEnrollmentRequestPayload {
	courseId: string;
	type: "personal";
	applicant: {
		name: string;
		email: string;
		phone: string;
		motivation?: string;
	};
	agreedToTerms: boolean;
}

export interface GroupEnrollmentRequestPayload {
	courseId: string;
	type: "group";
	applicant: {
		name: string;
		email: string;
		phone: string;
		motivation?: string;
	};
	group: {
		organizationName: string;
		headCount: number;
		participants: ReviewParticipant[];
		contactPerson: string;
	};
	agreedToTerms: boolean;
}

export type EnrollmentRequestPayload =
	| PersonalEnrollmentRequestPayload
	| GroupEnrollmentRequestPayload;

function formatDate(isoDate: string) {
	return dateFormatter.format(new Date(isoDate));
}

function formatPrice(price: number) {
	return `${price.toLocaleString()}원`;
}

function toOptionalString(value?: string) {
	const trimmedValue = value?.trim();
	return trimmedValue ? trimmedValue : undefined;
}

function resolveCourseId(enrollmentForm: EnrollmentFormData) {
	return enrollmentForm.courseId || enrollmentForm.selectedCourse?.id || "";
}

function createCourseReviewModel(
	enrollmentForm: EnrollmentFormData,
): CourseReviewModel | null {
	const selectedCourse = enrollmentForm.selectedCourse;

	if (!selectedCourse) {
		return null;
	}

	return {
		id: selectedCourse.id,
		title: selectedCourse.title,
		category: selectedCourse.category,
		categoryLabel: categoryLabelMap[selectedCourse.category],
		startDateLabel: formatDate(selectedCourse.startDate),
		priceLabel: formatPrice(selectedCourse.price),
	};
}

export function createEnrollmentReviewModel({
	enrollmentForm,
	groupRegistration,
	individualRegistration,
}: EnrollmentReviewSource): EnrollmentReviewModel {
	const course = createCourseReviewModel(enrollmentForm);

	if (enrollmentForm.type === "group") {
		return {
			course,
			applicant: {
				type: "group",
				title: "신청자 정보 (단체)",
				groupFields: [
					{
						label: "기관/회사명",
						value: groupRegistration.groupInfo.groupName,
					},
					{
						label: "담당자",
						value: groupRegistration.groupInfo.managerName,
					},
					{
						label: "신청 인원",
						value: `${groupRegistration.groupInfo.participantCount}명`,
					},
				],
				representativeFields: [
					{
						label: "대표자 성명",
						value: groupRegistration.representative.name,
					},
					{
						label: "이메일",
						value: groupRegistration.representative.email,
					},
					{
						label: "연락처",
						value: groupRegistration.representative.phone,
					},
				],
				participants: groupRegistration.participants,
				motivation: toOptionalString(
					groupRegistration.representative.motivation,
				),
			},
			isReadyToSubmit: Boolean(course && resolveCourseId(enrollmentForm)),
		};
	}

	return {
		course,
		applicant: {
			type: "personal",
			title: "신청자 정보",
			fields: [
				{ label: "성명", value: individualRegistration.name },
				{ label: "이메일", value: individualRegistration.email },
				{ label: "연락처", value: individualRegistration.phone },
			],
			motivation: toOptionalString(individualRegistration.motivation),
		},
		isReadyToSubmit: Boolean(course && resolveCourseId(enrollmentForm)),
	};
}

export function createEnrollmentRequestPayload(
	{
		enrollmentForm,
		groupRegistration,
		individualRegistration,
	}: EnrollmentReviewSource,
	agreedToTerms: boolean,
): EnrollmentRequestPayload {
	const courseId = resolveCourseId(enrollmentForm);

	if (!courseId) {
		throw new Error("선택한 강의 정보가 없어 신청서를 제출할 수 없습니다.");
	}

	if (enrollmentForm.type === "group") {
		return {
			courseId,
			type: "group",
			applicant: {
				name: groupRegistration.representative.name,
				email: groupRegistration.representative.email,
				phone: groupRegistration.representative.phone,
				motivation: toOptionalString(
					groupRegistration.representative.motivation,
				),
			},
			group: {
				organizationName: groupRegistration.groupInfo.groupName,
				headCount: groupRegistration.groupInfo.participantCount,
				participants: groupRegistration.participants,
				contactPerson: groupRegistration.groupInfo.managerName,
			},
			agreedToTerms,
		};
	}

	return {
		courseId,
		type: "personal",
		applicant: {
			name: individualRegistration.name,
			email: individualRegistration.email,
			phone: individualRegistration.phone,
			motivation: toOptionalString(individualRegistration.motivation),
		},
		agreedToTerms,
	};
}

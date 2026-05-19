import {
	CourseFullError,
	DuplicateEnrollmentError,
	InvalidInputError,
	type MockErrorBody,
} from "../errors";

export type MockEnrollmentScenarioType = Extract<
	MockErrorBody["code"],
	"COURSE_FULL" | "DUPLICATE_ENROLLMENT" | "INVALID_INPUT"
>;

export function applyMockEnrollmentScenario(
	scenario: MockEnrollmentScenarioType,
): never {
	switch (scenario) {
		case "COURSE_FULL":
			throw new CourseFullError("시나리오 에러: 정원이 초과되었습니다.");
		case "DUPLICATE_ENROLLMENT":
			throw new DuplicateEnrollmentError(
				"시나리오 에러: 이미 신청된 강의입니다.",
			);
		case "INVALID_INPUT":
			throw new InvalidInputError(
				"시나리오 에러: 입력값이 올바르지 않습니다.",
				{
					form: "환경 설정 또는 사용자 시나리오에 의해 강제된 검증 오류입니다.",
				},
			);
	}
}

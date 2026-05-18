import { readFileSync, writeFileSync } from "node:fs";

// 1. 기존 강의 데이터 불러오기
const coursesFilePath = new URL("./models/demo-courses.json", import.meta.url);
let coursesData;

try {
	coursesData = JSON.parse(readFileSync(coursesFilePath, "utf-8"));
} catch (_error) {
	console.error("demo-courses.json 파일을 먼저 생성해주세요.");
	process.exit(1);
}

const courses = coursesData.courses;

// 2. 테스트 환경을 위한 타겟 강의 추출
// 2-1. 정원이 꽉 찬 강의 (유저 2 테스트용)
const targetFullCourse = courses.find(
	(c) => c.currentEnrollment === c.maxCapacity,
);
// 2-2. 정원 여유가 있는 강의 (유저 1, 유저 3 테스트용)
const targetAvailableCourse = courses.find(
	(c) => c.currentEnrollment < c.maxCapacity,
);

if (!targetFullCourse || !targetAvailableCourse) {
	console.error(
		"적절한 테스트용 강의 데이터를 찾을 수 없습니다. demo-courses.json을 다시 생성해주세요.",
	);
	process.exit(1);
}

// 3. 3명의 유저 데이터 생성
const users = [
	{
		id: "user-0001",
		name: "최정민",
		email: "jm@example.com",
		motivation: "테스트: 정상 수강 신청 성공",
	},
	{
		id: "user-0002",
		name: "김철수",
		email: "chulsu@example.com",
		motivation: "테스트: 정원 초과 에러 발생",
	},
	{
		id: "user-0003",
		name: "이영희",
		email: "younghee@example.com",
		motivation: "테스트: 중복 수강 신청 에러 발생",
	},
];

const baseApplicantPayload = (user) => ({
	type: "personal",
	applicant: {
		name: user.name,
		email: user.email,
		phone: "010-1234-5678",
		motivation: user.motivation,
	},
	agreedToTerms: true,
});

// 4. Enrollments (수강 신청 내역) 세팅
// 핵심: 유저 3이 이미 'targetAvailableCourse'를 수강 중인 것으로 초기 세팅합니다.
const enrollments = [
	{
		id: "enr-0001",
		userId: "user-0003", // 유저 3에게 미리 할당
		courseId: targetAvailableCourse.id,
		enrolledAt: new Date().toISOString(),
	},
];

// 5. 프론트엔드 연동 테스트용 가이드 메타데이터
const outputData = {
	users,
	enrollments,
	_testGuide: {
		description: "프론트엔드 수강신청 API 테스트를 위한 Request Payload 가이드",
		cases: {
			유저1_성공: {
				description: "여유 있는 강의를 처음 신청하므로 200 OK 성공",
				env: {
					DEMO_USER_ID: "user-0001",
				},
				requestPayload: {
					courseId: targetAvailableCourse.id,
					...baseApplicantPayload(users[0]),
				},
				expectedStatus: 200,
			},
			유저2_정원초과: {
				description: "이미 꽉 찬 강의를 신청하므로 COURSE_FULL 에러 발생",
				env: {
					DEMO_USER_ID: "user-0002",
				},
				requestPayload: {
					courseId: targetFullCourse.id,
					...baseApplicantPayload(users[1]),
				},
				expectedStatus: 409,
				expectedCode: "COURSE_FULL",
			},
			유저3_중복신청: {
				description:
					"이미 수강 중인 강의를 또 신청하므로 DUPLICATE_ENROLLMENT 에러 발생",
				env: {
					DEMO_USER_ID: "user-0003",
				},
				requestPayload: {
					courseId: targetAvailableCourse.id,
					...baseApplicantPayload(users[2]),
				},
				expectedStatus: 409,
				expectedCode: "DUPLICATE_ENROLLMENT",
			},
		},
	},
};

const outputPath = new URL("./models/demo-user.json", import.meta.url);
writeFileSync(outputPath, JSON.stringify(outputData, null, 2));

console.log(`성공적으로 생성되었습니다: ${outputPath.pathname}`);
console.log(
	"[유저1=성공, 유저2=정원초과, 유저3=중복신청] 시나리오로 테스트 가능합니다.",
);

import demoUserData from "./demo-user.json";

export interface DemoUser {
	id: string;
	name: string;
	email: string;
	motivation: string;
}

export interface DemoEnrollmentRecord {
	id: string;
	userId: string;
	courseId: string;
	enrolledAt: string;
}

export interface DemoUserTestCase {
	description: string;
	env: {
		DEMO_USER_ID: string;
	};
	requestPayload: {
		courseId: string;
		type: "personal";
		applicant: {
			name: string;
			email: string;
			phone: string;
			motivation: string;
		};
		agreedToTerms: true;
	};
	expectedStatus: number;
	expectedCode?: "COURSE_FULL" | "DUPLICATE_ENROLLMENT";
}

export interface DemoUserGuide {
	description: string;
	cases: {
		유저1_성공: DemoUserTestCase;
		유저2_정원초과: DemoUserTestCase;
		유저3_중복신청: DemoUserTestCase;
	};
}

export const DemoUsers = demoUserData as {
	users: DemoUser[];
	enrollments: DemoEnrollmentRecord[];
	_testGuide: DemoUserGuide;
};

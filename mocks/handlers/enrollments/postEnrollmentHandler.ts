import {
	GroupEnrollmentRequestSchema,
	PersonalEnrollmentRequestSchema,
} from "@shared/types";
import { delay, HttpResponse, http } from "msw";
import { Courses } from "../../db/models/Courses";

export const postEnrollmentHandler = http.post(
	"*/api/enrollments",
	async ({ request }) => {
		const rawPercentage = process.env.RANDOM_ERROR_PERCENTAGE;
		const errorPercentage =
			rawPercentage !== undefined ? Number(rawPercentage) : 10;

		if (Math.random() * 100 < errorPercentage) {
			const errorType = Math.random() > 0.5 ? "COURSE_FULL" : "INVALID_INPUT";
			if (errorType === "COURSE_FULL") {
				return HttpResponse.json(
					{ code: "COURSE_FULL", message: "랜덤 에러: 정원이 초과되었습니다." },
					{ status: 409 },
				);
			}
			return HttpResponse.json(
				{
					code: "INVALID_INPUT",
					message: "랜덤 에러: 입력값이 올바르지 않습니다.",
					details: { form: "서버 측에서 무작위로 발생한 검증 오류입니다." },
				},
				{ status: 400 },
			);
		}

		const body = await request.json();
		const isGroup = (body as Record<string, unknown>)?.type === "group";

		const schema = isGroup
			? GroupEnrollmentRequestSchema
			: PersonalEnrollmentRequestSchema;
		const parsed = schema.safeParse(body);

		if (!parsed.success) {
			const fieldErrors: Record<string, string> = {};
			for (const issue of parsed.error.issues) {
				fieldErrors[issue.path.join(".")] = issue.message;
			}
			return HttpResponse.json(
				{
					code: "INVALID_INPUT",
					message: "입력값이 올바르지 않습니다.",
					details: fieldErrors,
				},
				{ status: 400 },
			);
		}

		const data = parsed.data;

		const applicantEmail = data.applicant.email;
		if (applicantEmail === "duplicate@test.com") {
			return HttpResponse.json(
				{ code: "DUPLICATE_ENROLLMENT", message: "이미 신청된 강의입니다." },
				{ status: 409 },
			);
		}

		const course = Courses.courses.find((c) => c.id === data.courseId);

		if (!course) {
			return HttpResponse.json(
				{ code: "NOT_FOUND", message: "강의를 찾을 수 없습니다." },
				{ status: 404 },
			);
		}

		const requestedHeadCount = data.type === "group" ? data.group.headCount : 1;
		if (course.currentEnrollment + requestedHeadCount > course.maxCapacity) {
			return HttpResponse.json(
				{ code: "COURSE_FULL", message: "정원이 초과되었습니다." },
				{ status: 409 },
			);
		}

		await delay(1000);

		return HttpResponse.json({
			enrollmentId: `enr-${Math.random().toString(36).substring(2, 11)}`,
			status: "confirmed",
			enrolledAt: new Date().toISOString(),
		});
	},
);

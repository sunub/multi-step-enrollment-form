import { COURSE_CATEGORIES } from "@shared/types";
import { delay, HttpResponse, http } from "msw";
import { Courses } from "../../db/models/Courses";

export const getCoursesHandler = http.get(
	"*/api/courses",
	async ({ request }) => {
		const url = new URL(request.url);
		const category = url.searchParams.get("category");

		let filteredCourses = Courses.courses;
		if (
			category &&
			(COURSE_CATEGORIES as readonly string[]).includes(category)
		) {
			filteredCourses = Courses.courses.filter((c) => c.category === category);
		}

		await delay(500);

		return HttpResponse.json({
			courses: filteredCourses,
			categories: COURSE_CATEGORIES,
		});
	},
);

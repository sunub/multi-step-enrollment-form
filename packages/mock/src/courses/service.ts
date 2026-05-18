import type { CourseType } from "@shared/types";
import { Courses } from "../db/models/Courses";

export function* getFilteredCoursesGenerator(category: string | null) {
	for (const course of Courses.courses) {
		if (!category || course.category === category) {
			yield course;
		}
	}
}

export function createCoursesNdjsonStream(category: string | null) {
	const encoder = new TextEncoder();

	return new ReadableStream<Uint8Array>({
		start(controller) {
			for (const course of getFilteredCoursesGenerator(category)) {
				const chunk = encoder.encode(
					`${JSON.stringify(course satisfies CourseType)}\n`,
				);
				controller.enqueue(chunk);
			}
			controller.close();
		},
	});
}

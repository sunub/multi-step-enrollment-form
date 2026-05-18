import type { CourseType } from "@shared/types";
import demoData from "./demo-courses.json";

export const Courses = demoData as {
	categories: CourseType["category"][];
	courses: CourseType[];
};

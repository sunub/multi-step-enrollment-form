import { z } from "zod";

export const COURSE_CATEGORIES = [
	"development",
	"design",
	"marketing",
	"business",
] as const;

export const CourseTypeSchema = z.enum(COURSE_CATEGORIES);

export type CourseType = z.infer<typeof CourseTypeSchema>;

export const CourseSchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string(),
	category: CourseTypeSchema,
	price: z.number(),
	maxCapacity: z.number(),
	currentEnrollment: z.number(),
	startDate: z.string(), // ISO 8601
	endDate: z.string(), // ISO 8601
	instructor: z.string(),
});

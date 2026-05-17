import { z } from "zod";

const COURSE_CATEGORIES = [
	"development",
	"design",
	"marketing",
	"business",
] as const;

export type CourseCategoryType = (typeof COURSE_CATEGORIES)[number];

export const CourseCategorySchema = z.enum(COURSE_CATEGORIES);

export const CourseTypeSchema = z.enum(COURSE_CATEGORIES);

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

export type CourseType = z.infer<typeof CourseSchema>;

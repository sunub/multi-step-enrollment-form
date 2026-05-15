import { getCoursesHandler } from "./courses/getCoursesHandler";
import { postEnrollmentHandler } from "./enrollments/postEnrollmentHandler";

export const handlers = [getCoursesHandler, postEnrollmentHandler];

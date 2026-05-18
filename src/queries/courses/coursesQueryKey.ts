import type { CourseCategoryType } from "@shared/types";
import { CourseTypeSchema } from "@shared/types";
import { queryOptions } from "@tanstack/react-query";
import { fetchPaginatedCourses } from "@/src/enrollment/api";

export const getPaginatedCoursesQueryOptions = (
  category: CourseCategoryType,
  page: number,
) => {
  const parsedCategory = CourseTypeSchema.parse(category);
  return queryOptions({
    queryKey: ["courses", parsedCategory, "paginated", page],
    queryFn: () => fetchPaginatedCourses(parsedCategory, page),
  });
};

export const API_ENDPOINTS = {
  COURSES: "/api/courses",
  ENROLLMENTS: "/api/enrollments",
} as const;

export function resolveApiUrl(path: string) {
  if (typeof window !== "undefined") {
    return path;
  }

  const baseUrl =
    process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;

  return baseUrl ? new URL(path, baseUrl).toString() : path;
}

export const INTERNAL_API_ENDPOINTS = {
  COURSES: "/internal-api/courses",
} as const;

export const COURSE_CATEGORIES = [
  "development",
  "design",
  "marketing",
  "business",
] as const;

export const CATEGORY_COURSE_URLS = {
  DEVELOPMENT: "/courses?category=development",
  DESIGN: "/courses?category=design",
  MARKETING: "/courses?category=marketing",
  BUSINESS: "/courses?category=business",
};

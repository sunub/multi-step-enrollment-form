import { CourseSchema, type CourseType } from "@shared/types";
import { API_ENDPOINTS, resolveApiUrl } from "../constants";

async function* streamToAsyncIterable(stream: ReadableStream<Uint8Array>) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");

      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.trim()) {
          yield JSON.parse(line);
        }
      }
    }

    if (buffer.trim()) {
      yield JSON.parse(buffer);
    }
  } finally {
    reader.releaseLock();
  }
}

export async function fetchPaginatedCourses(
  category: string,
  page: number,
  limit = 10,
) {
  const URL = resolveApiUrl(`${API_ENDPOINTS.COURSES}?category=${category}`);
  console.log(`Fetching courses from: ${URL}`);
  const response = await fetch(URL);
  if (!response.ok) throw new Error("Failed to fetch courses");
  if (!response.body) throw new Error("Response body is missing");

  const skip = (page - 1) * limit;
  const items: CourseType[] = [];
  let currentIndex = 0;
  let totalCount = 0;

  for await (const rawCourse of streamToAsyncIterable(response.body)) {
    totalCount++;

    if (currentIndex >= skip && items.length < limit) {
      items.push(CourseSchema.parse(rawCourse));
    }

    currentIndex++;
  }

  return {
    items,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
    hasNextPage: page < Math.ceil(totalCount / limit),
    hasPrevPage: page > 1,
  };
}

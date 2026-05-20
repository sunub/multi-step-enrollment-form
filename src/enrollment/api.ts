import { CourseSchema, type CourseType } from "@shared/types";
import { API_ENDPOINTS, resolveApiUrl } from "../constants";
import type { EnrollmentRequestPayload } from "./review";

const enrollmentErrorCodes = [
	"NOT_FOUND",
	"SERVER_ERROR",
	"COURSE_FULL",
	"DUPLICATE_ENROLLMENT",
	"INVALID_INPUT",
] as const;

export type EnrollmentErrorCode = (typeof enrollmentErrorCodes)[number];

export interface EnrollmentSuccessResponse {
	enrollmentId: string;
	status: "confirmed" | "pending";
	enrolledAt: string;
}

export interface EnrollmentRequestErrorDetails {
	[key: string]: string;
}

export class EnrollmentRequestError extends Error {
	status: number;
	code: EnrollmentErrorCode;
	details?: EnrollmentRequestErrorDetails;

	constructor(
		status: number,
		code: EnrollmentErrorCode,
		message: string,
		details?: EnrollmentRequestErrorDetails,
	) {
		super(message);
		this.name = "EnrollmentRequestError";
		this.status = status;
		this.code = code;
		this.details = details;
	}
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null;
}

function isEnrollmentErrorCode(value: unknown): value is EnrollmentErrorCode {
	return (
		typeof value === "string" &&
		enrollmentErrorCodes.includes(value as EnrollmentErrorCode)
	);
}

function parseEnrollmentSuccessResponse(
	body: unknown,
): EnrollmentSuccessResponse {
	if (
		isRecord(body) &&
		typeof body.enrollmentId === "string" &&
		(body.status === "confirmed" || body.status === "pending") &&
		typeof body.enrolledAt === "string"
	) {
		return {
			enrollmentId: body.enrollmentId,
			status: body.status,
			enrolledAt: body.enrolledAt,
		};
	}

	throw new Error("수강 신청 응답 형식이 올바르지 않습니다.");
}

function parseEnrollmentError(
	status: number,
	body: unknown,
): EnrollmentRequestError {
	if (
		isRecord(body) &&
		isEnrollmentErrorCode(body.code) &&
		typeof body.message === "string"
	) {
		const details =
			isRecord(body.details) &&
			Object.values(body.details).every((value) => typeof value === "string")
				? (body.details as EnrollmentRequestErrorDetails)
				: undefined;

		return new EnrollmentRequestError(status, body.code, body.message, details);
	}

	return new EnrollmentRequestError(
		status,
		"SERVER_ERROR",
		"알 수 없는 서버 에러가 발생했습니다.",
	);
}

export function isEnrollmentRequestError(
	error: unknown,
): error is EnrollmentRequestError {
	return error instanceof EnrollmentRequestError;
}

async function* streamToAsyncIterable<T>(
	stream: ReadableStream<Uint8Array>,
): AsyncIterable<T> {
	const reader = stream.getReader();
	const decoder = new TextDecoder();
	let buffer = "";

	try {
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;

			buffer += decoder.decode(value, { stream: true });
			const lines = buffer.split("\n");

			// Keep the last partial line in the buffer
			buffer = lines.pop() || "";

			for (const line of lines) {
				if (line.trim()) {
					try {
						yield JSON.parse(line) as T;
					} catch (e) {
						console.error("Failed to parse NDJSON line:", line, e);
					}
				}
			}
		}

		if (buffer.trim()) {
			try {
				yield JSON.parse(buffer) as T;
			} catch (e) {
				console.error("Failed to parse final NDJSON buffer:", buffer, e);
			}
		}
	} finally {
		reader.releaseLock();
	}
}

export async function fetchPaginatedCourses(
	category: string,
	page: number,
	limit = 10,
	signal?: AbortSignal,
) {
	const URL = resolveApiUrl(`${API_ENDPOINTS.COURSES}?category=${category}`);

	const response = await fetch(URL, { signal });
	if (!response.ok) {
		throw new Error(`Failed to fetch courses: ${response.statusText}`);
	}
	if (!response.body) {
		throw new Error("Response body is missing");
	}

	const skip = (page - 1) * limit;
	const items: CourseType[] = [];
	let currentIndex = 0;
	let totalCount = 0;

	for await (const rawCourse of streamToAsyncIterable<unknown>(response.body)) {
		totalCount++;

		if (currentIndex >= skip && items.length < limit) {
			const parsed = CourseSchema.safeParse(rawCourse);
			if (parsed.success) {
				items.push(parsed.data);
			} else {
				console.warn("Skipping invalid course data:", parsed.error);
			}
		}

		currentIndex++;
	}

	const totalPages = Math.ceil(totalCount / limit);

	return {
		items,
		totalCount,
		totalPages,
		currentPage: page,
		hasNextPage: page < totalPages,
		hasPrevPage: page > 1,
	};
}

export async function submitEnrollment(payload: EnrollmentRequestPayload) {
	const url = resolveApiUrl(API_ENDPOINTS.ENROLLMENTS);
	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});
	const body = (await response.json()) as unknown;

	if (!response.ok) {
		throw parseEnrollmentError(response.status, body);
	}

	return parseEnrollmentSuccessResponse(body);
}

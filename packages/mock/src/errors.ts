export interface HttpError extends Error {
	status?: number;
}

export interface MockErrorDetails {
	[key: string]: string;
}

export interface MockErrorBody {
	code:
		| "NOT_FOUND"
		| "SERVER_ERROR"
		| "COURSE_FULL"
		| "DUPLICATE_ENROLLMENT"
		| "INVALID_INPUT";
	message: string;
	details?: MockErrorDetails;
}

export function getErrorStatus(error: unknown): number | undefined {
	if (typeof error === "object" && error !== null) {
		if ("status" in error && typeof error.status === "number") {
			return error.status;
		}
		if (
			"response" in error &&
			typeof (error as { response?: unknown }).response === "object" &&
			(error as { response?: unknown }).response !== null
		) {
			const response = (
				error as { response: { status?: unknown; headers?: unknown } }
			).response;
			if ("status" in response && typeof response.status === "number") {
				return response.status;
			}
		}
	}
	return undefined;
}

class MockServerError extends Error {
	code: MockErrorBody["code"];
	status: number;
	details?: MockErrorDetails;

	constructor(
		name: string,
		code: MockErrorBody["code"],
		status: number,
		message: string,
		details?: MockErrorDetails,
	) {
		super(message);
		this.name = name;
		this.code = code;
		this.status = status;
		if (details) {
			this.details = details;
		}
	}
}

export class NotFoundError extends MockServerError {
	constructor(message: string) {
		super("NotFoundError", "NOT_FOUND", 404, message);
	}
}

export class ServerError extends MockServerError {
	constructor(message: string) {
		super("ServerError", "SERVER_ERROR", 500, message);
	}
}

export class CourseFullError extends MockServerError {
	constructor(message: string) {
		super("CourseFullError", "COURSE_FULL", 409, message);
	}
}

export class DuplicateEnrollmentError extends MockServerError {
	constructor(message: string) {
		super("DuplicateEnrollmentError", "DUPLICATE_ENROLLMENT", 409, message);
	}
}

export class InvalidInputError extends MockServerError {
	constructor(message: string, details?: MockErrorDetails) {
		super("InvalidInputError", "INVALID_INPUT", 400, message, details);
	}
}

export function toMockErrorBody(error: unknown): {
	status: number;
	body: MockErrorBody;
} {
	if (
		typeof error === "object" &&
		error !== null &&
		"code" in error &&
		typeof error.code === "string" &&
		"message" in error &&
		typeof error.message === "string"
	) {
		return {
			status: getErrorStatus(error) ?? 500,
			body: {
				code: error.code as MockErrorBody["code"],
				message: error.message,
				details:
					"details" in error &&
					typeof error.details === "object" &&
					error.details !== null
						? (error.details as MockErrorDetails)
						: undefined,
			},
		};
	}

	return {
		status: 500,
		body: {
			code: "SERVER_ERROR",
			message: "알 수 없는 서버 에러가 발생했습니다.",
		},
	};
}

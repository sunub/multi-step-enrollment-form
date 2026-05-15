export interface HttpError extends Error {
	status?: number;
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

export class NotFoundError extends Error {
	code: number;
	constructor(message: string, code?: number) {
		super(message);
		this.name = "NotFoundError";
		this.code = code ? code : 404;
	}
}

export class ServerError extends Error {
	code: number;
	constructor(message: string, code?: number) {
		super(message);
		this.name = "ServerError";
		this.code = code ? code : 500;
	}
}

export class CourseFullError extends Error {
	code: string;
	constructor(message: string) {
		super(message);
		this.name = "CourseFullError";
		this.code = "COURSE_FULL";
	}
}

export class DuplicateEnrollmentError extends Error {
	code: string;
	constructor(message: string) {
		super(message);
		this.name = "DuplicateEnrollmentError";
		this.code = "DUPLICATE_ENROLLMENT";
	}
}

export class InvalidInputError extends Error {
	code: string;
	details?: Record<string, string>;
	constructor(message: string, details?: Record<string, string>) {
		super(message);
		this.name = "InvalidInputError";
		this.code = "INVALID_INPUT";
		if (details) {
			this.details = details;
		}
	}
}

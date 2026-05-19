import type { MockEnrollmentScenarioType } from "./scenarios";

export interface MockEnrollmentConfig {
	forcedScenario: MockEnrollmentScenarioType | null;
	randomErrorPercentage: number;
}

type EnvLike = Record<string, string | undefined>;

function parseMockEnrollmentScenario(value: string | undefined) {
	if (value === undefined || value.trim() === "" || value === "0") {
		return null;
	}

	switch (value.trim()) {
		case "1":
			return "INVALID_INPUT";
		case "2":
			return "COURSE_FULL";
		default:
			throw new Error("MOCK_ENROLLMENT_SCENARIO must be 0, 1, or 2.");
	}
}

function parseRandomErrorPercentage(value: string | undefined) {
	if (value === undefined || value.trim() === "") {
		return 0;
	}

	const parsed = Number(value.trim());
	if (!Number.isFinite(parsed)) {
		throw new Error(
			"RANDOM_ERROR_PERCENTAGE must be a number between 0 and 100.",
		);
	}

	return Math.min(100, Math.max(0, parsed));
}

export function getMockEnrollmentConfig(env: EnvLike): MockEnrollmentConfig {
	return {
		forcedScenario: parseMockEnrollmentScenario(env.MOCK_ENROLLMENT_SCENARIO),
		randomErrorPercentage: parseRandomErrorPercentage(
			env.RANDOM_ERROR_PERCENTAGE,
		),
	};
}

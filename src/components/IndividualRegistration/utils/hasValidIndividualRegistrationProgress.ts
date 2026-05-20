import {
	emailSchema,
	type IndividualApplicationData,
	motivationSchema,
	phoneSchema,
	usernameSchema,
} from "../types";

export function hasValidIndividualRegistrationProgress(
	values: Partial<IndividualApplicationData>,
): boolean {
	return Boolean(
		((values.name ?? "").length > 0 &&
			usernameSchema.safeParse(values.name).success) ||
			((values.email ?? "").length > 0 &&
				emailSchema.safeParse(values.email).success) ||
			((values.phone ?? "").length > 0 &&
				phoneSchema.safeParse(values.phone).success) ||
			((values.motivation ?? "").length > 0 &&
				motivationSchema.safeParse(values.motivation).success),
	);
}

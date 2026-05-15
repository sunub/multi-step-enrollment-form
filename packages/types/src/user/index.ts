import { z } from "zod";

const PHONE_REGEX = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;

export const PhoneSchema = z
	.string({ error: "Invalid phone number format" })
	.regex(PHONE_REGEX, {
		message: "Phone number must be in the format 010-1234-5678 or 01012345678",
	})
	.transform((phone) => {
		return phone.replace(/-/g, ""); // Remove dashes for consistent formatting
	});

export const UserSchema = z.object({
	name: z.string(),
	email: z.email(),
	phone: PhoneSchema,
	motivation: z.string().optional(),
});

export type User = z.infer<typeof UserSchema>;

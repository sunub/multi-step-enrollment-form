import { z } from "zod";
import { GroupParticipantSchema } from "../group";
import { UserSchema } from "../user";

export const PersonalEnrollmentRequestSchema = z.object({
	courseId: z.string(),
	type: z.literal("personal"),
	applicant: z.object({
		name: z.string(),
		email: z.email(),
		phone: z.string(),
		motivation: z.string().optional(),
	}),
	agreedToTerms: z.boolean(),
});

export const GroupEnrollmentRequestSchema = z.object({
	courseId: z.string(),
	type: z.literal("group"),
	applicant: UserSchema,
	group: z.object({
		organizationName: z.string(),
		headCount: z.number().int().positive(),
		participants: z.array(GroupParticipantSchema),
		contactPerson: z.string(),
	}),
	agreedToTerms: z.boolean(),
});

import z from "zod";

export const GroupParticipantSchema = z.object({
	name: z.string(),
	email: z.email(),
});

export const GroupSchema = z.object({
	organizationName: z.string(),
	headCount: z.number().int().positive(),
	participants: z.array(GroupParticipantSchema),
	contactPerson: z.string(),
});

export type Group = z.infer<typeof GroupSchema>;

import z from "zod";

export const EnrollmentStatus = ["confirmed", "pending"] as const;

export const EnrollmentResponseSchema = z.object({
	enrollmentId: z.string(),
	status: z.enum(EnrollmentStatus),
	enrolledAt: z.date(),
});

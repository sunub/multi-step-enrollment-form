import { z } from "zod";

const phoneRegex = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;

export const usernameSchema = z
	.string()
	.min(2, { error: "이름은 2자 이상이어야 합니다." })
	.max(20, { error: "이름은 20자 이하이어야 합니다." });

export const emailSchema = z.email({ error: "유효한 이메일 형식이 아닙니다." });
export const phoneSchema = z
	.string()
	.regex(phoneRegex, { error: "올바른 한국 전화번호 형식이 아닙니다." });

export const groupNameSchema = z
	.string()
	.min(1, { error: "단체명은 필수 입력 항목입니다." });

export const representativeSchema = z.object({
	name: usernameSchema,
	email: emailSchema,
	phone: phoneSchema,
	motivation: z
		.string()
		.max(300, { error: "수강 동기는 300자 이하로 작성해야 합니다." })
		.optional(),
});

export const groupInfoSchema = z.object({
	groupName: groupNameSchema,
	managerName: z
		.string()
		.min(2, { error: "담당자 이름은 2자 이상이어야 합니다." })
		.max(20, { error: "담당자 이름은 20자 이하이어야 합니다." }),
	participantCount: z
		.number()
		.min(2, { error: "신청 인원은 최소 2명입니다." })
		.max(10, { error: "신청 인원은 최대 10명입니다." }),
});

export const participantSchema = z.object({
	name: usernameSchema,
	email: emailSchema,
});

export const groupApplicationSchema = z
	.object({
		representative: representativeSchema,
		groupInfo: groupInfoSchema,
		participants: z.array(participantSchema),
	})
	.superRefine((data, ctx) => {
		if (data.participants.length !== data.groupInfo.participantCount) {
			ctx.addIssue({
				code: "custom",
				message: `입력된 참가자 명단 수(${data.participants.length}명)가 신청 인원수(${data.groupInfo.participantCount}명)와 일치하지 않습니다.`,
				path: ["participants"],
			});
		}
	});

export type RepresentativeData = z.infer<typeof representativeSchema>;
export type GroupInfoData = z.infer<typeof groupInfoSchema>;
export type ParticipantData = z.infer<typeof participantSchema>;
export type GroupApplicationData = z.infer<typeof groupApplicationSchema>;

export function isSameGroupApplicationData(
	left: GroupApplicationData,
	right: GroupApplicationData,
) {
	if (
		left.representative.name !== right.representative.name ||
		left.representative.email !== right.representative.email ||
		left.representative.phone !== right.representative.phone ||
		left.representative.motivation !== right.representative.motivation ||
		left.groupInfo.groupName !== right.groupInfo.groupName ||
		left.groupInfo.managerName !== right.groupInfo.managerName ||
		left.groupInfo.participantCount !== right.groupInfo.participantCount ||
		left.participants.length !== right.participants.length
	) {
		return false;
	}

	return left.participants.every((participant, index) => {
		const otherParticipant = right.participants[index];

		return (
			participant.name === otherParticipant?.name &&
			participant.email === otherParticipant?.email
		);
	});
}

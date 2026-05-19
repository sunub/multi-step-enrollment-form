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
		.min(2, { error: "신청 인원은 2명에서 10명 사이로 입력해주세요." })
		.max(10, { error: "신청 인원은 2명에서 10명 사이로 입력해주세요." }),
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

		const usedEmails = new Set<string>();
		const representativeEmail = data.representative.email.toLowerCase();

		usedEmails.add(representativeEmail);

		data.participants.forEach((participant, index) => {
			const currentEmail = participant.email.toLowerCase();
			if (!currentEmail) return;

			if (usedEmails.has(currentEmail)) {
				const isDuplicateWithRepresentative =
					currentEmail === representativeEmail;
				ctx.addIssue({
					code: "custom",
					message: isDuplicateWithRepresentative
						? "대표자 이메일과 중복됩니다."
						: "다른 참가자의 이메일과 중복됩니다.",
					path: ["participants", index, "email"],
				});
			} else {
				usedEmails.add(currentEmail);
			}
		});
	});

export type RepresentativeData = z.infer<typeof representativeSchema>;
export type GroupInfoData = z.infer<typeof groupInfoSchema>;
export type ParticipantData = z.infer<typeof participantSchema>;
export type GroupApplicationData = z.infer<typeof groupApplicationSchema>;

const DEFAULT_PARTICIPANT_COUNT = 2;

function normalizeRepresentative(
	representative?: Partial<RepresentativeData>,
): RepresentativeData {
	return {
		name: representative?.name?.trim() ?? "",
		email: representative?.email?.trim().toLowerCase() ?? "",
		phone: representative?.phone?.trim() ?? "",
		motivation: representative?.motivation?.trim() ?? "",
	};
}

function normalizeGroupInfo(groupInfo?: Partial<GroupInfoData>): GroupInfoData {
	const participantCountValue = groupInfo?.participantCount;

	return {
		groupName: groupInfo?.groupName?.trim() ?? "",
		managerName: groupInfo?.managerName?.trim() ?? "",
		participantCount:
			typeof participantCountValue === "number" &&
			!Number.isNaN(participantCountValue)
				? participantCountValue
				: DEFAULT_PARTICIPANT_COUNT,
	};
}

function normalizeParticipants(
	participants?: Partial<ParticipantData>[],
): ParticipantData[] {
	return (participants ?? []).map((participant) => ({
		name: participant.name?.trim() ?? "",
		email: participant.email?.trim().toLowerCase() ?? "",
	}));
}

export function normalizeGroupApplicationData(values?: {
	representative?: Partial<RepresentativeData> | null;
	groupInfo?: Partial<GroupInfoData> | null;
	participants?: Partial<ParticipantData>[] | null;
}): GroupApplicationData {
	return {
		representative: normalizeRepresentative(
			values?.representative ?? undefined,
		),
		groupInfo: normalizeGroupInfo(values?.groupInfo ?? undefined),
		participants: normalizeParticipants(values?.participants ?? undefined),
	};
}

export function isSameGroupApplicationData(
	left: Parameters<typeof normalizeGroupApplicationData>[0],
	right: Parameters<typeof normalizeGroupApplicationData>[0],
) {
	const normalizedLeft = normalizeGroupApplicationData(left);
	const normalizedRight = normalizeGroupApplicationData(right);

	if (
		normalizedLeft.representative.name !==
			normalizedRight.representative.name ||
		normalizedLeft.representative.email !==
			normalizedRight.representative.email ||
		normalizedLeft.representative.phone !==
			normalizedRight.representative.phone ||
		normalizedLeft.representative.motivation !==
			normalizedRight.representative.motivation ||
		normalizedLeft.groupInfo.groupName !==
			normalizedRight.groupInfo.groupName ||
		normalizedLeft.groupInfo.managerName !==
			normalizedRight.groupInfo.managerName ||
		normalizedLeft.groupInfo.participantCount !==
			normalizedRight.groupInfo.participantCount ||
		normalizedLeft.participants.length !== normalizedRight.participants.length
	) {
		return false;
	}

	return normalizedLeft.participants.every((participant, index) => {
		const otherParticipant = normalizedRight.participants[index];

		return (
			participant.name === otherParticipant?.name &&
			participant.email === otherParticipant?.email
		);
	});
}

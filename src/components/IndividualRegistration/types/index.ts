import { z } from "zod";

const phoneRegex = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;

export const usernameSchema = z
	.string()
	.min(2, { error: "이름은 2자 이상이어야 합니다." })
	.max(20, { error: "이름은 20자 이하이어야 합니다." });

export const emailSchema = z.email({ error: "유효한 이메일 형식이 아닙니다." });
export const phoneSchema = z
	.string()
	.regex(phoneRegex, { error: "올바른 한국 전화번호 형식이 아닙니다." })
	.transform((val) => {
		const digits = val.replace(/[^0-9]/g, "");
		if (digits.length === 11) {
			return digits.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
		} else if (digits.length === 10) {
			return digits.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
		}
		return val;
	});

export const groupNameSchema = z
	.string()
	.min(1, { error: "단체명은 필수 입력 항목입니다." });

export const individualApplicationSchema = z.object({
	name: usernameSchema,
	email: emailSchema,
	phone: phoneSchema,
	motivation: z
		.string()
		.max(300, { error: "수강 동기는 300자 이하로 작성해야 합니다." })
		.optional(),
});

export type IndividualApplicationData = z.infer<
	typeof individualApplicationSchema
>;

export function isSameIndividualApplicationData(
	left: IndividualApplicationData,
	right: IndividualApplicationData,
) {
	return (
		left.name === right.name &&
		left.email === right.email &&
		left.phone === right.phone &&
		left.motivation === right.motivation
	);
}

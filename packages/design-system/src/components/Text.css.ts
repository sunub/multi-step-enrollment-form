import { styleVariants } from "@vanilla-extract/css";
import { vars } from "../tokens/theme.css";

export const textVariant = styleVariants({
	headlineLg: {
		fontFamily: vars.typography.fontFamily,
		...vars.textStyle.headlineLg,
	},
	headlineMd: {
		fontFamily: vars.typography.fontFamily,
		...vars.textStyle.headlineMd,
	},
	bodyMd: {
		fontFamily: vars.typography.fontFamily,
		...vars.textStyle.bodyMd,
	},
	bodySm: {
		fontFamily: vars.typography.fontFamily,
		...vars.textStyle.bodySm,
	},
	labelMd: {
		fontFamily: vars.typography.fontFamily,
		...vars.textStyle.labelMd,
	},
	labelSm: {
		fontFamily: vars.typography.fontFamily,
		...vars.textStyle.labelSm,
	},
	inherit: {
		fontFamily: "inherit",
		fontSize: "inherit",
		fontWeight: "inherit",
		lineHeight: "inherit",
		letterSpacing: "inherit",
	},
});

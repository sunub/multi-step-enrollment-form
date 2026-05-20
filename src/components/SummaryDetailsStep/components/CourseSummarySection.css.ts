import { vars } from "@shared/design-system";
import { style, styleVariants } from "@vanilla-extract/css";

export const sectionIcon = style({
	width: "48px",
	height: "48px",
	borderRadius: vars.borderRadius.md,
	display: "inline-flex",
	alignItems: "center",
	justifyContent: "center",
	flexShrink: 0,
});

export const sectionIconTone = styleVariants({
	development: {
		backgroundColor: vars.color.primaryFixed,
		color: vars.color.primary,
	},
	design: {
		backgroundColor: vars.color.primaryFixedDim,
		color: vars.color.primary,
	},
	marketing: {
		backgroundColor: vars.color.tertiaryFixed,
		color: vars.color.tertiary,
	},
	business: {
		backgroundColor: vars.color.surfaceContainerHigh,
		color: vars.color.surfaceTint,
	},
	primary: {
		backgroundColor: vars.color.primaryFixed,
		color: vars.color.primary,
	},
});

export const courseMetaList = style({
	display: "flex",
	flexWrap: "wrap",
	gap: vars.space[1.5],
});

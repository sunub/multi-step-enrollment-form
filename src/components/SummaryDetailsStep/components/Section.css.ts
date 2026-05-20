import { vars } from "@shared/design-system";
import { style, styleVariants } from "@vanilla-extract/css";

const glassBorderColor = "rgba(255, 255, 255, 0.45)";
const glassBackgroundColor = "rgba(255, 255, 255, 0.72)";
const glassBackgroundHoverColor = "rgba(255, 255, 255, 0.82)";

export const glassSection = style({
	backdropFilter: "blur(12px)",
	WebkitBackdropFilter: "blur(12px)",
	background: glassBackgroundColor,
	borderTop: `1px solid ${glassBorderColor}`,
	borderLeft: `1px solid ${glassBorderColor}`,
	boxShadow: "0 4px 30px rgba(0, 0, 0, 0.04)",
	transition: "background-color 0.2s ease",
	selectors: {
		"&:hover": {
			background: glassBackgroundHoverColor,
		},
	},
});

export const sectionHeader = style({
	marginBottom: vars.space[3],
});

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

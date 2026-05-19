import { vars } from "@shared/design-system";
import { createVar, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

export const progressWidthVar = createVar();

export const stepText = style({
	textTransform: "uppercase",
});

export const progressBarTrack = recipe({
	base: {
		width: "100%",
		height: "8px",
		borderRadius: vars.borderRadius.full,
		overflow: "hidden",
		marginBottom: vars.space[4],
		boxShadow: "inset 0 2px 4px rgba(0,0,0,0.06)",
	},
	variants: {
		variant: {
			primary: { backgroundColor: vars.color.surfaceContainer },
			error: { backgroundColor: vars.color.errorContainer },
			default: { backgroundColor: vars.color.tertiaryFixed },
		},
	},
	defaultVariants: {
		variant: "primary",
	},
});

export const progressBarIndicator = recipe({
	base: {
		height: "100%",
		borderRadius: vars.borderRadius.full,
		transition: "width 0.7s ease",
		width: progressWidthVar,
	},
	variants: {
		variant: {
			primary: { backgroundColor: vars.color.primary },
			error: { backgroundColor: vars.color.error },
			default: { backgroundColor: vars.color.tertiary },
		},
	},
	defaultVariants: {
		variant: "primary",
	},
});

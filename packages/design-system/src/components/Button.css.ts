import { createVar, fallbackVar, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { vars } from "../tokens/theme.css";

export const buttonPaddingVar = createVar();
export const buttonCursorVar = createVar();

export const buttonContentClass = style({
	display: "inline-flex",
	alignItems: "center",
	justifyContent: "center",
	width: "100%",
	whiteSpace: "nowrap",
	gap: vars.space[2],
});

export const buttonRecipe = recipe({
	base: {
		position: "relative",
		display: "inline-flex",
		alignItems: "center",
		justifyContent: "center",
		cursor: fallbackVar(buttonCursorVar, "pointer"),
		borderRadius: vars.borderRadius.md,
		fontWeight: vars.typography.weight.semibold,
		transition: "all 0.2s ease-in-out",
		outline: "none",
		border: "1px solid transparent",
		selectors: {
			"&:disabled": {
				cursor: "not-allowed",
				opacity: 0.5,
			},
			"&:active": {
				transform: "scale(0.98)",
			},
		},
	},
	variants: {
		variant: {
			primary: {
				backgroundColor: vars.color.primary,
				color: vars.color.onPrimary,
				selectors: {
					"&:hover:not(:disabled)": {
						backgroundColor: vars.color.primaryContainer,
					},
				},
			},
			secondary: {
				backgroundColor: vars.color.secondary,
				color: vars.color.onSecondary,
				selectors: {
					"&:hover:not(:disabled)": {
						backgroundColor: vars.color.secondaryContainer,
						color: vars.color.onSecondaryContainer,
					},
				},
			},
			outline: {
				backgroundColor: "transparent",
				color: vars.color.primary,
				border: `1px solid ${vars.color.primary}`,
				selectors: {
					"&:hover:not(:disabled)": {
						backgroundColor: vars.color.primaryFixed,
					},
				},
			},
			ghost: {
				backgroundColor: "transparent",
				color: vars.color.onSurfaceVariant,
				selectors: {
					"&:hover:not(:disabled)": {
						backgroundColor: vars.color.surfaceContainerHigh,
					},
				},
			},
			error: {
				backgroundColor: vars.color.error,
				color: vars.color.onError,
				selectors: {
					"&:hover:not(:disabled)": {
						backgroundColor: vars.color.errorContainer,
						color: vars.color.onErrorContainer,
					},
				},
			},
		},
		size: {
			sm: {
				height: "32px",
				padding: `0 ${vars.space[2]}`,
				fontSize: vars.textStyle.labelSm.fontSize,
			},
			md: {
				height: "40px",
				padding: `0 ${vars.space[4]}`,
				fontSize: vars.textStyle.bodySm.fontSize,
			},
			lg: {
				height: "48px",
				padding: `0 ${vars.space[6]}`,
				fontSize: vars.textStyle.bodyMd.fontSize,
			},
		},
	},
	defaultVariants: {
		variant: "primary",
		size: "md",
	},
});

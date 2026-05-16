import { style, styleVariants } from "@vanilla-extract/css";
import { vars } from "../tokens/theme.css";

export const surfaceBase = style({
	boxSizing: "border-box",
	width: "100%",
	transition: "all 0.2s ease-in-out",
});

export const surfaceTone = styleVariants({
	// Level 0: Neutral Background
	background: {
		backgroundColor: vars.color.background,
		color: vars.color.onBackground,
	},
	// Level 1: Standard Surface (Card)
	surface: {
		backgroundColor: vars.color.surfaceContainerLowest,
		color: vars.color.onSurface,
		border: `1px solid ${vars.color.outlineVariant}`,
	},
	// Level 1: Tinted Surface (Selected Course etc)
	primaryContainer: {
		backgroundColor: vars.color.primaryContainer,
		color: vars.color.onPrimaryContainer,
		border: `1px solid ${vars.color.primary}`,
	},
	secondaryContainer: {
		backgroundColor: vars.color.secondaryContainer,
		color: vars.color.onSecondaryContainer,
		border: `1px solid ${vars.color.secondary}`,
	},
	errorContainer: {
		backgroundColor: vars.color.errorContainer,
		color: vars.color.onErrorContainer,
		border: `1px solid ${vars.color.error}`,
	},
});

export const surfaceElevation = styleVariants({
	none: {
		boxShadow: "none",
	},
	low: {
		boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
	},
	medium: {
		boxShadow:
			"0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
	},
	high: {
		boxShadow:
			"0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
	},
});

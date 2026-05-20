import { vars } from "@shared/design-system";
import { style } from "@vanilla-extract/css";

export const checkboxRow = style({
	display: "flex",
	alignItems: "flex-start",
	gap: vars.space[1.5],
	padding: vars.space[2],
	backgroundColor: vars.color.surfaceContainerLowest,
	border: `1px solid ${vars.color.outlineVariant}`,
	borderRadius: vars.borderRadius.md,
	cursor: "pointer",
});

export const checkboxInput = style({
	width: "18px",
	height: "18px",
	marginTop: "2px",
	flexShrink: 0,
	accentColor: vars.color.primary,
	cursor: "pointer",
});

export const errorBanner = style({
	borderLeft: `4px solid ${vars.color.error}`,
});

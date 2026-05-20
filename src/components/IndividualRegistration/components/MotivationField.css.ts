import { vars } from "@shared/design-system";
import { style } from "@vanilla-extract/css";

export const fieldContainer = style({
	display: "flex",
	flexDirection: "column",
	gap: vars.space[1],
});

export const textareaHeader = style({
	display: "flex",
	justifyContent: "space-between",
	alignItems: "flex-end",
});

export const fieldLabelBase = style({
	fontFamily: vars.typography.fontFamily,
	fontSize: vars.textStyle.bodySm.fontSize,
	fontWeight: vars.typography.weight.semibold,
	color: vars.color.onSurface,
	display: "flex",
	alignItems: "center",
	gap: vars.space[0.5],
});

export const fieldLabelOptional = style({
	color: vars.color.onSurfaceVariant,
	fontWeight: vars.typography.weight.normal,
});

export const charCount = style({
	fontFamily: vars.typography.fontFamily,
	fontSize: vars.textStyle.labelSm.fontSize,
	color: vars.color.onSurfaceVariant,
});

export const inputBase = style({
	width: "100%",
	padding: `${vars.space[1.5]} ${vars.space[2]}`,
	borderRadius: vars.borderRadius.md,
	fontFamily: vars.typography.fontFamily,
	fontSize: vars.textStyle.bodyMd.fontSize,
	fontWeight: vars.typography.weight.medium,
	color: vars.color.onSurface,
	transition: "all 0.2s ease",
	boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
	"::placeholder": {
		color: vars.color.outlineVariant,
	},
	":focus": {
		outline: "none",
	},
});

export const inputDefault = style({
	backgroundColor: "rgba(255, 255, 255, 0.8)",
	border: `2px solid ${vars.color.surfaceContainerHighest}`,
	":hover": { backgroundColor: vars.color.white },
	":focus": {
		borderColor: vars.color.primary,
		boxShadow: `0 0 0 4px rgba(0, 74, 198, 0.1)`,
	},
});

export const textareaBase = style([
	inputBase,
	inputDefault,
	{
		resize: "none",
	},
]);

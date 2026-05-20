import { vars } from "@shared/design-system";
import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

export const typeLabel = recipe({
	base: {
		border: `1px solid ${vars.color.outlineVariant}`,
		cursor: "pointer",
		transition: "all 0.2s",
	},
	variants: {
		selected: {
			true: {
				borderColor: vars.color.primary,
			},
			false: {
				borderColor: vars.color.outlineVariant,
			},
		},
	},
});

export const courseWrapper = style({
	borderTop: `1px solid ${vars.color.outlineVariant}`,
	borderBottom: `1px solid ${vars.color.outlineVariant}`,
});

export const removeButton = style({
	padding: 0,
	minWidth: "auto",
	height: "auto",
});

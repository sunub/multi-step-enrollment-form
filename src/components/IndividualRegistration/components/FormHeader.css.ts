import { vars } from "@shared/design-system";
import { style } from "@vanilla-extract/css";

export const headerContainer = style({
	marginBottom: vars.space[5],
	textAlign: "center",
});

export const headerTitle = style({
	fontFamily: vars.typography.fontFamily,
	fontSize: vars.textStyle.headlineLg.fontSize,
	fontWeight: vars.typography.weight.bold,
	color: vars.color.onSurface,
	marginBottom: vars.space[1.5],
	letterSpacing: vars.textStyle.headlineLg.letterSpacing,
});

export const headerDesc = style({
	fontFamily: vars.typography.fontFamily,
	fontSize: vars.textStyle.bodyMd.fontSize,
	color: vars.color.onSurfaceVariant,
	lineHeight: 1.6,
});

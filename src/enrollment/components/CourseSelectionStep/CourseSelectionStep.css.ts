import { vars } from "@shared/design-system";
import { style } from "@vanilla-extract/css";

export const container = style({
	display: "grid",
	gridTemplateColumns: "1fr 380px",
	gap: vars.space.gutter,
	maxWidth: "1400px",
	margin: "0 auto",
	padding: vars.space[4],
	alignItems: "start",
	"@media": {
		"screen and (max-width: 1024px)": {
			gridTemplateColumns: "1fr",
		},
	},
});

export const coursesSection = style({
	display: "flex",
	flexDirection: "column",
	gap: vars.space[4],
});

export const sidebar = style({
	position: "sticky",
	top: vars.space[4],
	display: "flex",
	flexDirection: "column",
	gap: vars.space[4],
});

export const header = style({
	marginBottom: vars.space[2],
});

export const headline = style({
	fontSize: vars.textStyle.headlineLg.fontSize,
	fontWeight: vars.textStyle.headlineLg.fontWeight,
	color: vars.color.onSurface,
	marginBottom: vars.space[1],
});

export const subline = style({
	fontSize: vars.textStyle.bodyMd.fontSize,
	color: vars.color.onSurfaceVariant,
});

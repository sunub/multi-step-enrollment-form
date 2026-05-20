import { vars } from "@shared/design-system";
import { style } from "@vanilla-extract/css";

export const sectionContainer = style({
	background: "rgba(255, 255, 255, 0.75)",
	backdropFilter: "blur(20px)",
	WebkitBackdropFilter: "blur(20px)",
	border: `1px solid ${vars.color.outlineVariant}`,
	borderRadius: vars.borderRadius.xl,
	transition: "background-color 0.3s ease",
});

export const header = style({
	display: "flex",
	alignItems: "center",
	gap: vars.space[1.5],
	marginBottom: vars.space[3],
	borderBottom: `1px solid ${vars.color.outlineVariant}`,
	paddingBottom: vars.space[2],
});

export const iconWrapper = style({
	width: "40px",
	height: "40px",
	borderRadius: vars.borderRadius.full,
	backgroundColor: "rgba(0, 74, 198, 0.1)",
	color: vars.color.primary,
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
});

export const formGrid = style({
	display: "grid",
	gridTemplateColumns: "1fr",
	columnGap: vars.space[4],
	rowGap: vars.space[2.5],
	"@media": {
		"screen and (min-width: 768px)": {
			gridTemplateColumns: "repeat(2, 1fr)",
		},
	},
});

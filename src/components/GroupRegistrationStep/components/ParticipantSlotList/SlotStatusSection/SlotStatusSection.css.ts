import { vars } from "@shared/design-system";
import { style } from "@vanilla-extract/css";

export const slotGrid = style({
	display: "grid",
	gridTemplateColumns: "1fr",
	gap: vars.space[2],
	"@media": {
		"screen and (min-width: 640px)": {
			gridTemplateColumns: "repeat(2, 1fr)",
		},
		"screen and (min-width: 1024px)": {
			gridTemplateColumns: "repeat(3, 1fr)",
		},
	},
});

export const navButton = style({
	height: "36px",
	minWidth: "36px",
	padding: 0,
	borderRadius: vars.borderRadius.full,
	backgroundColor: "rgba(255, 255, 255, 0.5)",
	boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
	":hover": {
		backgroundColor: vars.color.white,
	},
});

export const statusBadge = style({
	padding: `${vars.space[0.5]} ${vars.space[1]}`,
	backgroundColor: vars.color.secondaryContainer,
	color: vars.color.onSecondaryContainer,
	borderRadius: vars.borderRadius.sm,
});

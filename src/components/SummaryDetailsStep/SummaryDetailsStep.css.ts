import { vars } from "@shared/design-system";
import { style } from "@vanilla-extract/css";

export const actionRow = style({
	display: "flex",
	flexDirection: "column",
	gap: vars.space[1.5],
	"@media": {
		"screen and (min-width: 768px)": {
			flexDirection: "row",
			justifyContent: "flex-end",
		},
	},
});

export const actionButton = style({
	width: "100%",
	"@media": {
		"screen and (min-width: 768px)": {
			width: "auto",
			minWidth: "160px",
		},
	},
});

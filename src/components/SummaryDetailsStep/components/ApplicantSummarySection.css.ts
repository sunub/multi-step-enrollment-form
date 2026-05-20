import { vars } from "@shared/design-system";
import { style } from "@vanilla-extract/css";

export const fieldGrid = style({
	display: "grid",
	gridTemplateColumns: "1fr",
	gap: vars.space[2],
	"@media": {
		"screen and (min-width: 768px)": {
			gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
		},
	},
});

export const noteCard = style({
	borderLeft: `4px solid ${vars.color.primary}`,
});

export const participantsList = style({
	display: "flex",
	flexDirection: "column",
	gap: vars.space[1.5],
});

export const participantItem = style({
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
	gap: vars.space[2],
	padding: `${vars.space[1.5]} ${vars.space[2]}`,
	borderBottom: `1px solid ${vars.color.outlineVariant}`,
	"@media": {
		"screen and (max-width: 767px)": {
			flexDirection: "column",
			alignItems: "flex-start",
		},
	},
});

export const participantIdentity = style({
	display: "flex",
	alignItems: "center",
	gap: vars.space[1.5],
});

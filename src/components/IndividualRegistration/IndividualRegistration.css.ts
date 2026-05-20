import { vars } from "@shared/design-system";
import { style } from "@vanilla-extract/css";

export const mainWrapper = style({
	flexGrow: 1,
	display: "flex",
	alignItems: "flex-start",
	justifyContent: "center",
	padding: `${vars.space[4]} ${vars.space[3]}`,
	overflowY: "auto",
	"@media": {
		"screen and (min-width: 1024px)": {
			padding: `${vars.space[6]} ${vars.space[5]}`,
		},
	},
});

export const formContainer = style({
	width: "100%",
	maxWidth: "42rem", // max-w-2xl
	backgroundColor: "rgba(255, 255, 255, 0.6)",
	backdropFilter: "blur(20px)",
	WebkitBackdropFilter: "blur(20px)",
	borderRadius: vars.borderRadius.lg,
	border: `1px solid ${vars.color.white}`,
	boxShadow: "0 20px 50px rgba(0,0,0,0.05)",
	padding: vars.space[4],
	"@media": {
		"screen and (min-width: 768px)": {
			padding: vars.space[6],
		},
	},
});

export const formLayout = style({
	display: "flex",
	flexDirection: "column",
	gap: vars.space[4], // space-y-8 (32px)
});

import { vars } from "@shared/design-system";
import { createVar, style } from "@vanilla-extract/css";

export const dynamicVars = {
	progress: createVar(),
	progressColor: createVar(),
};

export const slotContainer = style({
	position: "relative",
	borderRadius: vars.borderRadius.lg,
	padding: "2px",
	background: `conic-gradient(${dynamicVars.progressColor} ${dynamicVars.progress}, ${vars.color.surfaceVariant} 0%)`,
	boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
	transition: "all 0.2s ease",
	":hover": {
		transform: "translateY(-4px)",
		boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
	},
});

export const slotInner = style({
	backgroundColor: vars.color.surfaceContainerLowest,
	borderRadius: `calc(${vars.borderRadius.lg} - 2px)`,
	height: "100%",
	padding: vars.space[3],
	display: "flex",
	flexDirection: "column",
	gap: vars.space[2],
});

export const checkIcon = style({
	position: "absolute",
	top: vars.space[3],
	right: vars.space[3],
	color: vars.color.secondary,
	zIndex: 1,
});

export const clearButton = style({
	position: "absolute",
	top: vars.space[3],
	right: vars.space[3],
	color: vars.color.outline,
	backgroundColor: vars.color.surfaceContainerHigh,
	borderRadius: vars.borderRadius.full,
	width: "28px",
	height: "28px",
	display: "none",
	alignItems: "center",
	justifyContent: "center",
	cursor: "pointer",
	border: "none",
	transition: "all 0.2s ease",
	zIndex: 2,
	":hover": {
		backgroundColor: vars.color.errorContainer,
		color: vars.color.error,
	},
	selectors: {
		[`${slotContainer}:hover &`]: {
			display: "flex",
		},
	},
});

export const fieldsContainer = style({
	display: "flex",
	flexDirection: "column",
	gap: vars.space[5], // Default stack gap to prevent floating label overlap
	"@media": {
		"screen and (min-width: 480px) and (max-width: 767px)": {
			flexDirection: "row",
			gap: vars.space[4],
		},
	},
});

import { vars } from "@shared/design-system";
import { style } from "@vanilla-extract/css";

export const headerContainer = style({
	display: "flex",
	flexDirection: "column",
	gap: vars.space[2],
	borderBottom: `1px solid ${vars.color.outlineVariant}`,
	paddingBottom: vars.space[2],
	"@media": {
		"screen and (min-width: 1024px)": {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
		},
	},
});

export const headerIcon = style({
	width: "40px",
	height: "40px",
	borderRadius: vars.borderRadius.full,
	backgroundColor: vars.color.secondaryContainer,
	color: vars.color.secondary,
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
});

export const totalCountContainer = style({
	backgroundColor: "rgba(255, 255, 255, 0.4)",
	padding: vars.space[2],
	borderRadius: vars.borderRadius.md,
	border: `1px solid ${vars.color.outlineVariant}`,
	alignSelf: "flex-start",
	"@media": {
		"screen and (min-width: 1024px)": {
			alignSelf: "center",
		},
	},
});

export const totalCountInput = style({
	width: "80px",
	backgroundColor: vars.color.white,
	border: `1px solid ${vars.color.outlineVariant}`,
	borderRadius: vars.borderRadius.sm,
	padding: `${vars.space[0.5]} ${vars.space[1]}`,
	textAlign: "center",
	fontSize: vars.textStyle.bodyMd.fontSize,
	fontWeight: vars.typography.weight.bold,
	color: vars.color.onSurface,
	transition: "all 0.2s ease",
	":focus": {
		outline: "none",
		boxShadow: `0 0 0 2px ${vars.color.primaryFixed}`,
	},
});

export const totalCountInputError = style({
	borderColor: vars.color.error,
	":focus": {
		boxShadow: `0 0 0 2px ${vars.color.errorContainer}`,
	},
});

export const inputValidationContainer = style({
	display: "flex",
	flexDirection: "column",
	alignItems: "flex-end",
	gap: vars.space[0.5],
});

export const errorMessage = style({
	color: vars.color.error,
	fontSize: vars.textStyle.labelSm.fontSize,
	fontWeight: vars.typography.weight.medium,
	whiteSpace: "nowrap",
});

export const chipButton = style({
	display: "flex",
	alignItems: "center",
	gap: vars.space[1],
	backgroundColor: vars.color.primaryFixed,
	border: `1px solid ${vars.color.primary}`,
	color: vars.color.onSurface,
	padding: `${vars.space[1]} ${vars.space[2]}`,
	borderRadius: vars.borderRadius.full,
	boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
	transition: "all 0.2s ease",
	cursor: "pointer",
	":hover": {
		backgroundColor: vars.color.primaryFixedDim,
	},
});

export const chipNumber = style({
	width: "24px",
	height: "24px",
	borderRadius: vars.borderRadius.full,
	backgroundColor: vars.color.primary,
	color: vars.color.white,
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	fontSize: "11px",
	fontWeight: vars.typography.weight.bold,
});

export const chipDeleteIcon = style({
	fontSize: "18px",
	color: vars.color.outline,
	transition: "color 0.2s ease",
	selectors: {
		[`${chipButton}:hover &`]: { color: vars.color.error },
	},
});

export const formContainer = style({
	backgroundColor: vars.color.surfaceContainerLow,
	border: `1px solid ${vars.color.outlineVariant}`,
	borderRadius: vars.borderRadius.lg,
	padding: vars.space[3],
	position: "relative",
});

export const formBadge = style({
	position: "absolute",
	top: "-12px",
	left: vars.space[3],
	backgroundColor: vars.color.primary,
	color: vars.color.white,
	padding: `2px ${vars.space[1.5]}`,
	fontSize: vars.textStyle.labelSm.fontSize,
	fontWeight: vars.typography.weight.bold,
	borderRadius: vars.borderRadius.full,
	boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
});

export const formGrid = style({
	display: "grid",
	gridTemplateColumns: "1fr",
	gap: vars.space[2],
	alignItems: "flex-end",
	"@media": {
		"screen and (min-width: 768px)": {
			gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
		},
	},
});

export const colSpan4 = style({
	display: "flex",
	flexDirection: "column",
	gap: vars.space[1],
	"@media": {
		"screen and (min-width: 768px)": { gridColumn: "span 4 / span 4" },
	},
});

export const colSpan6 = style({
	display: "flex",
	flexDirection: "column",
	gap: vars.space[1],
	"@media": {
		"screen and (min-width: 768px)": { gridColumn: "span 6 / span 6" },
	},
});

export const colSpan2 = style({
	"@media": {
		"screen and (min-width: 768px)": { gridColumn: "span 2 / span 2" },
	},
});

export const inputField = style({
	width: "100%",
	backgroundColor: vars.color.white,
	border: `1px solid ${vars.color.outlineVariant}`,
	borderRadius: vars.borderRadius.md,
	padding: `${vars.space[1.5]} ${vars.space[2]}`,
	fontSize: vars.textStyle.bodyMd.fontSize,
	transition: "all 0.2s ease",
	":focus": {
		outline: "none",
		boxShadow: `0 0 0 4px ${vars.color.primaryFixed}`,
	},
});

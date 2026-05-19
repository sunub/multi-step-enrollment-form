import { vars } from "@shared/design-system";
import { style, styleVariants } from "@vanilla-extract/css";

const glassBorderColor = "rgba(255, 255, 255, 0.45)";
const glassBackgroundColor = "rgba(255, 255, 255, 0.72)";
const glassBackgroundHoverColor = "rgba(255, 255, 255, 0.82)";

export const glassSection = style({
	backdropFilter: "blur(12px)",
	WebkitBackdropFilter: "blur(12px)",
	background: glassBackgroundColor,
	borderTop: `1px solid ${glassBorderColor}`,
	borderLeft: `1px solid ${glassBorderColor}`,
	boxShadow: "0 4px 30px rgba(0, 0, 0, 0.04)",
	transition: "background-color 0.2s ease",
	selectors: {
		"&:hover": {
			background: glassBackgroundHoverColor,
		},
	},
});

export const sectionHeader = style({
	marginBottom: vars.space[3],
});

export const sectionIcon = style({
	width: "48px",
	height: "48px",
	borderRadius: vars.borderRadius.md,
	display: "inline-flex",
	alignItems: "center",
	justifyContent: "center",
	flexShrink: 0,
});

export const sectionIconTone = styleVariants({
	development: {
		backgroundColor: vars.color.primaryFixed,
		color: vars.color.primary,
	},
	design: {
		backgroundColor: vars.color.primaryFixedDim,
		color: vars.color.primary,
	},
	marketing: {
		backgroundColor: vars.color.tertiaryFixed,
		color: vars.color.tertiary,
	},
	business: {
		backgroundColor: vars.color.surfaceContainerHigh,
		color: vars.color.surfaceTint,
	},
	primary: {
		backgroundColor: vars.color.primaryFixed,
		color: vars.color.primary,
	},
});

export const courseMetaList = style({
	display: "flex",
	flexWrap: "wrap",
	gap: vars.space[1.5],
});

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

export const fieldCard = style({
	height: "100%",
});

export const fieldLabel = style({
	display: "block",
	marginBottom: vars.space[0.5],
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

export const checkboxRow = style({
	display: "flex",
	alignItems: "flex-start",
	gap: vars.space[1.5],
	padding: vars.space[2],
	backgroundColor: vars.color.surfaceContainerLowest,
	border: `1px solid ${vars.color.outlineVariant}`,
	borderRadius: vars.borderRadius.md,
});

export const checkboxInput = style({
	width: "18px",
	height: "18px",
	marginTop: "2px",
	flexShrink: 0,
	accentColor: vars.color.primary,
	cursor: "pointer",
});

export const errorBanner = style({
	borderLeft: `4px solid ${vars.color.error}`,
});

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

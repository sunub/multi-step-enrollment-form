import { vars } from "@shared/design-system";
import { keyframes, style } from "@vanilla-extract/css";

const fadeInUp = keyframes({
	from: {
		opacity: 0,
		transform: "translateY(20px)",
	},
	to: {
		opacity: 1,
		transform: "translateY(0)",
	},
});

const float = keyframes({
	"0%, 100%": {
		transform: "translateY(0)",
	},
	"50%": {
		transform: "translateY(-6px)",
	},
});

export const pageContainer = style({
	minHeight: "100vh",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	padding: vars.space[3],
	background: `radial-gradient(circle at 10% 20%, rgba(0, 83, 219, 0.05) 0%, transparent 40%),
               radial-gradient(circle at 90% 80%, rgba(106, 30, 219, 0.05) 0%, transparent 40%),
               ${vars.color.background}`,
	fontFamily: vars.typography.fontFamily,
});

export const welcomeCard = style({
	maxWidth: "640px",
	width: "100%",
	backgroundColor: "rgba(255, 255, 255, 0.8)",
	backdropFilter: "blur(20px)",
	WebkitBackdropFilter: "blur(20px)",
	border: `1px solid rgba(255, 255, 255, 0.6)`,
	borderRadius: vars.borderRadius.xl,
	padding: vars.space[5],
	boxShadow: "0 20px 40px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)",
	animation: `${fadeInUp} 0.8s cubic-bezier(0.16, 1, 0.3, 1) both`,
	"@media": {
		"screen and (max-width: 480px)": {
			padding: vars.space[3],
		},
	},
});

export const badge = style({
	display: "inline-flex",
	alignItems: "center",
	gap: vars.space[1],
	backgroundColor: vars.color.primaryFixed,
	color: vars.color.onPrimaryFixedVariant,
	padding: `${vars.space[0.5]} ${vars.space[1.5]}`,
	borderRadius: vars.borderRadius.full,
	animation: `${fadeInUp} 0.8s cubic-bezier(0.16, 1, 0.3, 1) both`,
});

export const badgeIcon = style({
	animation: `${float} 3s ease-in-out infinite`,
});

export const title = style({
	fontSize: "36px",
	lineHeight: "44px",
	fontWeight: vars.typography.weight.bold,
	color: vars.color.onSurface,
	letterSpacing: "-0.03em",
	background: `linear-gradient(135deg, ${vars.color.primary} 0%, ${vars.color.tertiary} 100%)`,
	WebkitBackgroundClip: "text",
	WebkitTextFillColor: "transparent",
	marginTop: vars.space[2],
	marginBottom: vars.space[1.5],
	"@media": {
		"screen and (max-width: 480px)": {
			fontSize: "28px",
			lineHeight: "36px",
		},
	},
});

export const description = style({
	fontSize: "16px",
	lineHeight: "26px",
	color: vars.color.onSurfaceVariant,
	marginBottom: vars.space[4],
});

export const featureList = style({
	display: "flex",
	flexDirection: "column",
	gap: vars.space[2],
	marginBottom: vars.space[5],
});

export const featureItem = style({
	display: "flex",
	alignItems: "flex-start",
	gap: vars.space[2],
	padding: vars.space[2],
	backgroundColor: vars.color.surfaceContainerLowest,
	border: `1px solid ${vars.color.surfaceContainer}`,
	borderRadius: vars.borderRadius.lg,
	transition: "transform 0.2s ease, border-color 0.2s ease",
	":hover": {
		transform: "translateX(4px)",
		borderColor: vars.color.outlineVariant,
	},
});

export const iconWrapper = style({
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	width: "40px",
	height: "40px",
	borderRadius: vars.borderRadius.md,
	backgroundColor: vars.color.surfaceContainerLow,
	color: vars.color.primary,
	flexShrink: 0,
});

export const ctaButton = style({
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	gap: vars.space[1],
	width: "100%",
	padding: `${vars.space[2]} ${vars.space[3]}`,
	backgroundColor: vars.color.primary,
	color: vars.color.onPrimary,
	borderRadius: vars.borderRadius.lg,
	fontSize: "16px",
	fontWeight: vars.typography.weight.semibold,
	textDecoration: "none",
	boxShadow: `0 8px 24px rgba(0, 74, 198, 0.2)`,
	transition:
		"transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease, box-shadow 0.2s ease",
	cursor: "pointer",
	":hover": {
		backgroundColor: "#003ea8",
		transform: "translateY(-2px)",
		boxShadow: `0 12px 30px rgba(0, 74, 198, 0.3)`,
	},
	":active": {
		transform: "translateY(0)",
	},
});

export const arrowIcon = style({
	transition: "transform 0.2s ease",
	selectors: {
		[`${ctaButton}:hover &`]: {
			transform: "translateX(4px)",
		},
	},
});

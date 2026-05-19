import { style } from "@vanilla-extract/css";
import { vars } from "../tokens/theme.css";

export const dialogBox = style({
	zIndex: vars.zIndex.modal,
	background: "rgba(255, 255, 255, 0.8)", // bg-white/80 + glass-panel 조합
	backdropFilter: "blur(12px)",
	WebkitBackdropFilter: "blur(12px)",
	borderTop: "1px solid rgba(255, 255, 255, 0.4)",
	borderLeft: "1px solid rgba(255, 255, 255, 0.4)",
	borderRadius: vars.borderRadius.xl,
	padding: vars.space[4],
	width: "100%",
	maxWidth: "28rem",
	boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08), 0 4px 30px rgba(0, 0, 0, 0.04)",
	position: "fixed",
	overflow: "hidden",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%) translateZ(0)",
	transition: "all 0.3s ease",
});

export const decorativeGlow = style({
	position: "absolute",
	top: 0,
	left: "50%",
	transform: "translateX(-50%)",
	width: "8rem",
	height: "8rem",
	backgroundColor: vars.color.primary,
	opacity: 0.1,
	borderRadius: vars.borderRadius.full,
	filter: "blur(40px)",
	pointerEvents: "none",
});

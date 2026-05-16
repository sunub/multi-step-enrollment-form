import { globalStyle } from "@vanilla-extract/css";
import { vars } from "../tokens/theme.css";

// 1. Base Reset
globalStyle("*, *::before, *::after", {
	boxSizing: "border-box",
	margin: 0,
	padding: 0,
});

// 2. Body & Root setup (Level 0)
globalStyle("html, body", {
	height: "100%",
	backgroundColor: vars.color.background,
	color: vars.color.onBackground,
	fontFamily: vars.typography.fontFamily,
	WebkitFontSmoothing: "antialiased",
	MozOsxFontSmoothing: "grayscale",
});

// 3. Link Reset
globalStyle("a", {
	textDecoration: "none",
	color: "inherit",
});

// 4. Button Reset
globalStyle("button", {
	fontFamily: "inherit",
	border: "none",
	background: "none",
	cursor: "pointer",
});

// 5. Typography 위계 강제 (Optional)
globalStyle("h1, h2, h3, h4, h5, h6", {
	fontWeight: vars.typography.weight.bold,
});

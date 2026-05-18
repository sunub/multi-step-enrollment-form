import { createGlobalTheme } from "@vanilla-extract/css";

const colors = {
	// Surface
	surface: "#f8f9fa",
	surfaceDim: "#d9dadb",
	surfaceBright: "#f8f9fa",
	surfaceContainerLowest: "#ffffff",
	surfaceContainerLow: "#f3f4f5",
	surfaceContainer: "#edeeef",
	surfaceContainerHigh: "#e7e8e9",
	surfaceContainerHighest: "#e1e3e4",
	onSurface: "#191c1d",
	onSurfaceVariant: "#434655",
	inverseSurface: "#2e3132",
	inverseOnSurface: "#f0f1f2",

	// Outlines
	outline: "#737686",
	outlineVariant: "#c3c6d7",

	// Brand & Functional
	surfaceTint: "#0053db",
	primary: "#004ac6",
	onPrimary: "#ffffff",
	primaryContainer: "#2563eb",
	onPrimaryContainer: "#eeefff",
	inversePrimary: "#b4c5ff",

	secondary: "#006e2d",
	onSecondary: "#ffffff",
	secondaryContainer: "#7cf994",
	onSecondaryContainer: "#007230",

	tertiary: "#6a1edb",
	onTertiary: "#ffffff",
	tertiaryContainer: "#8343f4",
	onTertiaryContainer: "#f7edff",

	error: "#ba1a1a",
	onError: "#ffffff",
	errorContainer: "#ffdad6",
	onErrorContainer: "#93000a",

	// Fixed Tones
	primaryFixed: "#dbe1ff",
	primaryFixedDim: "#b4c5ff",
	onPrimaryFixed: "#00174b",
	onPrimaryFixedVariant: "#003ea8",

	secondaryFixed: "#7ffc97",
	secondaryFixedDim: "#62df7d",
	onSecondaryFixed: "#002109",
	onSecondaryFixedVariant: "#005320",

	tertiaryFixed: "#eaddff",
	tertiaryFixedDim: "#d2bbff",
	onTertiaryFixed: "#25005a",
	onTertiaryFixedVariant: "#5a00c6",

	background: "#f8f9fa",
	onBackground: "#191c1d",
	surfaceVariant: "#e1e3e4",

	// Util
	white: "#ffffff",
	black: "#000000",
	transparent: "transparent",
	backdrop: "rgba(25, 28, 29, 0.4)",
} as const;

const spacing = {
	0: "0px",
	0.5: "4px", // 8px scale base
	1: "8px",
	1.5: "12px",
	2: "16px",
	2.5: "20px",
	3: "24px",
	3.5: "28px",
	4: "32px",
	5: "40px",
	6: "48px",
	8: "64px",
	10: "80px",
	12: "96px",
	// Named Spacing from DESIGN.md
	containerMax: "1024px",
	gutter: "1.5rem",
	sectionGap: "3rem",
	stackSm: "0.5rem",
	stackMd: "1rem",
	stackLg: "2rem",
} as const;

const typography = {
	fontFamily: "Inter, sans-serif",
	weight: {
		normal: "400",
		medium: "500",
		semibold: "600",
		bold: "700",
	},
	// Scale from DESIGN.md
	headlineLg: {
		fontSize: "32px",
		lineHeight: "40px",
		letterSpacing: "-0.02em",
		fontWeight: "700",
	},
	headlineMd: {
		fontSize: "20px",
		lineHeight: "28px",
		fontWeight: "600",
	},
	bodyMd: {
		fontSize: "16px",
		lineHeight: "24px",
		fontWeight: "400",
	},
	bodySm: {
		fontSize: "14px",
		lineHeight: "20px",
		fontWeight: "400",
	},
	labelMd: {
		fontSize: "14px",
		lineHeight: "20px",
		fontWeight: "600",
		letterSpacing: "0.05em",
	},
	labelSm: {
		fontSize: "12px",
		lineHeight: "16px",
		fontWeight: "500",
	},
} as const;

const borderRadius = {
	sm: "0.25rem",
	md: "0.5rem",
	lg: "1rem",
	xl: "1.5rem",
	full: "9999px",
} as const;

export const vars = createGlobalTheme(":root", {
	color: colors,
	space: spacing,
	borderRadius: borderRadius,
	layout: {
		full: "100%",
		half: "50%",
		fullVw: "100vw",
		fullVh: "100vh",
		fullDvw: "100dvw",
		fullDvh: "100dvh",
		fit: "fit-content",
		max: "max-content",
		min: "min-content",
	},
	typography: {
		fontFamily: typography.fontFamily,
		weight: typography.weight,
	},
	textStyle: {
		headlineLg: typography.headlineLg,
		headlineMd: typography.headlineMd,
		bodyMd: typography.bodyMd,
		bodySm: typography.bodySm,
		labelMd: typography.labelMd,
		labelSm: typography.labelSm,
	},
	zIndex: {
		negative: "-1",
		base: "0",
		dropdown: "1",
		sticky: "2",
		overlay: "10",
		modal: "1000",
		popover: "1000",
		toast: "9999",
	},
});

import { createVar, style } from "@vanilla-extract/css";

// --- 동적 변수 설정 ---
export const progressWidthVar = createVar();

// --- 공통 색상 ---
const colors = {
	primary: "#004ac6",
	primaryContainer: "#2563eb",
	onSurface: "#0b1c30",
	onSurfaceVariant: "#434655",
	outline: "#737686",
	outlineVariant: "#c3c6d7",
	surfaceContainer: "#e5eeff",
	white: "#ffffff",
	blue600: "#2563eb",
	blue700: "#1d4ed8",
};

// --- 레이아웃 및 Glassmorphism 컨테이너 ---
export const sidebarWrapper = style({
	width: "100%",
	zIndex: 20,
	"@media": {
		"screen and (min-width: 1024px)": {
			width: "24rem", // w-96
			position: "sticky",
			top: "7rem", // top-28
		},
	},
});

export const glassPanel = style({
	background: "rgba(255, 255, 255, 0.55)",
	backdropFilter: "blur(24px)",
	WebkitBackdropFilter: "blur(24px)",
	border: "1px solid rgba(255, 255, 255, 0.4)",
	borderRadius: "1.5rem", // 3xl
	display: "flex",
	flexDirection: "column",
	padding: "24px",
	boxShadow:
		"0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)", // shadow-xl
	gap: "16px",
	height: "auto",
	"@media": {
		"screen and (min-width: 1024px)": {
			maxHeight: "calc(100vh - 8rem)",
		},
	},
});

export const divider = style({
	border: "none",
	borderTop: "1px solid rgba(255, 255, 255, 0.4)",
	margin: 0,
});

// --- 1. Progress 영역 ---
export const progressHeader = style({
	display: "flex",
	justifyContent: "space-between",
	alignItems: "flex-end",
	marginBottom: "8px",
});

export const stepText = style({
	display: "block",
	color: colors.primary,
	fontSize: "11px",
	textTransform: "uppercase",
	letterSpacing: "0.05em",
	marginBottom: "2px",
	fontWeight: 800,
	fontFamily: '"Nunito", sans-serif',
});

export const titleText = style({
	color: colors.onSurface,
	fontSize: "16px",
	marginBottom: "12px",
	fontWeight: 700,
	fontFamily: '"Nunito", sans-serif',
});

export const percentText = style({
	color: colors.primary,
	fontWeight: 900,
	fontSize: "14px",
});

export const progressBarBg = style({
	width: "100%",
	height: "8px",
	backgroundColor: colors.surfaceContainer,
	borderRadius: "9999px",
	overflow: "hidden",
	marginBottom: "16px",
	boxShadow: "inset 0 2px 4px rgba(0,0,0,0.06)",
});

export const progressBarFill = style({
	height: "100%",
	backgroundColor: colors.primary,
	borderRadius: "9999px",
	transition: "width 0.7s ease",
	width: progressWidthVar, // 동적 주입
});

export const stepIndicatorList = style({
	display: "flex",
	flexDirection: "column",
	gap: "6px",
});

export const stepIndicatorItem = style({
	display: "flex",
	alignItems: "center",
	gap: "8px",
	fontSize: "11px",
	color: "rgba(67, 70, 85, 0.7)",
	fontWeight: 700,
});

export const dotBase = style({
	width: "6px",
	height: "6px",
	borderRadius: "9999px",
});

export const dotPrevious = style([
	dotBase,
	{ backgroundColor: colors.outlineVariant },
]);
export const dotNext = style([
	dotBase,
	{ backgroundColor: "rgba(0, 74, 198, 0.3)" },
]);

// --- 2. 신청 유형 영역 ---
export const sectionTitle = style({
	color: colors.onSurface,
	fontSize: "14px",
	display: "flex",
	alignItems: "center",
	gap: "8px",
	fontWeight: 700,
	textTransform: "uppercase",
	letterSpacing: "0.05em",
	marginBottom: "16px",
	fontFamily: '"Nunito", sans-serif',
});

export const sectionIcon = style({
	color: colors.primary,
	fontSize: "20px",
});

export const radioGroup = style({
	display: "flex",
	flexDirection: "column",
	gap: "12px",
});

export const radioLabel = style({
	background: "rgba(255, 255, 255, 0.45)",
	backdropFilter: "blur(12px)",
	WebkitBackdropFilter: "blur(12px)",
	border: "2px solid transparent",
	borderRadius: "1rem",
	padding: "16px",
	cursor: "pointer",
	display: "flex",
	alignItems: "flex-start",
	gap: "12px",
	transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
});

export const radioLabelUnselected = style([
	radioLabel,
	{
		opacity: 0.6,
		":hover": {
			borderColor: "rgba(0, 74, 198, 0.3)",
			opacity: 1,
		},
	},
]);

export const radioLabelSelected = style([
	radioLabel,
	{
		background: "rgba(255, 255, 255, 0.8)",
		borderColor: colors.primary,
		boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
	},
]);

export const radioCircleBase = style({
	marginTop: "4px",
	width: "20px",
	height: "20px",
	borderRadius: "9999px",
	border: "2px solid",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	flexShrink: 0,
});

export const radioCircleUnselected = style([
	radioCircleBase,
	{ borderColor: colors.outline },
]);
export const radioCircleSelected = style([
	radioCircleBase,
	{ borderColor: colors.primary },
]);

export const radioInnerCircle = style({
	width: "10px",
	height: "10px",
	borderRadius: "9999px",
	backgroundColor: colors.primary,
});

export const radioTitle = style({
	color: colors.onSurface,
	fontSize: "14px",
	fontWeight: 700,
	marginBottom: "2px",
	fontFamily: '"Nunito", sans-serif',
});

export const radioDesc = style({
	color: colors.onSurfaceVariant,
	fontSize: "12px",
	fontWeight: 600,
	opacity: 0.7,
});

// --- 3. 선택된 강의 리스트 영역 ---
export const selectedListContainer = style({
	display: "flex",
	flexDirection: "column",
	gap: "12px",
	overflowY: "auto",
	paddingRight: "8px",
	flex: 1,
	minHeight: "160px",
	// Custom Scrollbar
	"::-webkit-scrollbar": { width: "4px" },
	"::-webkit-scrollbar-track": { background: "transparent" },
	"::-webkit-scrollbar-thumb": {
		background: "rgba(0, 74, 198, 0.15)",
		borderRadius: "4px",
	},
});

export const courseCard = style({
	background: "rgba(255, 255, 255, 0.45)",
	backdropFilter: "blur(12px)",
	WebkitBackdropFilter: "blur(12px)",
	border: "1px solid rgba(255, 255, 255, 0.3)",
	padding: "16px",
	borderRadius: "1rem",
	display: "flex",
	flexDirection: "column",
	gap: "8px",
});

export const courseCardInner = style({
	display: "flex",
	alignItems: "center",
	gap: "16px",
});

export const courseIconWrapper = style({
	width: "40px",
	height: "40px",
	borderRadius: "0.75rem",
	backgroundColor: "rgba(37, 99, 235, 0.2)", // primary-container/20
	color: colors.primary,
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	flexShrink: 0,
});

export const courseTitle = style({
	color: colors.onSurface,
	fontSize: "13px",
	fontWeight: 700,
	overflow: "hidden",
	textOverflow: "ellipsis",
	whiteSpace: "nowrap",
});

export const courseMeta = style({
	color: colors.onSurfaceVariant,
	fontSize: "11px",
	fontWeight: 700,
	opacity: 0.7,
});

// --- 4. Summary & CTA 영역 ---
export const summaryContainer = style({
	paddingTop: "24px",
	borderTop: "1px solid rgba(255, 255, 255, 0.6)",
	marginTop: "auto",
});

export const summaryRow = style({
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
	marginBottom: "24px",
});

export const summaryLabel = style({
	color: "rgba(67, 70, 85, 0.7)",
	fontSize: "14px",
	fontWeight: 700,
});

export const priceContainer = style({
	display: "flex",
	alignItems: "baseline",
	gap: "4px",
	color: colors.primary,
});

export const priceSymbol = style({
	fontSize: "14px",
	fontWeight: 700,
	opacity: 0.8,
});

export const priceAmount = style({
	fontSize: "30px",
	fontWeight: 900,
	letterSpacing: "-0.02em",
});

export const submitButton = style({
	width: "100%",
	backgroundColor: colors.blue600,
	color: colors.white,
	fontFamily: '"Nunito", sans-serif',
	padding: "16px 24px",
	borderRadius: "1rem",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	gap: "12px",
	fontSize: "18px",
	fontWeight: 800,
	border: "2px solid rgba(255, 255, 255, 0.2)",
	boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.3)",
	transition: "all 0.2s ease",
	cursor: "pointer",
	":hover": {
		backgroundColor: colors.blue700,
	},
	":active": {
		transform: "scale(0.98)",
	},
});

import { createVar, style } from "@vanilla-extract/css";

export const progressVar = createVar();

const colors = {
	primary: "#004ac6",
	surfaceContainer: "#e5eeff",
	onSurface: "#0b1c30",
	onSurfaceVariant: "#434655",
	outlineVariant: "#c3c6d7",
	white: "#ffffff",
	blue600: "#2563eb",
	blue700: "#1d4ed8",
};

// --- 전체 레이아웃 래퍼 ---
export const layoutWrapper = style({
	width: "100%",
	minHeight: "100vh",
	display: "flex",
	flexDirection: "column",
	paddingTop: "64px",
	paddingBottom: "100px", // 모바일 하단 고정 바 공간
	"@media": {
		"screen and (min-width: 1024px)": {
			flexDirection: "row",
			alignItems: "flex-start",
			paddingBottom: "64px",
			gap: "32px",
			maxWidth: "1280px",
			margin: "0 auto",
			padding: "100px 64px 100px",
		},
	},
});

// --- 메인 콘텐츠 영역 (Main) ---
export const mainContent = style({
	width: "100%",
	display: "flex",
	flexDirection: "column",
	gap: "32px",
	zIndex: 10,
	position: "relative",
	padding: "16px",
	"@media": {
		"screen and (min-width: 1024px)": {
			flex: 1,
			padding: 0,
		},
	},
});

// --- 사이드바 영역 (Sidebar) ---
export const sidebarWrapper = style({
	width: "100%",
	padding: "16px",
	zIndex: 20,
	"@media": {
		"screen and (min-width: 1024px)": {
			width: "384px",
			position: "sticky",
			top: "112px",
			padding: 0,
		},
	},
});

export const sidebarGlassPanel = style({
	background: "rgba(255, 255, 255, 0.55)",
	backdropFilter: "blur(24px)",
	WebkitBackdropFilter: "blur(24px)",
	border: `1px solid rgba(255, 255, 255, 0.4)`,
	borderRadius: "1.5rem",
	padding: "24px",
	display: "flex",
	flexDirection: "column",
	gap: "16px",
	boxShadow:
		"0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
	"@media": {
		"screen and (min-width: 1024px)": {
			maxHeight: "calc(100vh - 8rem)",
			overflowY: "auto",
		},
	},
});

// --- 사이드바 동적 콘텐츠 (SidebarContent) ---
export const divider = style({
	border: "none",
	borderTop: `1px solid rgba(255, 255, 255, 0.6)`,
	margin: "8px 0",
});

export const dynamicSidebarSlot = style({
	display: "flex",
	flexDirection: "column",
	gap: "16px",
	flex: 1,
	overflowY: "auto",
	"::-webkit-scrollbar": { width: "4px" },
	"::-webkit-scrollbar-track": { background: "transparent" },
	"::-webkit-scrollbar-thumb": {
		background: "rgba(0, 74, 198, 0.15)",
		borderRadius: "4px",
	},
});

// --- 진행도 영역 (Progress) ---
export const progressHeader = style({
	display: "flex",
	justifyContent: "space-between",
	alignItems: "flex-end",
	marginBottom: "12px",
});
export const stepLabelText = style({
	display: "block",
	color: colors.primary,
	fontSize: "11px",
	textTransform: "uppercase",
	letterSpacing: "0.05em",
	fontWeight: 800,
	marginBottom: "2px",
});
export const stepTitleText = style({
	fontSize: "16px",
	fontWeight: 700,
	color: colors.onSurface,
});
export const percentText = style({
	fontSize: "14px",
	fontWeight: 900,
	color: colors.primary,
});
export const progressBarContainer = style({
	width: "100%",
	height: "8px",
	backgroundColor: colors.surfaceContainer,
	borderRadius: "9999px",
	overflow: "hidden",
	boxShadow: "inset 0 2px 4px rgba(0,0,0,0.06)",
});
export const progressBarFill = style({
	height: "100%",
	backgroundColor: colors.primary,
	borderRadius: "9999px",
	transition: "width 0.7s ease",
	width: progressVar,
});

// --- 액션 영역 (Action) ---
export const actionWrapper = style({
	marginTop: "auto",
	paddingTop: "16px",
});

export const desktopSubmitButton = style({
	display: "none",
	width: "100%",
	backgroundColor: colors.blue600,
	color: colors.white,
	height: "48px",
	padding: "0 24px",
	borderRadius: "8px",
	alignItems: "center",
	justifyContent: "center",
	gap: "12px",
	fontSize: "16px",
	fontWeight: 600,
	border: "2px solid rgba(255, 255, 255, 0.2)",
	boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.3)",
	transition: "all 0.2s ease",
	cursor: "pointer",
	":hover": { backgroundColor: colors.blue700 },
	":disabled": { opacity: 0.5, cursor: "not-allowed" },
	"@media": {
		"screen and (min-width: 1024px)": {
			display: "flex",
		},
	},
});

export const mobileBottomBar = style({
	display: "flex",
	position: "fixed",
	bottom: 0,
	left: 0,
	width: "100%",
	padding: "16px",
	paddingBottom: "max(16px, env(safe-area-inset-bottom))",
	backgroundColor: "rgba(255, 255, 255, 0.8)",
	backdropFilter: "blur(24px)",
	WebkitBackdropFilter: "blur(24px)",
	borderTop: `1px solid rgba(255, 255, 255, 0.4)`,
	boxShadow: "0 -4px 24px rgba(0, 0, 0, 0.06)",
	zIndex: 50,
	alignItems: "center",
	justifyContent: "center",
	"@media": {
		"screen and (min-width: 1024px)": {
			display: "none",
		},
	},
});

export const mobileSubmitButton = style({
	width: "100%",
	backgroundColor: colors.blue600,
	color: colors.white,
	height: "48px",
	padding: "0 32px",
	borderRadius: "8px",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	gap: "12px",
	fontSize: "16px",
	fontWeight: 600,
	border: "2px solid rgba(255, 255, 255, 0.2)",
	boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.3)",
	transition: "all 0.2s ease",
	cursor: "pointer",
	":active": { transform: "scale(0.95)" },
	":disabled": { opacity: 0.5, cursor: "not-allowed" },
});

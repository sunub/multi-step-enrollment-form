import { vars } from "@shared/design-system";
import { style } from "@vanilla-extract/css";

// --- 공통 색상 변수 (Tailwind Config 및 커스텀 색상 기준) ---
const colors = {
	primary: "#004ac6",
	primaryContainer: "#2563eb",
	onSurface: "#0b1c30",
	onSurfaceVariant: "#434655",
	outlineVariant: "#c3c6d7",
	surfaceContainerHighest: "#d3e4fe",
	error: "#ba1a1a",
	errorBg: "rgba(186, 26, 26, 0.05)", // error/5
	success: "#10b981",
	successText: "#059669",
	white: "#ffffff",
	white60: "rgba(255, 255, 255, 0.6)",
	white80: "rgba(255, 255, 255, 0.8)",
};

// --- 레이아웃 및 폼 컨테이너 ---
export const mainWrapper = style({
	flexGrow: 1,
	display: "flex",
	alignItems: "flex-start",
	justifyContent: "center",
	padding: "32px 24px",
	overflowY: "auto",
	"@media": {
		"screen and (min-width: 1024px)": {
			padding: "48px 40px",
		},
	},
});

export const formContainer = style({
	width: "100%",
	maxWidth: "42rem", // max-w-2xl
	backgroundColor: colors.white60,
	backdropFilter: "blur(20px)",
	WebkitBackdropFilter: "blur(20px)",
	borderRadius: "1rem", // rounded-2xl
	border: `1px solid ${colors.white}`,
	boxShadow: "0 20px 50px rgba(0,0,0,0.05)",
	padding: "32px",
	"@media": {
		"screen and (min-width: 768px)": {
			padding: "48px",
		},
	},
});

export const formLayout = style({
	display: "flex",
	flexDirection: "column",
	gap: "32px", // space-y-8
});

// --- 헤더 영역 ---
export const headerContainer = style({
	marginBottom: "40px",
	textAlign: "center",
});

export const headerTitle = style({
	fontFamily: '"Epilogue", sans-serif',
	fontSize: "32px",
	fontWeight: 700,
	color: colors.onSurface,
	marginBottom: "12px",
	letterSpacing: "-0.01em",
});

export const headerDesc = style({
	fontFamily: '"Epilogue", sans-serif',
	fontSize: "16px",
	color: colors.onSurfaceVariant,
	lineHeight: 1.6,
});

// --- 공통 입력 필드 요소 ---
export const fieldContainer = style({
	display: "flex",
	flexDirection: "column",
	gap: "8px",
});

export const fieldLabelBase = style({
	fontFamily: '"Epilogue", sans-serif',
	fontSize: "13px",
	fontWeight: 600,
	color: colors.onSurface,
	display: "flex",
	alignItems: "center",
	gap: "4px",
});

export const fieldLabelOptional = style({
	color: colors.onSurfaceVariant,
	fontWeight: 400,
});

export const requiredStar = style({
	color: colors.primary,
	fontWeight: 700,
});

export const inputWrapper = style({
	position: "relative",
});

export const inputBase = style({
	width: "100%",
	padding: "14px 16px",
	borderRadius: "0.75rem", // xl
	fontFamily: '"Epilogue", sans-serif',
	fontSize: "16px",
	fontWeight: 500,
	color: colors.onSurface,
	transition: "all 0.2s ease",
	boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
	"::placeholder": {
		color: colors.outlineVariant,
	},
	":focus": {
		outline: "none",
	},
});

export const inputWithIcon = style({
	paddingRight: "48px", // 아이콘 공간 확보
});

// --- 상태별 Input 스타일 ---
export const inputDefault = style({
	backgroundColor: colors.white80,
	border: `2px solid ${colors.surfaceContainerHighest}`,
	":hover": { backgroundColor: colors.white },
	":focus": {
		borderColor: colors.primary,
		boxShadow: `0 0 0 4px rgba(0, 74, 198, 0.1)`, // ring-primary/10
	},
});

export const inputValid = style({
	backgroundColor: colors.white80,
	border: `2px solid ${colors.success}`,
	":focus": {
		boxShadow: `0 0 0 4px rgba(16, 185, 129, 0.1)`, // ring-success/10
	},
});

export const inputInvalid = style({
	backgroundColor: colors.errorBg,
	border: `2px solid ${colors.error}`,
	":focus": {
		boxShadow: `0 0 0 4px rgba(186, 26, 26, 0.1)`, // ring-error/10
	},
});

// --- 아이콘 스타일 ---
export const iconBase = style({
	position: "absolute",
	right: "16px",
	top: "50%",
	transform: "translateY(-50%)",
});

export const iconValid = style({ color: colors.success });
export const iconInvalid = style({ color: colors.error });

// --- 피드백 메시지 영역 ---
export const messageBox = style({
	height: "20px", // 레이아웃 시프트 방지
});

export const messageBase = style({
	fontFamily: '"Epilogue", sans-serif',
	fontSize: "12px",
	display: "flex",
	alignItems: "center",
	gap: "4px",
});

export const messageDefault = style({ color: colors.onSurfaceVariant });
export const messageValid = style({ color: colors.successText });
export const messageInvalid = style({ color: colors.error });

export const messageIcon = style({
	fontSize: "16px",
	fontWeight: 700,
});

// --- Textarea 전용 스타일 ---
export const textareaHeader = style({
	display: "flex",
	justifyContent: "space-between",
	alignItems: "flex-end",
});

export const charCount = style({
	fontFamily: '"Epilogue", sans-serif',
	fontSize: "12px",
	color: colors.onSurfaceVariant,
});

export const textareaBase = style([
	inputBase,
	inputDefault,
	{
		resize: "none",
	},
]);

export const sectionContainer = style({
	background: "rgba(255, 255, 255, 0.75)",
	backdropFilter: "blur(20px)",
	WebkitBackdropFilter: "blur(20px)",
	border: `1px solid ${vars.color.outlineVariant}`,
	borderRadius: vars.borderRadius.xl,
	transition: "background-color 0.3s ease",
});

export const header = style({
	display: "flex",
	alignItems: "center",
	gap: vars.space[1.5],
	marginBottom: vars.space[3],
	borderBottom: `1px solid ${vars.color.outlineVariant}`,
	paddingBottom: vars.space[2],
});

export const iconWrapper = style({
	width: "40px",
	height: "40px",
	borderRadius: vars.borderRadius.full,
	backgroundColor: "rgba(0, 74, 198, 0.1)", // primary/10
	color: vars.color.primary,
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
});

export const formGrid = style({
	display: "grid",
	gridTemplateColumns: "1fr",
	columnGap: vars.space[4],
	rowGap: vars.space[2.5],
	"@media": {
		"screen and (min-width: 768px)": {
			gridTemplateColumns: "repeat(2, 1fr)",
		},
	},
});

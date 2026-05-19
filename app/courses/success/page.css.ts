import { keyframes, style } from "@vanilla-extract/css";

const colors = {
  surface: "#f8f9ff",
  onSurface: "#0b1c30",
  onSurfaceVariant: "#434655",
  primary: "#004ac6",
  primaryContainer: "#2563eb",
  onPrimaryContainer: "#ffffff",
  primaryFixed: "#dbe1ff",
  secondaryFixed: "#c0e8ff",
  white: "#ffffff",
};

const fadeInUp = keyframes({
  "0%": { opacity: 0, transform: "translateY(20px)" },
  "100%": { opacity: 1, transform: "translateY(0)" },
});

export const mainWrapper = style({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "16px", // p-margin-mobile
  backgroundColor: colors.surface,
  backgroundImage: `
    radial-gradient(at 10% 20%, rgba(219, 225, 255, 0.5) 0px, transparent 50%),
    radial-gradient(at 80% 90%, rgba(203, 219, 245, 0.4) 0px, transparent 50%),
    radial-gradient(at 50% 50%, rgba(229, 238, 255, 0.6) 0px, transparent 50%)
  `,
  fontFamily: '"Inter", sans-serif',
  "@media": {
    "screen and (min-width: 768px)": {
      padding: "64px", // p-margin-desktop
    },
  },
});

export const glassCard = style({
  width: "100%",
  maxWidth: "42rem", // max-w-2xl
  backgroundColor: "rgba(255, 255, 255, 0.7)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  borderTop: "1px solid rgba(255, 255, 255, 0.4)",
  borderLeft: "1px solid rgba(255, 255, 255, 0.4)",
  boxShadow: "0 10px 40px rgba(0, 0, 0, 0.04)",
  borderRadius: "0.75rem", // rounded-xl
  padding: "32px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  position: "relative",
  overflow: "hidden",
  transition: "background-color 0.3s ease",
  animation: `${fadeInUp} 0.6s ease-out forwards`,
  ":hover": {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  "@media": {
    "screen and (min-width: 768px)": {
      padding: "48px",
    },
  },
});

export const decorativeBlobBase = style({
  position: "absolute",
  width: "10rem", // w-40
  height: "10rem",
  borderRadius: "9999px",
  mixBlendMode: "multiply",
  filter: "blur(40px)", // blur-2xl
  opacity: 0.5,
  pointerEvents: "none",
});

export const decorativeBlobLeft = style([
  decorativeBlobBase,
  {
    top: "-5rem",
    left: "-5rem",
    backgroundColor: colors.primaryFixed,
  },
]);

export const decorativeBlobRight = style([
  decorativeBlobBase,
  {
    bottom: "-5rem",
    right: "-5rem",
    backgroundColor: colors.secondaryFixed,
  },
]);

// --- 아이콘 영역 ---
export const iconWrapper = style({
  position: "relative",
  marginBottom: "32px",
});

export const iconGlowBg = style({
  position: "absolute",
  inset: 0,
  backgroundColor: colors.primaryContainer,
  borderRadius: "9999px",
  opacity: 0.2,
  filter: "blur(24px)", // blur-xl
  transition: "opacity 0.5s ease",
  selectors: {
    [`${iconWrapper}:hover &`]: { opacity: 0.3 },
  },
});

export const iconCenter = style({
  width: "6rem", // w-24
  height: "6rem",
  borderRadius: "9999px",
  backgroundColor: colors.primaryContainer,
  color: colors.onPrimaryContainer,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow:
    "0 10px 15px -3px rgba(0,0,0,0.1), 0 0 40px rgba(37, 99, 235, 0.3)", // shadow-lg + glow-effect
  position: "relative",
  zIndex: 10,
  border: "1px solid rgba(255, 255, 255, 0.4)",
  transition: "transform 0.5s ease",
  selectors: {
    [`${iconWrapper}:hover &`]: { transform: "scale(1.05)" },
  },
});

export const iconStyle = style({
  fontSize: "48px", // text-5xl
});

export const titleText = style({
  fontSize: "32px", // display-lg
  lineHeight: 1.1,
  letterSpacing: "-0.02em",
  fontWeight: 800,

  color: colors.primary,
  marginBottom: "8px",
  position: "relative",
  zIndex: 10,
});

export const subtitleText = style({
  fontSize: "18px", // headline-lg-mobile
  lineHeight: 1.2,
  fontWeight: 700,
  marginBottom: "24px",
  position: "relative",
  zIndex: 10,
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: "32px", // headline-lg
      letterSpacing: "-0.01em",
    },
  },
});

export const descriptionText = style({
  fontSize: "16px", // body-md
  lineHeight: 1.6,
  fontWeight: 400,
  color: colors.onSurfaceVariant,
  maxWidth: "28rem", // max-w-md
  margin: "0 auto 40px auto",
  position: "relative",
  zIndex: 10,
});

// --- 버튼 및 액션 ---
export const actionGroup = style({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  width: "100%",
  justifyContent: "center",
  position: "relative",
  zIndex: 10,
  "@media": {
    "screen and (min-width: 640px)": {
      flexDirection: "row",
      width: "auto",
    },
  },
});

export const buttonBase = style({
  padding: "12px 32px",
  borderRadius: "0.5rem",
  fontSize: "13px", // label-sm
  fontWeight: 600,
  letterSpacing: "0.03em",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  transition: "all 0.3s ease",
  cursor: "pointer",
});

export const primaryButton = style([
  buttonBase,
  {
    backgroundColor: colors.primaryContainer,
    color: colors.onPrimaryContainer,
    position: "relative",
    overflow: "hidden",
    border: "none",
    ":hover": {
      backgroundColor: colors.primary,
    },
  },
]);

export const primaryButtonHighlight = style({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: "1px",
  background:
    "linear-gradient(to right, transparent, rgba(255,255,255,0.5), transparent)",
});

export const secondaryButton = style([
  buttonBase,
  {
    backgroundColor: "rgba(255, 255, 255, 0.7)", // glass-panel
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    borderTop: "1px solid rgba(255, 255, 255, 0.4)",
    borderLeft: "1px solid rgba(255, 255, 255, 0.4)",
    color: colors.primary,
    ":hover": {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
    },
  },
]);

export const receiptContainer = style({
  marginTop: "32px",
  paddingTop: "24px",
  borderTop: "1px solid rgba(255, 255, 255, 0.2)",
  width: "100%",
  position: "relative",
  zIndex: 10,
});

export const receiptLink = style({
  fontSize: "13px", // label-sm
  fontWeight: 600,
  letterSpacing: "0.03em",
  color: colors.onSurfaceVariant,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "4px",
  textDecoration: "none",
  transition: "color 0.2s ease",
  cursor: "pointer",
  ":hover": {
    color: colors.primary,
  },
});

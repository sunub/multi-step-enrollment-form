import { style } from "@vanilla-extract/css";

export const flexCenter = style({
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
});

export const flexColumnCenter = style({
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
	alignItems: "center",
});

export const flexSpaceBetween = style({
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
});

export const flexColumnSpaceBetween = style({
	display: "flex",
	flexDirection: "column",
	justifyContent: "space-between",
	alignItems: "center",
});

export const flexAlignStart = style({
	display: "flex",
	justifyContent: "flex-start",
	alignItems: "center",
});

export const flexColumnAlignStart = style({
	display: "flex",
	flexDirection: "column",
	justifyContent: "flex-start",
	alignItems: "center",
});

export const flexAlignEnd = style({
	display: "flex",
	justifyContent: "flex-end",
	alignItems: "center",
});

export const flexColumnAlignEnd = style({
	display: "flex",
	flexDirection: "column",
	justifyContent: "flex-end",
	alignItems: "center",
});

import { globalStyle, style } from "@vanilla-extract/css";
import { vars } from "../tokens/theme.css";

export const buttonGroup = style({
	display: "flex",
	alignItems: "stretch",
	border: "none",
});

export const horizontalGroup = style({});
export const verticalGroup = style({
	flexDirection: "column",
});

globalStyle(`${horizontalGroup} > *:not(:first-child)`, {
	borderTopLeftRadius: 0,
	borderBottomLeftRadius: 0,
	borderLeftWidth: 0,
});

globalStyle(`${horizontalGroup} > *:not(:last-child)`, {
	borderTopRightRadius: 0,
	borderBottomRightRadius: 0,
});

globalStyle(`${verticalGroup} > *:not(:first-child)`, {
	borderTopLeftRadius: 0,
	borderTopRightRadius: 0,
	borderTopWidth: 0,
});

globalStyle(`${verticalGroup} > *:not(:last-child)`, {
	borderBottomLeftRadius: 0,
	borderBottomRightRadius: 0,
});

globalStyle(`${buttonGroup} > *:focus-visible`, {
	zIndex: vars.zIndex.dropdown,
	position: "relative",
});

globalStyle(`${buttonGroup} :has([data-slot="button-group"])`, {
	gap: vars.space[8],
});

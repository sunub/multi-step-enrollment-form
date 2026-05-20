import { vars } from "@shared/design-system";
import { style } from "@vanilla-extract/css";

export const summarySticky = style({
	position: "relative",
	bottom: vars.space[4],
	zIndex: vars.zIndex.sticky,
});

import { styleVariants } from "@vanilla-extract/css";

export const backdropBlur = styleVariants({
	none: {},
	soft: {
		backdropFilter: "blur(20px)",
	},
});

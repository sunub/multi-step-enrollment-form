import { createSprinkles, defineProperties } from "@vanilla-extract/sprinkles";
import { vars } from "../tokens/theme.css";

const baseStyleProperties = defineProperties({
	properties: {
		display: ["none", "flex", "block", "inline", "grid"],
		flexWrap: ["nowrap", "wrap", "wrap-reverse"],
		flexDirection: ["row", "column"],
		alignItems: [
			"stretch",
			"flex-start",
			"center",
			"flex-end",
			"space-between",
			"space-around",
			"space-evenly",
		],
		justifyContent: [
			"stretch",
			"flex-start",
			"center",
			"flex-end",
			"space-between",
			"space-around",
			"space-evenly",
		],
		placeContent: [
			"stretch",
			"flex-start",
			"center",
			"flex-end",
			"space-between",
		],
		width: { ...vars.space, ...vars.layout },
		height: { ...vars.space, ...vars.layout },
		maxWidth: { ...vars.space, ...vars.layout },
		maxHeight: { ...vars.space, ...vars.layout },
		minWidth: { ...vars.space, ...vars.layout },
		minHeight: { ...vars.space, ...vars.layout },
		gap: { ...vars.space },
		padding: { ...vars.space },
		paddingTop: { ...vars.space },
		paddingBottom: { ...vars.space },
		paddingLeft: { ...vars.space },
		paddingRight: { ...vars.space },
		margin: { ...vars.space, auto: "auto" },
		marginTop: { ...vars.space, auto: "auto" },
		marginBottom: { ...vars.space, auto: "auto" },
		marginLeft: { ...vars.space, auto: "auto" },
		marginRight: { ...vars.space, auto: "auto" },
		backgroundColor: vars.color,
		color: vars.color,
		borderRadius: vars.borderRadius,
		fontWeight: vars.typography.weight,
		zIndex: vars.zIndex,
		top: { ...vars.space, ...vars.layout },
		left: { ...vars.space, ...vars.layout },
		right: { ...vars.space, ...vars.layout },
		bottom: { ...vars.space, ...vars.layout },

		position: ["static", "relative", "absolute", "fixed", "sticky"],
		textAlign: ["left", "center", "right", "justify"],
	},
	shorthands: {
		p: ["padding"],
		px: ["paddingLeft", "paddingRight"],
		py: ["paddingTop", "paddingBottom"],
		m: ["margin"],
		mx: ["marginLeft", "marginRight"],
		my: ["marginTop", "marginBottom"],
		bg: ["backgroundColor"],
		placeItems: ["justifyContent", "alignItems"],
		size: ["width", "height"],
	},
});

export const baseStyles = createSprinkles(baseStyleProperties);

export type BaseStyle = Parameters<typeof baseStyles>[0];

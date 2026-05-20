import { vars } from "@shared/design-system";
import { createVar, fallbackVar, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

export const borderColorVar = createVar();
export const borderRadiusVar = createVar();

export const inputContainer = style({
	width: "100%",
	display: "flex",
	flexDirection: "column",
	gap: vars.space[1],
});

export const inputWrapper = recipe({
	base: {
		position: "relative",
		display: "flex",
		alignItems: "center",
		width: "100%",
		borderRadius: fallbackVar(borderRadiusVar, vars.borderRadius.md),
		border: `1px solid ${fallbackVar(borderColorVar, vars.color.outlineVariant)}`,
		backgroundColor: vars.color.surfaceContainerLowest,
		transition: "all 0.2s ease-in-out",
		":focus-within": {
			borderColor: vars.color.primary,
			boxShadow: `0 0 0 1px ${vars.color.primary}`,
		},
	},
	variants: {
		isError: {
			true: {
				vars: {
					[borderColorVar]: vars.color.error,
				},
			},
			false: {},
		},
	},
	defaultVariants: {
		isError: false,
	},
});

export const input = style({
	flex: 1,
	border: "none",
	background: "none",
	padding: `${vars.space[4]} ${vars.space[3]} ${vars.space[1.5]}`,
	fontSize: vars.textStyle.bodyMd.fontSize,
	fontWeight: vars.typography.weight.medium,
	fontFamily: vars.typography.fontFamily,
	color: vars.color.onSurface,
	outline: "none",
	width: "100%",
	selectors: {
		"&::placeholder": {
			color: "transparent",
		},
	},
});

export const placeholder = recipe({
	base: {
		position: "absolute",
		top: "50%",
		transform: "translateY(-50%)",
		pointerEvents: "none",
		userSelect: "none",
		transition: "all 0.2s ease-in-out",
		color: vars.color.onSurfaceVariant,
		fontSize: vars.textStyle.bodyMd.fontSize,
		transformOrigin: "left top",
		zIndex: 1,
		background: vars.color.surfaceBright,
		padding: `0 ${vars.space[1]}`,
		opacity: 1,
	},
	variants: {
		isFocused: {
			true: {
				transform: "translateY(-30px) scale(0.75)",
				color: vars.color.primary,
				opacity: 0,
			},
			false: {},
		},
		hasLeftIcon: {
			true: {
				left: vars.space[10],
			},
			false: {
				left: vars.space[3],
			},
		},
	},
	defaultVariants: {
		isFocused: false,
		hasLeftIcon: false,
	},
});

export const iconWrapper = recipe({
	base: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		paddingLeft: vars.space[3],
		color: vars.color.onSurfaceVariant,
		transition: "color 0.2s ease-in-out",
	},
	variants: {
		isTyping: {
			true: { color: vars.color.primary },
			false: {},
		},
	},
});

export const suffixIconWrapper = recipe({
	base: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		paddingRight: vars.space[3],
		color: vars.color.onSurfaceVariant,
		transition: "color 0.2s ease-in-out",
	},
	variants: {
		isTyping: {
			true: { color: vars.color.primary },
			false: {},
		},
	},
});

export const passwordVisibilityIconButton = recipe({
	base: {
		cursor: "pointer",
		padding: vars.space[1],
		borderRadius: vars.borderRadius.full,
		transition: "background-color 0.2s ease-in-out",
		":hover": {
			backgroundColor: vars.color.surfaceContainerHigh,
		},
	},
	variants: {
		isFocused: {
			true: { opacity: 1 },
			false: { opacity: 0.7 },
		},
	},
});

export const errorText = recipe({
	base: {
		fontSize: vars.textStyle.labelSm.fontSize,
		fontWeight: vars.typography.weight.medium,
		transition: "all 0.2s ease-in-out",
		paddingLeft: vars.space[1],
	},
	variants: {
		isVisible: {
			true: {
				color: vars.color.error,
			},
			false: {
				color: vars.color.onSurfaceVariant,
			},
		},
	},
	defaultVariants: {
		isVisible: false,
	},
});

export const inputRootContainer = style({
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
	alignItems: "center",
	gap: vars.space[3],
});

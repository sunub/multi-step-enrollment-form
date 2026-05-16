import type { BaseStyle } from "./sprinkles.css";
import { baseStyles } from "./sprinkles.css";

export const sprinklePropOrder = [...baseStyles.properties] as Array<
	keyof BaseStyle
>;
export const sprinklePropNames = new Set(sprinklePropOrder);

export function splitProps<T extends Record<string, unknown>>(props: T) {
	const atomProps: Record<string, unknown> = {};
	const nativeProps: Record<string, unknown> = {};

	for (const key of sprinklePropOrder) {
		if (key in props) {
			atomProps[key] = props[key as keyof T];
		}
	}

	for (const key in props) {
		if (!sprinklePropNames.has(key as keyof BaseStyle)) {
			nativeProps[key] = props[key];
		}
	}

	return {
		atomProps: atomProps as BaseStyle,
		nativeProps,
	};
}

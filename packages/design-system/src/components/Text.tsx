import clsx from "clsx";
import type { ComponentPropsWithRef, ElementType } from "react";
import { Box, type BoxProps } from "../primitives/Box";
import * as styles from "./Text.css";

type TextVariant = keyof typeof styles.textVariant;

export type TextProps<T extends ElementType = "p"> = BoxProps<T> & {
	variant?: TextVariant;
};

export function Text<T extends ElementType = "p">({
	as,
	variant = "bodyMd",
	className,
	...props
}: TextProps<T> & { ref?: ComponentPropsWithRef<T>["ref"] }) {
	return (
		<Box
			as={as || ("p" as unknown as T)}
			className={clsx(styles.textVariant[variant], className)}
			{...(props as BoxProps<T>)}
		/>
	);
}

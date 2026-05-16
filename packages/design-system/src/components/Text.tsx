import clsx from "clsx";
import type { ComponentProps, ElementType } from "react";
import { Box } from "../primitives/Box";
import * as styles from "./Text.css";

type TextVariant = keyof typeof styles.textVariant;

export interface TextProps extends Omit<ComponentProps<typeof Box>, "as"> {
	as?: ElementType;
	variant?: TextVariant;
}

export function Text({
	as = "p",
	variant = "bodyMd",
	className,
	...props
}: TextProps) {
	return (
		<Box
			as={as}
			className={clsx(styles.textVariant[variant], className)}
			{...props}
		/>
	);
}

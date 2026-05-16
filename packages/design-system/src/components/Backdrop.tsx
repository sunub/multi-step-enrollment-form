import clsx from "clsx";
import type { ComponentProps } from "react";
import { Box } from "../primitives/Box";
import * as styles from "./Backdrop.css";

type BackdropBlur = keyof typeof styles.backdropBlur;

export interface BackdropProps
	extends Omit<
		ComponentProps<typeof Box>,
		| "backgroundColor"
		| "position"
		| "top"
		| "left"
		| "width"
		| "height"
		| "zIndex"
	> {
	blur?: BackdropBlur;
}

export function Backdrop({
	blur = "soft",
	className,
	...props
}: BackdropProps) {
	return (
		<Box
			position="fixed"
			top={0}
			left={0}
			width="fullDvw"
			height="fullDvh"
			backgroundColor="backdrop"
			zIndex="overlay"
			className={clsx(styles.backdropBlur[blur], className)}
			{...props}
		/>
	);
}

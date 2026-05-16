import clsx from "clsx";
import type { ComponentProps } from "react";
import { Box } from "../primitives/Box";
import * as styles from "./Surface.css";

type SurfaceTone = keyof typeof styles.surfaceTone;
type SurfaceElevation = keyof typeof styles.surfaceElevation;

export interface SurfaceProps
	extends Omit<ComponentProps<typeof Box>, "backgroundColor" | "color"> {
	tone?: SurfaceTone;
	elevation?: SurfaceElevation;
}

export function Surface({
	tone = "background",
	elevation = "none",
	borderRadius = "md",
	padding = 2,
	className,
	...props
}: SurfaceProps) {
	return (
		<Box
			borderRadius={borderRadius}
			padding={padding}
			className={clsx(
				styles.surfaceBase,
				styles.surfaceTone[tone],
				styles.surfaceElevation[elevation],
				className,
			)}
			{...props}
		/>
	);
}

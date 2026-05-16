import clsx from "clsx";
import type { ComponentProps } from "react";
import { Box } from "../primitives/Box";
import * as styles from "./ButtonGroup.css";

export interface ButtonGroupProps extends ComponentProps<typeof Box> {
	orientation?: "horizontal" | "vertical";
}

export function ButtonGroup({
	className,
	orientation = "horizontal",
	as = "fieldset",
	...props
}: ButtonGroupProps) {
	return (
		<Box
			as={as}
			data-slot="button-group"
			data-orientation={orientation}
			className={clsx(
				styles.buttonGroup,
				orientation === "vertical"
					? styles.verticalGroup
					: styles.horizontalGroup,
				className,
			)}
			{...props}
		/>
	);
}

import type { ComponentProps } from "react";
import { Box } from "./Box";

export interface FlexProps extends Omit<ComponentProps<typeof Box>, "display"> {
	direction?: "row" | "column";
}

export function Flex({
	direction,
	alignItems,
	justifyContent,
	flexWrap,
	style,
	ref,
	...props
}: FlexProps) {
	return (
		<Box
			display="flex"
			flexDirection={direction ?? "row"}
			flexWrap={flexWrap ?? "nowrap"}
			alignItems={alignItems}
			justifyContent={justifyContent}
			style={style}
			ref={ref}
			{...props}
		/>
	);
}

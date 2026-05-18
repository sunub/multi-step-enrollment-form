import type { ElementType } from "react";
import type { BaseStyle } from "../styles/sprinkles.css";
import { Box, type BoxProps } from "./Box";

export type FlexProps<T extends ElementType = "div"> = Omit<
	BoxProps<T>,
	"display" | "flexDirection" | "flexWrap"
> & {
	direction?: BaseStyle["flexDirection"];
	alignItems?: BaseStyle["alignItems"];
	justifyContent?: BaseStyle["justifyContent"];
	flexWrap?: BaseStyle["flexWrap"];
};

export function Flex<T extends ElementType = "div">({
	direction,
	alignItems,
	justifyContent,
	flexWrap,
	...props
}: FlexProps<T>) {
	return (
		<Box
			display="flex"
			flexDirection={direction ?? "row"}
			flexWrap={flexWrap ?? "nowrap"}
			alignItems={alignItems}
			justifyContent={justifyContent}
			// biome-ignore lint/suspicious/noExplicitAny: BoxProps is generic and safe here
			{...(props as any)}
		/>
	);
}

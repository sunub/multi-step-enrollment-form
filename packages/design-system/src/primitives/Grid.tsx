import type { ElementType } from "react";
import type { BaseStyle } from "../styles/sprinkles.css";
import { Box, type BoxProps } from "./Box";

export type GridProps<T extends ElementType = "div"> = Omit<
	BoxProps<T>,
	"display"
> & {
	alignItems?: BaseStyle["alignItems"];
	justifyContent?: BaseStyle["justifyContent"];
	placeItems?: BaseStyle["placeItems"];
};

export function Grid<T extends ElementType = "div">({
	alignItems,
	justifyContent,
	placeItems,
	...props
}: GridProps<T>) {
	return (
		<Box
			display="grid"
			alignItems={alignItems}
			justifyContent={justifyContent}
			placeItems={placeItems}
			{...(props as any)}
		/>
	);
}

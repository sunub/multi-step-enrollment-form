import type { ComponentProps } from "react";
import { Box } from "./Box";

export interface GridProps
	extends Omit<ComponentProps<typeof Box>, "display"> {}

export function Grid(props: GridProps) {
	return <Box display="grid" {...props} />;
}

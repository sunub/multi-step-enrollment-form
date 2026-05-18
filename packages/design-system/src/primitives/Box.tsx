import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";
import type {
	ComponentPropsWithoutRef,
	ComponentPropsWithRef,
	ElementType,
} from "react";
import { splitProps } from "../styles/sprinkels.utils";
import type { BaseStyle } from "../styles/sprinkles.css";
import { baseStyles } from "../styles/sprinkles.css";

type BoxNativeProps<T extends ElementType> = Omit<
	ComponentPropsWithoutRef<T>,
	keyof BaseStyle | "as" | "asChild"
>;

export type BoxProps<T extends ElementType = "div"> = BaseStyle &
	BoxNativeProps<T> & {
		as?: T;
		asChild?: boolean;
	};

function normalizeClassName(...parts: Array<string | undefined>) {
	return Array.from(new Set(clsx(parts).split(/\s+/).filter(Boolean)))
		.sort()
		.join(" ");
}

export function Box<T extends ElementType = "div">({
	as,
	asChild,
	className,
	ref,
	...props
}: BoxProps<T> & { ref?: ComponentPropsWithRef<T>["ref"] }) {
	const Tag = as || "div";
	const Component = (asChild ? Slot : Tag) as ElementType;
	const { atomProps, nativeProps } = splitProps(
		props as Record<string, unknown>,
	);

	return (
		<Component
			ref={ref}
			className={normalizeClassName(baseStyles(atomProps), className)}
			{...nativeProps}
		/>
	);
}

import type { RecipeVariants } from "@vanilla-extract/recipes";
import clsx from "clsx";
import type { ReactElement, Ref } from "react";
import { Box, type BoxProps } from "../primitives/Box";
import { buttonContentClass, buttonRecipe } from "./Button.css";

type ButtonRecipeVariants = RecipeVariants<typeof buttonRecipe>;
type ButtonVariantKeys = keyof NonNullable<ButtonRecipeVariants>;

type ButtonOwnProps = ButtonRecipeVariants & {
	className?: string;
};

export type NativeButtonProps = Omit<
	BoxProps<"button">,
	ButtonVariantKeys | "className" | "asChild" | "as"
> &
	ButtonOwnProps & {
		asChild?: false;
		ref?: Ref<HTMLButtonElement>;
		type?: "button" | "submit" | "reset";
	};

export type SlottableButtonProps = Omit<
	BoxProps<"button">,
	ButtonVariantKeys | "className" | "asChild" | "as" | "children"
> &
	ButtonOwnProps & {
		asChild: true;
		children: ReactElement;
		ref?: Ref<HTMLButtonElement>;
	};

export type ButtonProps = NativeButtonProps | SlottableButtonProps;

export function Button(props: ButtonProps) {
	const className = clsx(
		buttonRecipe({
			variant: props.variant ?? "primary",
			size: props.size ?? "md",
		}),
		props.className,
	);

	if (props.asChild) {
		const {
			asChild: _asChild,
			children,
			className: _className,
			ref,
			size: _size,
			variant: _variant,
			...slotProps
		} = props;

		return (
			<Box as="button" asChild ref={ref} className={className} {...slotProps}>
				{children}
			</Box>
		);
	}

	const {
		asChild: _asChild,
		className: _className,
		children,
		ref,
		size: _size,
		type = "button",
		variant: _variant,
		...buttonProps
	} = props;

	return (
		<Box
			as="button"
			ref={ref}
			type={type}
			className={className}
			{...buttonProps}
		>
			<span className={buttonContentClass}>{children}</span>
		</Box>
	);
}

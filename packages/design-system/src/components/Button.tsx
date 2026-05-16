import { Slot } from "@radix-ui/react-slot";
import type { RecipeVariants } from "@vanilla-extract/recipes";
import clsx from "clsx";
import type {
	ButtonHTMLAttributes,
	HTMLAttributes,
	ReactElement,
	Ref,
} from "react";
import { buttonContentClass, buttonRecipe } from "./Button.css";

type ButtonRecipeVariants = RecipeVariants<typeof buttonRecipe>;
type ButtonVariantKeys = keyof NonNullable<ButtonRecipeVariants>;

type ButtonOwnProps = ButtonRecipeVariants & {
	className?: string;
};

export type NativeButtonProps = Omit<
	ButtonHTMLAttributes<HTMLButtonElement>,
	ButtonVariantKeys | "className"
> &
	ButtonOwnProps & {
		asChild?: false;
		ref?: Ref<HTMLButtonElement>;
	};

export type SlottableButtonProps = Omit<
	HTMLAttributes<HTMLElement>,
	"children" | "className"
> &
	ButtonOwnProps & {
		asChild: true;
		children: ReactElement;
		ref?: Ref<HTMLElement>;
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
			<Slot ref={ref} className={className} {...slotProps}>
				{children}
			</Slot>
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
		<button ref={ref} type={type} className={className} {...buttonProps}>
			<span className={buttonContentClass}>{children}</span>
		</button>
	);
}

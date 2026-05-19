import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import clsx from "clsx";
import React from "react";
import { Flex } from "../primitives/Flex";
import * as style from "./AlertDialog.css";
import { Backdrop } from "./Backdrop";
import { Button, type ButtonProps } from "./Button";
import { Text } from "./Text";

export const AlertDialog = AlertDialogPrimitive.Root;
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
export const AlertDialogPortal = AlertDialogPrimitive.Portal;

export const AlertDialogOverlay = React.forwardRef<
	React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
	React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
	<AlertDialogPrimitive.Overlay asChild ref={ref}>
		<Backdrop blur="soft" className={className} {...props} />
	</AlertDialogPrimitive.Overlay>
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;

export const AlertDialogContent = React.forwardRef<
	React.ElementRef<typeof AlertDialogPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
	<AlertDialogPortal>
		<AlertDialogOverlay />
		<AlertDialogPrimitive.Content
			ref={ref}
			className={clsx(style.dialogBox, className)}
			{...props}
		>
			<div className={style.decorativeGlow} />
			<Flex
				direction="column"
				alignItems="center"
				textAlign="center"
				position="relative"
				zIndex="overlay"
			>
				{children}
			</Flex>
		</AlertDialogPrimitive.Content>
	</AlertDialogPortal>
));
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;

export const AlertDialogHeader = ({
	className,
	...props
}: React.ComponentPropsWithoutRef<typeof Flex>) => (
	<Flex
		direction="column"
		alignItems="center"
		textAlign="center"
		className={className}
		{...props}
	/>
);
AlertDialogHeader.displayName = "AlertDialogHeader";

export const AlertDialogTitle = React.forwardRef<
	React.ElementRef<typeof AlertDialogPrimitive.Title>,
	React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, color: _color, ...props }, ref) => (
	<AlertDialogPrimitive.Title asChild ref={ref}>
		<Text
			as="h2"
			variant="headlineMd"
			marginBottom={1.5}
			className={className}
			{...props}
		/>
	</AlertDialogPrimitive.Title>
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;

export const AlertDialogDescription = React.forwardRef<
	React.ElementRef<typeof AlertDialogPrimitive.Description>,
	React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, color: _color, ...props }, ref) => (
	<AlertDialogPrimitive.Description asChild ref={ref}>
		<Text
			as="p"
			variant="bodyMd"
			color="onSurfaceVariant"
			marginBottom={4}
			px={1}
			className={className}
			{...props}
		/>
	</AlertDialogPrimitive.Description>
));
AlertDialogDescription.displayName =
	AlertDialogPrimitive.Description.displayName;

export const AlertDialogAction = React.forwardRef<
	React.ElementRef<typeof AlertDialogPrimitive.Action>,
	React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action> & {
		variant?: ButtonProps["variant"];
	}
>(({ className, variant = "primary", asChild, ...props }, ref) => (
	<AlertDialogPrimitive.Action asChild ref={ref}>
		{asChild ? (
			<Button variant={variant} className={className} asChild {...(props as any)}>
				{props.children as React.ReactElement}
			</Button>
		) : (
			<Button variant={variant} className={className} {...(props as any)} />
		)}
	</AlertDialogPrimitive.Action>
));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;

export const AlertDialogCancel = React.forwardRef<
	React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
	React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel> & {
		variant?: ButtonProps["variant"];
	}
>(({ className, variant = "outline", asChild, ...props }, ref) => (
	<AlertDialogPrimitive.Cancel asChild ref={ref}>
		{asChild ? (
			<Button variant={variant} className={className} asChild {...(props as any)}>
				{props.children as React.ReactElement}
			</Button>
		) : (
			<Button variant={variant} className={className} {...(props as any)} />
		)}
	</AlertDialogPrimitive.Cancel>
));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;

export const AlertDialogFooter = ({
	className,
	...props
}: React.ComponentPropsWithoutRef<typeof Flex>) => (
	<Flex
		direction="row"
		gap={2}
		width="full"
		justifyContent="center"
		className={className}
		{...props}
	/>
);
AlertDialogFooter.displayName = "AlertDialogFooter";

import { Flex } from "@shared/design-system";
import clsx from "clsx";
import type { ComponentProps, ReactNode } from "react";
import { useId, useMemo, useState } from "react";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import * as style from "./TexField.css";

type InputType =
	| "text"
	| "email"
	| "password"
	| "number"
	| "tel"
	| "url"
	| "search";

interface TextFieldProps
	extends Omit<ComponentProps<"input">, "ref" | "type" | "onFocus" | "onBlur"> {
	labelContent: string;
	leftIcon?: ReactNode;
	rightElement?: ReactNode;
	isError?: boolean;
	errorMessageId?: string;
	helperText?: string;
	ref?: React.Ref<HTMLInputElement>;
	passwordVisibility?: boolean;
	type?: InputType;
	value?: string | number;
	defaultValue?: string;
	onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
	onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export function TextField({
	id,
	labelContent,
	leftIcon,
	rightElement,
	isError = false,
	errorMessageId,
	helperText,
	onFocus,
	onBlur,
	className,
	passwordVisibility = false,
	ref,
	type = "text",
	value,
	defaultValue,
	...props
}: TextFieldProps) {
	const internalId = useId();
	const inputId = id || internalId;
	const helperId = helperText ? `${inputId}-helper` : undefined;

	const [isFocused, setIsFocused] = useState(false);
	const [internalValue, setInternalValue] = useState(defaultValue || "");
	const [passwordVisibilityState, setPasswordVisibility] =
		useState<InputType>("password");

	const isControlled = value !== undefined;
	const displayValue = isControlled ? value : internalValue;
	const isFieldFilled = Boolean(displayValue);
	const shouldShowPlaceholder = !isFieldFilled;

	const handlePasswordToggle = () => {
		setPasswordVisibility((prev) =>
			prev === "password" ? "text" : "password",
		);
	};

	const inputType = useMemo(() => {
		if (passwordVisibility && type === "password") {
			return passwordVisibilityState;
		}
		return type;
	}, [passwordVisibility, type, passwordVisibilityState]);

	const passwordIcon = useMemo(
		() =>
			passwordVisibilityState === "password" ? (
				<LuEyeClosed size="16px" aria-hidden />
			) : (
				<LuEye size="16px" aria-hidden />
			),
		[passwordVisibilityState],
	);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!isControlled) {
			setInternalValue(e.target.value);
		}
		props.onChange?.(e);
	};

	const descriptionIds =
		[!isError && helperText ? helperId : null].filter(Boolean).join(" ") ||
		undefined;

	const errorId =
		isError && (errorMessageId || helperId)
			? errorMessageId || helperId
			: undefined;

	return (
		<Flex direction="column" gap={4} style={{ width: "100%" }}>
			<div className={style.inputContainer}>
				<div className={style.inputWrapper({ isError })}>
					<label
						htmlFor={inputId}
						className={style.placeholder({
							isFocused: isFocused || !shouldShowPlaceholder,
						})}
					>
						{labelContent}
						{props.required && <span aria-hidden="true"> *</span>}
					</label>
					{leftIcon && (
						<div className={style.iconWrapper({ isTyping: isFocused })}>
							{leftIcon}
						</div>
					)}
					<input
						{...props}
						ref={ref}
						id={inputId}
						className={clsx(style.input, className)}
						type={inputType}
						value={displayValue}
						aria-invalid={isError}
						aria-describedby={descriptionIds}
						aria-errormessage={errorId}
						onChange={handleInputChange}
						onFocus={(e) => {
							setIsFocused(true);
							onFocus?.(e);
						}}
						onBlur={(e) => {
							setIsFocused(false);
							onBlur?.(e);
						}}
					/>
					{rightElement && <>{rightElement}</>}
					{passwordVisibility && type === "password" && (
						<button
							type="button"
							onClick={handlePasswordToggle}
							aria-label={`${passwordVisibilityState === "password" ? "Show" : "Hide"} password`}
							className={clsx(
								style.suffixIconWrapper({ isTyping: isFocused }),
								style.passwordVisibilityIconButton({ isFocused: true }),
							)}
						>
							{passwordIcon}
						</button>
					)}
				</div>
				{helperText && (
					<div
						id={errorId || helperId}
						role={isError ? "alert" : undefined}
						className={style.errorText({ isVisible: isError })}
						data-testid={errorMessageId}
					>
						{helperText}
					</div>
				)}
			</div>
		</Flex>
	);
}

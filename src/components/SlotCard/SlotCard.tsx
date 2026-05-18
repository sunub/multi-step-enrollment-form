import { Box, Flex, Text, vars } from "@shared/design-system";
import { assignInlineVars } from "@vanilla-extract/dynamic";
import type React from "react";
import { useController, useFormContext } from "react-hook-form";
import { FaCheckCircle, FaTimes } from "react-icons/fa";
import { usePersistGroupRegistrationSnapshot } from "../GroupRegistrationStep/hooks/usePersistGroupRegistrationSnapshot";
import type { GroupApplicationData } from "../GroupRegistrationStep/types";
import { TextField } from "../TextField/TextField";
import * as styles from "./SlotCard.css";

export type SlotStatus = "complete" | "in-progress" | "empty";

export interface SlotCardProps {
	index: number;
	onClear: () => void;
}

export const SlotCard: React.FC<SlotCardProps> = ({ index, onClear }) => {
	const {
		control,
		formState: { errors },
	} = useFormContext<GroupApplicationData>();
	const persistSnapshot = usePersistGroupRegistrationSnapshot();

	const { field: participantNameField } = useController({
		control,
		name: `participants.${index}.name`,
	});
	const { field: participantEmailField } = useController({
		control,
		name: `participants.${index}.email`,
	});

	const nameValue = participantNameField.value ?? "";
	const emailValue = participantEmailField.value ?? "";

	const isComplete = nameValue.trim() !== "" && emailValue.trim() !== "";
	const isProgress = nameValue.trim() !== "" || emailValue.trim() !== "";

	const progressPercent = isComplete ? 100 : isProgress ? 50 : 0;

	const slotNumberStr = `Slot ${String(index + 1).padStart(2, "0")}`;

	const inlineVars = assignInlineVars({
		[styles.dynamicVars.progress]: `${progressPercent}%`,
		[styles.dynamicVars.progressColor]: isComplete
			? vars.color.secondary
			: vars.color.primary,
	});

	const nameError = errors.participants?.[index]?.name;
	const emailError = errors.participants?.[index]?.email;

	return (
		<Box className={styles.slotContainer} style={inlineVars}>
			<button
				type="button"
				className={styles.clearButton}
				onClick={onClear}
				aria-label="입력 초기화"
				title="초기화"
			>
				<FaTimes size={14} />
			</button>

			<Box className={styles.slotInner}>
				{isComplete && (
					<Box className={styles.checkIcon}>
						<FaCheckCircle size={24} />
					</Box>
				)}

				<Flex justifyContent="space-between" alignItems="center">
					<Text
						variant="labelMd"
						color={
							isComplete
								? "secondary"
								: isProgress
									? "primary"
									: "onSurfaceVariant"
						}
					>
						{slotNumberStr}
					</Text>
				</Flex>

				<Flex direction="column" gap={1}>
					<TextField
						name={participantNameField.name}
						ref={participantNameField.ref}
						className={styles.inputField}
						type="text"
						labelContent="이름 (Name)"
						placeholder=""
						value={nameValue}
						onChange={participantNameField.onChange}
						onBlur={() => {
							participantNameField.onBlur();
							persistSnapshot();
						}}
						autoComplete="off"
						aria-label={`참가자 ${index + 1} 이름`}
						isError={!!nameError}
						helperText={nameError?.message}
						required
					/>
					<TextField
						name={participantEmailField.name}
						ref={participantEmailField.ref}
						className={styles.inputField}
						type="email"
						labelContent="이메일 (Email)"
						value={emailValue}
						onChange={participantEmailField.onChange}
						onBlur={() => {
							participantEmailField.onBlur();
							persistSnapshot();
						}}
						autoComplete="off"
						aria-label={`참가자 ${index + 1} 이메일`}
						isError={!!emailError}
						helperText={emailError?.message}
						required
					/>
				</Flex>
			</Box>
		</Box>
	);
};

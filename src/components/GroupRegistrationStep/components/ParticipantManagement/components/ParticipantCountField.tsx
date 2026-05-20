import { Box, Flex, Text } from "@shared/design-system";
import clsx from "clsx";
import type React from "react";
import * as styles from "../ParticipantManagement.css";

interface ParticipantCountFieldProps {
	mounted: boolean;
	registeredCount: number;
	createdSlotsCount: number;
	pendingCount: string;
	onChange: (value: string) => void;
	onFocus: () => void;
	onBlur: () => void;
	error?: string;
	min: number;
	max: number;
}

export const ParticipantCountField: React.FC<ParticipantCountFieldProps> = ({
	mounted,
	registeredCount,
	createdSlotsCount,
	pendingCount,
	onChange,
	onFocus,
	onBlur,
	error,
	min,
	max,
}) => {
	return (
		<Flex
			alignItems="center"
			gap={1}
			className={styles.totalCountContainer}
			width={"full"}
		>
			<Flex direction="row" gap={1} style={{ flex: 1 }} alignItems="center">
				<Text variant="labelMd" color="onSurfaceVariant">
					신청 인원
				</Text>
				<Text variant="bodySm" color="onSurfaceVariant" marginTop={0.5}>
					등록 필요 인원:{" "}
					<Box as="span" color="primary" fontWeight="bold">
						{mounted ? registeredCount : ""}명
					</Box>{" "}
					(현재{" "}
					<Box as="span" color="secondary" fontWeight="bold">
						{mounted ? createdSlotsCount : ""}명
					</Box>{" "}
					슬롯 생성됨)
				</Text>
			</Flex>

			<div className={styles.inputValidationContainer}>
				<input
					data-testid="participant-count-input"
					className={clsx(
						styles.totalCountInput,
						error && styles.totalCountInputError,
					)}
					type="number"
					inputMode="numeric"
					value={pendingCount}
					onChange={(event) => onChange(event.target.value)}
					onFocus={onFocus}
					onBlur={onBlur}
					placeholder="인원수"
					min={min}
					max={max}
					step="1"
					aria-label="신청 인원"
					required
					aria-required="true"
				/>
				{error && (
					<span className={styles.errorMessage} role="alert">
						{error}
					</span>
				)}
			</div>
		</Flex>
	);
};

"use client";

import { Box, Flex, Text } from "@shared/design-system";
import clsx from "clsx";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useController, useFormContext, useWatch } from "react-hook-form";
import { MdGroups } from "react-icons/md";
import { useMounted } from "../../hooks/useMounted";
import { usePersistGroupRegistrationSnapshot } from "../GroupRegistrationStep/hooks/usePersistGroupRegistrationSnapshot";
import type { GroupApplicationData } from "../GroupRegistrationStep/types";
import { TextField } from "../TextField/TextField";
import * as styles from "./ParticipantManagement.css";

const PARTICIPANT_COUNT_DEBOUNCE_MS = 500;
const MIN_PARTICIPANTS = 2;
const MAX_PARTICIPANTS = 10;

export const ParticipantManagement: React.FC = () => {
	const mounted = useMounted();
	const {
		control,
		formState: { errors },
	} = useFormContext<GroupApplicationData>();
	const persistSnapshot = usePersistGroupRegistrationSnapshot();
	const isParticipantCountFocusedRef = useRef(false);

	const { field: groupNameField } = useController({
		control,
		name: "groupInfo.groupName",
	});

	const { field: participantCountField } = useController({
		control,
		name: "groupInfo.participantCount",
	});

	const participants = useWatch({
		control,
		name: "participants",
	});

	const [pendingParticipantCount, setPendingParticipantCount] = useState(() =>
		String(participantCountField.value ?? ""),
	);

	useEffect(() => {
		if (isParticipantCountFocusedRef.current) {
			return;
		}

		setPendingParticipantCount(String(participantCountField.value ?? ""));
	}, [participantCountField.value]);

	const commitParticipantCount = useCallback(
		(value: string) => {
			if (value === "") {
				return;
			}

			const parsedValue = Number(value);
			if (Number.isNaN(parsedValue)) {
				return;
			}

			if (parsedValue !== Number(participantCountField.value)) {
				participantCountField.onChange(parsedValue);
			}
		},
		[participantCountField],
	);

	useEffect(() => {
		const timerId = window.setTimeout(() => {
			commitParticipantCount(pendingParticipantCount);
		}, PARTICIPANT_COUNT_DEBOUNCE_MS);

		return () => {
			window.clearTimeout(timerId);
		};
	}, [pendingParticipantCount, commitParticipantCount]);

	const participantCountError = errors.groupInfo?.participantCount;

	return (
		<Box width={"full"}>
			<div className={styles.headerContainer}>
				<Flex alignItems="center" gap={1}>
					<Box className={styles.headerIcon}>
						<MdGroups size={24} />
					</Box>
					<Box>
						<Text variant="headlineMd" color="onSurface">
							단체 등록 정보
						</Text>
					</Box>
				</Flex>

				<Flex direction="column" gap={3} width="full" marginTop={2}>
					<TextField
						name={groupNameField.name}
						ref={groupNameField.ref}
						className={styles.inputField}
						type="text"
						labelContent="단체명을 입력해주세요."
						value={groupNameField.value ?? ""}
						onChange={groupNameField.onChange}
						onBlur={() => {
							groupNameField.onBlur();
							persistSnapshot();
						}}
						autoComplete="organization"
						aria-label="단체명"
						isError={!!errors.groupInfo?.groupName}
						helperText={errors.groupInfo?.groupName?.message}
						required
					/>

					<Flex
						alignItems="center"
						gap={1}
						className={styles.totalCountContainer}
						width={"full"}
					>
						<Flex
							direction="row"
							gap={1}
							style={{ flex: 1 }}
							alignItems="center"
						>
							<Text variant="labelMd" color="onSurfaceVariant">
								신청 인원
							</Text>
							<Text variant="bodySm" color="onSurfaceVariant" marginTop={0.5}>
								등록 필요 인원:{" "}
								<Box as="span" color="primary" fontWeight="bold">
									{mounted ? participantCountField.value : ""}명
								</Box>{" "}
								(현재{" "}
								<Box as="span" color="secondary" fontWeight="bold">
									{mounted ? participants?.length || 0 : ""}명
								</Box>{" "}
								슬롯 생성됨)
							</Text>
						</Flex>

						<div className={styles.inputValidationContainer}>
							<input
								data-testid="participant-count-input"
								className={clsx(
									styles.totalCountInput,
									participantCountError && styles.totalCountInputError,
								)}
								type="number"
								inputMode="numeric"
								name={participantCountField.name}
								ref={participantCountField.ref}
								value={pendingParticipantCount}
								onChange={(event) => {
									setPendingParticipantCount(event.target.value);
								}}
								onFocus={() => {
									isParticipantCountFocusedRef.current = true;
								}}
								onBlur={() => {
									isParticipantCountFocusedRef.current = false;
									participantCountField.onBlur();
									commitParticipantCount(pendingParticipantCount);
								}}
								placeholder="인원수"
								min={MIN_PARTICIPANTS}
								max={MAX_PARTICIPANTS}
								step="1"
								aria-label="신청 인원"
								required
								aria-required="true"
							/>
							{participantCountError && (
								<span className={styles.errorMessage} role="alert">
									{participantCountError.message}
								</span>
							)}
						</div>
					</Flex>
				</Flex>
			</div>
		</Box>
	);
};

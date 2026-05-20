"use client";

import { Box, Flex } from "@shared/design-system";
import { useSetAtom } from "jotai";
import { useCallback, useEffect, useRef, useState } from "react";
import { useController, useFormContext, useWatch } from "react-hook-form";
import { groupRegistrationAtom } from "@/src/enrollment";
import { useMounted } from "../../../../hooks/useMounted";
import { TextField } from "../../../TextField/TextField";
import { usePersistGroupRegistrationSnapshot } from "../../hooks/usePersistGroupRegistrationSnapshot";
import {
	type GroupApplicationData,
	normalizeGroupApplicationData,
} from "../../types";
import { ParticipantCountField } from "./components/ParticipantCountField";
import { ParticipantManagementHeader } from "./components/ParticipantManagementHeader";
import * as styles from "./ParticipantManagement.css";

const PARTICIPANT_COUNT_DEBOUNCE_MS = 500;
const MIN_PARTICIPANTS = 2;
const MAX_PARTICIPANTS = 10;

export const ParticipantManagement = () => {
	const mounted = useMounted();
	const {
		control,
		setValue,
		getValues,
		formState: { errors },
	} = useFormContext<GroupApplicationData>();

	const persistSnapshot = usePersistGroupRegistrationSnapshot();
	const setLiveAtomState = useSetAtom(groupRegistrationAtom);
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
			if (value === "") return;

			const parsedValue = Number(value);
			if (Number.isNaN(parsedValue)) return;

			const currentCount = Number(participantCountField.value) || 0;
			if (parsedValue === currentCount) return;

			participantCountField.onChange(parsedValue);

			const currentParticipants = getValues("participants") || [];
			let nextParticipants = [...currentParticipants];

			if (parsedValue > currentParticipants.length) {
				const diff = parsedValue - currentParticipants.length;
				const newSlots = Array.from({ length: diff }, () => ({
					name: "",
					email: "",
				}));
				nextParticipants = [...nextParticipants, ...newSlots];
			} else if (parsedValue < currentParticipants.length) {
				nextParticipants = nextParticipants.slice(0, parsedValue);
			}

			setValue("participants", nextParticipants, {
				shouldValidate: true,
				shouldDirty: true,
			});

			const nextSnapshot = normalizeGroupApplicationData({
				...getValues(),
				groupInfo: {
					...getValues("groupInfo"),
					participantCount: parsedValue,
				},
				participants: nextParticipants,
			});
			setLiveAtomState(nextSnapshot);
		},
		[participantCountField, getValues, setValue, setLiveAtomState],
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
				<ParticipantManagementHeader />

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

					<ParticipantCountField
						mounted={mounted}
						registeredCount={Number(participantCountField.value) || 0}
						createdSlotsCount={participants?.length || 0}
						pendingCount={pendingParticipantCount}
						onChange={setPendingParticipantCount}
						onFocus={() => {
							isParticipantCountFocusedRef.current = true;
						}}
						onBlur={() => {
							isParticipantCountFocusedRef.current = false;
							participantCountField.onBlur();
							commitParticipantCount(pendingParticipantCount);
						}}
						error={participantCountError?.message}
						min={MIN_PARTICIPANTS}
						max={MAX_PARTICIPANTS}
					/>
				</Flex>
			</div>
		</Box>
	);
};

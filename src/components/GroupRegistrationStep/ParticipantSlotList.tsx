"use client";

import { useEffect, useRef, useState } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { SlotCard } from "../SlotCard";
import { SlotStatusSection } from "../SlotStatusSection";
import { usePersistGroupRegistrationSnapshot } from "./hooks/usePersistGroupRegistrationSnapshot";
import type { GroupApplicationData } from "./types";

const ITEMS_PER_PAGE = 6;

export const ParticipantSlotList = () => {
	const { control, setValue } = useFormContext<GroupApplicationData>();
	const persistSnapshot = usePersistGroupRegistrationSnapshot();
	const hasSyncedStructureRef = useRef(false);
	const [currentPage, setCurrentPage] = useState(1);

	const { fields, append, remove } = useFieldArray({
		control,
		name: "participants",
	});

	const participantCount = useWatch({
		control,
		name: "groupInfo.participantCount",
	});

	useEffect(() => {
		const targetCount = Number(participantCount) || 0;
		if (targetCount > fields.length) {
			const diff = targetCount - fields.length;
			const newItems = Array.from({ length: diff }, () => ({
				name: "",
				email: "",
			}));
			append(newItems);
		} else if (targetCount < fields.length && targetCount >= 0) {
			const diff = fields.length - targetCount;
			const indicesToRemove = Array.from(
				{ length: diff },
				(_, i) => fields.length - 1 - i,
			);
			remove(indicesToRemove);
		}
	}, [participantCount, fields.length, append, remove]);

	useEffect(() => {
		if (!hasSyncedStructureRef.current) {
			hasSyncedStructureRef.current = true;
			return;
		}

		if (fields.length !== Number(participantCount ?? 0)) {
			return;
		}

		persistSnapshot();
	}, [fields.length, participantCount, persistSnapshot]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: reset page on count change
	useEffect(() => {
		setCurrentPage(1);
	}, [participantCount]);

	const handleClear = (index: number) => {
		setValue(`participants.${index}.name`, "");
		setValue(`participants.${index}.email`, "");
		persistSnapshot();
	};

	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const visibleFields = fields.slice(startIndex, startIndex + ITEMS_PER_PAGE);

	return (
		<SlotStatusSection
			totalCount={fields.length}
			currentPage={currentPage}
			itemsPerPage={ITEMS_PER_PAGE}
			onNextPage={() => setCurrentPage((p) => p + 1)}
			onPrevPage={() => setCurrentPage((p) => p - 1)}
		>
			{visibleFields.map((field, localIndex) => {
				const actualIndex = startIndex + localIndex;
				return (
					<SlotCard
						key={field.id}
						index={actualIndex}
						onClear={() => handleClear(actualIndex)}
					/>
				);
			})}
		</SlotStatusSection>
	);
};

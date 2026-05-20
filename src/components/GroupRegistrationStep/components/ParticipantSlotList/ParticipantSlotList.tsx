"use client";

import { useEffect, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { usePersistGroupRegistrationSnapshot } from "../../hooks/usePersistGroupRegistrationSnapshot";
import type { GroupApplicationData } from "../../types";
import { SlotCard } from "./SlotCard";
import { SlotStatusSection } from "./SlotStatusSection";

const ITEMS_PER_PAGE = 6;

export const ParticipantSlotList = () => {
	const { control, setValue, watch } = useFormContext<GroupApplicationData>();
	const persistSnapshot = usePersistGroupRegistrationSnapshot();
	const [currentPage, setCurrentPage] = useState(1);

	const { fields } = useFieldArray({
		control,
		name: "participants",
	});

	const participantCount = watch("groupInfo.participantCount");

	// biome-ignore lint/correctness/useExhaustiveDependencies: 의도적으로 participantCount 변경 시에만 이펙트를 실행하기 위함
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

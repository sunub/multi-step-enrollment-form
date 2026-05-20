"use client";

import { useEffect, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { usePersistGroupRegistrationSnapshot } from "../../hooks/usePersistGroupRegistrationSnapshot";
import type { GroupApplicationData } from "../../types";
import { SlotCard } from "./SlotCard";
import { SlotStatusSection } from "./SlotStatusSection";

export const ParticipantSlotList = () => {
	const {
		control,
		setValue,
		watch,
		formState: { errors },
	} = useFormContext<GroupApplicationData>();
	const persistSnapshot = usePersistGroupRegistrationSnapshot();
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(6);

	const { fields } = useFieldArray({
		control,
		name: "participants",
	});

	const participantCount = watch("groupInfo.participantCount");

	// biome-ignore lint/correctness/useExhaustiveDependencies: 의도적으로 participantCount 변경 시에만 이펙트를 실행하기 위함
	useEffect(() => {
		setCurrentPage(1);
	}, [participantCount]);

	useEffect(() => {
		const handleResize = () => {
			const width = window.innerWidth;
			const nextItemsPerPage = width < 1024 ? 4 : 6;
			setItemsPerPage(nextItemsPerPage);
		};

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		const totalPages = Math.ceil(fields.length / itemsPerPage);
		if (currentPage > totalPages && totalPages > 0) {
			setCurrentPage(totalPages);
		}
	}, [itemsPerPage, fields.length, currentPage]);

	useEffect(() => {
		const participantErrors = errors.participants;
		if (participantErrors && Array.isArray(participantErrors)) {
			const firstErrorIndex = participantErrors.findIndex(
				(err) => err !== undefined && err !== null,
			);
			if (firstErrorIndex !== -1) {
				const errorPage = Math.floor(firstErrorIndex / itemsPerPage) + 1;
				setCurrentPage(errorPage);
			}
		}
	}, [errors.participants, itemsPerPage]);

	const handleClear = (index: number) => {
		setValue(`participants.${index}.name`, "");
		setValue(`participants.${index}.email`, "");
		persistSnapshot();
	};

	const startIndex = (currentPage - 1) * itemsPerPage;

	return (
		<SlotStatusSection
			totalCount={fields.length}
			currentPage={currentPage}
			itemsPerPage={itemsPerPage}
			onNextPage={() => setCurrentPage((p) => p + 1)}
			onPrevPage={() => setCurrentPage((p) => p - 1)}
		>
			{fields.map((field, index) => {
				const isVisible =
					index >= startIndex && index < startIndex + itemsPerPage;
				return (
					<SlotCard
						key={field.id}
						index={index}
						onClear={() => handleClear(index)}
						style={{ display: isVisible ? "block" : "none" }}
					/>
				);
			})}
		</SlotStatusSection>
	);
};

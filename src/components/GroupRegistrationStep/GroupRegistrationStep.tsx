"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Surface } from "@shared/design-system";
import { useAtom, useSetAtom } from "jotai";
import { useEffect } from "react";
import {
	FormProvider,
	type SubmitHandler,
	useForm,
	useWatch,
} from "react-hook-form";
import { useBlocker } from "@/src/hooks/useBlocker";
import {
	groupRegistrationAtom,
	groupRegistrationInitialData,
	removeGroupRegistrationDataAtom,
} from "../../enrollment/atoms";
import { ParticipantManagement } from "../ParticipantManagement";
import { RepresentativeInfo } from "../RepresentativeInfo";
import { ParticipantSlotList } from "./ParticipantSlotList";
import {
	type GroupApplicationData,
	groupApplicationSchema,
	isSameGroupApplicationData,
} from "./types";

interface GroupRegistrationStepProps {
	onNext: () => void;
	onPrev: () => void;
}

const LEAVE_PAGE_MESSAGE =
	"저장되지 않은 변경 사항이 있습니다. 정말 떠나시겠습니까?";

export function GroupRegistrationStep({
	onNext,
	onPrev,
}: GroupRegistrationStepProps) {
	const [liveAtomState, setLiveAtomState] = useAtom(groupRegistrationAtom);
	const removeGroupData = useSetAtom(removeGroupRegistrationDataAtom); // still used by useBlocker

	const methods = useForm<GroupApplicationData>({
		resolver: zodResolver(groupApplicationSchema),
		defaultValues: liveAtomState,
		mode: "onChange",
	});

	const { handleSubmit, reset } = methods;

	const watchedValues = useWatch({
		control: methods.control,
		defaultValue: liveAtomState,
	});
	const shouldBlockNavigation = !isSameGroupApplicationData(
		watchedValues,
		groupRegistrationInitialData,
	);

	// Sync form changes to atom in real-time so SelectionSummary can detect
	// incompatible data when the user navigates back without submitting.
	useEffect(() => {
		setLiveAtomState(watchedValues as GroupApplicationData);
	}, [watchedValues, setLiveAtomState]);

	useBlocker({
		shouldBlock: shouldBlockNavigation,
		message: LEAVE_PAGE_MESSAGE,
		onBlock: () => {
			removeGroupData();
			reset(groupRegistrationInitialData);
		},
	});

	const onSubmit: SubmitHandler<GroupApplicationData> = (data) => {
		setLiveAtomState(data);
		onNext();
	};

	const handlePrevClick = () => {
		// Navigate back freely — group data stays in atoms so the user can
		// return and continue. If they switch enrollment type on step 1,
		// SelectionSummary will show an AlertDialog to confirm data reset.
		onPrev();
	};

	return (
		<FormProvider {...methods}>
			<Box
				as="form"
				onSubmit={handleSubmit(onSubmit)}
				display="flex"
				flexDirection="column"
				gap={4}
			>
				<RepresentativeInfo />
				<ParticipantManagement />

				<ParticipantSlotList />

				<Box marginTop={6} display="flex" gap={2} justifyContent="center">
					<Surface
						as="button"
						type="button"
						onClick={handlePrevClick}
						padding={2}
						borderRadius="md"
						style={{ cursor: "pointer" }}
						aria-label="이전 단계로 이동"
					>
						이전 단계로 이동
					</Surface>
					<Surface
						as="button"
						type="submit"
						data-testid="next-step-button"
						padding={2}
						borderRadius="md"
						tone="primaryContainer"
						style={{ cursor: "pointer" }}
						aria-label="다음 단계로 이동"
					>
						다음 단계로 이동
					</Surface>
				</Box>
			</Box>
		</FormProvider>
	);
}

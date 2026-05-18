"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Surface } from "@shared/design-system";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { FormProvider, type SubmitHandler, useForm } from "react-hook-form";
import { groupRegistrationAtom } from "../../enrollment/atoms";
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

export function GroupRegistrationStep({
	onNext,
	onPrev,
}: GroupRegistrationStepProps) {
	const [liveAtomState, setLiveAtomState] = useAtom(groupRegistrationAtom);

	const methods = useForm<GroupApplicationData>({
		resolver: zodResolver(groupApplicationSchema),
		defaultValues: liveAtomState,
		mode: "onChange",
	});

	const {
		formState: { isDirty },
		getValues,
		handleSubmit,
		reset,
	} = methods;

	useEffect(() => {
		const currentValues = getValues();
		if (isDirty || isSameGroupApplicationData(liveAtomState, currentValues)) {
			return;
		}

		reset(liveAtomState);
	}, [getValues, isDirty, liveAtomState, reset]);

	const onSubmit: SubmitHandler<GroupApplicationData> = (data) => {
		setLiveAtomState(data);
		onNext();
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
						onClick={onPrev}
						padding={2}
						borderRadius="md"
						style={{ cursor: "pointer" }}
					>
						이전
					</Surface>
					<Surface
						as="button"
						type="submit"
						data-testid="next-step-button"
						padding={2}
						borderRadius="md"
						tone="primaryContainer"
						style={{ cursor: "pointer" }}
					>
						다음
					</Surface>
				</Box>
			</Box>
		</FormProvider>
	);
}

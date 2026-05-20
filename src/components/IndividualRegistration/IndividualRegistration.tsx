"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Surface } from "@shared/design-system";
import { useAtom, useSetAtom } from "jotai";
import type React from "react";
import { useEffect, useRef } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import {
	individualRegistrationAtom,
	individualRegistrationInitialData,
	removeIndividualRegistrationDataAtom,
} from "@/src/enrollment";
import { useBlocker } from "@/src/hooks/useBlocker";
import { FormHeader } from "./components/FormHeader";
import { MotivationField } from "./components/MotivationField";
import { StudentInfoSection } from "./components/StudentInfoSection";
import * as styles from "./IndividualRegistration.css";
import {
	type IndividualApplicationData,
	individualApplicationSchema,
	isSameIndividualApplicationData,
} from "./types";

interface IndividualRegistrationProps {
	onNext: () => void;
	onPrev: () => void;
}

const LEAVE_PAGE_MESSAGE = "작성 중인 내용이 있습니다. 정말 나가시겠습니까?";

export const IndividualRegistration: React.FC<IndividualRegistrationProps> = ({
	onNext,
	onPrev,
}) => {
	const [liveAtomState, setLiveAtomState] = useAtom(individualRegistrationAtom);
	const methods = useForm<IndividualApplicationData>({
		resolver: zodResolver(individualApplicationSchema),
		defaultValues: liveAtomState,
		mode: "onChange",
	});
	const removeIndividualData = useSetAtom(removeIndividualRegistrationDataAtom);

	const {
		control,
		formState: { isDirty },
		handleSubmit,
		reset,
	} = methods;

	const watchedValues = useWatch({
		control,
		defaultValue: liveAtomState,
	});
	const shouldBlockNavigation = !isSameIndividualApplicationData(
		watchedValues,
		individualRegistrationInitialData,
	);

	useBlocker({
		shouldBlock: shouldBlockNavigation,
		message: LEAVE_PAGE_MESSAGE,
		onBlock: () => {
			removeIndividualData();
			reset(individualRegistrationInitialData);
		},
	});

	const lastSyncedRef = useRef(liveAtomState);

	useEffect(() => {
		if (isDirty) {
			return;
		}

		if (isSameIndividualApplicationData(lastSyncedRef.current, liveAtomState)) {
			return;
		}

		reset(liveAtomState);
		lastSyncedRef.current = liveAtomState;
	}, [isDirty, liveAtomState, reset]);

	const onSubmit = (data: IndividualApplicationData) => {
		setLiveAtomState(data);
		onNext();
	};

	const handlePrevClick = () => {
		if (shouldBlockNavigation && !window.confirm(LEAVE_PAGE_MESSAGE)) {
			return;
		}

		if (shouldBlockNavigation) {
			removeIndividualData();
			reset(individualRegistrationInitialData);
		}

		onPrev();
	};

	return (
		<main className={styles.mainWrapper}>
			<div className={styles.formContainer}>
				<FormHeader />

				<FormProvider {...methods}>
					<Box
						as="form"
						onSubmit={handleSubmit(onSubmit)}
						className={styles.formLayout}
					>
						<StudentInfoSection>
							<MotivationField />
						</StudentInfoSection>

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
			</div>
		</main>
	);
};

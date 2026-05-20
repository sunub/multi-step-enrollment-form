"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button } from "@shared/design-system";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { EnrollmentLayout } from "@/src/components/EnrollmentLayout";
import { EnrollmentSidebar } from "@/src/components/EnrollmentSidebar";
import {
	enrollmentFormAtom,
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

export const IndividualRegistration = ({
	onNext,
	onPrev,
}: IndividualRegistrationProps) => {
	const [liveAtomState, setLiveAtomState] = useAtom(individualRegistrationAtom);
	const methods = useForm<IndividualApplicationData>({
		resolver: zodResolver(individualApplicationSchema),
		defaultValues: liveAtomState,
		mode: "onChange",
	});
	const removeIndividualData = useSetAtom(removeIndividualRegistrationDataAtom);

	const {
		formState: { isDirty },
		handleSubmit,
		reset,
	} = methods;

	const [shouldBlockNavigation, setShouldBlockNavigation] = useState(
		() =>
			!isSameIndividualApplicationData(
				liveAtomState,
				individualRegistrationInitialData,
			),
	);

	useEffect(() => {
		const subscription = methods.watch((value) => {
			const isDirtyVal = !isSameIndividualApplicationData(
				value as IndividualApplicationData,
				individualRegistrationInitialData,
			);
			if (isDirtyVal !== shouldBlockNavigation) {
				setShouldBlockNavigation(isDirtyVal);
			}
		});
		return () => subscription.unsubscribe();
	}, [methods.watch, shouldBlockNavigation]);

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

	const enrollmentForm = useAtomValue(enrollmentFormAtom);

	return (
		<EnrollmentLayout>
			<EnrollmentLayout.Main>
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
					</Box>
				</FormProvider>
			</EnrollmentLayout.Main>
			<EnrollmentSidebar
				currentStep={2}
				totalSteps={3}
				stepTitle="수강생 정보 입력"
				percent={66}
				selectedCourse={enrollmentForm.selectedCourse}
				enrollmentType={enrollmentForm.type}
			>
				<Button
					type="button"
					variant="outline"
					size="lg"
					onClick={handlePrevClick}
					style={{ width: "100%" }}
					aria-label="이전 단계로 이동"
				>
					이전 단계로 이동
				</Button>
				<EnrollmentLayout.Action onClick={handleSubmit(onSubmit)}>
					다음 단계로 이동
				</EnrollmentLayout.Action>
			</EnrollmentSidebar>
		</EnrollmentLayout>
	);
};

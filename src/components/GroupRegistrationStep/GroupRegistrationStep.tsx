"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Text } from "@shared/design-system";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import {
	FormProvider,
	type SubmitHandler,
	useForm,
	useWatch,
} from "react-hook-form";
import { FaInfoCircle } from "react-icons/fa";
import { EnrollmentLayout } from "@/src/components/EnrollmentLayout";
import { EnrollmentSidebar } from "@/src/components/EnrollmentSidebar";
import { useBlocker } from "@/src/hooks/useBlocker";
import {
	enrollmentFormAtom,
	groupRegistrationAtom,
	groupRegistrationInitialData,
	removeGroupRegistrationDataAtom,
} from "../../enrollment/atoms";
import { ParticipantManagement } from "./components/ParticipantManagement";
import { ParticipantSlotList } from "./components/ParticipantSlotList/ParticipantSlotList";
import { RepresentativeInfo } from "./components/RepresentativeInfo";
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
	const removeGroupData = useSetAtom(removeGroupRegistrationDataAtom);

	const methods = useForm<GroupApplicationData>({
		resolver: zodResolver(groupApplicationSchema),
		defaultValues: liveAtomState,
		mode: "onChange",
	});

	const { handleSubmit, reset } = methods;

	const [shouldBlockNavigation, setShouldBlockNavigation] = useState(
		() =>
			!isSameGroupApplicationData(liveAtomState, groupRegistrationInitialData),
	);

	useEffect(() => {
		const subscription = methods.watch((value) => {
			const isDirty = !isSameGroupApplicationData(
				value as GroupApplicationData,
				groupRegistrationInitialData,
			);
			if (isDirty !== shouldBlockNavigation) {
				setShouldBlockNavigation(isDirty);
			}
		});
		return () => subscription.unsubscribe();
	}, [methods.watch, shouldBlockNavigation]);

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
		onPrev();
	};

	const enrollmentForm = useAtomValue(enrollmentFormAtom);

	const participantCount =
		useWatch({
			control: methods.control,
			name: "groupInfo.participantCount",
			defaultValue: liveAtomState.groupInfo.participantCount,
		}) ?? 0;
	const [hasMultiplePages, setHasMultiplePages] = useState(false);

	useEffect(() => {
		const handleResize = () => {
			const width = window.innerWidth;
			const itemsPerPage = width < 1024 ? 4 : 6;
			setHasMultiplePages(participantCount > itemsPerPage);
		};

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [participantCount]);

	return (
		<EnrollmentLayout>
			<EnrollmentLayout.Main>
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
				{hasMultiplePages && (
					<Box
						style={{
							backgroundColor: "rgba(37, 99, 235, 0.08)",
							border: "1px solid rgba(37, 99, 235, 0.2)",
							borderRadius: "12px",
							padding: "12px",
							marginTop: "8px",
							marginBottom: "16px",
							display: "flex",
							gap: "8px",
							alignItems: "flex-start",
						}}
					>
						<span
							style={{
								color: "#2563eb",
								display: "inline-flex",
								alignItems: "center",
								marginTop: "2px",
							}}
						>
							<FaInfoCircle size={16} />
						</span>
						<Text
							color="primary"
							style={{
								fontSize: "12px",
								lineHeight: "1.4",
								fontWeight: 500,
							}}
						>
							다음 페이지에도 입력 가능한 슬롯이 있습니다. 페이지네이션을 통해
							확인해주세요.
						</Text>
					</Box>
				)}
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
}

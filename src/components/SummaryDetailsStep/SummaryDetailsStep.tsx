"use client";

import { Box, Button } from "@shared/design-system";
import { useMutation } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useMemo, useRef, useState } from "react";
import { steps } from "@/app/courses/funeelConfig";
import {
	createEnrollmentRequestPayload,
	createEnrollmentReviewModel,
	type EnrollmentSuccessResponse,
	enrollmentFormAtom,
	groupRegistrationAtom,
	individualRegistrationAtom,
	isEnrollmentRequestError,
	submitEnrollment,
} from "@/src/enrollment";
import { ApplicantSummarySection } from "./components/ApplicantSummarySection";
import { CourseSummarySection } from "./components/CourseSummarySection";
import { SubmitAgreementSection } from "./components/SubmitAgreementSection";
import * as styles from "./SummaryDetailsStep.css";

interface SummaryDetailsStepProps {
	navigateTo: (stepId: string) => void;
	onPrev: () => void;
	onComplete: (result: EnrollmentSuccessResponse) => void;
}

interface ErrorPresentation {
	title: string;
	description: string;
}

function getErrorPresentation(error: Error): ErrorPresentation {
	if (!isEnrollmentRequestError(error)) {
		return {
			title: "수강 신청을 완료하지 못했습니다.",
			description: "잠시 후 다시 시도해 주세요.",
		};
	}

	switch (error.code) {
		case "COURSE_FULL":
			return {
				title: "선택한 강의의 정원이 마감되었습니다.",
				description:
					"다른 강의를 선택하거나 이전 단계로 돌아가 신청 내용을 조정해 주세요.",
			};
		case "DUPLICATE_ENROLLMENT":
			return {
				title: "이미 신청한 강의입니다.",
				description:
					"동일한 이메일로 중복 신청할 수 없습니다. 다른 정보를 확인한 뒤 다시 시도해 주세요.",
			};
		case "INVALID_INPUT":
			return {
				title: "제출한 신청 정보를 다시 확인해 주세요.",
				description:
					error.details?.form ||
					Object.values(error.details ?? {})[0] ||
					error.message,
			};
		default:
			return {
				title: error.message,
				description: "잠시 후 다시 시도해 주세요.",
			};
	}
}

export function SummaryDetailsStep({
	navigateTo,
	onPrev: _onPrev,
	onComplete,
}: SummaryDetailsStepProps) {
	const enrollmentForm = useAtomValue(enrollmentFormAtom);
	const groupRegistration = useAtomValue(groupRegistrationAtom);
	const individualRegistration = useAtomValue(individualRegistrationAtom);
	const [agreedToTerms, setAgreedToTerms] = useState(false);
	const isSubmitRef = useRef(false);

	const reviewSource = useMemo(
		() => ({
			enrollmentForm,
			groupRegistration,
			individualRegistration,
		}),
		[enrollmentForm, groupRegistration, individualRegistration],
	);
	const reviewModel = useMemo(
		() => createEnrollmentReviewModel(reviewSource),
		[reviewSource],
	);
	const registrationFunnelId = steps.find(
		(step) => step.name === reviewModel.applicant.type,
	)?.id;

	const mutation = useMutation({
		mutationFn: async () => {
			const payload = createEnrollmentRequestPayload(
				reviewSource,
				agreedToTerms,
			);
			return submitEnrollment(payload);
		},
		onSuccess: (result) => {
			onComplete(result);
		},
		onError: () => {
			isSubmitRef.current = false;
		},
	});

	const errorPresentation = mutation.error
		? getErrorPresentation(mutation.error)
		: null;
	const submitDisabled =
		!agreedToTerms || !reviewModel.isReadyToSubmit || mutation.isPending;

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (isSubmitRef.current) return;
		isSubmitRef.current = true;
		mutation.mutate();
	}

	return (
		<Box
			as="form"
			onSubmit={handleSubmit}
			display="flex"
			flexDirection="column"
			gap={3}
		>
			<CourseSummarySection
				course={reviewModel.course}
				onEditClick={() => navigateTo("course-selection")}
			/>

			<ApplicantSummarySection
				applicant={reviewModel.applicant}
				onEditClick={() =>
					navigateTo(registrationFunnelId ?? "course-selection")
				}
			/>

			<SubmitAgreementSection
				agreedToTerms={agreedToTerms}
				onAgreementChange={setAgreedToTerms}
				isPending={mutation.isPending}
				error={errorPresentation}
			/>

			<Box className={styles.actionRow}>
				<Button
					type="submit"
					size="lg"
					disabled={submitDisabled}
					className={styles.actionButton}
					aria-label="수강 신청 제출"
					aria-busy={mutation.isPending}
				>
					{mutation.isPending ? "제출 중..." : "수강 신청 제출"}
				</Button>
			</Box>
		</Box>
	);
}

import { Box, Button, Flex, Surface, Text } from "@shared/design-system";
import { useMutation } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import type { ReactNode } from "react";
import { useMemo, useRef, useState } from "react";
import { steps } from "@/app/courses/funeelConfig";
import { categoryIconMap, ICON_MAP } from "@/src/constants";
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
import * as styles from "./SummaryDetailsStep.css";

interface SummaryDetailsStepProps {
	navigateTo: (stepId: string) => void;
	onPrev: () => void;
	onComplete: (result: EnrollmentSuccessResponse) => void;
}

interface SectionProps {
	icon: keyof typeof ICON_MAP;
	iconTone?: keyof typeof styles.sectionIconTone;
	title: string;
	description?: string;
	children: ReactNode;
}

interface SummaryFieldProps {
	label: string;
	value: string;
}

interface ErrorPresentation {
	title: string;
	description: string;
}

function Section({
	icon,
	iconTone = "primary",
	title,
	description,
	children,
}: SectionProps) {
	const IconComponent = ICON_MAP[icon];

	return (
		<Surface
			as="section"
			tone="surface"
			borderRadius="lg"
			padding={4}
			className={styles.glassSection}
		>
			<Flex gap={2} className={styles.sectionHeader}>
				<Box
					className={`${styles.sectionIcon} ${styles.sectionIconTone[iconTone]}`}
				>
					<IconComponent size={24} />
				</Box>
				<Box>
					<Text as="h2" variant="headlineMd" color="primary">
						{title}
					</Text>
					{description ? (
						<Text variant="bodySm" color="onSurfaceVariant">
							{description}
						</Text>
					) : null}
				</Box>
			</Flex>
			{children}
		</Surface>
	);
}

function SummaryField({ label, value }: SummaryFieldProps) {
	return (
		<Surface
			tone="background"
			borderRadius="md"
			padding={2}
			className={styles.fieldCard}
		>
			<Text
				as="span"
				variant="labelSm"
				color="onSurfaceVariant"
				className={styles.fieldLabel}
			>
				{label}
			</Text>
			<Text variant="bodyMd" color="onSurface">
				{value}
			</Text>
		</Surface>
	);
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
			// Allow the user to retry after a server error.
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
		// Guard synchronously so force-clicked duplicates never call mutate() again.
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
			<Section
				icon="menu_book"
				iconTone={reviewModel.course?.category ?? "primary"}
				title="선택한 강의 정보"
				description="이전 단계에서 선택한 강의와 신청 정보를 마지막으로 확인해 주세요."
			>
				{reviewModel.course ? (
					<Surface tone="background" borderRadius="md" padding={3}>
						<Flex
							justifyContent="space-between"
							alignItems="flex-start"
							gap={2}
						>
							<Flex gap={2} alignItems="flex-start">
								<Box
									className={`${
										styles.sectionIcon
									} ${styles.sectionIconTone[reviewModel.course.category]}`}
								>
									{(() => {
										const CategoryIcon =
											categoryIconMap[reviewModel.course.category];
										return <CategoryIcon size={24} />;
									})()}
								</Box>
								<Box>
									<Text
										as="h3"
										variant="headlineMd"
										color="onSurface"
										data-testid="review-course-title"
									>
										{reviewModel.course.title}
									</Text>
									<Box className={styles.courseMetaList} marginTop={1}>
										<Text variant="bodySm" color="onSurfaceVariant">
											카테고리: {reviewModel.course.categoryLabel}
										</Text>
										<Text variant="bodySm" color="onSurfaceVariant">
											개강일: {reviewModel.course.startDateLabel}
										</Text>
									</Box>
								</Box>
							</Flex>
							<Text variant="headlineMd" color="onSurface">
								{reviewModel.course.priceLabel}
							</Text>
						</Flex>
					</Surface>
				) : (
					<Surface tone="errorContainer" borderRadius="md" padding={3}>
						<Text variant="bodyMd" color="onErrorContainer">
							선택한 강의 정보가 없어 제출할 수 없습니다. 이전 단계로 돌아가
							강의를 다시 선택해 주세요.
						</Text>
					</Surface>
				)}
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={() => navigateTo("course-selection")}
				>
					강의 선택 수정
				</Button>
			</Section>

			<Section
				icon={reviewModel.applicant.type === "group" ? "groups" : "person"}
				title={reviewModel.applicant.title}
			>
				{reviewModel.applicant.type === "personal" ? (
					<>
						<Box className={styles.fieldGrid}>
							{reviewModel.applicant.fields.map((field) => (
								<SummaryField
									key={field.label}
									label={field.label}
									value={field.value}
								/>
							))}
						</Box>
						{reviewModel.applicant.motivation ? (
							<Surface
								tone="background"
								borderRadius="md"
								padding={3}
								marginTop={3}
								className={styles.noteCard}
							>
								<Text variant="labelMd" color="onSurfaceVariant">
									지원 동기
								</Text>
								<Text marginTop={1} variant="bodyMd" color="onSurface">
									{reviewModel.applicant.motivation}
								</Text>
							</Surface>
						) : null}
					</>
				) : (
					<>
						<Box className={styles.fieldGrid}>
							{reviewModel.applicant.groupFields.map((field) => (
								<SummaryField
									key={field.label}
									label={field.label}
									value={field.value}
								/>
							))}
							{reviewModel.applicant.representativeFields.map((field) => (
								<SummaryField
									key={field.label}
									label={field.label}
									value={field.value}
								/>
							))}
						</Box>
						{reviewModel.applicant.motivation ? (
							<Surface
								tone="background"
								borderRadius="md"
								padding={3}
								marginTop={3}
								className={styles.noteCard}
							>
								<Text variant="labelMd" color="onSurfaceVariant">
									신청 메모
								</Text>
								<Text marginTop={1} variant="bodyMd" color="onSurface">
									{reviewModel.applicant.motivation}
								</Text>
							</Surface>
						) : null}
						<Box marginTop={3}>
							<Text
								as="h3"
								variant="headlineMd"
								color="onSurface"
								marginBottom={2}
							>
								수강생 명단 ({reviewModel.applicant.participants.length}명)
							</Text>
							<Box className={styles.participantsList}>
								{reviewModel.applicant.participants.map((participant) => {
									const PersonIcon = ICON_MAP.person;
									return (
										<Box
											key={`${participant.name}-${participant.email}`}
											className={styles.participantItem}
										>
											<Box className={styles.participantIdentity}>
												<PersonIcon size={20} />
												<Text variant="bodyMd" color="onSurface">
													{participant.name}
												</Text>
											</Box>
											<Text variant="bodySm" color="onSurfaceVariant">
												{participant.email}
											</Text>
										</Box>
									);
								})}
							</Box>
						</Box>
					</>
				)}
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={() => navigateTo(registrationFunnelId ?? "course-selection")}
				>
					신청 정보 수정
				</Button>
			</Section>

			<Section
				icon="fact_check"
				title="제출 전 확인"
				description="약관 동의 후 수강 신청을 완료할 수 있습니다."
			>
				<label className={styles.checkboxRow} htmlFor="agreed-to-terms">
					<input
						id="agreed-to-terms"
						type="checkbox"
						aria-label="수강 신청 내용과 유의사항을 확인했으며, 제출에 동의합니다."
						className={styles.checkboxInput}
						checked={agreedToTerms}
						onChange={(event) => setAgreedToTerms(event.target.checked)}
					/>
					<Box>
						<Text as="span" variant="bodyMd" color="onSurface">
							수강 신청 내용과 유의사항을 확인했으며, 제출에 동의합니다.
						</Text>
						<Text
							as="p"
							variant="bodySm"
							color="onSurfaceVariant"
							marginTop={0.5}
						>
							필수 항목이며, 동의해야 제출 버튼이 활성화됩니다.
						</Text>
					</Box>
				</label>

				{mutation.isPending ? (
					<Surface tone="surface" borderRadius="md" padding={3} marginTop={3}>
						<Text variant="bodyMd" color="onSurface">
							수강 신청을 제출하고 있습니다...
						</Text>
					</Surface>
				) : null}

				{errorPresentation ? (
					<Surface
						tone="errorContainer"
						borderRadius="md"
						padding={3}
						marginTop={3}
						className={styles.errorBanner}
						data-testid="review-submit-error"
						role="alert"
					>
						<Text variant="labelMd" color="onErrorContainer">
							{errorPresentation.title}
						</Text>
						<Text marginTop={1} variant="bodySm" color="onErrorContainer">
							{errorPresentation.description}
						</Text>
					</Surface>
				) : null}
			</Section>

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

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	Box,
	Button,
	Flex,
	Surface,
	Text,
	vars,
} from "@shared/design-system";
import type { CourseCategoryType } from "@shared/types";
import { useAtomValue, useSetAtom } from "jotai";
import type React from "react";
import { useRef, useState } from "react";
import { IoIosWarning } from "react-icons/io";
import {
	clearIncompatibleRegistrationDataAtom,
	groupRegistrationAtom,
	individualRegistrationAtom,
	type SelectedCourseSnapshot,
} from "../../../enrollment/atoms";
import { useMounted } from "../../../hooks/useMounted";

import * as styles from "./SelectionSummary.css";

interface SelectionSummaryProps {
	selectedCourseId: string;
	// biome-ignore lint/suspicious/noExplicitAny: Type alignment
	selectedCourse: SelectedCourseSnapshot | null | any;
	totalPrice: number;
	enrollmentType: "personal" | "group";
	onEnrollmentTypeChange: (type: "personal" | "group") => void;
	onRemoveCourse: () => void;
	isNextDisabled: boolean;
}

const categoryColorMap: Record<CourseCategoryType, keyof typeof vars.color> = {
	development: "primary",
	design: "secondary",
	marketing: "tertiary",
	business: "surfaceTint",
};

export const SelectionSummary: React.FC<SelectionSummaryProps> = ({
	selectedCourseId,
	selectedCourse,
	totalPrice,
	enrollmentType,
	onEnrollmentTypeChange,
	onRemoveCourse,
	isNextDisabled,
}) => {
	const mounted = useMounted();
	const individualData = useAtomValue(individualRegistrationAtom);
	const groupAtom = useAtomValue(groupRegistrationAtom);
	const clearIncompatibleData = useSetAtom(
		clearIncompatibleRegistrationDataAtom,
	);

	const [isDialogOpen, setIsDialogOpen] = useState(false);
	// The type the user wants to switch to — set when the dialog opens.
	const [pendingType, setPendingType] = useState<"personal" | "group" | null>(
		null,
	);
	const hiddenSubmitRef = useRef<HTMLButtonElement>(null);

	const isHasIndividualData =
		!!individualData.name ||
		!!individualData.email ||
		!!individualData.phone ||
		!!individualData.motivation;

	const isHasGroupData =
		!!groupAtom.groupInfo.groupName ||
		!!groupAtom.groupInfo.managerName ||
		groupAtom.groupInfo.participantCount > 2 ||
		!!groupAtom.representative.name;

	// Determine whether switching TO the given type would lose existing data.
	const wouldLoseData = (targetType: "personal" | "group") =>
		(targetType === "personal" && isHasGroupData) ||
		(targetType === "group" && isHasIndividualData);

	const handleTypeChange = (type: "personal" | "group") => {
		if (wouldLoseData(type)) {
			// Warn before discarding incompatible registration data.
			setPendingType(type);
			setIsDialogOpen(true);
		} else {
			onEnrollmentTypeChange(type);
		}
	};

	// Clicking Next no longer needs to handle incompatible data — the dialog
	// fires on type-change, so by this point data is already consistent.
	const handleNextClick = () => {
		hiddenSubmitRef.current?.click();
	};

	const handleConfirmReset = () => {
		if (!pendingType) return;
		clearIncompatibleData(pendingType);
		onEnrollmentTypeChange(pendingType);
		setIsDialogOpen(false);
		setPendingType(null);
	};

	return (
		<>
			<Surface
				marginTop={4}
				padding={6}
				tone="surface"
				borderRadius="lg"
				elevation="medium"
				className={styles.summarySticky}
			>
				<Flex direction="column" gap={6}>
					<Flex justifyContent="space-between" alignItems="flex-end">
						<Box>
							<Text variant="headlineMd" marginBottom={2}>
								신청 내역 요약
							</Text>
							<Text variant="bodyMd" data-testid="summary-course-count">
								선택된 강의: {mounted ? (selectedCourseId ? "1개" : "0개") : ""}
							</Text>
						</Box>
						<Box textAlign="right">
							<Text variant="labelMd" color="onSurfaceVariant">
								결제 금액
							</Text>
							<Text
								variant="headlineLg"
								color="primary"
								data-testid="summary-total-price"
							>
								{mounted ? totalPrice.toLocaleString() : ""}원
							</Text>
						</Box>
					</Flex>
					<Flex gap={4} alignItems="center">
						<Text variant="labelMd">신청 유형:</Text>
						<Flex gap={2}>
							{(["personal", "group"] as const).map((type) => (
								<Surface
									key={type}
									as="label"
									tone={
										enrollmentType === type ? "primaryContainer" : "background"
									}
									padding={2}
									px={4}
									borderRadius="full"
									cursor="pointer"
									data-testid={`enrollment-type-${type}`}
									style={{
										border:
											enrollmentType === type
												? `1px solid ${vars.color.primary}`
												: `1px solid ${vars.color.outlineVariant}`,
									}}
								>
									<input
										type="radio"
										name="enrollmentType"
										value={type}
										checked={enrollmentType === type}
										onChange={() => handleTypeChange(type)}
										style={{ display: "none" }}
									/>
									<Text variant="labelMd">
										{type === "personal" ? "개인" : "단체"}
									</Text>
								</Surface>
							))}
						</Flex>
					</Flex>
					{enrollmentType === "group" && (
						<Surface
							tone="errorContainer"
							padding={3}
							borderRadius="md"
							data-testid="group-enrollment-notice"
						>
							<Text variant="bodySm" color="onErrorContainer">
								📢 단체 신청 안내: 단체명, 최소 2인 이상, 담당자 정보가
								필요합니다.
							</Text>
						</Surface>
					)}
					<Box
						py={2}
						style={{
							borderTop: `1px solid ${vars.color.outlineVariant}`,
							borderBottom: `1px solid ${vars.color.outlineVariant}`,
						}}
					>
						{selectedCourse ? (
							<Surface
								tone="background"
								padding={3}
								borderRadius="md"
								elevation="low"
								data-testid="summary-selected-course"
								style={{
									borderLeft: `4px solid ${
										vars.color[
											categoryColorMap[
												selectedCourse.category as CourseCategoryType
											] || "primary"
										]
									}`,
								}}
							>
								<Flex direction="column" gap={2}>
									<Flex justifyContent="space-between" alignItems="flex-start">
										<Text variant="labelSm" fontWeight="bold">
											{selectedCourse.title}
										</Text>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											onClick={onRemoveCourse}
											data-testid="summary-remove-button"
											style={{ padding: 0, minWidth: "auto", height: "auto" }}
										>
											✕
										</Button>
									</Flex>
									<Text variant="labelSm" color="onSurfaceVariant">
										{new Date(selectedCourse.startDate).toLocaleDateString()}
									</Text>
								</Flex>
							</Surface>
						) : (
							<Box py={4}>
								<Text variant="bodySm" color="onSurfaceVariant">
									아직 선택된 강의가 없습니다. 강의를 선택해 주세요.
								</Text>
							</Box>
						)}
					</Box>
					<Button
						type="button"
						size="lg"
						disabled={isNextDisabled}
						data-testid="next-step-button"
						onClick={handleNextClick}
						style={{ width: "100%" }}
						aria-label="다음 단계로 이동"
					>
						수강생 정보 입력으로 이동
					</Button>
					{/* 실제 폼 제출을 담당하는 숨겨진 버튼 */}
					<button
						ref={hiddenSubmitRef}
						type="submit"
						style={{ display: "none" }}
					/>{" "}
				</Flex>
			</Surface>

			<AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<div
							style={{
								width: "64px",
								height: "64px",
								borderRadius: "9999px",
								backgroundColor: vars.color.surfaceContainerHigh,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								marginBottom: "24px",
								border: "1px solid rgba(255, 255, 255, 0.5)",
							}}
						>
							<IoIosWarning color={vars.color.primary} size={32} />
						</div>
						<AlertDialogTitle>신청 정보 초기화 안내</AlertDialogTitle>
						<AlertDialogDescription>
							선택하신 신청 유형으로 변경하여 진행할 경우,
							<br />
							이전에 작성하셨던 기존 신청 정보가 모두 초기화됩니다.
							<br />
							이대로 진행하시겠습니까?
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>취소</AlertDialogCancel>
						<AlertDialogAction onClick={handleConfirmReset}>
							확인
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};

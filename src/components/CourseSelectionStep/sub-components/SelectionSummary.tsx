import { Box, Button, Flex, Surface, Text, vars } from "@shared/design-system";
import type { CourseCategoryType } from "@shared/types";
import type React from "react";
import type { SelectedCourseSnapshot } from "../../../enrollment/atoms";
import { useMounted } from "../../../hooks/useMounted";

import * as styles from "./SelectionSummary.css";

interface SelectionSummaryProps {
	selectedCourseId: string;
	// biome-ignore lint/suspicious/noExplicitAny: Type alignment
	selectedCourse: SelectedCourseSnapshot | null | any; // Type alignment
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

	return (
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
									onChange={() => onEnrollmentTypeChange(type)}
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
					type="submit"
					size="lg"
					disabled={isNextDisabled}
					data-testid="next-step-button"
					style={{ width: "100%" }}
				>
					수강생 정보 입력으로 이동
				</Button>
			</Flex>
		</Surface>
	);
};

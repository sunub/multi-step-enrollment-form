import { Box, Flex, Surface, Text, vars } from "@shared/design-system";
import type { CourseCategoryType, CourseType } from "@shared/types";
import type React from "react";

interface CourseCardProps {
	course: CourseType;
	isSelected: boolean;
	onSelect: (id: string) => void;
}

const categoryColorMap: Record<CourseCategoryType, keyof typeof vars.color> = {
	development: "primary",
	design: "secondary",
	marketing: "tertiary",
	business: "surfaceTint",
};

export const CourseCard: React.FC<CourseCardProps> = ({
	course,
	isSelected,
	onSelect,
}) => {
	const isFull = course.currentEnrollment >= course.maxCapacity;
	const categoryColor = categoryColorMap[course.category] || "primary";

	return (
		<Surface
			as="label"
			tone={isSelected ? "primaryContainer" : "surface"}
			elevation={isSelected ? "medium" : "low"}
			padding={4}
			cursor={isFull ? "not-allowed" : "pointer"}
			opacity={isFull ? 0.5 : 1}
			data-testid={`course-card-${course.id}`}
			style={{
				display: "block",
				transition: "all 0.2s",
				borderLeft: `4px solid ${vars.color[categoryColor]}`,
			}}
		>
			<input
				type="radio"
				name="selectedCourseId"
				style={{ display: "none" }}
				disabled={isFull}
				checked={isSelected}
				onChange={() => onSelect(course.id)}
				data-testid={`course-radio-${course.id}`}
			/>
			<Flex direction="column" gap={3}>
				<Flex justifyContent="space-between" alignItems="center">
					<Surface tone="background" padding={1} px={2} borderRadius="full">
						<Text variant="labelSm" color={categoryColor}>
							{course.category.toUpperCase()}
						</Text>
					</Surface>
					{isFull && (
						<Text
							variant="labelSm"
							color="error"
							fontWeight="bold"
							data-testid={`course-full-badge-${course.id}`}
						>
							신청 마감
						</Text>
					)}
				</Flex>

				<Box>
					<Text variant="headlineMd" data-testid={`course-title-${course.id}`}>
						{course.title}
					</Text>
					<Text variant="bodySm" color="onSurfaceVariant" marginTop={1}>
						{course.description}
					</Text>
				</Box>

				<Flex direction="column" gap={1}>
					<Text variant="labelMd" data-testid={`course-date-${course.id}`}>
						일정: {new Date(course.startDate).toLocaleDateString()}
					</Text>
					<Text variant="labelMd" data-testid={`course-price-${course.id}`}>
						가격: {course.price.toLocaleString()}원
					</Text>
				</Flex>

				<Surface tone="surface" padding={2} borderRadius="sm">
					<Flex justifyContent="space-between" alignItems="center">
						<Text variant="labelSm">수강 정원</Text>
						<Text
							variant="labelSm"
							fontWeight="bold"
							data-testid={`course-capacity-${course.id}`}
						>
							{course.currentEnrollment} / {course.maxCapacity} 명
						</Text>
					</Flex>
				</Surface>
			</Flex>
		</Surface>
	);
};

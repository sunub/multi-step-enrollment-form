import { Box, Button, Flex, Surface, Text } from "@shared/design-system";
import React from "react";
import { categoryIconMap } from "@/src/constants";
import * as styles from "./CourseSummarySection.css";
import { Section } from "./Section";

interface CourseSummaryInfo {
	category: "development" | "design" | "marketing" | "business";
	categoryLabel: string;
	title: string;
	startDateLabel: string;
	priceLabel: string;
}

interface CourseSummarySectionProps {
	course: CourseSummaryInfo | null;
	onEditClick: () => void;
}

export const CourseSummarySection = React.memo(
	({ course, onEditClick }: CourseSummarySectionProps) => {
		return (
			<Section
				icon="menu_book"
				iconTone={course?.category ?? "primary"}
				title="선택한 강의 정보"
				description="이전 단계에서 선택한 강의와 신청 정보를 마지막으로 확인해 주세요."
			>
				{course ? (
					<Surface tone="background" borderRadius="md" padding={3}>
						<Flex
							justifyContent="space-between"
							alignItems="flex-start"
							gap={2}
						>
							<Flex gap={2} alignItems="flex-start">
								<Box
									className={`${styles.sectionIcon} ${styles.sectionIconTone[course.category]}`}
								>
									{(() => {
										const CategoryIcon = categoryIconMap[course.category];
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
										{course.title}
									</Text>
									<Box className={styles.courseMetaList} marginTop={1}>
										<Text variant="bodySm" color="onSurfaceVariant">
											카테고리: {course.categoryLabel}
										</Text>
										<Text variant="bodySm" color="onSurfaceVariant">
											개강일: {course.startDateLabel}
										</Text>
									</Box>
								</Box>
							</Flex>
							<Text variant="headlineMd" color="onSurface">
								{course.priceLabel}
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
					size="md"
					onClick={onEditClick}
					style={{ cursor: "pointer", marginTop: "16px" }}
				>
					강의 선택 수정
				</Button>
			</Section>
		);
	},
);

CourseSummarySection.displayName = "CourseSummarySection";

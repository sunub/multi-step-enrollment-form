import { Box, Flex, Text } from "@shared/design-system";
import { memo } from "react";

interface PriceSummaryContentProps {
	selectedCourseId: string;
	totalPrice: number;
	mounted: boolean;
}

export const PriceSummaryContent = memo(
	({ selectedCourseId, totalPrice, mounted }: PriceSummaryContentProps) => (
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
	),
);

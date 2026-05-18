import { Button, Flex, Text } from "@shared/design-system";
import type React from "react";

interface PaginationControlProps {
	currentPage: number;
	totalPages: number;
	hasPrevPage: boolean;
	hasNextPage: boolean;
	onPageChange: (page: number) => void;
}

export const PaginationControl: React.FC<PaginationControlProps> = ({
	currentPage,
	totalPages,
	hasPrevPage,
	hasNextPage,
	onPageChange,
}) => {
	return (
		<Flex justifyContent="center" alignItems="center" gap={4} py={4}>
			<Button
				type="button"
				variant="outline"
				disabled={!hasPrevPage}
				onClick={() => onPageChange(currentPage - 1)}
				data-testid="pagination-prev"
			>
				이전
			</Button>
			<Text variant="labelMd">
				{currentPage} / {totalPages} 페이지
			</Text>
			<Button
				type="button"
				variant="outline"
				disabled={!hasNextPage}
				onClick={() => onPageChange(currentPage + 1)}
				data-testid="pagination-next"
			>
				다음
			</Button>
		</Flex>
	);
};

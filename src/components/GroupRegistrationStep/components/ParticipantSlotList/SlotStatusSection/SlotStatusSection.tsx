import { Box, Button, Flex, Grid, Text } from "@shared/design-system";
import type React from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import * as styles from "./SlotStatusSection.css";

interface SlotStatusSectionProps {
	children?: React.ReactNode;
	totalCount: number;
	currentPage: number;
	itemsPerPage: number;
	onNextPage: () => void;
	onPrevPage: () => void;
}

export const SlotStatusSection = ({
	children,
	totalCount,
	currentPage,
	itemsPerPage,
	onNextPage,
	onPrevPage,
}: SlotStatusSectionProps) => {
	const totalPages = Math.ceil(totalCount / itemsPerPage);
	const startIdx = totalCount > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
	const endIdx = Math.min(currentPage * itemsPerPage, totalCount);

	return (
		<Box>
			<Flex justifyContent="space-between" alignItems="center" marginBottom={2}>
				<Flex alignItems="center" gap={1}>
					<Text variant="headlineMd" color="onSurface">
						슬롯 현황
					</Text>
					<Box as="span" className={styles.statusBadge}>
						<Text as="span" variant="labelSm" color="onSecondaryContainer">
							{startIdx} - {endIdx} / {totalCount}
						</Text>
					</Box>
				</Flex>

				<Flex gap={1}>
					<Button
						size="sm"
						variant="outline"
						className={styles.navButton}
						data-testid="pagination-prev-button"
						onClick={onPrevPage}
						disabled={currentPage <= 1}
					>
						<FaArrowLeft size={20} />
					</Button>
					<Button
						size="sm"
						variant="outline"
						className={styles.navButton}
						data-testid="pagination-next-button"
						onClick={onNextPage}
						disabled={currentPage >= totalPages}
					>
						<FaArrowRight size={20} />
					</Button>
				</Flex>
			</Flex>

			<Grid className={styles.slotGrid}>{children}</Grid>
		</Box>
	);
};

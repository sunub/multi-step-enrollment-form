import { Box, Flex, Text } from "@shared/design-system";
import type React from "react";
import { MdGroups } from "react-icons/md";
import * as styles from "../ParticipantManagement.css";

export const ParticipantManagementHeader: React.FC = () => {
	return (
		<Flex alignItems="center" gap={1}>
			<Box className={styles.headerIcon}>
				<MdGroups size={24} />
			</Box>
			<Box>
				<Text variant="headlineMd" color="onSurface">
					단체 등록 정보
				</Text>
			</Box>
		</Flex>
	);
};

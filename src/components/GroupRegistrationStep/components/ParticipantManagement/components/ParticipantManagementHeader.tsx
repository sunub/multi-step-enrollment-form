import { Box, Flex, Text } from "@shared/design-system";
import { MdGroups } from "react-icons/md";
import * as styles from "../ParticipantManagement.css";

export const ParticipantManagementHeader = () => {
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

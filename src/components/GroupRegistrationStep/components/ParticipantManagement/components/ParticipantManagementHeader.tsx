import { Flex, Text } from "@shared/design-system";
import { MdGroups } from "react-icons/md";
import * as styles from "../ParticipantManagement.css";

export const ParticipantManagementHeader = () => {
	return (
		<div className={styles.header}>
			<div className={styles.iconWrapper}>
				<MdGroups size={24} />
			</div>
			<Flex alignItems="baseline" gap={1}>
				<Text variant="headlineMd" color="onSurface" as="h2">
					단체 등록 정보
				</Text>
				<Text variant="bodySm" color="onSurfaceVariant" opacity={0.6} as="span">
					(Group Information)
				</Text>
			</Flex>
		</div>
	);
};

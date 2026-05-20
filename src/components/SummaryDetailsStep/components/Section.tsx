import { Box, Flex, Surface, Text } from "@shared/design-system";
import type { ReactNode } from "react";
import React from "react";
import { ICON_MAP } from "@/src/constants";
import * as styles from "./Section.css";

interface SectionProps {
	icon: keyof typeof ICON_MAP;
	iconTone?: keyof typeof styles.sectionIconTone;
	title: string;
	description?: string;
	children: ReactNode;
}

export const Section = React.memo(
	({
		icon,
		iconTone = "primary",
		title,
		description,
		children,
	}: SectionProps) => {
		const IconComponent = ICON_MAP[icon];

		return (
			<Surface
				as="section"
				tone="surface"
				borderRadius="lg"
				padding={4}
				className={styles.glassSection}
			>
				<Flex gap={2} className={styles.sectionHeader}>
					<Box
						className={`${styles.sectionIcon} ${styles.sectionIconTone[iconTone]}`}
					>
						<IconComponent size={24} />
					</Box>
					<Box>
						<Text as="h2" variant="headlineMd" color="primary">
							{title}
						</Text>
						{description ? (
							<Text variant="bodySm" color="onSurfaceVariant">
								{description}
							</Text>
						) : null}
					</Box>
				</Flex>
				{children}
			</Surface>
		);
	},
);

Section.displayName = "Section";

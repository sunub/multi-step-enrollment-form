import { Surface, Text } from "@shared/design-system";
import React from "react";
import * as styles from "./SummaryField.css";

interface SummaryFieldProps {
	label: string;
	value: string;
}

export const SummaryField = React.memo(
	({ label, value }: SummaryFieldProps) => {
		return (
			<Surface
				tone="background"
				borderRadius="md"
				padding={2}
				className={styles.fieldCard}
			>
				<Text
					as="span"
					variant="labelSm"
					color="onSurfaceVariant"
					className={styles.fieldLabel}
				>
					{label}
				</Text>
				<Text variant="bodyMd" color="onSurface">
					{value}
				</Text>
			</Surface>
		);
	},
);

SummaryField.displayName = "SummaryField";

import { Box, Flex, Text } from "@shared/design-system";
import { assignInlineVars } from "@vanilla-extract/dynamic";
import type { ComponentProps } from "react";
import * as styles from "./ProgressSection.css";

export function ProgressSection({ progress }: { progress: number }) {
	return (
		<Box as="section" marginBottom={2}>
			<Flex
				justifyContent="space-between"
				alignItems="flex-end"
				marginBottom={2}
			>
				<Box>
					<Text
						as="span"
						variant="labelSm"
						color="primary"
						display="block"
						marginBottom={0.5}
						className={styles.stepText}
					>
						Step 2 of 3
					</Text>
					<Text
						as="h2"
						variant="bodyMd"
						color="onSurface"
						fontWeight="bold"
						marginBottom={3}
					>
						Student Info
					</Text>
				</Box>
				<Text as="span" variant="labelMd" color="primary" fontWeight="bold">
					{progress}%
				</Text>
			</Flex>

			<ProgressBar value={progress} max={100} variant="primary" />
		</Box>
	);
}

interface ProgressBarProps extends ComponentProps<typeof Box> {
	value: number;
	max?: number;
	variant?: "primary" | "error" | "default";
	label?: string;
	uses?: "winning" | "losing" | "default";
}

function ProgressBar({
	value,
	max = 100,
	variant,
	uses,
	label = "",
	...props
}: ProgressBarProps) {
	const resolvedVariant =
		variant ||
		(uses === "winning" ? "primary" : uses === "losing" ? "error" : "default");

	const percentage = Math.min(100, Math.max(0, (value / max) * 100));

	return (
		<Box
			className={styles.progressBarTrack({ variant: resolvedVariant })}
			role="progressbar"
			aria-valuenow={value}
			aria-valuemin={0}
			aria-valuemax={max}
			aria-label={label || "진행률"}
			{...props}
		>
			<Box
				className={styles.progressBarIndicator({ variant: resolvedVariant })}
				style={assignInlineVars({
					[styles.progressWidthVar]: `${percentage}%`,
				})}
			/>
		</Box>
	);
}

export { ProgressBar };

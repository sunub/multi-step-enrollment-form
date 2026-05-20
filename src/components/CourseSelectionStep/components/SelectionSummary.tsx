import { Button, Flex, Surface } from "@shared/design-system";
import type React from "react";
import { useRef } from "react";
import * as styles from "./SelectionSummary.css";

interface SelectionSummaryProps {
	isNextDisabled: boolean;
	onSubmitClick?: () => void;
	children: React.ReactNode;
}

export const SelectionSummary: React.FC<SelectionSummaryProps> = ({
	isNextDisabled,
	onSubmitClick,
	children,
}) => {
	const hiddenSubmitRef = useRef<HTMLButtonElement>(null);

	const handleNextClick = () => {
		if (onSubmitClick) {
			onSubmitClick();
		} else {
			hiddenSubmitRef.current?.click();
		}
	};

	return (
		<Surface
			marginTop={4}
			padding={6}
			tone="surface"
			borderRadius="lg"
			elevation="medium"
			className={styles.summarySticky}
		>
			<Flex direction="column" gap={6}>
				{children}
				<Button
					type="button"
					size="lg"
					disabled={isNextDisabled}
					data-testid="next-step-button"
					onClick={handleNextClick}
					style={{ width: "100%" }}
					aria-label="다음 단계로 이동"
				>
					수강생 정보 입력으로 이동
				</Button>
				<button
					ref={hiddenSubmitRef}
					type="submit"
					style={{ display: "none" }}
				/>{" "}
			</Flex>
		</Surface>
	);
};

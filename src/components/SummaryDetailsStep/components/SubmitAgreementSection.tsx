import { Box, Surface, Text } from "@shared/design-system";
import React from "react";
import { Section } from "./Section";
import * as styles from "./SubmitAgreementSection.css";

interface ErrorPresentation {
	title: string;
	description: string;
}

interface SubmitAgreementSectionProps {
	agreedToTerms: boolean;
	onAgreementChange: (agreed: boolean) => void;
	isPending: boolean;
	error: ErrorPresentation | null;
}

export const SubmitAgreementSection = React.memo(
	({
		agreedToTerms,
		onAgreementChange,
		isPending,
		error,
	}: SubmitAgreementSectionProps) => {
		return (
			<Section
				icon="fact_check"
				title="제출 전 확인"
				description="약관 동의 후 수강 신청을 완료할 수 있습니다."
			>
				<label className={styles.checkboxRow} htmlFor="agreed-to-terms">
					<input
						id="agreed-to-terms"
						type="checkbox"
						aria-label="수강 신청 내용과 유의사항을 확인했으며, 제출에 동의합니다."
						className={styles.checkboxInput}
						checked={agreedToTerms}
						onChange={(event) => onAgreementChange(event.target.checked)}
					/>
					<Box>
						<Text as="span" variant="bodyMd" color="onSurface">
							수강 신청 내용과 유의사항을 확인했으며, 제출에 동의합니다.
						</Text>
						<Text
							as="p"
							variant="bodySm"
							color="onSurfaceVariant"
							marginTop={0.5}
						>
							필수 항목이며, 동의해야 제출 버튼이 활성화됩니다.
						</Text>
					</Box>
				</label>

				{isPending ? (
					<Surface tone="surface" borderRadius="md" padding={3} marginTop={3}>
						<Text variant="bodyMd" color="onSurface">
							수강 신청을 제출하고 있습니다...
						</Text>
					</Surface>
				) : null}

				{error ? (
					<Surface
						tone="errorContainer"
						borderRadius="md"
						padding={3}
						marginTop={3}
						className={styles.errorBanner}
						data-testid="review-submit-error"
						role="alert"
					>
						<Text variant="labelMd" color="onErrorContainer">
							{error.title}
						</Text>
						<Text marginTop={1} variant="bodySm" color="onErrorContainer">
							{error.description}
						</Text>
					</Surface>
				) : null}
			</Section>
		);
	},
);

SubmitAgreementSection.displayName = "SubmitAgreementSection";

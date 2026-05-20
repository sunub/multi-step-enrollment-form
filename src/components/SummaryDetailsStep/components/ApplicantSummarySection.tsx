import { Box, Button, Surface, Text } from "@shared/design-system";
import React from "react";
import { ICON_MAP } from "@/src/constants";
import type { ApplicantReviewModel } from "@/src/enrollment";
import * as styles from "./ApplicantSummarySection.css";
import { Section } from "./Section";
import { SummaryField } from "./SummaryField";

interface ApplicantSummarySectionProps {
	applicant: ApplicantReviewModel;
	onEditClick: () => void;
}

export const ApplicantSummarySection = React.memo(
	({ applicant, onEditClick }: ApplicantSummarySectionProps) => {
		return (
			<Section
				icon={applicant.type === "group" ? "groups" : "person"}
				title={applicant.title}
			>
				{applicant.type === "personal" ? (
					<>
						<Box className={styles.fieldGrid}>
							{applicant.fields.map((field) => (
								<SummaryField
									key={field.label}
									label={field.label}
									value={field.value}
								/>
							))}
						</Box>
						{applicant.motivation ? (
							<Surface
								tone="background"
								borderRadius="md"
								padding={3}
								marginTop={3}
								className={styles.noteCard}
							>
								<Text variant="labelMd" color="onSurfaceVariant">
									지원 동기
								</Text>
								<Text marginTop={1} variant="bodyMd" color="onSurface">
									{applicant.motivation}
								</Text>
							</Surface>
						) : null}
					</>
				) : (
					<>
						<Box className={styles.fieldGrid}>
							{applicant.groupFields.map((field) => (
								<SummaryField
									key={field.label}
									label={field.label}
									value={field.value}
								/>
							))}
							{applicant.representativeFields.map((field) => (
								<SummaryField
									key={field.label}
									label={field.label}
									value={field.value}
								/>
							))}
						</Box>
						{applicant.motivation ? (
							<Surface
								tone="background"
								borderRadius="md"
								padding={3}
								marginTop={3}
								className={styles.noteCard}
							>
								<Text variant="labelMd" color="onSurfaceVariant">
									신청 메모
								</Text>
								<Text marginTop={1} variant="bodyMd" color="onSurface">
									{applicant.motivation}
								</Text>
							</Surface>
						) : null}
						<Box marginTop={3}>
							<Text
								as="h3"
								variant="headlineMd"
								color="onSurface"
								marginBottom={2}
							>
								수강생 명단 ({applicant.participants.length}명)
							</Text>
							<Box className={styles.participantsList}>
								{applicant.participants.map((participant) => {
									const PersonIcon = ICON_MAP.person;
									return (
										<Box
											key={`${participant.name}-${participant.email}`}
											className={styles.participantItem}
										>
											<Box className={styles.participantIdentity}>
												<PersonIcon size={20} />
												<Text variant="bodyMd" color="onSurface">
													{participant.name}
												</Text>
											</Box>
											<Text variant="bodySm" color="onSurfaceVariant">
												{participant.email}
											</Text>
										</Box>
									);
								})}
							</Box>
						</Box>
					</>
				)}
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={onEditClick}
					style={{ cursor: "pointer" }}
				>
					신청 정보 수정
				</Button>
			</Section>
		);
	},
);

ApplicantSummarySection.displayName = "ApplicantSummarySection";

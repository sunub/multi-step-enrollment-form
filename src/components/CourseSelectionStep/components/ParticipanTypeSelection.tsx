import { Box, Button, Flex, Surface, Text } from "@shared/design-system";
import { GrAnnounce } from "react-icons/gr";
import { MdDeleteOutline } from "react-icons/md";
import type { SelectedCourseSnapshot } from "@/src/enrollment";
import type { EnrollmentType } from "../CourseSelectionStep";
import * as styles from "./ParticipanTypeSelection.css";

interface ParticipantTypeSelectionProps {
	enrollmentType: EnrollmentType;
	selectedCourse: SelectedCourseSnapshot | null;
	handleTypeChange: (type: EnrollmentType) => void;
	onRemoveCourse: () => void;
}

export function ParticipantTypeSelection({
	enrollmentType,
	selectedCourse,
	handleTypeChange,
	onRemoveCourse,
}: ParticipantTypeSelectionProps) {
	return (
		<>
			<Flex gap={4} alignItems="center">
				<Text variant="labelMd">신청 유형:</Text>
				<Flex gap={2}>
					{(["personal", "group"] as const).map((type) => (
						<Surface
							key={type}
							as="label"
							tone={enrollmentType === type ? "primaryContainer" : "background"}
							padding={2}
							px={4}
							borderRadius="full"
							cursor="pointer"
							data-testid={`enrollment-type-${type}`}
							className={styles.typeLabel({
								selected: enrollmentType === type,
							})}
						>
							<input
								type="radio"
								name="enrollmentType"
								value={type}
								checked={enrollmentType === type}
								onChange={() => handleTypeChange(type)}
								style={{ display: "none" }}
							/>
							<Text variant="labelMd">
								{type === "personal" ? "개인" : "단체"}
							</Text>
						</Surface>
					))}
				</Flex>
			</Flex>
			{enrollmentType === "group" && (
				<Surface
					tone="errorContainer"
					padding={3}
					borderRadius="md"
					data-testid="group-enrollment-notice"
				>
					<Text variant="bodySm" color="onErrorContainer">
						<GrAnnounce size={16} style={{ verticalAlign: "middle" }} /> 단체
						신청 안내: 단체명, 최소 2인 이상, 담당자 정보가 필요합니다.
					</Text>
				</Surface>
			)}
			<Box py={2} className={styles.courseWrapper}>
				{selectedCourse ? (
					<Surface
						tone="background"
						padding={3}
						borderRadius="md"
						elevation="low"
						data-testid="summary-selected-course"
					>
						<Flex direction="column" gap={2}>
							<Flex justifyContent="space-between" alignItems="flex-start">
								<Text variant="labelSm" fontWeight="bold">
									{selectedCourse.title}
								</Text>
								<Button
									type="button"
									variant="ghost"
									size="md"
									onClick={onRemoveCourse}
									data-testid="summary-remove-button"
									className={styles.removeButton}
								>
									<MdDeleteOutline size={20} />
								</Button>
							</Flex>
							<Text variant="labelSm" color="onSurfaceVariant">
								{new Date(selectedCourse.startDate).toLocaleDateString()}
							</Text>
						</Flex>
					</Surface>
				) : (
					<Box py={4}>
						<Text variant="bodySm" color="onSurfaceVariant">
							아직 선택된 강의가 없습니다. 강의를 선택해 주세요.
						</Text>
					</Box>
				)}
			</Box>
		</>
	);
}

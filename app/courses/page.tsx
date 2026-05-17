"use client";

import { Box, Surface, Text } from "@shared/design-system";
import { useAtom } from "jotai";
import { Suspense } from "react";
import { enrollmentFormAtom } from "@/src/enrollment/atoms";
import { CourseSelectionStep } from "@/src/enrollment/components";
import { useFunnel } from "@/src/funnel";

function EnrollmentFunnel() {
	const [formData] = useAtom(enrollmentFormAtom);

	const steps = [
		{ id: "course-selection" },
		{ id: "applicant-info" },
		{ id: "review" },
	];

	const funnel = useFunnel(steps, formData);

	return (
		<Box padding={4}>
			<Surface marginBottom={6} padding={4} borderRadius="lg" tone="surface">
				<Text variant="headlineLg">
					수강 신청 ({funnel.currentIndex + 1} / {funnel.activeSteps.length})
				</Text>
				<Text variant="bodyMd" color="onSurfaceVariant">
					현재 단계: {funnel.currentStepId}
				</Text>
			</Surface>

			{funnel.currentStepId === "course-selection" && (
				<CourseSelectionStep onNext={funnel.next} />
			)}

			{funnel.currentStepId === "applicant-info" && (
				<Box padding={10} textAlign="center">
					<Text variant="headlineMd">수강생 정보 입력 스텝 (구현 예정)</Text>
					<Box marginTop={4} display="flex" gap={2} justifyContent="center">
						<Surface as="button" onClick={funnel.prev} padding={2}>
							이전
						</Surface>
						<Surface as="button" onClick={funnel.next} padding={2}>
							다음
						</Surface>
					</Box>
				</Box>
			)}

			{funnel.currentStepId === "review" && (
				<Box padding={10} textAlign="center">
					<Text variant="headlineMd">최종 확인 스텝 (구현 예정)</Text>
					<Box marginTop={4} display="flex" gap={2} justifyContent="center">
						<Surface as="button" onClick={funnel.prev} padding={2}>
							이전
						</Surface>
						<Surface as="button" onClick={funnel.next} padding={2}>
							제출
						</Surface>
					</Box>
				</Box>
			)}

			{funnel.currentStepId === "complete" && (
				<Box padding={10} textAlign="center">
					<Text variant="headlineMd">신청 완료! (구현 예정)</Text>
					<Box marginTop={4}>
						<Surface
							as="button"
							onClick={() => funnel.navigateTo("course-selection")}
							padding={2}
						>
							처음으로 돌아가기
						</Surface>
					</Box>
				</Box>
			)}
		</Box>
	);
}

export default function CoursesPage() {
	return (
		<Suspense
			fallback={
				<Box padding={10} textAlign="center">
					로딩 중...
				</Box>
			}
		>
			<EnrollmentFunnel />
		</Suspense>
	);
}

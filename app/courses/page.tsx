"use client";

import { Box } from "@shared/design-system";
import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import { Suspense, useMemo } from "react";
import { CourseSelectionStep } from "@/src/components/CourseSelectionStep";
import { GroupRegistrationStep } from "@/src/components/GroupRegistrationStep";
import { IndividualRegistration } from "@/src/components/IndividualRegistration";
import { ProgressSection } from "@/src/components/ProgressSection/ProgressSection";
import { SummaryDetailsStep } from "@/src/components/SummaryDetailsStep";
import { INTERNAL_URL } from "@/src/constants";
import {
	enrollmentFormAtom,
	groupRegistrationAtom,
	individualRegistrationAtom,
} from "@/src/enrollment/atoms";
import { useFunnel } from "@/src/funnel";
import { useMounted } from "@/src/hooks/useMounted";
import { type CoursesFunnelState, steps } from "./funeelConfig";

function EnrollmentFunnel() {
	const isMounted = useMounted();
	const enrollmentForm = useAtomValue(enrollmentFormAtom);
	const individualRegistration = useAtomValue(individualRegistrationAtom);
	const groupRegistration = useAtomValue(groupRegistrationAtom);
	const router = useRouter();
	const funnelState = useMemo<CoursesFunnelState>(
		() => ({
			enrollmentForm,
			individualRegistration,
			groupRegistration,
		}),
		[enrollmentForm, groupRegistration, individualRegistration],
	);

	const funnel = useFunnel<CoursesFunnelState>(
		isMounted ? steps : [],
		funnelState,
	);
	if (!isMounted) {
		return (
			<Box padding={10} textAlign="center">
				상태를 불러오는 중입니다...
			</Box>
		);
	}

	if (funnel.currentIndex === -1) {
		return null;
	}

	const currentStep =
		funnel.currentIndex >= 0 ? funnel.activeSteps[funnel.currentIndex] : null;
	return (
		<Box padding={4}>
			<ProgressSection progress={funnel.progress} />

			{currentStep?.id === "course-selection" && (
				<CourseSelectionStep onNext={funnel.next} />
			)}

			{currentStep?.id === "group-member-registration" && (
				<GroupRegistrationStep onNext={funnel.next} onPrev={funnel.prev} />
			)}

			{currentStep?.id === "individual-member-registration" && (
				<IndividualRegistration onNext={funnel.next} onPrev={funnel.prev} />
			)}

			{currentStep?.id === "review" && (
				<SummaryDetailsStep
					navigateTo={funnel.navigateTo}
					onPrev={funnel.prev}
					onComplete={() => {
						router.push(INTERNAL_URL.success);
					}}
				/>
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

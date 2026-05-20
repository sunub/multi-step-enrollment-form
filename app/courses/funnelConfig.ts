import type { GroupApplicationData } from "@/src/components/GroupRegistrationStep/types";
import { groupApplicationSchema } from "@/src/components/GroupRegistrationStep/types";
import type { IndividualApplicationData } from "@/src/components/IndividualRegistration/types";
import { individualApplicationSchema } from "@/src/components/IndividualRegistration/types";
import type { EnrollmentFormData } from "@/src/enrollment";
import type { StepConfig } from "@/src/funnel";

export interface CoursesFunnelState {
  enrollmentForm: EnrollmentFormData;
  individualRegistration: IndividualApplicationData;
  groupRegistration: GroupApplicationData;
}

export function hasSelectedCourse(enrollmentForm: EnrollmentFormData) {
  return Boolean(
    enrollmentForm.courseId &&
    enrollmentForm.selectedCourse &&
    enrollmentForm.courseId === enrollmentForm.selectedCourse.id,
  );
}

export function canAccessIndividualMemberRegistration(
  state: CoursesFunnelState,
) {
  return (
    hasSelectedCourse(state.enrollmentForm) &&
    state.enrollmentForm.type === "personal"
  );
}

export function canAccessGroupMemberRegistration(state: CoursesFunnelState) {
  return (
    hasSelectedCourse(state.enrollmentForm) &&
    state.enrollmentForm.type === "group"
  );
}

export function canAccessReview(state: CoursesFunnelState) {
  if (!hasSelectedCourse(state.enrollmentForm)) {
    return false;
  }

  if (state.enrollmentForm.type === "group") {
    return groupApplicationSchema.safeParse(state.groupRegistration).success;
  }

  return individualApplicationSchema.safeParse(state.individualRegistration)
    .success;
}

export const steps: StepConfig<CoursesFunnelState>[] = [
  {
    id: "course-selection",
    shouldRender: () => true,
  },
  {
    id: "individual-member-registration",
    name: "personal",
    shouldRender: canAccessIndividualMemberRegistration,
  },
  {
    id: "group-member-registration",
    name: "group",
    shouldRender: canAccessGroupMemberRegistration,
  },
  {
    id: "review",
    shouldRender: canAccessReview,
  },
];

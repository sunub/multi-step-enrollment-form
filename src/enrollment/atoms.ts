import type { CourseType } from "@shared/types";
import { atom } from "jotai";
import { atomWithStorage, createJSONStorage } from "jotai/utils";
import type { GroupApplicationData } from "../components/GroupRegistrationStep/types";
import type { IndividualApplicationData } from "../components/IndividualRegistration/types";

export type EnrollmentType = "personal" | "group";
export type SelectedCourseSnapshot = Pick<
	CourseType,
	"id" | "title" | "price" | "startDate" | "category"
>;

export interface EnrollmentFormData {
	courseId: string;
	selectedCourse: SelectedCourseSnapshot | null;
	type: EnrollmentType;
	applicant: {
		name: string;
		email: string;
		phone: string;
	};
	group?: {
		groupName: string;
		memberCount: number;
	};
}

export function createSelectedCourseSnapshot(
	course: CourseType | SelectedCourseSnapshot,
): SelectedCourseSnapshot {
	return {
		id: course.id,
		title: course.title,
		price: course.price,
		startDate: course.startDate,
		category: course.category,
	};
}

export function isSameSelectedCourseSnapshot(
	left: SelectedCourseSnapshot | null,
	right: SelectedCourseSnapshot | null,
) {
	if (left === right) return true;
	if (!left || !right) return false;

	return (
		left.id === right.id &&
		left.title === right.title &&
		left.price === right.price &&
		left.startDate === right.startDate &&
		left.category === right.category
	);
}

// biome-ignore lint/suspicious/noExplicitAny: storage can accept various types
const storage = createJSONStorage<any>(() => {
	if (typeof window !== "undefined") {
		return sessionStorage;
	}
	return {
		getItem: () => null,
		setItem: () => {},
		removeItem: () => {},
	};
});

const initialData: EnrollmentFormData = {
	courseId: "",
	selectedCourse: null,
	type: "personal",
	applicant: { name: "", email: "", phone: "" },
};

export const enrollmentFormAtom = atomWithStorage<EnrollmentFormData>(
	"enrollment-form",
	initialData,
	storage,
	{ getOnInit: false },
);

export const groupRegistrationInitialData: GroupApplicationData = {
	representative: {
		name: "",
		email: "",
		phone: "",
		motivation: "",
	},
	groupInfo: {
		groupName: "",
		managerName: "",
		participantCount: 2,
	},
	participants: Array.from({ length: 2 }, () => ({ name: "", email: "" })),
};

export const groupRegistrationAtom = atomWithStorage<GroupApplicationData>(
	"group-registration-form",
	groupRegistrationInitialData,
	storage,
	{ getOnInit: false },
);

export const individualRegistrationInitialData: IndividualApplicationData = {
	name: "",
	email: "",
	phone: "",
	motivation: "",
};

export const individualRegistrationAtom =
	atomWithStorage<IndividualApplicationData>(
		"individual-registration-form",
		individualRegistrationInitialData,
		storage,
		{ getOnInit: false },
	);

export const clearIncompatibleRegistrationDataAtom = atom(
	null,
	(get, set, targetType: EnrollmentType) => {
		if (targetType === "personal") {
			set(groupRegistrationAtom, groupRegistrationInitialData);
		} else if (targetType === "group") {
			set(individualRegistrationAtom, individualRegistrationInitialData);

			const currentForm = get(enrollmentFormAtom);
			set(enrollmentFormAtom, {
				...currentForm,
				applicant: { name: "", email: "", phone: "" },
			});
		}
	},
);

export const removeEnrollmentFormDataAtom = atom(null, (_get, set) => {
	set(enrollmentFormAtom, initialData);
});

export const removeGroupRegistrationDataAtom = atom(null, (_get, set) => {
	set(groupRegistrationAtom, groupRegistrationInitialData);
});

export const removeIndividualRegistrationDataAtom = atom(null, (_get, set) => {
	set(individualRegistrationAtom, individualRegistrationInitialData);
});

export const clearAllRegistrationDataAtom = atom(null, (_get, set) => {
	set(enrollmentFormAtom, initialData);
	set(groupRegistrationAtom, groupRegistrationInitialData);
	set(individualRegistrationAtom, individualRegistrationInitialData);
});

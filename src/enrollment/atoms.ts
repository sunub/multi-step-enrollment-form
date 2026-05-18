import type { CourseType } from "@shared/types";
import { atomWithStorage, createJSONStorage } from "jotai/utils";

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

const storage = createJSONStorage<EnrollmentFormData>(() => {
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
	{ getOnInit: true },
);

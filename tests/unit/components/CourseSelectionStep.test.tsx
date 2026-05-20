import type { CourseType } from "@shared/types";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createStore, getDefaultStore, Provider } from "jotai";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CourseSelectionStep } from "@/src/components/CourseSelectionStep/CourseSelectionStep";
import {
	type EnrollmentFormData,
	enrollmentFormAtom,
} from "@/src/enrollment/atoms";

const mockPush = vi.fn();
const mockOnNext = vi.fn();
const mockUseQuery = vi.fn();

vi.mock("next/navigation", () => ({
	useRouter: () => ({
		push: mockPush,
	}),
	useSearchParams: () => new URLSearchParams("page=1&category=development"),
}));

vi.mock("@tanstack/react-query", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@tanstack/react-query")>();
	return {
		...actual,
		useQuery: () => mockUseQuery(),
	};
});

vi.mock("@/src/constants", () => ({
	COURSE_CATEGORIES: ["development", "design", "marketing", "business"],
	CATEGORY_COURSE_URLS: {
		DEVELOPMENT: "/courses/development",
		DESIGN: "/courses/design",
		MARKETING: "/courses/marketing",
		BUSINESS: "/courses/business",
	},
}));

vi.mock("@/src/queries/courses/coursesQueryKey", () => ({
	getPaginatedCoursesQueryOptions: () => ({}),
}));

vi.mock("next/link", () => ({
	default: ({ children, href }: { children: ReactNode; href: string }) => (
		<a href={href}>{children}</a>
	),
}));

const mockCourses: CourseType[] = [
	{
		id: "course-1",
		title: "Next.js 실전 마스터 클래스",
		description: "실무 프로젝트 중심 과정",
		category: "development",
		price: 150000,
		maxCapacity: 30,
		currentEnrollment: 10,
		startDate: "2026-06-01T00:00:00.000Z",
		endDate: "2026-06-30T00:00:00.000Z",
		instructor: "홍길동",
	},
	{
		id: "course-2",
		title: "React 성능 최적화",
		description: "렌더링 병목을 해결하는 과정",
		category: "development",
		price: 175000,
		maxCapacity: 25,
		currentEnrollment: 12,
		startDate: "2026-07-01T00:00:00.000Z",
		endDate: "2026-07-31T00:00:00.000Z",
		instructor: "김개발",
	},
];

const baseEnrollmentFormData: EnrollmentFormData = {
	courseId: "",
	selectedCourse: null,
	type: "personal",
	applicant: {
		name: "",
		email: "",
		phone: "",
	},
};

function mockPaginatedCourses(courses: CourseType[] = mockCourses) {
	mockUseQuery.mockReturnValue({
		data: {
			items: courses,
			totalPages: 2,
			hasNextPage: true,
			hasPrevPage: false,
		},
		isPending: false,
		isError: false,
	});
}

function renderCourseSelectionStep(
	overrides?: Partial<EnrollmentFormData>,
	courses: CourseType[] = mockCourses,
) {
	mockPaginatedCourses(courses);

	const store = createStore();
	store.set(enrollmentFormAtom, {
		...baseEnrollmentFormData,
		...overrides,
	});

	render(
		<Provider store={store}>
			<CourseSelectionStep onNext={mockOnNext} />
		</Provider>,
	);

	return store;
}

describe("CourseSelectionStep", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		window.sessionStorage.clear();
		getDefaultStore().set(enrollmentFormAtom, baseEnrollmentFormData);
	});

	it("persists selected course and enrollment type immediately without submit", async () => {
		const store = renderCourseSelectionStep();

		fireEvent.click(screen.getByTestId("course-card-course-1"));
		fireEvent.click(screen.getByTestId("enrollment-type-group"));

		await waitFor(() => {
			expect(store.get(enrollmentFormAtom)).toMatchObject({
				courseId: "course-1",
				type: "group",
				selectedCourse: {
					id: "course-1",
					title: "Next.js 실전 마스터 클래스",
					price: 150000,
					startDate: "2026-06-01T00:00:00.000Z",
					category: "development",
				},
			});
		});

		fireEvent.click(screen.getByTestId("summary-remove-button"));

		await waitFor(() => {
			expect(store.get(enrollmentFormAtom)).toMatchObject({
				courseId: "",
				selectedCourse: null,
				type: "group",
			});
		});
	});

	it("renders persisted selected course summary when current page does not include the course", async () => {
		renderCourseSelectionStep(
			{
				courseId: "persisted-course",
				selectedCourse: {
					id: "persisted-course",
					title: "이전 페이지에서 선택한 강의",
					price: 99000,
					startDate: "2026-08-01T00:00:00.000Z",
					category: "development",
				},
				type: "group",
			},
			[mockCourses[0]],
		);

		await waitFor(() => {
			expect(screen.getByTestId("summary-course-count")).toHaveTextContent(
				"선택된 강의: 1개",
			);
		});

		expect(screen.getByTestId("summary-selected-course")).toHaveTextContent(
			"이전 페이지에서 선택한 강의",
		);
		expect(screen.getByTestId("summary-total-price")).toHaveTextContent(
			"99,000원",
		);
		expect(screen.getByTestId("group-enrollment-notice")).toBeInTheDocument();
	});

	it("rehydrates persisted selection from sessionStorage without overwriting it on mount", async () => {
		mockPaginatedCourses();

		window.sessionStorage.setItem(
			"enrollment-form",
			JSON.stringify({
				courseId: "course-1",
				selectedCourse: {
					id: "course-1",
					title: "Next.js 실전 마스터 클래스",
					price: 150000,
					startDate: "2026-06-01T00:00:00.000Z",
					category: "development",
				},
				type: "group",
				applicant: {
					name: "",
					email: "",
					phone: "",
				},
			}),
		);

		render(<CourseSelectionStep onNext={mockOnNext} />);

		await waitFor(() => {
			expect(screen.getByTestId("summary-course-count")).toHaveTextContent(
				"선택된 강의: 1개",
			);
		});

		expect(screen.getByTestId("summary-selected-course")).toHaveTextContent(
			"Next.js 실전 마스터 클래스",
		);
		expect(screen.getByTestId("group-enrollment-notice")).toBeInTheDocument();
		expect(window.sessionStorage.getItem("enrollment-form")).toContain(
			'"type":"group"',
		);
	});
});

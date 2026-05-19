import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CoursesPage from "../../app/courses/page";
import {
	type EnrollmentFormData,
	enrollmentFormAtom,
	groupRegistrationAtom,
	individualRegistrationAtom,
} from "../../src/enrollment/atoms";

const mockPush = vi.fn();
const mockReplace = vi.fn();
const mockSummaryComplete = vi.fn();
let currentSearchParams = new URLSearchParams(
	"category=development&step=individual-member-registration",
);

vi.mock("next/navigation", () => ({
	useRouter: () => ({
		push: mockPush,
		replace: mockReplace,
	}),
	usePathname: () => "/courses",
	useSearchParams: () => currentSearchParams,
}));

vi.mock("@/src/enrollment/components", () => ({
	CourseSelectionStep: () => <div>Course Selection Step</div>,
}));

vi.mock("@/src/components/GroupRegistrationStep", () => ({
	GroupRegistrationStep: () => <div>Group Registration Step</div>,
}));

vi.mock(
	"@/src/components/GroupRegistrationStep/provider/GroupRegistrationContext",
	() => ({
		GroupRegistrationProvider: ({ children }: { children: ReactNode }) => (
			<>{children}</>
		),
	}),
);

vi.mock("@/src/components/IndividualRegistration", () => ({
	IndividualRegistration: () => <div>Individual Registration Step</div>,
}));

vi.mock("@/src/components/SummaryDetailsStep", () => ({
	SummaryDetailsStep: ({
		onComplete,
	}: {
		onComplete: (result: {
			enrollmentId: string;
			status: "confirmed" | "pending";
			enrolledAt: string;
		}) => void;
	}) => (
		<button
			type="button"
			onClick={() => {
				const result = {
					enrollmentId: "enr-123",
					status: "confirmed" as const,
					enrolledAt: "2026-05-19T00:00:00.000Z",
				};
				mockSummaryComplete(result);
				onComplete(result);
			}}
		>
			Complete Summary Step
		</button>
	),
}));

const baseEnrollmentFormData: EnrollmentFormData = {
	courseId: "course-1",
	selectedCourse: {
		id: "course-1",
		title: "테스트 강의",
		price: 100000,
		startDate: "2026-08-01T00:00:00.000Z",
		category: "development",
	},
	type: "personal",
	applicant: {
		name: "",
		email: "",
		phone: "",
	},
};

describe("CoursesPage", () => {
	beforeEach(() => {
		mockPush.mockReset();
		mockReplace.mockReset();
		mockSummaryComplete.mockReset();
		currentSearchParams = new URLSearchParams(
			"category=development&step=individual-member-registration",
		);
	});

	it("renders the individual registration step for personal enrollment", async () => {
		const store = createStore();
		store.set(enrollmentFormAtom, baseEnrollmentFormData);

		render(
			<Provider store={store}>
				<CoursesPage />
			</Provider>,
		);

		expect(
			await screen.findByText("Individual Registration Step"),
		).toBeInTheDocument();
		expect(
			screen.queryByText("Group Registration Step"),
		).not.toBeInTheDocument();
	});

	it("redirects to the success page without clearing funnel state first", async () => {
		const store = createStore();
		store.set(enrollmentFormAtom, baseEnrollmentFormData);
		store.set(individualRegistrationAtom, {
			name: "홍길동",
			email: "hong@example.com",
			phone: "010-1234-5678",
			motivation: "실무 역량을 키우고 싶습니다.",
		});
		store.set(groupRegistrationAtom, {
			representative: {
				name: "김대표",
				email: "leader@example.com",
				phone: "010-9999-1111",
				motivation: "팀 전체 역량 강화를 원합니다.",
			},
			groupInfo: {
				groupName: "Acme Corp",
				managerName: "박담당",
				participantCount: 2,
			},
			participants: [
				{ name: "참가자1", email: "member1@example.com" },
				{ name: "참가자2", email: "member2@example.com" },
			],
		});

		currentSearchParams = new URLSearchParams(
			"category=development&step=review",
		);

		render(
			<Provider store={store}>
				<CoursesPage />
			</Provider>,
		);

		fireEvent.click(
			await screen.findByRole("button", { name: "Complete Summary Step" }),
		);

		await waitFor(() => {
			expect(mockPush).toHaveBeenCalledWith("/courses/success");
		});

		expect(mockSummaryComplete).toHaveBeenCalledTimes(1);
		expect(store.get(enrollmentFormAtom)).toEqual(baseEnrollmentFormData);
		expect(store.get(individualRegistrationAtom)).toEqual({
			name: "홍길동",
			email: "hong@example.com",
			phone: "010-1234-5678",
			motivation: "실무 역량을 키우고 싶습니다.",
		});
		expect(store.get(groupRegistrationAtom)).toEqual({
			representative: {
				name: "김대표",
				email: "leader@example.com",
				phone: "010-9999-1111",
				motivation: "팀 전체 역량 강화를 원합니다.",
			},
			groupInfo: {
				groupName: "Acme Corp",
				managerName: "박담당",
				participantCount: 2,
			},
			participants: [
				{ name: "참가자1", email: "member1@example.com" },
				{ name: "참가자2", email: "member2@example.com" },
			],
		});
	});
});

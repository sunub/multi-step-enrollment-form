import { render, screen, waitFor } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import { describe, expect, it, vi } from "vitest";
import CoursesSuccessPage from "../../../app/courses/success/page";
import {
	enrollmentFormAtom,
	groupRegistrationAtom,
	groupRegistrationInitialData,
	individualRegistrationAtom,
	individualRegistrationInitialData,
} from "../../../src/enrollment/atoms";

const mockReplace = vi.fn();
vi.mock("next/navigation", () => ({
	useRouter: () => ({
		replace: mockReplace,
	}),
}));

describe("CoursesSuccessPage", () => {
	it("clears registration state after entering the success page", async () => {
		const store = createStore();

		store.set(enrollmentFormAtom, {
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
		});
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

		render(
			<Provider store={store}>
				<CoursesSuccessPage />
			</Provider>,
		);

		expect(
			screen.getByRole("heading", { name: "수강 신청이 완료되었습니다" }),
		).toBeInTheDocument();

		await waitFor(() => {
			expect(store.get(enrollmentFormAtom)).toEqual({
				courseId: "",
				selectedCourse: null,
				type: "personal",
				applicant: {
					name: "",
					email: "",
					phone: "",
				},
			});
		});

		expect(store.get(individualRegistrationAtom)).toEqual(
			individualRegistrationInitialData,
		);
		expect(store.get(groupRegistrationAtom)).toEqual(
			groupRegistrationInitialData,
		);
	});

	it("redirects to courses page if accessed with empty registration state", async () => {
		const store = createStore();
		// enrollmentFormAtom has initialData (selectedCourse is null)

		render(
			<Provider store={store}>
				<CoursesSuccessPage />
			</Provider>,
		);

		await waitFor(() => {
			expect(mockReplace).toHaveBeenCalledWith("/courses");
		});
	});
});

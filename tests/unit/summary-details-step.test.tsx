import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { GroupApplicationData } from "../../src/components/GroupRegistrationStep/types";
import type { IndividualApplicationData } from "../../src/components/IndividualRegistration/types";
import { SummaryDetailsStep } from "../../src/components/SummaryDetailsStep";
import type { EnrollmentFormData } from "../../src/enrollment";
import {
	enrollmentFormAtom,
	groupRegistrationAtom,
	individualRegistrationAtom,
} from "../../src/enrollment";

const mockOnPrev = vi.fn();
const mockOnComplete = vi.fn();
const mockNavigateTo = vi.fn();

const personalEnrollmentFormData: EnrollmentFormData = {
	courseId: "course-1",
	selectedCourse: {
		id: "course-1",
		title: "Advanced UI Engineering",
		price: 180000,
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

const individualRegistrationData: IndividualApplicationData = {
	name: "홍길동",
	email: "hong@example.com",
	phone: "010-1234-5678",
	motivation: "실무 역량을 키우고 싶습니다.",
};

const groupRegistrationData: GroupApplicationData = {
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
};

function createQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
			mutations: {
				retry: false,
			},
		},
	});
}

function renderSummaryStep(
	enrollmentForm: EnrollmentFormData = personalEnrollmentFormData,
) {
	const store = createStore();
	store.set(enrollmentFormAtom, enrollmentForm);
	store.set(groupRegistrationAtom, groupRegistrationData);
	store.set(individualRegistrationAtom, individualRegistrationData);

	render(
		<QueryClientProvider client={createQueryClient()}>
			<Provider store={store}>
				<SummaryDetailsStep
					onPrev={mockOnPrev}
					onComplete={mockOnComplete}
					navigateTo={mockNavigateTo}
				/>
			</Provider>
		</QueryClientProvider>,
	);
}

describe("SummaryDetailsStep", () => {
	beforeEach(() => {
		vi.stubGlobal("fetch", vi.fn());
		mockOnPrev.mockReset();
		mockOnComplete.mockReset();
		mockNavigateTo.mockReset();
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("renders the selected course and applicant summary from atom state", () => {
		renderSummaryStep();

		expect(screen.getByTestId("review-course-title")).toHaveTextContent(
			"Advanced UI Engineering",
		);
		expect(screen.getByText("hong@example.com")).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "수강 신청 제출" }),
		).toBeDisabled();
	});

	it("submits the mapped payload and completes the funnel on success", async () => {
		const fetchMock = vi.mocked(fetch);
		fetchMock.mockResolvedValueOnce(
			new Response(
				JSON.stringify({
					enrollmentId: "enr-123",
					status: "confirmed",
					enrolledAt: "2026-05-19T00:00:00.000Z",
				}),
				{
					status: 200,
					headers: {
						"Content-Type": "application/json",
					},
				},
			),
		);

		renderSummaryStep();

		fireEvent.click(
			screen.getByLabelText(
				"수강 신청 내용과 유의사항을 확인했으며, 제출에 동의합니다.",
			),
		);
		fireEvent.click(screen.getByRole("button", { name: "수강 신청 제출" }));

		await waitFor(() => {
			expect(mockOnComplete).toHaveBeenCalledWith({
				enrollmentId: "enr-123",
				status: "confirmed",
				enrolledAt: "2026-05-19T00:00:00.000Z",
			});
		});

		expect(fetchMock).toHaveBeenCalledWith(
			"/api/enrollments",
			expect.objectContaining({
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					courseId: "course-1",
					type: "personal",
					applicant: {
						name: "홍길동",
						email: "hong@example.com",
						phone: "010-1234-5678",
						motivation: "실무 역량을 키우고 싶습니다.",
					},
					agreedToTerms: true,
				}),
			}),
		);
	});

	it.each([
		[
			"COURSE_FULL",
			"선택한 강의의 정원이 마감되었습니다.",
			"다른 강의를 선택하거나 이전 단계로 돌아가 신청 내용을 조정해 주세요.",
		],
		[
			"DUPLICATE_ENROLLMENT",
			"이미 신청한 강의입니다.",
			"동일한 이메일로 중복 신청할 수 없습니다. 다른 정보를 확인한 뒤 다시 시도해 주세요.",
		],
	] as const)("shows a friendly error message for %s responses", async (code, title, description) => {
		const fetchMock = vi.mocked(fetch);
		fetchMock.mockResolvedValueOnce(
			new Response(
				JSON.stringify({
					code,
					message: title,
				}),
				{
					status: 409,
					headers: {
						"Content-Type": "application/json",
					},
				},
			),
		);

		renderSummaryStep();

		fireEvent.click(
			screen.getByLabelText(
				"수강 신청 내용과 유의사항을 확인했으며, 제출에 동의합니다.",
			),
		);
		fireEvent.click(screen.getByRole("button", { name: "수강 신청 제출" }));

		await waitFor(() => {
			expect(screen.getByTestId("review-submit-error")).toBeInTheDocument();
		});

		expect(screen.getByText(title)).toBeInTheDocument();
		expect(screen.getByText(description)).toBeInTheDocument();
		expect(mockOnComplete).not.toHaveBeenCalled();
	});
});

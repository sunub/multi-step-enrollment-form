import {
	act,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import { Provider } from "jotai";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GroupRegistrationStep } from "../../src/components/GroupRegistrationStep/GroupRegistrationStep";
import type { GroupApplicationData } from "../../src/components/GroupRegistrationStep/types";

const mockOnNext = vi.fn();
const mockOnPrev = vi.fn();
const representativeNameLabel = /대표자 성함을 입력해주세요/;
const representativeEmailLabel = /대표자 이메일을 입력해주세요/;
const representativePhoneLabel = /대표자 연락처를 입력해주세요/;
const managerNameLabel = /담당자 성함을 입력해주세요/;
const participantCountLabel = /신청 인원/;

const persistedGroupRegistrationData: GroupApplicationData = {
	representative: {
		name: "홍길동",
		email: "leader@example.com",
		phone: "010-1234-5678",
		motivation: "",
	},
	groupInfo: {
		groupName: "테스트 그룹",
		managerName: "김담당",
		participantCount: 2,
	},
	participants: [
		{ name: "저장된 참가자", email: "saved@example.com" },
		{ name: "두번째 참가자", email: "saved2@example.com" },
	],
};

describe("GroupRegistrationStep 통합 단위 테스트", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		window.sessionStorage.clear();
	});

	describe("기본 기능 및 복구 (Hydration)", () => {
		it("세션 스토리지 값이 있어도 초기 렌더는 현재 atom 상태를 사용하고 수정 시 다시 저장한다", async () => {
			window.sessionStorage.setItem(
				"group-registration-form",
				JSON.stringify(persistedGroupRegistrationData),
			);

			render(
				<Provider>
					<GroupRegistrationStep onNext={mockOnNext} onPrev={mockOnPrev} />
				</Provider>,
			);

			// Hydration 대기
			const nameInput = await screen.findByLabelText(representativeNameLabel);
			expect(nameInput).toHaveValue("");

			const participantNameInput = screen.getByLabelText("참가자 1 이름");

			fireEvent.change(nameInput, { target: { value: "고친 대표자" } });
			fireEvent.blur(nameInput);

			fireEvent.change(participantNameInput, {
				target: { value: "수정된 참가자" },
			});
			fireEvent.blur(participantNameInput);

			await waitFor(() => {
				const persistedState = window.sessionStorage.getItem(
					"group-registration-form",
				);
				expect(persistedState).not.toBeNull();
				const parsed = JSON.parse(persistedState ?? "");
				expect(parsed.representative.name).toBe("고친 대표자");
				expect(parsed.participants[0].name).toBe("수정된 참가자");
			});
		});
	});

	describe("유효성 검증 (Validation)", () => {
		it("이름이 2자 미만일 경우 blur 시 에러 메시지를 표시한다", async () => {
			render(
				<Provider>
					<GroupRegistrationStep onNext={mockOnNext} onPrev={mockOnPrev} />
				</Provider>,
			);

			const nameInput = await screen.findByLabelText(representativeNameLabel);

			fireEvent.change(nameInput, { target: { value: "홍" } });
			fireEvent.blur(nameInput);

			expect(
				await screen.findByTestId("representative-name-error"),
			).toHaveTextContent("이름은 2자 이상이어야 합니다.");
			expect(nameInput).toHaveAttribute("aria-invalid", "true");
		});

		it("유효하지 않은 이메일 입력 후 올바른 형식으로 수정하면 에러 메시지가 사라진다", async () => {
			render(
				<Provider>
					<GroupRegistrationStep onNext={mockOnNext} onPrev={mockOnPrev} />
				</Provider>,
			);

			const emailInput = await screen.findByLabelText(representativeEmailLabel);

			fireEvent.change(emailInput, { target: { value: "invalid-email" } });
			fireEvent.blur(emailInput);

			expect(
				await screen.findByTestId("representative-email-error"),
			).toBeInTheDocument();

			fireEvent.change(emailInput, { target: { value: "valid@example.com" } });

			await waitFor(() => {
				expect(
					screen.queryByTestId("representative-email-error"),
				).not.toBeInTheDocument();
			});
		});

		it("참가자 수가 범위를 벗어날 경우 에러 메시지를 표시한다", async () => {
			render(
				<Provider>
					<GroupRegistrationStep onNext={mockOnNext} onPrev={mockOnPrev} />
				</Provider>,
			);

			const countInput = await screen.findByRole("spinbutton", {
				name: participantCountLabel,
			});

			// 11명으로 설정 (범위 초과)
			fireEvent.change(countInput, { target: { value: "11" } });

			// Debounce 및 Validation 대기
			await waitFor(
				() => {
					expect(
						screen.getByText("신청 인원은 2명에서 10명 사이로 입력해주세요."),
					).toBeInTheDocument();
				},
				{ timeout: 2000 },
			);

			// 1명으로 설정 (범위 미만)
			fireEvent.change(countInput, { target: { value: "1" } });

			await waitFor(
				() => {
					expect(
						screen.getByText("신청 인원은 2명에서 10명 사이로 입력해주세요."),
					).toBeInTheDocument();
				},
				{ timeout: 2000 },
			);
		});
	});

	describe("동적 필드 관리 (Dynamic Fields)", () => {
		it("참가자 수를 늘렸다가 줄이면 데이터가 절삭된다", async () => {
			render(
				<Provider>
					<GroupRegistrationStep onNext={mockOnNext} onPrev={mockOnPrev} />
				</Provider>,
			);

			const countInput = await screen.findByRole("spinbutton", {
				name: participantCountLabel,
			});

			// 5명으로 늘림
			fireEvent.change(countInput, { target: { value: "5" } });

			// Debounce(500ms) 대기
			await waitFor(
				() => {
					expect(screen.getAllByText(/Slot \d+/)).toHaveLength(5);
				},
				{ timeout: 2000 },
			);

			// 3명으로 줄임
			fireEvent.change(countInput, { target: { value: "3" } });

			await waitFor(
				() => {
					expect(screen.getAllByText(/Slot \d+/)).toHaveLength(3);
				},
				{ timeout: 2000 },
			);
		});
	});

	describe("페이지네이션 (Pagination)", () => {
		it("참가자가 6명 이상일 때 페이지네이션이 동작한다", async () => {
			render(
				<Provider>
					<GroupRegistrationStep onNext={mockOnNext} onPrev={mockOnPrev} />
				</Provider>,
			);

			const countInput = await screen.findByRole("spinbutton", {
				name: participantCountLabel,
			});

			// 10명으로 설정
			fireEvent.change(countInput, { target: { value: "10" } });

			await waitFor(
				() => {
					expect(screen.getByText("Slot 01")).toBeVisible();
					expect(screen.getByText("Slot 06")).toBeVisible();
					expect(screen.getByText("Slot 07")).not.toBeVisible();
				},
				{ timeout: 2000 },
			);

			// 다음 버튼 클릭
			const nextBtn = screen.getByTestId("pagination-next-button");
			fireEvent.click(nextBtn);

			// 7~10번 슬롯이 보여야 함
			await waitFor(
				() => {
					expect(screen.getByText("Slot 01")).not.toBeVisible();
					expect(screen.getByText("Slot 07")).toBeVisible();
					expect(screen.getByText("Slot 10")).toBeVisible();
				},
				{ timeout: 2000 },
			);
		});
	});

	describe("단계 이동 제어 (Navigation)", () => {
		it("필수 값이 누락된 경우 다음 단계로 이동할 수 없다", async () => {
			render(
				<Provider>
					<GroupRegistrationStep onNext={mockOnNext} onPrev={mockOnPrev} />
				</Provider>,
			);

			const nextBtn = await screen.findByTestId("next-step-button");
			fireEvent.click(nextBtn);

			// 비동기 제출 프로세스 고려하여 잠시 대기
			await new Promise((resolve) => setTimeout(resolve, 500));
			expect(mockOnNext).not.toHaveBeenCalled();
		});

		it("모든 값이 유효할 경우 다음 단계로 이동한다", async () => {
			render(
				<Provider>
					<GroupRegistrationStep onNext={mockOnNext} onPrev={mockOnPrev} />
				</Provider>,
			);

			// 대표자 정보 입력
			fireEvent.change(await screen.findByLabelText(representativeNameLabel), {
				target: { value: "홍길동" },
			});
			fireEvent.change(screen.getByLabelText(representativeEmailLabel), {
				target: { value: "leader@example.com" },
			});
			fireEvent.change(screen.getByLabelText(representativePhoneLabel), {
				target: { value: "010-1234-5678" },
			});
			fireEvent.change(screen.getByLabelText(managerNameLabel), {
				target: { value: "김담당" },
			});

			// 단체 정보 입력
			fireEvent.change(screen.getByLabelText("단체명"), {
				target: { value: "테스트 그룹" },
			});

			// 참가자 정보 입력 (기본 2명)
			fireEvent.change(screen.getByLabelText("참가자 1 이름"), {
				target: { value: "참가자1" },
			});
			fireEvent.change(screen.getByLabelText("참가자 1 이메일"), {
				target: { value: "p1@example.com" },
			});
			fireEvent.change(screen.getByLabelText("참가자 2 이름"), {
				target: { value: "참가자2" },
			});
			fireEvent.change(screen.getByLabelText("참가자 2 이메일"), {
				target: { value: "p2@example.com" },
			});

			const nextBtn = screen.getByTestId("next-step-button");

			await act(async () => {
				fireEvent.click(nextBtn);
			});

			await waitFor(
				() => {
					expect(mockOnNext).toHaveBeenCalledTimes(1);
				},
				{ timeout: 5000 },
			);
		});
	});
});

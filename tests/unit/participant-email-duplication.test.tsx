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

const mockOnNext = vi.fn();
const mockOnPrev = vi.fn();
const representativeNameLabel = /대표자 성함을 입력해주세요/;
const representativeEmailLabel = /대표자 이메일을 입력해주세요/;
const representativePhoneLabel = /대표자 연락처를 입력해주세요/;
const managerNameLabel = /담당자 성함을 입력해주세요/;

describe("참가자 이메일 중복 체크 테스트", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		window.sessionStorage.clear();
	});

	it("참가자 간 이메일이 중복될 경우 에러 메시지를 표시하고 다음 단계 이동을 차단한다", async () => {
		render(
			<Provider>
				<GroupRegistrationStep onNext={mockOnNext} onPrev={mockOnPrev} />
			</Provider>,
		);

		// 필수 정보 입력
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
		fireEvent.change(screen.getByLabelText("단체명"), {
			target: { value: "테스트 그룹" },
		});

		// 참가자 1 정보 입력
		fireEvent.change(screen.getByLabelText("참가자 1 이름"), {
			target: { value: "참가자1" },
		});
		fireEvent.change(screen.getByLabelText("참가자 1 이메일"), {
			target: { value: "duplicate@example.com" },
		});

		// 참가자 2 정보 입력 (참가자 1과 중복)
		fireEvent.change(screen.getByLabelText("참가자 2 이름"), {
			target: { value: "참가자2" },
		});
		fireEvent.change(screen.getByLabelText("참가자 2 이메일"), {
			target: { value: "duplicate@example.com" },
		});
		fireEvent.blur(screen.getByLabelText("참가자 2 이메일"));

		// 에러 메시지 확인
		expect(
			await screen.findByText("다른 참가자의 이메일과 중복됩니다."),
		).toBeInTheDocument();

		// 다음 단계 이동 시도
		const nextBtn = screen.getByTestId("next-step-button");
		await act(async () => {
			fireEvent.click(nextBtn);
		});

		// 이동이 차단되어야 함
		expect(mockOnNext).not.toHaveBeenCalled();
	});

	it("참가자 이메일이 대표자 이메일과 중복될 경우 에러 메시지를 표시한다", async () => {
		render(
			<Provider>
				<GroupRegistrationStep onNext={mockOnNext} onPrev={mockOnPrev} />
			</Provider>,
		);

		const leaderEmail = "leader@example.com";
		fireEvent.change(await screen.findByLabelText(representativeEmailLabel), {
			target: { value: leaderEmail },
		});

		// 참가자 1 이메일을 대표자 이메일과 동일하게 입력
		fireEvent.change(screen.getByLabelText("참가자 1 이메일"), {
			target: { value: leaderEmail },
		});
		fireEvent.blur(screen.getByLabelText("참가자 1 이메일"));

		// 에러 메시지 확인
		expect(
			await screen.findByText("대표자 이메일과 중복됩니다."),
		).toBeInTheDocument();
	});

	it("중복 에러가 해결되면 에러 메시지가 사라지고 다음 단계로 이동 가능하다", async () => {
		render(
			<Provider>
				<GroupRegistrationStep onNext={mockOnNext} onPrev={mockOnPrev} />
			</Provider>,
		);

		// 모든 필수 정보 및 중복된 이메일 입력
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
		fireEvent.change(screen.getByLabelText("단체명"), {
			target: { value: "테스트 그룹" },
		});

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
			target: { value: "p1@example.com" },
		}); // 중복
		fireEvent.blur(screen.getByLabelText("참가자 2 이메일"));

		expect(
			await screen.findByText("다른 참가자의 이메일과 중복됩니다."),
		).toBeInTheDocument();

		// 중복 해결
		fireEvent.change(screen.getByLabelText("참가자 2 이메일"), {
			target: { value: "p2@example.com" },
		});

		await waitFor(() => {
			expect(
				screen.queryByText("다른 참가자의 이메일과 중복됩니다."),
			).not.toBeInTheDocument();
		});

		// 다음 단계 이동 성공 확인
		const nextBtn = screen.getByTestId("next-step-button");
		await act(async () => {
			fireEvent.click(nextBtn);
		});

		await waitFor(() => {
			expect(mockOnNext).toHaveBeenCalledTimes(1);
		});
	});
});

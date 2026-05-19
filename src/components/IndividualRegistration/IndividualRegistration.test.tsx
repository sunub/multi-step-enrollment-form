import { act, fireEvent, render, screen } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	individualRegistrationAtom,
	individualRegistrationInitialData,
} from "../../enrollment/atoms";
import { IndividualRegistration } from "./IndividualRegistration";
import type { IndividualApplicationData } from "./types";

vi.mock("next/navigation", () => ({
	usePathname: () => "/courses",
	useRouter: () => ({
		push: vi.fn(),
	}),
	useSearchParams: () =>
		new URLSearchParams("step=individual-member-registration"),
}));

function renderIndividualRegistration(
	initialState: IndividualApplicationData = individualRegistrationInitialData,
) {
	const store = createStore();
	store.set(individualRegistrationAtom, initialState);

	const onNext = vi.fn();
	const onPrev = vi.fn();

	render(
		<Provider store={store}>
			<IndividualRegistration onNext={onNext} onPrev={onPrev} />
		</Provider>,
	);

	return {
		onNext,
		onPrev,
		store,
	};
}

describe("IndividualRegistration", () => {
	beforeEach(() => {
		vi.restoreAllMocks();
		window.sessionStorage.clear();
		window.history.replaceState(
			null,
			"",
			"/courses?step=individual-member-registration",
		);
	});

	it("asks for confirmation before moving to the previous step when a valid field exists", async () => {
		const { onPrev } = renderIndividualRegistration();
		const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false);

		await act(async () => {
			fireEvent.change(
				screen.getByRole("textbox", { name: "성함을 입력해주세요" }),
				{
					target: { value: "홍길동" },
				},
			);
			fireEvent.click(screen.getByRole("button", { name: "이전 단계로 이동" }));
		});

		expect(confirmSpy).toHaveBeenCalledTimes(1);
		expect(onPrev).not.toHaveBeenCalled();
	});

	it("asks for confirmation before moving to the previous step when unsaved invalid data exists", async () => {
		const { onPrev } = renderIndividualRegistration();
		const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false);

		await act(async () => {
			fireEvent.change(
				screen.getByRole("textbox", { name: "성함을 입력해주세요" }),
				{
					target: { value: "가" },
				},
			);
			fireEvent.click(screen.getByRole("button", { name: "이전 단계로 이동" }));
		});

		expect(confirmSpy).toHaveBeenCalledTimes(1);
		expect(onPrev).not.toHaveBeenCalled();
	});

	it("persists the draft on blur and still asks for confirmation before moving back", async () => {
		const { onPrev, store } = renderIndividualRegistration();
		const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false);
		const nameInput = screen.getByRole("textbox", {
			name: "성함을 입력해주세요",
		});

		await act(async () => {
			fireEvent.change(nameInput, {
				target: { value: "홍길동" },
			});
			fireEvent.blur(nameInput);
		});

		expect(store.get(individualRegistrationAtom).name).toBe("홍길동");

		await act(async () => {
			fireEvent.click(screen.getByRole("button", { name: "이전 단계로 이동" }));
		});

		expect(confirmSpy).toHaveBeenCalledTimes(1);
		expect(onPrev).not.toHaveBeenCalled();
	});

	it("asks for confirmation when restored draft data already exists on mount", async () => {
		const { onPrev } = renderIndividualRegistration({
			name: "홍길동",
			email: "",
			phone: "",
			motivation: "",
		});
		const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false);

		await act(async () => {
			fireEvent.click(screen.getByRole("button", { name: "이전 단계로 이동" }));
		});

		expect(confirmSpy).toHaveBeenCalledTimes(1);
		expect(onPrev).not.toHaveBeenCalled();
	});
});

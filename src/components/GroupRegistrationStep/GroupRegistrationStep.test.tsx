import { act, fireEvent, render, screen } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	groupRegistrationAtom,
	groupRegistrationInitialData,
} from "../../enrollment/atoms";
import { GroupRegistrationStep } from "./GroupRegistrationStep";
import type { GroupApplicationData } from "./types";

vi.mock("next/navigation", () => ({
	usePathname: () => "/courses",
	useRouter: () => ({
		push: vi.fn(),
	}),
	useSearchParams: () => new URLSearchParams("step=group-registration"),
}));

function renderGroupRegistrationStep(
	initialState: GroupApplicationData = groupRegistrationInitialData,
) {
	const store = createStore();
	store.set(groupRegistrationAtom, initialState);

	const onNext = vi.fn();
	const onPrev = vi.fn();

	render(
		<Provider store={store}>
			<GroupRegistrationStep onNext={onNext} onPrev={onPrev} />
		</Provider>,
	);

	return {
		onNext,
		onPrev,
		store,
	};
}

describe("GroupRegistrationStep", () => {
	beforeEach(() => {
		vi.restoreAllMocks();
		window.sessionStorage.clear();
		window.history.replaceState(null, "", "/courses?step=group-registration");
	});

	it("asks for confirmation before moving to the previous step when unsaved changes exist", async () => {
		const { onPrev } = renderGroupRegistrationStep();
		const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false);

		await act(async () => {
			fireEvent.change(
				screen.getByRole("textbox", { name: "대표자 성함을 입력해주세요" }),
				{
					target: { value: "홍길동" },
				},
			);
			fireEvent.click(screen.getByRole("button", { name: "이전 단계로 이동" }));
		});

		expect(confirmSpy).toHaveBeenCalledTimes(1);
		expect(onPrev).not.toHaveBeenCalled();
	});

	it("persists the draft on blur and still asks for confirmation before moving back", async () => {
		const { onPrev, store } = renderGroupRegistrationStep();
		const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false);
		const representativeNameInput = screen.getByRole("textbox", {
			name: "대표자 성함을 입력해주세요",
		});

		await act(async () => {
			fireEvent.change(representativeNameInput, {
				target: { value: "홍길동" },
			});
			fireEvent.blur(representativeNameInput);
		});

		expect(store.get(groupRegistrationAtom).representative.name).toBe("홍길동");

		await act(async () => {
			fireEvent.click(screen.getByRole("button", { name: "이전 단계로 이동" }));
		});

		expect(confirmSpy).toHaveBeenCalledTimes(1);
		expect(onPrev).not.toHaveBeenCalled();
	});

	it("asks for confirmation when restored group draft data already exists on mount", async () => {
		const { onPrev } = renderGroupRegistrationStep({
			...groupRegistrationInitialData,
			representative: {
				...groupRegistrationInitialData.representative,
				name: "홍길동",
			},
		});
		const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false);

		await act(async () => {
			fireEvent.click(screen.getByRole("button", { name: "이전 단계로 이동" }));
		});

		expect(confirmSpy).toHaveBeenCalledTimes(1);
		expect(onPrev).not.toHaveBeenCalled();
	});
});

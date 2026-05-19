import { act, fireEvent, render, screen } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	groupRegistrationAtom,
	groupRegistrationInitialData,
} from "../../enrollment/atoms";
import { GroupRegistrationStep } from "./GroupRegistrationStep";
import type { GroupApplicationData } from "./types";

const representativeNameLabel = /대표자 성함을 입력해주세요/;

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

	it("moves to the previous step without confirmation when unsaved changes exist", async () => {
		const { onPrev } = renderGroupRegistrationStep();
		const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false);

		await act(async () => {
			fireEvent.change(
				screen.getByRole("textbox", { name: representativeNameLabel }),
				{
					target: { value: "홍길동" },
				},
			);
			fireEvent.click(screen.getByRole("button", { name: "이전 단계로 이동" }));
		});

		expect(confirmSpy).not.toHaveBeenCalled();
		expect(onPrev).toHaveBeenCalledTimes(1);
	});

	it("persists the draft on blur and still moves to the previous step without confirmation", async () => {
		const { onPrev, store } = renderGroupRegistrationStep();
		const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false);
		const representativeNameInput = screen.getByRole("textbox", {
			name: representativeNameLabel,
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

		expect(confirmSpy).not.toHaveBeenCalled();
		expect(onPrev).toHaveBeenCalledTimes(1);
	});

	it("asks for confirmation when restored group draft data already exists and browser back is used", async () => {
		const { onPrev } = renderGroupRegistrationStep({
			...groupRegistrationInitialData,
			representative: {
				...groupRegistrationInitialData.representative,
				name: "홍길동",
			},
		});
		const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false);

		await act(async () => {
			window.dispatchEvent(new PopStateEvent("popstate"));
		});

		expect(confirmSpy).toHaveBeenCalledTimes(1);
		expect(onPrev).not.toHaveBeenCalled();
	});
});

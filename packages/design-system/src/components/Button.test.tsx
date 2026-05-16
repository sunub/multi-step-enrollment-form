import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { Button } from "./Button";

describe("Button 컴포넌트", () => {
	test("자식 요소와 함께 렌더링되어야 한다", () => {
		render(<Button>Click me</Button>);
		expect(screen.getByRole("button")).toHaveTextContent("Click me");
	});

	test("클릭 이벤트를 올바르게 처리해야 한다", () => {
		const handleClick = vi.fn();
		render(<Button onClick={handleClick}>Click me</Button>);
		fireEvent.click(screen.getByRole("button"));
		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	test("variant에 따른 클래스가 올바르게 적용되어야 한다", () => {
		render(
			<Button variant="primary" data-testid="btn">
				Primary
			</Button>,
		);
		const primaryBtn = screen.getByTestId("btn");

		render(
			<Button variant="secondary" data-testid="btn-sec">
				Secondary
			</Button>,
		);
		const secondaryBtn = screen.getByTestId("btn-sec");

		expect(primaryBtn.className).not.toBe(secondaryBtn.className);
	});

	test("disabled Prop이 true일 때 비활성화되어야 한다", () => {
		const handleClick = vi.fn();
		render(
			<Button disabled onClick={handleClick}>
				Disabled
			</Button>,
		);
		const button = screen.getByRole("button");

		expect(button).toBeDisabled();
		fireEvent.click(button);
		expect(handleClick).not.toHaveBeenCalled();
	});

	test("asChild가 true일 때 다른 엘리먼트로 렌더링되어야 한다 (Polymorphism)", () => {
		render(
			<Button asChild>
				<a href="/test">Link Button</a>
			</Button>,
		);
		const link = screen.getByRole("link");
		expect(link).toHaveAttribute("href", "/test");
		expect(link).toHaveTextContent("Link Button");
	});
});

import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Box } from "./Box";

describe("Box 컴포넌트", () => {
	test("기본적으로 div로 렌더링되어야 한다", async () => {
		render(<Box data-testid="box">Content</Box>);
		await screen.findByTestId("box");

		const element = screen.getByTestId("box");
		expect(element.tagName).toBe("DIV");
		expect(element).toHaveTextContent("Content");
	});

	test("'as' Prop이 제공되면 해당 엘리먼트로 렌더링되어야 한다", () => {
		render(
			<Box as="section" data-testid="box">
				Content
			</Box>,
		);
		const element = screen.getByTestId("box");
		expect(element.tagName).toBe("SECTION");
	});

	test("sprinkle 클래스가 올바르게 적용되어야 한다", () => {
		render(
			<Box padding={2} data-testid="box">
				Content
			</Box>,
		);
		const element = screen.getByTestId("box");
		expect(element.className).not.toBe("");
	});

	test("사용자 정의 className이 sprinkle 클래스와 올바르게 병합되어야 한다", () => {
		render(
			<Box padding={2} className="custom-class" data-testid="box">
				Content
			</Box>,
		);
		const element = screen.getByTestId("box");
		expect(element.className).toContain("custom-class");
	});

	test("asChild가 true일 때 Slot으로 렌더링되어야 한다", () => {
		render(
			<Box asChild data-testid="box">
				<button type="button">Click me</button>
			</Box>,
		);
		const element = screen.getByRole("button");
		expect(element).toHaveTextContent("Click me");
		expect(element.getAttribute("data-testid")).toBe("box");
	});
});

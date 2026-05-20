import { expect, test } from "@playwright/test";

test.describe("Step 3: 확인 및 제출 페이지", () => {
	test.beforeEach(async ({ page }) => {
		// 1단계, 2단계 거쳐서 3단계 도착한 상태로 시작
		await page.goto("/courses?category=development&step=course-selection");
		await expect(page).toHaveURL(/step=course-selection/);
		await page.waitForSelector('[data-testid^="course-card-"]');
		await page.locator('[data-testid^="course-card-"]').first().click();
		await page.getByRole("button", { name: "다음 단계로 이동" }).click();
		await expect(page).toHaveURL(/step=individual-member-registration/);

		await page
			.getByRole("textbox", { name: "성함을 입력해주세요" })
			.fill("홍길동");
		await page
			.getByRole("textbox", { name: "이메일을 입력해주세요" })
			.fill("test@example.com");
		await page
			.getByRole("textbox", { name: "연락처를 입력해주세요" })
			.fill("01012345678");
		await page.getByRole("button", { name: "다음 단계로 이동" }).click();
	});

	test("요약 정보 수정(Edit) 기능 검증: 수정 버튼 클릭 시 이전 단계로 돌아가고 데이터가 유지된다", async ({
		page,
	}) => {
		// '신청 정보 수정' 버튼 클릭
		await page.getByRole("button", { name: "신청 정보 수정" }).click();

		await expect(page).toHaveURL(/step=individual-member-registration/);
		await expect(
			page.getByRole("textbox", { name: "성함을 입력해주세요" }),
		).toHaveValue("홍길동");
	});

	test("중복 제출(Double Submit) 방지 검증: 제출 중에는 버튼이 비활성화되며 한 번만 요청된다", async ({
		page,
	}) => {
		let requestCount = 0;
		await page.route("**/api/enrollments", async (route) => {
			requestCount++;
			await new Promise((resolve) => setTimeout(resolve, 2000)); // 2초 지연
			await route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify({
					enrollmentId: "test-id",
					status: "confirmed",
					enrolledAt: new Date().toISOString(),
				}),
			});
		});

		await page.getByRole("checkbox").check();

		const submitButton = page.getByRole("button", { name: "수강 신청 제출" });
		// 1차 클릭
		await submitButton.click();
		// 2차 강제 클릭 시도 전 스크롤 강제 동기화
		await submitButton.scrollIntoViewIfNeeded();
		await submitButton.click({ force: true });
		await submitButton.scrollIntoViewIfNeeded();
		await submitButton.click({ force: true });

		// 제출 중 상태 확인 (Phase 1 리팩토링 결과)
		await expect(submitButton).toBeDisabled();
		await expect(submitButton).toHaveAttribute("aria-busy", "true");
		await expect(submitButton).toHaveText(/제출 중.../);

		// 요청이 단 1번만 발생했는지 확인
		expect(requestCount).toBe(1);
	});

	test("서버 에러 핸들링 및 재시도: 중복 신청 에러 시 알림이 뜨고 수정한 뒤 재제출 가능하다", async ({
		page,
	}) => {
		// 1. 중복 신청(409) 에러 모킹
		await page.route("**/api/enrollments", async (route) => {
			await route.fulfill({
				status: 409,
				contentType: "application/json",
				body: JSON.stringify({
					code: "DUPLICATE_ENROLLMENT",
					message: "이미 신청한 강의입니다.",
				}),
			});
		});

		await page.getByRole("checkbox").check();
		await page.getByRole("button", { name: "수강 신청 제출" }).click();

		// 에러 알림 확인
		const errorAlert = page
			.getByRole("alert")
			.filter({ hasText: /이미 신청한 강의입니다/ });
		await expect(errorAlert).toBeVisible();

		// 2. 에러 복구 시나리오: 이전 단계로 돌아가 이메일 수정 후 재제출
		await page.getByRole("button", { name: "신청 정보 수정" }).click();
		await page
			.getByRole("textbox", { name: "이메일을 입력해주세요" })
			.fill("new-email@test.com");
		await page.getByRole("button", { name: "다음 단계로 이동" }).click();

		// 정상 응답으로 모킹 변경
		await page.unroute("**/api/enrollments");
		await page.route("**/api/enrollments", async (route) => {
			await route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify({
					enrollmentId: "success-id",
					status: "confirmed",
					enrolledAt: new Date().toISOString(),
				}),
			});
		});

		await page.getByRole("checkbox").check();
		await page.getByRole("button", { name: "수강 신청 제출" }).click();

		// 성공 UI 노출 확인 (Funnel의 complete 스텝)
		await expect(page.getByText("수강 신청이 완료되었습니다")).toBeVisible();
		await expect(page).toHaveURL(/\/courses\/success/);
	});
});

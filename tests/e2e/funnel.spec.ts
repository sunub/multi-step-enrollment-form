import { expect, test } from "@playwright/test";

test.describe("Funnel Routing & Global State", () => {
	test.beforeEach(({ page }) => {
		page.on("console", (msg) => {
			console.log(`BROWSER CONSOLE: [${msg.type()}] ${msg.text()}`);
		});
		page.on("pageerror", (err) => {
			console.error(`BROWSER ERROR: ${err.message}\n${err.stack}`);
		});
		page.on("response", (res) => {
			if (res.status() >= 500) {
				console.error(`BROWSER 500 RESPONSE: [${res.status()}] ${res.url()}`);
			}
		});
	});

	test("비정상 접근 리다이렉트: 필수 상태(courseId) 없이 Step 2로 직접 이동 시 Step 1로 리다이렉트된다", async ({
		page,
	}) => {
		// 초기 상태(courseId 없음)에서 2단계로 강제 이동 시도
		await page.goto("/courses?step=individual-member-registration");

		// 1단계(강의 선택)로 리다이렉트되는지 확인
		await expect(page).toHaveURL(/step=course-selection/);
		await expect(
			page.getByText("강의 선택", { exact: false }).first(),
		).toBeVisible();
	});

	test("세션 데이터 유지: Step 2에서 새로고침 시 입력한 데이터와 단계가 유지된다", async ({
		page,
	}) => {
		// 1단계에서 강의 선택 후 2단계로 이동
		await page.goto(
			"/courses?category=development&page=1&step=course-selection",
		);
		await expect(page).toHaveURL(/step=course-selection/);

		// 강의 카드 로드 대기
		const firstCourse = page.locator('[data-testid^="course-card-"]').first();
		await expect(firstCourse).toBeVisible();
		await firstCourse.click();

		// 선택된 상태 확인 (radio가 checked인지)
		const radio = firstCourse.locator('input[type="radio"]');
		await expect(radio).toBeChecked();

		const nextButton = page.getByRole("button", { name: "다음 단계로 이동" });
		await expect(nextButton).toBeEnabled();

		await nextButton.click();

		// 만약 이전 테스트 데이터 때문에 알림창이 뜬다면 확인 클릭
		const dialog = page.getByRole("alertdialog");
		if (await dialog.isVisible({ timeout: 2000 }).catch(() => false)) {
			await page.getByRole("button", { name: "확인" }).click();
		}

		await expect(page).toHaveURL(/step=individual-member-registration/, {
			timeout: 10000,
		});

		// 데이터 입력
		const nameInput = page.getByRole("textbox", {
			name: "성함을 입력해주세요",
		});
		await expect(nameInput).toBeVisible();
		await nameInput.fill("홍길동");
		await nameInput.blur(); // blur를 해야 atom에 저장(sessionStorage)됨

		// 새로고침
		await page.reload();

		// 상태 유지 확인
		await expect(page).toHaveURL(/step=individual-member-registration/);
		await expect(nameInput).toHaveValue("홍길동");
	});

	test("이탈 방지 (Beforeunload): Step 2에서 데이터를 입력한 상태에서 뒤로가기 시 확인 다이얼로그가 뜬다", async ({
		page,
	}) => {
		// 1단계에서 강의 선택 후 2단계로 이동
		await page.goto(
			"/courses?category=development&page=1&step=course-selection",
		);
		await expect(page).toHaveURL(/step=course-selection/);

		await page.waitForSelector('[data-testid^="course-card-"]');
		await page.locator('[data-testid^="course-card-"]').first().click();
		await page.getByRole("button", { name: "다음 단계로 이동" }).click();

		// 데이터 입력 (Dirty 상태로 만듦)
		const nameInput = page.getByRole("textbox", {
			name: "성함을 입력해주세요",
		});
		await nameInput.fill("홍길동");
		await nameInput.blur();

		// 브라우저 뒤로가기 시도 시 다이얼로그 감지 설정
		let dialogTriggered = false;
		page.on("dialog", async (dialog) => {
			dialogTriggered = true;
			// 메시지가 비어있을 수 있으므로 다이얼로그 타입이나 발생 여부 위주로 검증
			expect(dialog.type()).toBe("confirm");
			await dialog.dismiss();
		});

		// 뒤로가기 대신 1단계 링크 클릭 등으로 이탈 시도
		const prevButton = page.getByRole("button", { name: "이전 단계로 이동" });
		await prevButton.click();

		expect(dialogTriggered).toBe(true);
	});
});

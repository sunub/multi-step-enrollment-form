import { expect, test } from "@playwright/test";

test.describe("다단계 수강 신청 폼 - 1단계 강의 선택", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/courses?category=development");
	});

	test("Test 1: 카테고리 탭 클릭 시 올바른 URL로 이동하고 해당 카테고리 강의가 표시된다", async ({
		page,
	}) => {
		const designTab = page.getByTestId("category-tab-design");
		await designTab.click();

		await expect(page).toHaveURL(/category=design/);

		await page.waitForSelector('[data-testid^="course-card-"]');
		const firstCourseTitle = page
			.locator('[data-testid^="course-title-"]')
			.first();
		await expect(firstCourseTitle).toBeVisible();
	});

	test("Test 2: 페이지네이션(이전/다음) 클릭 시 강의 목록이 변경되며 남은 강의가 로드된다", async ({
		page,
	}) => {
		await page.waitForSelector('[data-testid^="course-card-"]');
		const firstPageCourses = await page
			.locator('[data-testid^="course-card-"]')
			.count();
		expect(firstPageCourses).toBeGreaterThan(0);

		const nextButton = page.getByTestId("pagination-next");

		if (await nextButton.isEnabled()) {
			await nextButton.click();
			await expect(page).toHaveURL(/page=2/);

			await page.waitForSelector('[data-testid^="course-card-"]');
			const secondPageCourses = await page
				.locator('[data-testid^="course-card-"]')
				.count();
			expect(secondPageCourses).toBeGreaterThanOrEqual(0);
		}
	});

	test("Test 3: 개별 강의 카드에 제목, 가격, 일정, 정원 정보가 모두 누락 없이 노출된다", async ({
		page,
	}) => {
		await page.waitForSelector('[data-testid^="course-card-"]');
		const firstCourseCard = page
			.locator('[data-testid^="course-card-"]')
			.first();
		const courseIdMatch = await firstCourseCard.getAttribute("data-testid");
		const courseId = courseIdMatch?.replace("course-card-", "");

		expect(courseId).toBeTruthy();

		await expect(page.getByTestId(`course-title-${courseId}`)).toBeVisible();
		await expect(page.getByTestId(`course-price-${courseId}`)).toBeVisible();
		await expect(page.getByTestId(`course-date-${courseId}`)).toBeVisible();
		await expect(page.getByTestId(`course-capacity-${courseId}`)).toBeVisible();
	});

	test("Test 4 & 6 & 7: 수강 가능한 강의 카드 클릭 시 선택되며, 요약 섹션에 표시되고 삭제할 수 있다", async ({
		page,
	}) => {
		await page.waitForSelector('[data-testid^="course-card-"]');

		const availableCourseRadios = page.locator(
			'input[type="radio"][name="selectedCourseId"]:not([disabled])',
		);
		await expect(availableCourseRadios.first()).toBeAttached();

		const targetCourseRadio = availableCourseRadios.first();
		const courseIdMatch = await targetCourseRadio.getAttribute("data-testid");
		const courseId = courseIdMatch?.replace("course-radio-", "");

		const courseCard = page.getByTestId(`course-card-${courseId}`);
		await courseCard.click();

		await expect(page.getByTestId("summary-course-count")).toHaveText(
			"선택된 강의: 1개",
		);

		const summarySelectedCourse = page.getByTestId("summary-selected-course");
		await expect(summarySelectedCourse).toBeVisible();
		const removeButton = page.getByTestId("summary-remove-button");
		await expect(removeButton).toBeVisible();

		const totalPriceText = await page
			.getByTestId("summary-total-price")
			.textContent();
		expect(totalPriceText).not.toBe("0원");

		await removeButton.click();

		await expect(summarySelectedCourse).not.toBeVisible();
		await expect(page.getByTestId("summary-course-count")).toHaveText(
			"선택된 강의: 0개",
		);
		await expect(page.getByTestId("summary-total-price")).toHaveText("0원");
	});

	test("Test 5: 신청 마감 상태인 강의 카드는 클릭해도 선택되지 않는다", async ({
		page,
	}) => {
		await page.waitForSelector('[data-testid^="course-card-"]');

		const fullBadge = page
			.locator('[data-testid^="course-full-badge-"]')
			.first();

		if (await fullBadge.isVisible()) {
			const badgeTestId = await fullBadge.getAttribute("data-testid");
			const courseId = badgeTestId?.replace("course-full-badge-", "");

			const courseCard = page.getByTestId(`course-card-${courseId}`);
			await courseCard.click({ force: true });

			const targetCourseRadio = page.getByTestId(`course-radio-${courseId}`);
			await expect(targetCourseRadio).toBeDisabled();
			await expect(targetCourseRadio).not.toBeChecked();

			await expect(page.getByTestId("summary-course-count")).toHaveText(
				"선택된 강의: 0개",
			);
		}
	});

	test("Test 8 & 9: 신청 유형 변경 및 안내 문구 노출", async ({ page }) => {
		const personalType = page.locator('input[type="radio"][value="personal"]');
		await expect(personalType).toBeChecked();

		const groupTypeContainer = page.getByTestId("enrollment-type-group");
		await groupTypeContainer.click();

		const groupType = page.locator('input[type="radio"][value="group"]');
		await expect(groupType).toBeChecked();

		const notice = page.getByTestId("group-enrollment-notice");
		await expect(notice).toBeVisible();
		await expect(notice).toContainText("단체 신청 안내");
	});

	test("Test 10: 선택된 강의가 없을 때 다음 단계 버튼은 비활성화된다", async ({
		page,
	}) => {
		const nextStepButton = page.getByRole("button", {
			name: "다음 단계로 이동",
		});
		await expect(nextStepButton).toBeDisabled();
	});

	test("Test A: 페이지네이션 이동 시 선택 데이터 유지 및 버튼 활성화 검증", async ({
		page,
	}) => {
		await page.waitForSelector('[data-testid^="course-card-"]');

		// 1. 1페이지에서 강의 선택
		const availableCourseRadios = page.locator(
			'input[type="radio"][name="selectedCourseId"]:not([disabled])',
		);
		const targetCourseRadio = availableCourseRadios.first();
		await expect(targetCourseRadio).toBeAttached();

		const courseIdMatch = await targetCourseRadio.getAttribute("data-testid");
		const courseId = courseIdMatch?.replace("course-radio-", "");

		await page.getByTestId(`course-card-${courseId}`).click();

		// 2. 선택 직후 상태 확인 (요약 등록 및 버튼 활성화)
		await expect(page.getByTestId("summary-course-count")).toHaveText(
			"선택된 강의: 1개",
		);
		await expect(page.getByTestId("summary-selected-course")).toBeVisible();
		const nextStepButton = page.getByRole("button", {
			name: "다음 단계로 이동",
		});
		await expect(nextStepButton).toBeEnabled();

		// 3. 2페이지로 이동
		const nextButton = page.getByTestId("pagination-next");
		if (await nextButton.isEnabled()) {
			await nextButton.click();
			await expect(page).toHaveURL(/page=2/);

			// 4. 페이지 이동 후 데이터 유지 및 버튼 활성화 확인 (사용자 질문 사항)
			await expect(page.getByTestId("summary-course-count")).toHaveText(
				"선택된 강의: 1개",
			);
			await expect(page.getByTestId("summary-selected-course")).toBeVisible();
			await expect(nextStepButton).toBeEnabled();

			// 5. 다시 1페이지로 돌아왔을 때 해당 카드가 여전히 시각적으로 선택 상태인지 확인
			const prevButton = page.getByTestId("pagination-prev");
			await prevButton.click();
			await expect(page).toHaveURL(/page=1/);

			const radioAfterReturn = page.getByTestId(`course-radio-${courseId}`);
			await expect(radioAfterReturn).toBeChecked();
			await expect(nextStepButton).toBeEnabled();
		}
	});

	test("Test B: 새로고침 시 데이터(선택 강의, 단체 신청 유형)가 복구된다", async ({
		page,
	}) => {
		await page.waitForSelector('[data-testid^="course-card-"]');

		const availableCourseRadios = page.locator(
			'input[type="radio"][name="selectedCourseId"]:not([disabled])',
		);
		const targetCourseRadio = availableCourseRadios.first();
		await expect(targetCourseRadio).toBeAttached();

		const courseIdMatch = await targetCourseRadio.getAttribute("data-testid");
		const courseId = courseIdMatch?.replace("course-radio-", "");

		await page.getByTestId(`course-card-${courseId}`).click();

		const groupTypeContainer = page.getByTestId("enrollment-type-group");
		await groupTypeContainer.click();

		await expect(page.getByTestId("summary-course-count")).toHaveText(
			"선택된 강의: 1개",
		);
		const groupType = page.locator('input[type="radio"][value="group"]');
		await expect(groupType).toBeChecked();

		await page.reload();
		await page.waitForSelector('[data-testid^="course-card-"]');

		await expect(page.getByTestId("summary-course-count")).toHaveText(
			"선택된 강의: 1개",
		);
		await expect(page.getByTestId("summary-selected-course")).toBeVisible();

		const groupTypeAfterReload = page.locator(
			'input[type="radio"][value="group"]',
		);
		await expect(groupTypeAfterReload).toBeChecked();
		await expect(
			page.getByRole("button", { name: "다음 단계로 이동" }),
		).toBeEnabled();
	});
});

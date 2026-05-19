import { expect, test } from "@playwright/test";

test.describe("Step 2: 수강생 정보 입력 페이지", () => {
	test.beforeEach(async ({ page }) => {
		// 1단계에서 강의 선택 후 2단계로 이동한 상태로 시작
		await page.goto("/courses?category=development&step=course-selection");
		await expect(page).toHaveURL(/step=course-selection/);
		await page.waitForSelector('[data-testid^="course-card-"]');
		await page.locator('[data-testid^="course-card-"]').first().click();
		await page.getByRole("button", { name: "다음 단계로 이동" }).click();
		await expect(page).toHaveURL(/step=individual-member-registration/);
	});

	test("유효성 검증 및 포커스 이동: 잘못된 입력 시 에러 메시지가 표시되고 첫 번째 에러 필드로 포커스가 이동한다", async ({
		page,
	}) => {
		const emailInput = page.getByRole("textbox", {
			name: "이메일을 입력해주세요",
		});

		// 잘못된 이메일 입력
		await emailInput.fill("invalid-email");
		await page.getByRole("button", { name: "다음 단계로 이동" }).click();

		// 에러 메시지(role="alert") 확인 (Phase 1 리팩토링 결과)
		// Next.js route announcer와 겹칠 수 있으므로 필터링 사용
		const errorAlert = page
			.getByRole("alert")
			.filter({ hasText: "유효한 이메일 형식이 아닙니다" });
		await expect(errorAlert).toBeVisible();

		// aria-invalid 확인
		await expect(emailInput).toHaveAttribute("aria-invalid", "true");

		// 포커스 이동 확인 (이름이 비어있으면 이름으로 먼저 가야함)
		const nameInput = page.getByRole("textbox", {
			name: "성함을 입력해주세요",
		});
		await expect(nameInput).toBeFocused();
	});

	test("단체 신청: 인원수 경계값 유효성 검증 (2~10명)", async ({ page }) => {
		// 단체 신청으로 전환하려면 1단계로 돌아가야 함 (또는 처음부터 단체로 시작)
		await page.getByRole("button", { name: "이전 단계로 이동" }).click();
		await expect(page).toHaveURL(/step=course-selection/);

		// 단체 신청 선택 (Step 1)
		await page.getByTestId("enrollment-type-group").click();
		await page.getByRole("button", { name: "다음 단계로 이동" }).click();

		const countInput = page.getByTestId("participant-count-input");
		await expect(countInput).toBeVisible();

		// 1명 입력 시 에러
		await countInput.fill("1");
		await countInput.blur();
		await expect(
			page.getByRole("alert").filter({ hasText: /2명에서 10명 사이/ }),
		).toBeVisible();

		// 11명 입력 시 에러
		await countInput.fill("11");
		await countInput.blur();
		await expect(
			page.getByRole("alert").filter({ hasText: /2명에서 10명 사이/ }),
		).toBeVisible();
	});

	test("참가자 이메일 중복 검증: 동일한 이메일 입력 시 에러가 발생한다", async ({
		page,
	}) => {
		await page.getByRole("button", { name: "이전 단계로 이동" }).click();
		await expect(page).toHaveURL(/step=course-selection/);
		await page.getByTestId("enrollment-type-group").click();
		await page.getByRole("button", { name: "다음 단계로 이동" }).click();

		await page.getByLabel("신청 인원").fill("2");

		const email1 = page.getByRole("textbox", { name: "참가자 1 이메일" });
		const email2 = page.getByRole("textbox", { name: "참가자 2 이메일" });

		await email1.fill("duplicate@test.com");
		await email2.fill("duplicate@test.com");
		await email2.blur();

		await expect(
			page.getByRole("alert").filter({ hasText: /중복됩니다/ }),
		).toBeVisible();
	});

	test("신청 유형 전환 시 데이터 격리: 단체 신청 데이터를 채운 뒤 개인 신청으로 변경하면 데이터가 배제된다", async ({
		page,
	}) => {
		// 1. 단체 신청 데이터 입력 (Step 2까지 이동)
		await page.getByRole("button", { name: "이전 단계로 이동" }).click();
		await expect(page).toHaveURL(/step=course-selection/);
		await page.getByTestId("enrollment-type-group").click();
		await page.getByRole("button", { name: "다음 단계로 이동" }).click();

		await page.getByLabel("대표자 성함").fill("대표자");
		await page.getByLabel("대표자 이메일").fill("rep@test.com");
		await page.getByLabel("대표자 연락처").fill("01011112222");
		await page.getByLabel("대표자 성함").blur();

		// 2. 1단계로 돌아가서 개인 신청으로 다시 변경
		await page.getByRole("button", { name: "이전 단계로 이동" }).click();
		await page.getByTestId("enrollment-type-personal").click();

		// 3. AlertDialog(Confirm) 대기 및 확인
		const dialog = page.getByRole("alertdialog");
		await expect(dialog).toBeVisible();
		await page.getByRole("button", { name: "확인" }).click();

		// 4. 개인 신청 데이터 입력 및 3단계 이동
		await page.getByRole("button", { name: "다음 단계로 이동" }).click();
		await page
			.getByRole("textbox", { name: "성함을 입력해주세요" })
			.fill("개인");
		await page
			.getByRole("textbox", { name: "이메일을 입력해주세요" })
			.fill("person@test.com");
		await page
			.getByRole("textbox", { name: "연락처를 입력해주세요" })
			.fill("01099998888");
		await page.getByRole("button", { name: "다음 단계로 이동" }).click();

		// 5. 최종 제출 시 POST 페이로드 확인
		const [request] = await Promise.all([
			page.waitForRequest("**/api/enrollments"),
			page.getByRole("checkbox").check(),
			page.getByRole("button", { name: "수강 신청 제출" }).click(),
		]);

		const postData = request.postDataJSON();
		// 개인 신청이므로 group 필드는 없어야 함 (또는 null/undefined)
		expect(postData.group).toBeUndefined();
		expect(postData.applicant?.name).toBe("개인");
	});
});

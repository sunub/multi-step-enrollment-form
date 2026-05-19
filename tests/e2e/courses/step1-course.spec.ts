import { expect, test } from "@playwright/test";

test.describe("Step 1: 강의 선택 페이지", () => {
	test.beforeEach(async () => {
		// 기본적으로 모든 /api/courses 요청에 대해 정상 응답을 반환하도록 설정 (필요시 각 테스트에서 덮어씀)
		// 실제 서버(3101)로 가는 요청을 가로챔
	});

	test("로딩 상태 검증: API 응답 지연 시 로딩 인디케이터가 표시된다", async ({
		page,
	}) => {
		await page.route("**/api/courses*", async (route) => {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			await route.continue();
		});

		await page.goto("/courses?step=course-selection");

		const loader = page.getByRole("status");
		await expect(loader).toBeVisible();
		await expect(loader).toHaveAttribute("aria-busy", "true");
	});

	test("빈 상태(Empty State) 검증: 강의가 없을 때 안내 문구가 표시된다", async ({
		page,
	}) => {
		await page.route("**/api/courses*", async (route) => {
			await route.fulfill({
				contentType: "application/x-ndjson",
				body: "",
			});
		});

		await page.goto("/courses?step=course-selection");

		await expect(page.getByText("선택 가능한 강의가 없습니다")).toBeVisible();
	});

	test("정원 초과(Course Full) 강의 예외 처리: 마감된 강의는 선택할 수 없다", async ({
		page,
	}) => {
		await page.route("**/api/courses*", async (route) => {
			const fullCourse = {
				id: "full-course-1",
				title: "마감된 강의",
				category: "development",
				description: "설명",
				price: 100000,
				startDate: "2026-06-01T00:00:00Z",
				endDate: "2026-06-30T00:00:00Z",
				instructor: "강사",
				currentEnrollment: 10,
				maxCapacity: 10,
			};
			await route.fulfill({
				contentType: "application/x-ndjson",
				body: `${JSON.stringify(fullCourse)}\n`,
			});
		});

		await page.goto("/courses?step=course-selection");

		const radio = page.getByRole("radio", { name: "마감된 강의" }); // CourseCard 내부에 label이 radio를 감싸고 있음

		// aria-disabled 확인 (Phase 1에서 추가함)
		await expect(page.locator('[data-testid^="course-card-"]')).toHaveAttribute(
			"aria-disabled",
			"true",
		);
		await expect(radio).toBeDisabled();

		// 클릭 시도해도 선택되지 않음 확인
		await page.locator('[data-testid^="course-card-"]').click({ force: true });
		await expect(radio).not.toBeChecked();
		await expect(
			page.getByRole("button", { name: "다음 단계로 이동" }),
		).toBeDisabled();
	});

	test("컨텍스트 갱신 검증: 강의 변경 시 요약 정보 및 최종 제출 데이터가 갱신된다", async ({
		page,
	}) => {
		// 두 개의 강의가 있는 목록 모킹
		const courses = [
			{
				id: "course-a",
				title: "강의 A",
				category: "development",
				description: "설명 A",
				price: 10000,
				startDate: "2026-06-01T00:00:00Z",
				endDate: "2026-06-30T00:00:00Z",
				instructor: "강사 A",
				currentEnrollment: 0,
				maxCapacity: 10,
			},
			{
				id: "course-b",
				title: "강의 B",
				category: "development",
				description: "설명 B",
				price: 20000,
				startDate: "2026-06-01T00:00:00Z",
				endDate: "2026-06-30T00:00:00Z",
				instructor: "강사 B",
				currentEnrollment: 0,
				maxCapacity: 10,
			},
		];

		await page.route("**/api/courses*", async (route) => {
			await route.fulfill({
				contentType: "application/x-ndjson",
				body: `${courses.map((c) => JSON.stringify(c)).join("\n")}\n`,
			});
		});

		await page.goto("/courses?category=development&step=course-selection");
		await expect(page).toHaveURL(/step=course-selection/);

		// 1. 강의 A 선택
		await page.getByText("강의 A").click();
		await expect(page.getByTestId("summary-total-price")).toHaveText(
			"10,000원",
		);

		// 2. 2단계 이동 후 뒤로가기
		await page.getByRole("button", { name: "다음 단계로 이동" }).click();
		await expect(page).toHaveURL(/step=individual-member-registration/);
		await page.getByRole("button", { name: "이전 단계로 이동" }).click();

		// 3. 강의 B로 변경
		await page.getByText("강의 B").click();
		await expect(page.getByTestId("summary-total-price")).toHaveText(
			"20,000원",
		);

		// 4. 3단계까지 진행 후 제출 시 데이터 확인
		await page.getByRole("button", { name: "다음 단계로 이동" }).click();
		// Step 2 입력
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

		// Step 3 제출 대기
		const [request] = await Promise.all([
			page.waitForRequest("**/api/enrollments"),
			page.getByRole("checkbox").check(),
			page.getByRole("button", { name: "수강 신청 제출" }).click(),
		]);

		const postData = request.postDataJSON();
		expect(postData.courseId).toBe("course-b");
	});
});

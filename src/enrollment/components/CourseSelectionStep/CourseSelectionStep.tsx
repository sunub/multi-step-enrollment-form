"use client";

import {
	Box,
	Button,
	ButtonGroup,
	Flex,
	Grid,
	Surface,
	Text,
	vars,
} from "@shared/design-system";
import type { CourseCategoryType, CourseType } from "@shared/types";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { type SubmitHandler, useController, useForm } from "react-hook-form";
import { COURSE_CATEGORIES } from "../../../constants";
import { getPaginatedCoursesQueryOptions } from "../../../quries/courses/coursesQueryKey";
import { enrollmentFormAtom, type SelectedCourseSnapshot } from "../../atoms";

interface CourseSelectionStepProps {
	onNext: () => void;
}

export interface CourseSelectionForm {
	selectedCourseId: string;
	enrollmentType: "personal" | "group";
}

const categoryColorMap: Record<CourseCategoryType, keyof typeof vars.color> = {
	development: "primary",
	design: "secondary",
	marketing: "tertiary",
	business: "surfaceTint",
};

function createSelectedCourseSnapshot(
	course: CourseType,
): SelectedCourseSnapshot {
	return {
		id: course.id,
		title: course.title,
		price: course.price,
		startDate: course.startDate,
		category: course.category,
	};
}

function isSameSelectedCourseSnapshot(
	left: SelectedCourseSnapshot | null,
	right: SelectedCourseSnapshot | null,
) {
	if (left === right) {
		return true;
	}

	if (!left || !right) {
		return false;
	}

	return (
		left.id === right.id &&
		left.title === right.title &&
		left.price === right.price &&
		left.startDate === right.startDate &&
		left.category === right.category
	);
}

export function CourseSelectionStep({ onNext }: CourseSelectionStepProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pageParam = searchParams.get("page");
	const page = Number(pageParam) || 1;
	const currentCategory =
		(searchParams.get("category") as CourseCategoryType) || "development";

	const [formAtom, setFormAtom] = useAtom(enrollmentFormAtom);

	const {
		data: paginationData,
		isPending,
		isError,
	} = useQuery(getPaginatedCoursesQueryOptions(currentCategory, page));

	const {
		items: courses = [],
		totalPages = 1,
		hasNextPage = false,
		hasPrevPage = false,
	} = paginationData || {};

	const [isInitialized, setIsInitialized] = useState(false);

	const { control, handleSubmit, reset } = useForm<CourseSelectionForm>({
		defaultValues: {
			selectedCourseId: "",
			enrollmentType: "personal",
		},
	});

	useEffect(() => {
		reset({
			selectedCourseId: formAtom.courseId,
			enrollmentType: formAtom.type,
		});
		setIsInitialized(true);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [reset, formAtom.type, formAtom.courseId]);

	const { field: selectedCourseField } = useController({
		name: "selectedCourseId",
		control,
	});

	const { field: enrollmentTypeField } = useController({
		name: "enrollmentType",
		control,
	});

	const selectedCourseId = selectedCourseField.value;
	const enrollmentType = enrollmentTypeField.value;

	const selectedCourseFromCurrentPage = useMemo(() => {
		return (
			courses.find((course: CourseType) => course.id === selectedCourseId) ??
			null
		);
	}, [courses, selectedCourseId]);

	const selectedCourseSnapshot = useMemo(() => {
		return selectedCourseFromCurrentPage
			? createSelectedCourseSnapshot(selectedCourseFromCurrentPage)
			: null;
	}, [selectedCourseFromCurrentPage]);

	useEffect(() => {
		if (!isInitialized) return;

		setFormAtom((prev) => {
			const nextSelectedCourse = (() => {
				if (!selectedCourseId) {
					return null;
				}

				if (selectedCourseSnapshot) {
					return selectedCourseSnapshot;
				}

				return prev.selectedCourse?.id === selectedCourseId
					? prev.selectedCourse
					: null;
			})();

			if (
				prev.courseId === selectedCourseId &&
				prev.type === enrollmentType &&
				isSameSelectedCourseSnapshot(prev.selectedCourse, nextSelectedCourse)
			) {
				return prev;
			}

			return {
				...prev,
				courseId: selectedCourseId,
				selectedCourse: nextSelectedCourse,
				type: enrollmentType,
			};
		});
	}, [
		enrollmentType,
		selectedCourseId,
		selectedCourseSnapshot,
		setFormAtom,
		isInitialized,
	]);

	const selectedCourse = useMemo(() => {
		if (selectedCourseFromCurrentPage) {
			return selectedCourseFromCurrentPage;
		}

		return formAtom.selectedCourse?.id === selectedCourseId
			? formAtom.selectedCourse
			: null;
	}, [
		formAtom.selectedCourse,
		selectedCourseFromCurrentPage,
		selectedCourseId,
	]);

	const totalPrice = selectedCourse?.price || 0;

	const onSubmit: SubmitHandler<CourseSelectionForm> = (data) => {
		if (!data.selectedCourseId) {
			alert("강의를 선택해야 합니다.");
			return;
		}

		setFormAtom((prev) => ({
			...prev,
			courseId: data.selectedCourseId,
			selectedCourse:
				selectedCourseSnapshot &&
				selectedCourseSnapshot.id === data.selectedCourseId
					? selectedCourseSnapshot
					: prev.selectedCourse,
			type: data.enrollmentType,
		}));

		onNext();
	};

	const isNextDisabled = !selectedCourseId;

	const handlePageChange = (newPage: number) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("page", newPage.toString());
		router.push(`?${params.toString()}`);
	};

	const handleCategoryChange = (cat: CourseCategoryType) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("category", cat);
		params.set("page", "1"); // Reset page on category change
		router.push(`?${params.toString()}`);
	};

	return (
		<Box
			as="form"
			onSubmit={handleSubmit(onSubmit)}
			padding={4}
			display="flex"
			flexDirection="column"
			gap={6}
		>
			<Box>
				<Text variant="headlineMd" marginBottom={4}>
					강의 선택
				</Text>

				<ButtonGroup orientation="horizontal" marginBottom={4}>
					{COURSE_CATEGORIES.map((cat) => (
						<Button
							key={cat}
							variant={currentCategory === cat ? "primary" : "outline"}
							onClick={() => handleCategoryChange(cat)}
							style={{ flex: 1 }}
							data-testid={`category-tab-${cat}`}
							type="button"
						>
							{cat.charAt(0).toUpperCase() + cat.slice(1)}
						</Button>
					))}
				</ButtonGroup>
			</Box>

			{isPending ? (
				<Flex justifyContent="center" alignItems="center" py={10}>
					<Text variant="bodyMd">강의 목록을 불러오는 중...</Text>
				</Flex>
			) : isError ? (
				<Flex justifyContent="center" alignItems="center" py={10}>
					<Text variant="bodyMd" color="error">
						강의 목록을 불러오는데 실패했습니다.
					</Text>
				</Flex>
			) : (
				<Grid
					gap={4}
					style={{
						gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
					}}
				>
					{courses.map((course: CourseType) => {
						const isSelected = selectedCourseId === course.id;
						const isFull = course.currentEnrollment >= course.maxCapacity;
						const categoryColor =
							categoryColorMap[course.category] || "primary";

						return (
							<Surface
								key={course.id}
								as="label"
								tone={isSelected ? "primaryContainer" : "surface"}
								elevation={isSelected ? "medium" : "low"}
								padding={4}
								cursor={isFull ? "not-allowed" : "pointer"}
								opacity={isFull ? 0.5 : 1}
								data-testid={`course-card-${course.id}`}
								style={{
									display: "block",
									transition: "all 0.2s",
									borderLeft: `4px solid ${vars.color[categoryColor]}`,
								}}
							>
								<input
									type="radio"
									name={selectedCourseField.name}
									style={{ display: "none" }}
									disabled={isFull}
									checked={isSelected}
									onChange={() => selectedCourseField.onChange(course.id)}
									data-testid={`course-radio-${course.id}`}
								/>
								<Flex direction="column" gap={3}>
									<Flex justifyContent="space-between" alignItems="center">
										<Surface
											tone="background"
											padding={1}
											px={2}
											borderRadius="full"
										>
											<Text variant="labelSm" color={categoryColor}>
												{course.category.toUpperCase()}
											</Text>
										</Surface>
										{isFull && (
											<Text
												variant="labelSm"
												color="error"
												fontWeight="bold"
												data-testid={`course-full-badge-${course.id}`}
											>
												신청 마감
											</Text>
										)}
									</Flex>

									<Box>
										<Text
											variant="headlineMd"
											data-testid={`course-title-${course.id}`}
										>
											{course.title}
										</Text>
										<Text
											variant="bodySm"
											color="onSurfaceVariant"
											marginTop={1}
										>
											{course.description}
										</Text>
									</Box>

									<Flex direction="column" gap={1}>
										<Text
											variant="labelMd"
											data-testid={`course-date-${course.id}`}
										>
											일정: {new Date(course.startDate).toLocaleDateString()}
										</Text>
										<Text
											variant="labelMd"
											data-testid={`course-price-${course.id}`}
										>
											가격: {course.price.toLocaleString()}원
										</Text>
									</Flex>

									<Surface tone="surface" padding={2} borderRadius="sm">
										<Flex justifyContent="space-between" alignItems="center">
											<Text variant="labelSm">수강 정원</Text>
											<Text
												variant="labelSm"
												fontWeight="bold"
												data-testid={`course-capacity-${course.id}`}
											>
												{course.currentEnrollment} / {course.maxCapacity} 명
											</Text>
										</Flex>
									</Surface>
								</Flex>
							</Surface>
						);
					})}
				</Grid>
			)}

			{!isPending && !isError && (
				<Flex justifyContent="center" alignItems="center" gap={4} py={4}>
					<Button
						type="button"
						variant="outline"
						disabled={!hasPrevPage}
						onClick={() => handlePageChange(page - 1)}
						data-testid="pagination-prev"
					>
						이전
					</Button>
					<Text variant="labelMd">
						{page} / {totalPages} 페이지
					</Text>
					<Button
						type="button"
						variant="outline"
						disabled={!hasNextPage}
						onClick={() => handlePageChange(page + 1)}
						data-testid="pagination-next"
					>
						다음
					</Button>
				</Flex>
			)}

			<Surface
				marginTop={4}
				padding={6}
				tone="surface"
				borderRadius="lg"
				elevation="medium"
				style={{
					position: "relative",
					bottom: vars.space[4],
					zIndex: vars.zIndex.sticky,
				}}
			>
				<Flex direction="column" gap={6}>
					<Flex justifyContent="space-between" alignItems="flex-end">
						<Box>
							<Text variant="headlineMd" marginBottom={2}>
								신청 내역 요약
							</Text>
							<Text variant="bodyMd" data-testid="summary-course-count">
								선택된 강의: {selectedCourseId ? "1개" : "0개"}
							</Text>
						</Box>
						<Box textAlign="right">
							<Text variant="labelMd" color="onSurfaceVariant">
								결제 금액
							</Text>
							<Text
								variant="headlineLg"
								color="primary"
								data-testid="summary-total-price"
							>
								{totalPrice.toLocaleString()}원
							</Text>
						</Box>
					</Flex>

					<Flex gap={4} alignItems="center">
						<Text variant="labelMd">신청 유형:</Text>
						<Flex gap={2}>
							{(["personal", "group"] as const).map((type) => (
								<Surface
									key={type}
									as="label"
									tone={
										enrollmentTypeField.value === type
											? "primaryContainer"
											: "background"
									}
									padding={2}
									px={4}
									borderRadius="full"
									cursor="pointer"
									data-testid={`enrollment-type-${type}`}
									style={{
										border:
											enrollmentTypeField.value === type
												? `1px solid ${vars.color.primary}`
												: `1px solid ${vars.color.outlineVariant}`,
									}}
								>
									<input
										type="radio"
										name={enrollmentTypeField.name}
										value={type}
										checked={enrollmentTypeField.value === type}
										onChange={() => enrollmentTypeField.onChange(type)}
										style={{ display: "none" }}
									/>
									<Text variant="labelMd">
										{type === "personal" ? "개인" : "단체"}
									</Text>
								</Surface>
							))}
						</Flex>
					</Flex>

					{enrollmentType === "group" && (
						<Surface
							tone="errorContainer"
							padding={3}
							borderRadius="md"
							data-testid="group-enrollment-notice"
						>
							<Text variant="bodySm" color="onErrorContainer">
								📢 단체 신청 안내: 단체명, 최소 2인 이상, 담당자 정보가
								필요합니다.
							</Text>
						</Surface>
					)}

					<Box
						py={2}
						style={{
							borderTop: `1px solid ${vars.color.outlineVariant}`,
							borderBottom: `1px solid ${vars.color.outlineVariant}`,
						}}
					>
						{selectedCourse ? (
							<Surface
								tone="background"
								padding={3}
								borderRadius="md"
								elevation="low"
								data-testid="summary-selected-course"
								style={{
									borderLeft: `4px solid ${
										vars.color[
											categoryColorMap[selectedCourse.category] || "primary"
										]
									}`,
								}}
							>
								<Flex direction="column" gap={2}>
									<Flex justifyContent="space-between" alignItems="flex-start">
										<Text variant="labelSm" fontWeight="bold">
											{selectedCourse.title}
										</Text>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											onClick={() => selectedCourseField.onChange("")}
											data-testid="summary-remove-button"
											style={{ padding: 0, minWidth: "auto", height: "auto" }}
										>
											✕
										</Button>
									</Flex>
									<Text variant="labelSm" color="onSurfaceVariant">
										{new Date(selectedCourse.startDate).toLocaleDateString()}
									</Text>
								</Flex>
							</Surface>
						) : (
							<Box py={4}>
								<Text variant="bodySm" color="onSurfaceVariant">
									아직 선택된 강의가 없습니다. 강의를 선택해 주세요.
								</Text>
							</Box>
						)}
					</Box>

					<Button
						type="submit"
						size="lg"
						disabled={isNextDisabled}
						data-testid="next-step-button"
						style={{ width: "100%" }}
					>
						수강생 정보 입력으로 이동
					</Button>
				</Flex>
			</Surface>
		</Box>
	);
}

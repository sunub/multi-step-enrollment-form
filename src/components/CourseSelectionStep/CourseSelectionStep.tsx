"use client";

import { Box, Flex, Grid, Text } from "@shared/design-system";
import type { CourseCategoryType, CourseType } from "@shared/types";
import { useQuery } from "@tanstack/react-query";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { type SubmitHandler, useController, useForm } from "react-hook-form";
import {
	clearIncompatibleRegistrationDataAtom,
	createSelectedCourseSnapshot,
	enrollmentFormAtom,
	groupRegistrationAtom,
	individualRegistrationAtom,
} from "@/src/enrollment";
import { getPaginatedCoursesQueryOptions } from "@/src/queries/courses/coursesQueryKey";
import { useMounted } from "../../hooks/useMounted";
import {
	CategoryTabs,
	CourseCard,
	PaginationControl,
	SelectionSummary,
} from "./components";
import { ParticipantTypeSelection } from "./components/ParticipanTypeSelection";
import { PriceSummaryContent } from "./components/PriceSummaryContent";
import { WarningAlertDialog } from "./components/WarningAlertDialog";

export type EnrollmentType = "personal" | "group";

interface CourseSelectionStepProps {
	onNext: () => void;
}

export interface CourseSelectionForm {
	selectedCourseId: string;
	enrollmentType: "personal" | "group";
}

export function CourseSelectionStep({ onNext }: CourseSelectionStepProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const page = Number(searchParams.get("page")) || 1;
	const currentCategory =
		(searchParams.get("category") as CourseCategoryType) || "development";

	const [formAtom, setFormAtom] = useAtom(enrollmentFormAtom);
	const lastSyncedRef = useRef({
		courseId: formAtom.courseId,
		type: formAtom.type,
	});

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

	const { reset, control, handleSubmit } = useForm<CourseSelectionForm>({
		defaultValues: {
			selectedCourseId: formAtom.courseId,
			enrollmentType: formAtom.type,
		},
	});

	const lastSyncedRef = useRef({
		courseId: formAtom.courseId,
		type: formAtom.type,
	});

	useEffect(() => {
		if (
			lastSyncedRef.current.courseId === formAtom.courseId &&
			lastSyncedRef.current.type === formAtom.type
		) {
			return;
		}

		reset({
			selectedCourseId: formAtom.courseId,
			enrollmentType: formAtom.type,
		});

		lastSyncedRef.current = {
			courseId: formAtom.courseId,
			type: formAtom.type,
		};
	}, [formAtom.courseId, formAtom.type, reset]);

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

	const selectedCourse = useMemo(() => {
		if (selectedCourseFromCurrentPage) return selectedCourseFromCurrentPage;
		return formAtom.selectedCourse?.id === selectedCourseId
			? formAtom.selectedCourse
			: null;
	}, [
		formAtom.selectedCourse,
		selectedCourseFromCurrentPage,
		selectedCourseId,
	]);

	const totalPrice = selectedCourse?.price || 0;

	const handleSelectCourse = useCallback(
		(courseId: string) => {
			selectedCourseField.onChange(courseId);
			const targetCourse = courses.find((c) => c.id === courseId);
			setFormAtom((prev) => ({
				...prev,
				courseId,
				selectedCourse: targetCourse
					? createSelectedCourseSnapshot(targetCourse)
					: null,
			}));
		},
		[courses, selectedCourseField, setFormAtom],
	);

	const handleRemoveCourse = useCallback(() => {
		selectedCourseField.onChange("");
		setFormAtom((prev) => ({
			...prev,
			courseId: "",
			selectedCourse: null,
		}));
	}, [selectedCourseField, setFormAtom]);

	const mounted = useMounted();
	const individualData = useAtomValue(individualRegistrationAtom);
	const groupAtom = useAtomValue(groupRegistrationAtom);
	const clearIncompatibleData = useSetAtom(
		clearIncompatibleRegistrationDataAtom,
	);

	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [pendingType, setPendingType] = useState<"personal" | "group" | null>(
		null,
	);

	const isHasIndividualData = useMemo(
		() =>
			!!individualData.name ||
			!!individualData.email ||
			!!individualData.phone ||
			!!individualData.motivation,
		[individualData],
	);

	const isHasGroupData = useMemo(
		() =>
			!!groupAtom.groupInfo.groupName ||
			!!groupAtom.groupInfo.managerName ||
			groupAtom.groupInfo.participantCount > 2 ||
			!!groupAtom.representative.name,
		[groupAtom],
	);

	const wouldLoseData = useCallback(
		(targetType: "personal" | "group") =>
			(targetType === "personal" && isHasGroupData) ||
			(targetType === "group" && isHasIndividualData),
		[isHasGroupData, isHasIndividualData],
	);

	const handleEnrollmentTypeChange = useCallback(
		(type: "personal" | "group") => {
			if (wouldLoseData(type)) {
				setPendingType(type);
				setIsDialogOpen(true);
			} else {
				enrollmentTypeField.onChange(type);
				setFormAtom((prev) => ({
					...prev,
					type,
				}));
			}
		},
		[wouldLoseData, enrollmentTypeField, setFormAtom],
	);

	const handleConfirmReset = useCallback(() => {
		if (!pendingType) return;
		clearIncompatibleData(pendingType);

		enrollmentTypeField.onChange(pendingType);
		setFormAtom((prev) => ({
			...prev,
			type: pendingType,
		}));

		setIsDialogOpen(false);
		setPendingType(null);
	}, [pendingType, clearIncompatibleData, enrollmentTypeField, setFormAtom]);

	const onSubmit: SubmitHandler<CourseSelectionForm> = (data) => {
		if (!data.selectedCourseId) {
			alert("강의를 선택해야 합니다.");
			return;
		}
		onNext();
	};

	const handlePageChange = (newPage: number) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("page", newPage.toString());
		router.push(`?${params.toString()}`);
	};

	const handleCategoryChange = (cat: CourseCategoryType) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("category", cat);
		params.set("page", "1");
		router.push(`?${params.toString()}`);
	};

	useEffect(() => {
		if (
			lastSyncedRef.current.courseId === formAtom.courseId &&
			lastSyncedRef.current.type === formAtom.type
		) {
			return;
		}
		reset({
			selectedCourseId: formAtom.courseId,
			enrollmentType: formAtom.type,
		});
		lastSyncedRef.current = {
			courseId: formAtom.courseId,
			type: formAtom.type,
		};
	}, [formAtom.courseId, formAtom.type, reset]);

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
				<CategoryTabs
					currentCategory={currentCategory}
					onCategoryChange={handleCategoryChange}
				/>
			</Box>

			{isPending ? (
				<Flex
					justifyContent="center"
					alignItems="center"
					py={10}
					role="status"
					aria-busy="true"
				>
					<Text variant="bodyMd">강의 목록을 불러오는 중...</Text>
				</Flex>
			) : isError ? (
				<Flex justifyContent="center" alignItems="center" py={10} role="alert">
					<Text variant="bodyMd" color="error">
						강의 목록을 불러오는데 실패했습니다.
					</Text>
				</Flex>
			) : courses.length === 0 ? (
				<Flex justifyContent="center" alignItems="center" py={10}>
					<Text variant="bodyMd" color="onSurfaceVariant">
						선택 가능한 강의가 없습니다.
					</Text>
				</Flex>
			) : (
				<Grid
					gap={4}
					style={{
						gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
					}}
				>
					{courses.map((course: CourseType) => (
						<CourseCard
							key={course.id}
							course={course}
							isSelected={selectedCourseId === course.id}
							onSelect={handleSelectCourse}
						/>
					))}
				</Grid>
			)}

			{!isPending && !isError && (
				<PaginationControl
					currentPage={page}
					totalPages={totalPages}
					hasPrevPage={hasPrevPage}
					hasNextPage={hasNextPage}
					onPageChange={handlePageChange}
				/>
			)}

			<SelectionSummary isNextDisabled={!selectedCourseId}>
				<PriceSummaryContent
					totalPrice={totalPrice}
					selectedCourseId={selectedCourseId}
					mounted={mounted}
				/>
				<ParticipantTypeSelection
					enrollmentType={enrollmentType}
					selectedCourse={selectedCourse}
					handleTypeChange={handleEnrollmentTypeChange}
					onRemoveCourse={handleRemoveCourse}
				/>
			</SelectionSummary>
			<WarningAlertDialog
				isDialogOpen={isDialogOpen}
				setIsDialogOpen={setIsDialogOpen}
				handleConfirmReset={handleConfirmReset}
			/>
		</Box>
	);
}

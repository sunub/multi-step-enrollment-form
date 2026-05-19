"use client";

import { Box, Flex, Grid, Text } from "@shared/design-system";
import type { CourseCategoryType, CourseType } from "@shared/types";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { type SubmitHandler, useController, useForm } from "react-hook-form";
import {
  createSelectedCourseSnapshot,
  enrollmentFormAtom,
  isSameSelectedCourseSnapshot,
} from "@/src/enrollment";
import { getPaginatedCoursesQueryOptions } from "@/src/queries/courses/coursesQueryKey";
import { CategoryTabs } from "./sub-components/CategoryTabs";
import { CourseCard } from "./sub-components/CourseCard";
import { PaginationControl } from "./sub-components/PaginationControl";
import { SelectionSummary } from "./sub-components/SelectionSummary";

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
  const hasInitializedSyncRef = useRef(false);
  const isSyncingFromAtomRef = useRef(false);

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

  const {
    control,
    formState: { isDirty },
    getValues,
    handleSubmit,
    reset,
  } = useForm<CourseSelectionForm>({
    defaultValues: {
      selectedCourseId: formAtom.courseId,
      enrollmentType: formAtom.type,
    },
  });

  useEffect(() => {
    const nextValues: CourseSelectionForm = {
      selectedCourseId: formAtom.courseId,
      enrollmentType: formAtom.type,
    };
    const currentValues = getValues();
    const isSameFormState =
      currentValues.selectedCourseId === nextValues.selectedCourseId &&
      currentValues.enrollmentType === nextValues.enrollmentType;

    hasInitializedSyncRef.current = true;

    if (isSameFormState) {
      isSyncingFromAtomRef.current = false;
      return;
    }

    isSyncingFromAtomRef.current = true;
    reset(nextValues);
  }, [getValues, reset, formAtom.courseId, formAtom.type]);

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
    if (!hasInitializedSyncRef.current) return;
    if (isSyncingFromAtomRef.current) {
      isSyncingFromAtomRef.current = false;
      return;
    }
    if (!isDirty) return;

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
    isDirty,
    selectedCourseId,
    selectedCourseSnapshot,
    setFormAtom,
  ]);

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
              onSelect={selectedCourseField.onChange}
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

      <SelectionSummary
        selectedCourseId={selectedCourseId}
        selectedCourse={selectedCourse}
        totalPrice={totalPrice}
        enrollmentType={enrollmentType}
        onEnrollmentTypeChange={enrollmentTypeField.onChange}
        onRemoveCourse={() => selectedCourseField.onChange("")}
        isNextDisabled={!selectedCourseId}
      />
    </Box>
  );
}

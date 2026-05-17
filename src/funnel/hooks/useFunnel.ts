"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import type { FunnelResult, StepConfig } from "../types";

/**
 * 다단계 폼(Funnel)의 라우팅과 진행 상태를 관리하는 커스텀 훅입니다.
 * 폼 데이터의 상태와 독립적으로 동작하며, URL의 'step' 파라미터를 통해 상태를 동기화합니다.
 *
 * @template T - 폼 데이터의 타입
 * @param steps - 전체 스텝 설정 배열
 * @param formData - 현재 폼 데이터 (shouldRender 계산에 사용)
 */
export function useFunnel<T>(
	steps: StepConfig<T>[],
	formData: T,
): FunnelResult<T> {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	// 1. 현재 데이터(formData)를 기반으로 실제 유효한 스텝들만 필터링
	const activeSteps = useMemo(() => {
		return steps.filter(
			(step) => !step.shouldRender || step.shouldRender(formData),
		);
	}, [steps, formData]);

	// 2. URL에서 현재 스텝 ID 추출 (없으면 첫 번째 활성 스텝 사용)
	const stepParam = searchParams.get("step");
	const currentStepId = stepParam || activeSteps[0]?.id || "";

	// 3. 현재 스텝의 인덱스 계산
	const currentIndex = useMemo(() => {
		return activeSteps.findIndex((s) => s.id === currentStepId);
	}, [activeSteps, currentStepId]);

	/**
	 * 🚨 Robustness Check:
	 * 만약 데이터 변경으로 인해 현재 스텝이 비활성화(shouldRender: false)되었거나
	 * 잘못된 step ID로 접근했다면, 자동으로 첫 번째 활성 스텝으로 복귀시킵니다.
	 */
	useEffect(() => {
		if (currentIndex === -1 && activeSteps.length > 0) {
			const firstStepId = activeSteps[0].id;
			const params = new URLSearchParams(searchParams.toString());
			params.set("step", firstStepId);
			router.replace(`${pathname}?${params.toString()}`);
		}
	}, [currentIndex, activeSteps, pathname, router, searchParams]);

	// 4. 진행률 계산 (currentIndex 기반)
	const progress = useMemo(() => {
		if (activeSteps.length === 0) return 0;
		return Math.floor(((currentIndex + 1) / activeSteps.length) * 100);
	}, [currentIndex, activeSteps.length]);

	// 5. 네비게이션 함수들
	const navigateTo = useCallback(
		(stepId: string) => {
			const params = new URLSearchParams(searchParams.toString());
			params.set("step", stepId);
			router.push(`${pathname}?${params.toString()}`);
		},
		[pathname, router, searchParams],
	);

	const next = useCallback(() => {
		if (currentIndex < activeSteps.length - 1) {
			navigateTo(activeSteps[currentIndex + 1].id);
		}
	}, [currentIndex, activeSteps, navigateTo]);

	const prev = useCallback(() => {
		if (currentIndex > 0) {
			navigateTo(activeSteps[currentIndex - 1].id);
		}
	}, [currentIndex, activeSteps, navigateTo]);

	return {
		currentStepId,
		activeSteps,
		currentIndex,
		progress,
		next,
		prev,
		navigateTo,
		isFirst: currentIndex === 0,
		isLast: currentIndex === activeSteps.length - 1 && activeSteps.length > 0,
	};
}

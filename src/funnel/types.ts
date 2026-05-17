export interface StepConfig<T> {
	/** 스텝의 고유 식별자 (URL query string으로 사용됨) */
	id: string;
	/** 현재 폼 데이터(T)를 기반으로 이 스텝을 렌더링할지 결정하는 술어 함수 */
	shouldRender?: (data: T) => boolean;
}

export interface FunnelResult<T> {
	currentStepId: string;
	activeSteps: StepConfig<T>[];
	currentIndex: number;
	/** 0 ~ 100 사이의 진행률 */
	progress: number;
	isFirst: boolean;
	isLast: boolean;
	next: () => void;
	prev: () => void;
	navigateTo: (stepId: string) => void;
}

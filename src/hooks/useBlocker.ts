"use client";

import {
	type ReadonlyURLSearchParams,
	usePathname,
	useSearchParams,
} from "next/navigation";
import { useEffect, useRef } from "react";

const DEFAULT_MESSAGE =
	"저장되지 않은 유효한 변경 사항이 있습니다. 정말 떠나시겠습니까?";
const BLOCKER_STATE_KEY = "__navigationBlocker";

interface UseBlockerOptions {
	shouldBlock: boolean;
	message?: string;
	onBlock?: () => void;
}

function buildFullPath(
	pathname: string | null,
	searchParams: ReadonlyURLSearchParams | null,
) {
	const resolvedPathname = pathname ?? window.location.pathname;
	const query = searchParams?.toString() ?? window.location.search.slice(1);

	return query ? `${resolvedPathname}?${query}` : resolvedPathname;
}

function createBlockedState(state: unknown) {
	if (state && typeof state === "object") {
		return {
			...state,
			[BLOCKER_STATE_KEY]: true,
		};
	}

	return {
		[BLOCKER_STATE_KEY]: true,
	};
}

function hasBlockedState(state: unknown) {
	if (typeof state !== "object" || state === null) {
		return false;
	}

	const candidate = state as Record<string, unknown>;
	return (
		BLOCKER_STATE_KEY in candidate && Boolean(candidate[BLOCKER_STATE_KEY])
	);
}

export function useBlocker({
	shouldBlock,
	message = DEFAULT_MESSAGE,
	onBlock,
}: UseBlockerOptions) {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const isBypassingRef = useRef(false);
	const hasPushedStateRef = useRef(false);
	const shouldBlockRef = useRef(shouldBlock);
	const messageRef = useRef(message);
	const fullPathRef = useRef(buildFullPath(pathname, searchParams));
	const onBlockRef = useRef(onBlock);

	useEffect(() => {
		shouldBlockRef.current = shouldBlock;
	}, [shouldBlock]);

	useEffect(() => {
		onBlockRef.current = onBlock;
	}, [onBlock]);

	useEffect(() => {
		messageRef.current = message;
	}, [message]);

	useEffect(() => {
		fullPathRef.current = buildFullPath(pathname, searchParams);
	}, [pathname, searchParams]);

	useEffect(() => {
		if (!shouldBlock || hasPushedStateRef.current) {
			return;
		}

		if (hasBlockedState(window.history.state)) {
			hasPushedStateRef.current = true;
			return;
		}

		window.history.pushState(
			createBlockedState(window.history.state),
			"",
			buildFullPath(pathname, searchParams),
		);
		hasPushedStateRef.current = true;
	}, [pathname, searchParams, shouldBlock]);

	useEffect(() => {
		const handleBeforeUnload = (event: BeforeUnloadEvent) => {
			if (isBypassingRef.current || !shouldBlockRef.current) {
				return;
			}
			event.preventDefault();
		};

		const handlePopState = () => {
			if (isBypassingRef.current) {
				isBypassingRef.current = false;
				return;
			}

			if (!hasPushedStateRef.current) {
				return;
			}

			if (!shouldBlockRef.current) {
				isBypassingRef.current = true;
				hasPushedStateRef.current = false;
				window.history.back();
				return;
			}

			if (window.confirm(messageRef.current)) {
				onBlockRef.current?.();
				isBypassingRef.current = true;
				hasPushedStateRef.current = false;
				window.history.back();
				return;
			}

			window.history.pushState(
				createBlockedState(window.history.state),
				"",
				fullPathRef.current,
			);
			hasPushedStateRef.current = true;
		};

		window.addEventListener("beforeunload", handleBeforeUnload);
		window.addEventListener("popstate", handlePopState);

		return () => {
			isBypassingRef.current = false;
			hasPushedStateRef.current = false;
			window.removeEventListener("beforeunload", handleBeforeUnload);
			window.removeEventListener("popstate", handlePopState);
		};
	}, []);
}

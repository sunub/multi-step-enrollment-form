import { useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { groupRegistrationAtom } from "../../../enrollment/atoms";
import {
	type GroupApplicationData,
	isSameGroupApplicationData,
	normalizeGroupApplicationData,
} from "../types";

export function usePersistGroupRegistrationSnapshot() {
	const { getValues } = useFormContext<GroupApplicationData>();
	const liveAtomState = useAtomValue(groupRegistrationAtom);
	const setLiveAtomState = useSetAtom(groupRegistrationAtom);

	return useCallback(() => {
		const nextSnapshot = normalizeGroupApplicationData(getValues());
		if (isSameGroupApplicationData(liveAtomState, nextSnapshot)) {
			return;
		}

		setLiveAtomState(nextSnapshot);
	}, [getValues, liveAtomState, setLiveAtomState]);
}

import { useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { individualRegistrationAtom } from "../../../enrollment/atoms";
import {
	type IndividualApplicationData,
	isSameIndividualApplicationData,
	normalizeIndividualApplicationData,
} from "../types";

export function usePersistIndividualRegistrationSnapshot() {
	const { getValues } = useFormContext<IndividualApplicationData>();
	const liveAtomState = useAtomValue(individualRegistrationAtom);
	const setLiveAtomState = useSetAtom(individualRegistrationAtom);

	return useCallback(() => {
		const nextSnapshot = normalizeIndividualApplicationData(getValues());
		if (isSameIndividualApplicationData(liveAtomState, nextSnapshot)) {
			return;
		}

		setLiveAtomState(nextSnapshot);
	}, [getValues, liveAtomState, setLiveAtomState]);
}

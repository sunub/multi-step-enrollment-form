import { useSetAtom } from "jotai";
import { useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { individualRegistrationAtom } from "../../../enrollment/atoms";
import type { IndividualApplicationData } from "../types";

export function usePersistIndividualRegistrationSnapshot() {
	const { getValues } = useFormContext<IndividualApplicationData>();
	const setLiveAtomState = useSetAtom(individualRegistrationAtom);

	return useCallback(() => {
		setLiveAtomState(getValues());
	}, [getValues, setLiveAtomState]);
}

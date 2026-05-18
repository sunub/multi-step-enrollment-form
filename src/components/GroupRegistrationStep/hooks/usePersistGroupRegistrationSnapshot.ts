import { useSetAtom } from "jotai";
import { useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { groupRegistrationAtom } from "../../../enrollment/atoms";
import type { GroupApplicationData } from "../types";

export function usePersistGroupRegistrationSnapshot() {
	const { getValues } = useFormContext<GroupApplicationData>();
	const setLiveAtomState = useSetAtom(groupRegistrationAtom);

	return useCallback(() => {
		setLiveAtomState(getValues());
	}, [getValues, setLiveAtomState]);
}

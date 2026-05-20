import { Text } from "@shared/design-system";
import { memo } from "react";
import { useController, useFormContext, useWatch } from "react-hook-form";
import { usePersistIndividualRegistrationSnapshot } from "../hooks/usePersistIndividualRegistrationSnapshot";
import type { IndividualApplicationData } from "../types";
import * as styles from "./MotivationField.css";

export const MotivationField = memo(() => {
	const { control } = useFormContext<IndividualApplicationData>();
	const persistSnapshot = usePersistIndividualRegistrationSnapshot();
	const {
		field,
		fieldState: { error },
	} = useController({
		control,
		name: "motivation",
	});

	const text =
		useWatch({
			control,
			name: "motivation",
		}) || "";
	const maxLength = 300;

	return (
		<div className={styles.fieldContainer}>
			<div className={styles.textareaHeader}>
				<label className={styles.fieldLabelBase} htmlFor="motivation">
					지원 동기 <span className={styles.fieldLabelOptional}>(선택)</span>
				</label>
				<span className={styles.charCount}>
					{text.length} / {maxLength}자
				</span>
			</div>
			<textarea
				{...field}
				id="motivation"
				className={styles.textareaBase}
				rows={4}
				placeholder="본 과정에 지원하게 된 계기나 목표를 자유롭게 작성해 주세요."
				maxLength={maxLength}
				onBlur={() => {
					field.onBlur();
					persistSnapshot();
				}}
			/>
			{error && (
				<Text color="error" variant="labelSm" marginTop={1}>
					{error.message}
				</Text>
			)}
		</div>
	);
});

MotivationField.displayName = "MotivationField";

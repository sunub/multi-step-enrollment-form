"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Flex, Surface, Text } from "@shared/design-system";
import { useAtom } from "jotai";
import type React from "react";
import { useEffect } from "react";
import {
	FormProvider,
	useController,
	useForm,
	useFormContext,
	useWatch,
} from "react-hook-form";
import { MdBadge } from "react-icons/md";
import { individualRegistrationAtom } from "@/src/enrollment";
import { TextField } from "../TextField/TextField";
import * as styles from "./IndividualRegistration.css";
import {
	type IndividualApplicationData,
	individualApplicationSchema,
	isSameIndividualApplicationData,
} from "./types";

interface IndividualRegistrationProps {
	onNext: () => void;
	onPrev: () => void;
}

// --- 1. 헤더 영역 ---
const FormHeader: React.FC = () => (
	<header className={styles.headerContainer}>
		<h1 className={styles.headerTitle}>수강생 정보 입력</h1>
		<p className={styles.headerDesc}>
			원활한 수강 진행을 위해 정확한 개인 정보를 입력해 주세요.
		</p>
	</header>
);

// --- 2. 지원 동기 필드 (Textarea) ---
const MotivationField: React.FC = () => {
	const { control } = useFormContext<IndividualApplicationData>();
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
			/>
			{error && (
				<Text color="error" variant="labelSm" marginTop={1}>
					{error.message}
				</Text>
			)}
		</div>
	);
};

const StudentInfoSection = () => {
	const {
		control,
		formState: { errors },
	} = useFormContext<IndividualApplicationData>();

	const { field: nameField } = useController({
		control,
		name: "name",
	});
	const { field: emailField } = useController({
		control,
		name: "email",
	});
	const { field: phoneField } = useController({
		control,
		name: "phone",
	});

	return (
		<Box
			as="section"
			// biome-ignore lint/suspicious/noExplicitAny: responsive prop type mismatch
			padding={{ mobile: 3, tablet: 4 } as any}
			className={styles.sectionContainer}
			marginBottom={4}
		>
			<div className={styles.header}>
				<div className={styles.iconWrapper}>
					<MdBadge size={24} />
				</div>
				<Flex alignItems="baseline" gap={1}>
					<Text variant="headlineMd" color="onSurface" as="h2">
						수강생 정보
					</Text>
					<Text
						variant="bodySm"
						color="onSurfaceVariant"
						opacity={0.6}
						as="span"
					>
						(Student Information)
					</Text>
				</Flex>
			</div>

			<div className={styles.formGrid}>
				<TextField
					{...nameField}
					labelContent="성함을 입력해주세요"
					isError={!!errors.name}
					helperText={errors.name?.message}
					required
				/>

				<TextField
					{...emailField}
					labelContent="이메일을 입력해주세요"
					type="email"
					isError={!!errors.email}
					helperText={errors.email?.message}
					required
				/>

				<TextField
					{...phoneField}
					labelContent="연락처를 입력해주세요"
					type="tel"
					isError={!!errors.phone}
					helperText={errors.phone?.message}
					required
				/>
			</div>

			<Box marginTop={6}>
				<MotivationField />
			</Box>
		</Box>
	);
};

// --- 4. 메인 컴포넌트 ---
export const IndividualRegistration = ({
	onNext,
	onPrev,
}: IndividualRegistrationProps) => {
	const [liveAtomState, setLiveAtomState] = useAtom(individualRegistrationAtom);

	const methods = useForm<IndividualApplicationData>({
		resolver: zodResolver(individualApplicationSchema),
		defaultValues: liveAtomState,
		mode: "onChange",
	});

	const {
		formState: { isDirty },
		getValues,
		handleSubmit,
		reset,
	} = methods;

	useEffect(() => {
		const currentValues = getValues();
		if (
			isDirty ||
			isSameIndividualApplicationData(liveAtomState, currentValues)
		) {
			return;
		}

		reset(liveAtomState);
	}, [getValues, isDirty, liveAtomState, reset]);

	const onSubmit = (data: IndividualApplicationData) => {
		setLiveAtomState(data);
		console.log("Individual Registration Data:", data);
		onNext();
	};

	return (
		<main className={styles.mainWrapper}>
			<div className={styles.formContainer}>
				<FormHeader />

				<FormProvider {...methods}>
					<Box
						as="form"
						onSubmit={handleSubmit(onSubmit)}
						className={styles.formLayout}
					>
						<StudentInfoSection />

						<Box marginTop={6} display="flex" gap={2} justifyContent="center">
							<Surface
								as="button"
								type="button"
								onClick={onPrev}
								padding={2}
								borderRadius="md"
								style={{ cursor: "pointer" }}
							>
								이전
							</Surface>
							<Surface
								as="button"
								type="submit"
								padding={2}
								borderRadius="md"
								tone="primaryContainer"
								style={{ cursor: "pointer" }}
							>
								다음
							</Surface>
						</Box>
					</Box>
				</FormProvider>
			</div>
		</main>
	);
};

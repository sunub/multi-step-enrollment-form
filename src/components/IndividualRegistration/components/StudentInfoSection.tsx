import { Box, Flex, Text } from "@shared/design-system";
import type React from "react";
import { memo } from "react";
import { useController, useFormContext } from "react-hook-form";
import { MdBadge } from "react-icons/md";
import { TextField } from "@/src/components/TextField";
import { usePersistIndividualRegistrationSnapshot } from "../hooks/usePersistIndividualRegistrationSnapshot";
import type { IndividualApplicationData } from "../types";
import * as styles from "./StudentInfoSection.css";

export const StudentInfoSection = memo(
	({ children }: { children: React.ReactNode }) => {
		const {
			control,
			formState: { errors },
		} = useFormContext<IndividualApplicationData>();
		const persistSnapshot = usePersistIndividualRegistrationSnapshot();

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
				padding={{ mobile: 3, tablet: 4 }}
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
						name={nameField.name}
						ref={nameField.ref}
						value={nameField.value ?? ""}
						onChange={nameField.onChange}
						onBlur={() => {
							nameField.onBlur();
							persistSnapshot();
						}}
						labelContent="성함을 입력해주세요"
						isError={!!errors.name}
						helperText={errors.name?.message}
						required
					/>

					<TextField
						name={emailField.name}
						ref={emailField.ref}
						value={emailField.value ?? ""}
						onChange={emailField.onChange}
						onBlur={() => {
							emailField.onBlur();
							persistSnapshot();
						}}
						labelContent="이메일을 입력해주세요"
						type="email"
						isError={!!errors.email}
						helperText={errors.email?.message}
						required
					/>

					<TextField
						name={phoneField.name}
						ref={phoneField.ref}
						value={phoneField.value ?? ""}
						onChange={phoneField.onChange}
						onBlur={() => {
							phoneField.onBlur();
							persistSnapshot();
						}}
						labelContent="연락처를 입력해주세요"
						type="tel"
						isError={!!errors.phone}
						helperText={errors.phone?.message}
						required
					/>
				</div>

				{children && <Box marginTop={6}>{children}</Box>}
			</Box>
		);
	},
);

StudentInfoSection.displayName = "StudentInfoSection";

import { Box, Flex, Text } from "@shared/design-system";
import { useController, useFormContext } from "react-hook-form";
import { MdBadge } from "react-icons/md";
import { usePersistGroupRegistrationSnapshot } from "../GroupRegistrationStep/hooks/usePersistGroupRegistrationSnapshot";
import type { GroupApplicationData } from "../GroupRegistrationStep/types";
import { TextField } from "../TextField/TextField";
import * as styles from "./RepresentativeInfo.css";

export const RepresentativeInfo = () => {
	const {
		control,
		formState: { errors },
	} = useFormContext<GroupApplicationData>();
	const persistSnapshot = usePersistGroupRegistrationSnapshot();

	const { field: representativeNameField } = useController({
		control,
		name: "representative.name",
	});
	const { field: representativeEmailField } = useController({
		control,
		name: "representative.email",
	});
	const { field: representativePhoneField } = useController({
		control,
		name: "representative.phone",
	});
	const { field: managerNameField } = useController({
		control,
		name: "groupInfo.managerName",
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
						대표자 정보
					</Text>
					<Text
						variant="bodySm"
						color="onSurfaceVariant"
						opacity={0.6}
						as="span"
					>
						(Representative Information)
					</Text>
				</Flex>
			</div>

			<div className={styles.formGrid}>
				<TextField
					name={representativeNameField.name}
					ref={representativeNameField.ref}
					labelContent="대표자 성함을 입력해주세요"
					value={representativeNameField.value ?? ""}
					onChange={representativeNameField.onChange}
					onBlur={() => {
						representativeNameField.onBlur();
						persistSnapshot();
					}}
					isError={!!errors.representative?.name}
					errorMessageId="representative-name-error"
					helperText={errors.representative?.name?.message}
					required
				/>

				<TextField
					name={representativeEmailField.name}
					ref={representativeEmailField.ref}
					labelContent="대표자 이메일을 입력해주세요"
					type="email"
					value={representativeEmailField.value ?? ""}
					onChange={representativeEmailField.onChange}
					onBlur={() => {
						representativeEmailField.onBlur();
						persistSnapshot();
					}}
					isError={!!errors.representative?.email}
					errorMessageId="representative-email-error"
					helperText={errors.representative?.email?.message}
					required
				/>

				<TextField
					name={representativePhoneField.name}
					ref={representativePhoneField.ref}
					labelContent="대표자 연락처를 입력해주세요"
					type="tel"
					value={representativePhoneField.value ?? ""}
					onChange={representativePhoneField.onChange}
					onBlur={() => {
						representativePhoneField.onBlur();
						persistSnapshot();
					}}
					isError={!!errors.representative?.phone}
					errorMessageId="representative-phone-error"
					helperText={errors.representative?.phone?.message}
					required
				/>

				<TextField
					name={managerNameField.name}
					ref={managerNameField.ref}
					labelContent="담당자 성함을 입력해주세요"
					value={managerNameField.value ?? ""}
					onChange={managerNameField.onChange}
					onBlur={() => {
						managerNameField.onBlur();
						persistSnapshot();
					}}
					isError={!!errors.groupInfo?.managerName}
					errorMessageId="manager-name-error"
					helperText={errors.groupInfo?.managerName?.message}
					required
				/>
			</div>
		</Box>
	);
};

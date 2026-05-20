"use client";

import { Button } from "@shared/design-system";
import { useAtomValue, useSetAtom } from "jotai";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { EnrollmentLayout } from "@/src/components/EnrollmentLayout";
import { ICON_MAP } from "@/src/constants";
import {
	clearAllRegistrationDataAtom,
	enrollmentFormAtom,
} from "@/src/enrollment/atoms";
import { useMounted } from "@/src/hooks/useMounted";
import * as styles from "./page.css";

export default function EnrollmentSucces() {
	const isMounted = useMounted();
	const enrollmentForm = useAtomValue(enrollmentFormAtom);
	const clearAllRegistrationData = useSetAtom(clearAllRegistrationDataAtom);
	const router = useRouter();
	const hasChecked = useRef(false);

	useEffect(() => {
		if (!isMounted || hasChecked.current) return;
		hasChecked.current = true;

		if (!enrollmentForm.selectedCourse) {
			router.replace("/courses");
			return;
		}

		clearAllRegistrationData();
	}, [isMounted, enrollmentForm, clearAllRegistrationData, router]);

	return (
		<EnrollmentLayout>
			<main className={styles.mainWrapper}>
				<div className={styles.glassCard}>
					<div className={styles.decorativeBlobLeft} />
					<div className={styles.decorativeBlobRight} />

					<div className={styles.iconWrapper}>
						<div className={styles.iconGlowBg} />
						<div className={styles.iconCenter}>
							<span
								className={`material-symbols-outlined ${styles.iconStyle}`}
								style={{ fontVariationSettings: "'FILL' 1" }}
							>
								<ICON_MAP.check size={32} />
							</span>
						</div>
					</div>

					<h1 className={styles.titleText}>수강 신청이 완료되었습니다</h1>

					<p className={styles.descriptionText}>
						이제 다시 메인 페이지로 돌아가셔도 됩니다.
					</p>

					<div className={styles.actionGroup}>
						<Button
							asChild
							type="button"
							className={styles.primaryButton}
							size="lg"
						>
							<Link href="/">메인으로 돌아가기</Link>
						</Button>
					</div>
				</div>
			</main>
		</EnrollmentLayout>
	);
}

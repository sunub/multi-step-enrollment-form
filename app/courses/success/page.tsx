"use client";

import { Button } from "@shared/design-system";
import { useSetAtom } from "jotai";
import Link from "next/link";
import { useEffect } from "react";
import { ICON_MAP } from "@/src/constants";
import { clearAllRegistrationDataAtom } from "@/src/enrollment/atoms";
import * as styles from "./page.css";

export default function EnrollmentSucces() {
	const clearAllRegistrationData = useSetAtom(clearAllRegistrationDataAtom);

	useEffect(() => {
		clearAllRegistrationData();
	}, [clearAllRegistrationData]);

	return (
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
				<p className={styles.subtitleText}>sdf님의 등록이 완료되었습니다!</p>

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
	);
}

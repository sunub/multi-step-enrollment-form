"use client";

import { Box, Text } from "@shared/design-system";
import Link from "next/link";
import {
	FiArrowRight,
	FiAward,
	FiBookOpen,
	FiCheckCircle,
	FiEdit3,
} from "react-icons/fi";
import * as styles from "./page.css";

export default function Home() {
	return (
		<div className={styles.pageContainer}>
			<main className={styles.welcomeCard}>
				{/* Recruiter Badge */}
				<div className={styles.badge}>
					<span className={styles.badgeIcon}>
						<FiAward size={14} />
					</span>
					<Text variant="labelSm" color="onPrimaryFixed">
						채용 담당자 안내 가이드
					</Text>
				</div>

				{/* Title & Introduction */}
				<h1 className={styles.title}>다단계 수강 신청 폼</h1>
				<p className={styles.description}>
					이번 프로젝트는 총 3단계로 이루어진 유기적인 다단계 수강 신청 흐름을
					가지고 있습니다. 아래 <strong>[수강 신청 페이지로 이동]</strong>{" "}
					버튼을 통해 각 단계별 세부 기능과 검증 과정을 직접 체험해 보실 수
					있습니다.
				</p>

				{/* Step Progress Guide */}
				<div className={styles.featureList}>
					<div className={styles.featureItem}>
						<div className={styles.iconWrapper}>
							<FiBookOpen size={20} />
						</div>
						<Box>
							<Text variant="labelMd" color="onSurface">
								1단계: 강의 선택 (Course Selection)
							</Text>
							<Text variant="bodySm" color="onSurfaceVariant" marginTop={0.5}>
								카테고리별로 정렬된 강의 목록을 조회하고, 신청할 강좌 및 신청
								유형(개인/단체)을 지정합니다. 유형 변경 시 동적으로 안내 문구가
								전환됩니다.
							</Text>
						</Box>
					</div>

					<div className={styles.featureItem}>
						<div className={styles.iconWrapper}>
							<FiEdit3 size={20} />
						</div>
						<Box>
							<Text variant="labelMd" color="onSurface">
								2단계: 수강생 정보 입력 (Applicant Details)
							</Text>
							<Text variant="bodySm" color="onSurfaceVariant" marginTop={0.5}>
								개인/단체 신청 유형에 맞춰 분기된 폼을 입력합니다. 실시간 입력
								값 검증(이메일 중복, 명단 제한 등)과 이탈 방지 경고 기능이
								작동합니다.
							</Text>
						</Box>
					</div>

					<div className={styles.featureItem}>
						<div className={styles.iconWrapper}>
							<FiCheckCircle size={20} />
						</div>
						<Box>
							<Text variant="labelMd" color="onSurface">
								3단계: 정보 확인 및 제출 (Review & Submit)
							</Text>
							<Text variant="bodySm" color="onSurfaceVariant" marginTop={0.5}>
								작성한 전체 데이터 요약을 검토하고 약관에 동의합니다. 제출 시
								중복 제출 방지 비활성화 처리와 서버 응답 지연 시 로딩
								인디케이터가 표출됩니다.
							</Text>
						</Box>
					</div>
				</div>

				{/* Call to Action Button */}
				<Link href="/courses" className={styles.ctaButton}>
					<span>수강 신청 페이지로 이동</span>
					<span className={styles.arrowIcon}>
						<FiArrowRight size={18} />
					</span>
				</Link>
			</main>
		</div>
	);
}

import { assignInlineVars } from "@vanilla-extract/dynamic";
import type { ReactNode } from "react";
import { FaGlobe, FaShoppingBag } from "react-icons/fa";
import { categoryIconMap } from "@/src/constants";
import type { SelectedCourseSnapshot } from "@/src/enrollment/atoms";
import * as styles from "./EnrollmentSidebar.css";

interface EnrollmentSidebarProps {
	currentStep: number;
	totalSteps: number;
	stepTitle: string;
	percent: number;
	selectedCourse?: SelectedCourseSnapshot | null;
	enrollmentType?: "personal" | "group" | null;
	children?: ReactNode;
}

const ProgressSection = ({
	currentStep,
	totalSteps,
	stepTitle,
	percent,
}: {
	currentStep: number;
	totalSteps: number;
	stepTitle: string;
	percent: number;
}) => {
	return (
		<section style={{ marginBottom: "8px" }}>
			<div className={styles.progressHeader}>
				<div>
					<span className={styles.stepText}>
						Step {currentStep} of {totalSteps}
					</span>
					<h2 className={styles.titleText}>{stepTitle}</h2>
				</div>
				<span className={styles.percentText}>{percent}%</span>
			</div>

			<div className={styles.progressBarBg}>
				<div
					className={styles.progressBarFill}
					style={assignInlineVars({ [styles.progressWidthVar]: `${percent}%` })}
				/>
			</div>
		</section>
	);
};

const SelectedCourseList = ({
	selectedCourse,
	enrollmentType,
}: {
	selectedCourse: SelectedCourseSnapshot;
	enrollmentType?: "personal" | "group" | null;
}) => {
	const IconComponent =
		categoryIconMap[selectedCourse.category as keyof typeof categoryIconMap] ||
		null;

	return (
		<section style={{ marginBottom: "8px" }}>
			<div style={{ paddingBottom: "8px" }}>
				<h2 className={styles.sectionTitle}>
					<FaShoppingBag
						className={styles.sectionIcon}
						size={18}
						style={{ flexShrink: 0 }}
					/>
					선택된 강의 정보
				</h2>
			</div>

			<div className={styles.selectedListContainer}>
				<div className={styles.courseCard}>
					<div className={styles.courseCardInner}>
						<div className={styles.courseIconWrapper}>
							{IconComponent ? (
								<IconComponent size={20} />
							) : (
								<FaGlobe size={20} style={{ flexShrink: 0 }} />
							)}
						</div>
						<div style={{ flex: 1, minWidth: 0 }}>
							<h4 className={styles.courseTitle} title={selectedCourse.title}>
								{selectedCourse.title}
							</h4>
							<p className={styles.courseMeta}>
								{enrollmentType === "group" ? "단체 신청" : "개인 신청"} |{" "}
								{selectedCourse.price.toLocaleString()}원
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export const EnrollmentSidebar = ({
	currentStep,
	totalSteps,
	stepTitle,
	percent,
	selectedCourse,
	enrollmentType,
	children,
}: EnrollmentSidebarProps) => {
	return (
		<aside className={styles.sidebarWrapper}>
			<div className={styles.glassPanel}>
				<ProgressSection
					currentStep={currentStep}
					totalSteps={totalSteps}
					stepTitle={stepTitle}
					percent={percent}
				/>
				<hr className={styles.divider} />

				{selectedCourse && (
					<>
						<SelectedCourseList
							selectedCourse={selectedCourse}
							enrollmentType={enrollmentType}
						/>
						<hr className={styles.divider} />
					</>
				)}

				{children}
			</div>
		</aside>
	);
};

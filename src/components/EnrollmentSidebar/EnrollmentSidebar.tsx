import { assignInlineVars } from "@vanilla-extract/dynamic";
import { useState } from "react";
import * as styles from "./EnrollmentSidebar.css";

const ProgressSection = () => {
	const percent = 66;

	return (
		<section style={{ marginBottom: "8px" }}>
			<div className={styles.progressHeader}>
				<div>
					<span className={styles.stepText}>Step 2 of 3</span>
					<h2 className={styles.titleText}>Student Info</h2>
				</div>
				<span className={styles.percentText}>{percent}%</span>
			</div>

			<div className={styles.progressBarBg}>
				<div
					className={styles.progressBarFill}
					style={assignInlineVars({ [styles.progressWidthVar]: `${percent}%` })}
				/>
			</div>

			<div className={styles.stepIndicatorList}>
				<div className={styles.stepIndicatorItem}>
					<span className={styles.dotPrevious}></span>
					<span>Previous: 강의 선택 (Course Selection)</span>
				</div>
				<div className={styles.stepIndicatorItem}>
					<span className={styles.dotNext}></span>
					<span>Next: 결제 및 확인 (Payment)</span>
				</div>
			</div>
		</section>
	);
};

const EnrollmentTypeSelector = () => {
	const [selectedType, setSelectedType] = useState<"individual" | "group">(
		"group",
	);

	return (
		<section>
			<h2 className={styles.sectionTitle}>
				<span className={`material-symbols-outlined ${styles.sectionIcon}`}>
					group
				</span>
				신청 유형
			</h2>

			<div className={styles.radioGroup}>
				<label
					className={
						selectedType === "individual"
							? styles.radioLabelSelected
							: styles.radioLabelUnselected
					}
				>
					<input
						type="radio"
						name="enrollmentType"
						value="individual"
						checked={selectedType === "individual"}
						onChange={() => setSelectedType("individual")}
						style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
					/>
					<div
						className={
							selectedType === "individual"
								? styles.radioCircleSelected
								: styles.radioCircleUnselected
						}
					>
						{selectedType === "individual" && (
							<div className={styles.radioInnerCircle} />
						)}
					</div>
					<div>
						<div className={styles.radioTitle}>개인</div>
						<div className={styles.radioDesc}>
							Individual enrollment for a single student.
						</div>
					</div>
				</label>

				<label
					className={
						selectedType === "group"
							? styles.radioLabelSelected
							: styles.radioLabelUnselected
					}
				>
					<input
						type="radio"
						name="enrollmentType"
						value="group"
						checked={selectedType === "group"}
						onChange={() => setSelectedType("group")}
						style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
					/>
					<div
						className={
							selectedType === "group"
								? styles.radioCircleSelected
								: styles.radioCircleUnselected
						}
					>
						{selectedType === "group" && (
							<div className={styles.radioInnerCircle} />
						)}
					</div>
					<div>
						<div className={styles.radioTitle}>단체</div>
						<div className={styles.radioDesc}>
							Group enrollment for corporate teams.
						</div>
					</div>
				</label>
			</div>
		</section>
	);
};

const SelectedCourseList = () => {
	return (
		<>
			<div style={{ paddingBottom: "8px" }}>
				<h2 className={styles.sectionTitle}>
					<span className={`material-symbols-outlined ${styles.sectionIcon}`}>
						shopping_bag
					</span>
					선택된 강의 리스트
				</h2>
			</div>

			<div className={styles.selectedListContainer}>
				<div className={styles.courseCard}>
					<div className={styles.courseCardInner}>
						<div className={styles.courseIconWrapper}>
							<span
								className="material-symbols-outlined"
								style={{ fontSize: "20px" }}
							>
								web
							</span>
						</div>
						<div style={{ flex: 1, minWidth: 0 }}>
							<h4 className={styles.courseTitle}>Advanced UI/UX</h4>
							<p className={styles.courseMeta}>Group (6 members)</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

const OrderSummary = () => {
	return (
		<div className={styles.summaryContainer}>
			<div className={styles.summaryRow}>
				<span className={styles.summaryLabel}>Total Fee</span>
				<div className={styles.priceContainer}>
					<span className={styles.priceSymbol}>$</span>
					<span className={styles.priceAmount}>1,200</span>
				</div>
			</div>

			<button type="button" className={styles.submitButton}>
				<span>Go to Payment</span>
				<span
					className="material-symbols-outlined"
					style={{ fontWeight: "bold" }}
				>
					arrow_forward
				</span>
			</button>
		</div>
	);
};

export const EnrollmentSidebar = () => {
	return (
		<aside className={styles.sidebarWrapper}>
			<div className={styles.glassPanel}>
				<ProgressSection />
				<hr className={styles.divider} />

				<EnrollmentTypeSelector />
				<hr className={styles.divider} />

				<SelectedCourseList />

				<OrderSummary />
			</div>
		</aside>
	);
};

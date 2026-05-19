import { assignInlineVars } from "@vanilla-extract/dynamic";
import type React from "react";
import type { ReactNode } from "react";
import * as styles from "./EnrollmentLayout.css";

const Root = ({ children }: { children: React.ReactNode }) => (
	<div className={styles.layoutWrapper}>{children}</div>
);

const Main = ({ children }: { children: React.ReactNode }) => (
	<main className={styles.mainContent}>{children}</main>
);

const Sidebar = ({ children }: { children: React.ReactNode }) => (
	<aside className={styles.sidebarWrapper}>
		<div className={styles.sidebarGlassPanel}>{children}</div>
	</aside>
);

interface ProgressProps {
	currentStep: number;
	totalSteps: number;
	title: string;
	percent: number;
}
const Progress: React.FC<ProgressProps> = ({
	currentStep,
	totalSteps,
	title,
	percent,
}) => (
	<section>
		<div className={styles.progressHeader}>
			<div>
				<span className={styles.stepLabelText}>
					Step {currentStep} of {totalSteps}
				</span>
				<h2 className={styles.stepTitleText}>{title}</h2>
			</div>
			<span className={styles.percentText}>{percent}%</span>
		</div>
		<div className={styles.progressBarContainer}>
			<div
				className={styles.progressBarFill}
				style={assignInlineVars({ [styles.progressVar]: `${percent}%` })}
			/>
		</div>
	</section>
);

const SidebarContent = ({ children }: { children: React.ReactNode }) => (
	<>
		<hr className={styles.divider} />
		<section className={styles.dynamicSidebarSlot}>{children}</section>
	</>
);

interface ActionProps {
	children: ReactNode;
	onClick: () => void;
	disabled?: boolean;
}
const Action = ({ children, onClick, disabled }: ActionProps) => (
	<>
		<div className={styles.actionWrapper}>
			<button
				type="button"
				className={styles.desktopSubmitButton}
				onClick={onClick}
				disabled={disabled}
			>
				<span>{children}</span>
				<span
					className="material-symbols-outlined"
					style={{ fontWeight: "bold" }}
				>
					arrow_forward
				</span>
			</button>
		</div>

		<div className={styles.mobileBottomBar}>
			<button
				type="button"
				className={styles.mobileSubmitButton}
				onClick={onClick}
				disabled={disabled}
			>
				{children}
				<span
					className="material-symbols-outlined"
					style={{ fontSize: "20px", fontWeight: "bold" }}
				>
					arrow_forward
				</span>
			</button>
		</div>
	</>
);

export const EnrollmentLayout = Object.assign(Root, {
	Main,
	Sidebar,
	Progress,
	SidebarContent,
	Action,
});

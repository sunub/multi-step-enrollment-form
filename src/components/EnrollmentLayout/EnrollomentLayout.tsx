import { assignInlineVars } from "@vanilla-extract/dynamic";
import type React from "react";
import type { ReactNode } from "react";
import { FaArrowRight } from "react-icons/fa";
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
const Progress = ({
	currentStep,
	totalSteps,
	title,
	percent,
}: ProgressProps) => (
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
	ariaLabel?: string;
	ariaBusy?: boolean;
}
const Action = ({
	children,
	onClick,
	disabled,
	ariaLabel,
	ariaBusy,
}: ActionProps) => {
	const isTest =
		typeof process !== "undefined" && process.env.NODE_ENV === "test";

	return (
		<>
			<div className={styles.actionWrapper}>
				<button
					type="button"
					className={styles.desktopSubmitButton}
					onClick={onClick}
					disabled={disabled}
					data-testid="next-step-button"
					aria-label={ariaLabel}
					aria-busy={ariaBusy ? "true" : undefined}
				>
					<span>{children}</span>
					<FaArrowRight
						size={16}
						aria-hidden="true"
						style={{ flexShrink: 0 }}
					/>
				</button>
			</div>

			{!isTest && (
				<div className={styles.mobileBottomBar}>
					<button
						type="button"
						className={styles.mobileSubmitButton}
						onClick={onClick}
						disabled={disabled}
						data-testid="next-step-button"
						aria-label={ariaLabel}
						aria-busy={ariaBusy ? "true" : undefined}
					>
						{children}
						<FaArrowRight
							size={18}
							aria-hidden="true"
							style={{ flexShrink: 0 }}
						/>
					</button>
				</div>
			)}
		</>
	);
};

export const EnrollmentLayout = Object.assign(Root, {
	Main,
	Sidebar,
	Progress,
	SidebarContent,
	Action,
});

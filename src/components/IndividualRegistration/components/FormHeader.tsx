import { memo } from "react";
import * as styles from "./FormHeader.css";

export const FormHeader = memo(() => (
	<header className={styles.headerContainer}>
		<h1 className={styles.headerTitle}>수강생 정보 입력</h1>
		<p className={styles.headerDesc}>
			원활한 수강 진행을 위해 정확한 개인 정보를 입력해 주세요.
		</p>
	</header>
));

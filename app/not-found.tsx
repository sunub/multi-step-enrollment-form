"use client";

import { Button } from "@shared/design-system";
import { usePathname, useRouter } from "next/navigation";

export default function NotFound() {
	const _pathname = usePathname();
	const router = useRouter();

	const handleGoHome = () => {
		router.push("/");
	};

	return (
		<div data-testid="not-found-page">
			<Button
				data-testid="not-found-home-button"
				onClick={handleGoHome}
				variant={"error"}
			>
				홈으로 돌아가기
			</Button>
		</div>
	);
}

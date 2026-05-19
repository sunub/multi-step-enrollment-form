"use client";

import { Button, Grid } from "@shared/design-system";
import Link from "next/link";

export default function Home() {
	return (
		<Grid placeItems={"center"}>
			<Button asChild variant="primary" size="lg">
				<Link href="/courses" className="text-blue-500 underline">
					강의 신청 페이지로 이동하기
				</Link>
			</Button>
		</Grid>
	);
}

"use client";

import { Button } from "@shared/design-system";
import Link from "next/link";

export default function Home() {
	return (
		<div>
			<h1>Hello world!</h1>
			<Button asChild>
				<Link href="/courses/development">Go to courses</Link>
			</Button>
		</div>
	);
}

import "./global.css";
import { Provider as JotaiProvider } from "jotai";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import QueryProvider from "@/src/provider/QueryProvider";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Multi-Step Enrollment Form",
	description: "A professional course enrollment form",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
		>
			<head>
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=add,arrow_forward,business_center,calendar_month,check,code,data_object,delete,group,palette,trending_up&display=swap"
				/>
			</head>
			<body>
				<QueryProvider>
					<JotaiProvider>{children}</JotaiProvider>
				</QueryProvider>
			</body>
		</html>
	);
}

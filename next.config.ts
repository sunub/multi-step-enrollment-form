import { createVanillaExtractPlugin } from "@vanilla-extract/next-plugin";
import type { NextConfig } from "next";

const withVanillaExtract = createVanillaExtractPlugin();

const nextConfig: NextConfig = {
	transpilePackages: ["@shared/design-system", "@shared/mock"],
	cacheComponents: true,
	allowedDevOrigins: ["127.0.0.1", "localhost"],
	async rewrites() {
		return [
			{
				source: "/api/:path*",
				destination: "http://127.0.0.1:3101/api/:path*",
			},
		];
	},
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{
						key: "Access-Control-Allow-Origin",
						value: "http://127.0.0.1:3101",
					},
					{
						key: "Access-Control-Allow-Credentials",
						value: "true",
					},
					{
						key: "Access-Control-Allow-Methods",
						value: "GET, OPTIONS, PATCH, DELETE, POST, PUT",
					},
					{
						key: "Access-Control-Allow-Headers",
						value:
							"X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
					},
				],
			},
		];
	},
};

export default withVanillaExtract(nextConfig);

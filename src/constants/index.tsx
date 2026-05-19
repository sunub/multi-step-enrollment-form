import { FaCheckCircle, FaCode, FaMoneyCheckAlt } from "react-icons/fa";
import { IoIosBusiness } from "react-icons/io";
import {
	MdFactCheck,
	MdGroups,
	MdMenuBook,
	MdOutlineDesignServices,
	MdPerson,
} from "react-icons/md";

export const API_ENDPOINTS = {
	COURSES: "/api/courses",
	ENROLLMENTS: "/api/enrollments",
} as const;

export function resolveApiUrl(path: string) {
	if (typeof window !== "undefined") {
		return path;
	}

	const baseUrl =
		process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;

	return baseUrl ? new URL(path, baseUrl).toString() : path;
}

export const INTERNAL_URL = {
	success: "/courses/success",
} as const;

export const COURSE_CATEGORIES = [
	"development",
	"design",
	"marketing",
	"business",
] as const;

export const CATEGORY_COURSE_URLS = {
	DEVELOPMENT: "/courses?category=development",
	DESIGN: "/courses?category=design",
	MARKETING: "/courses?category=marketing",
	BUSINESS: "/courses?category=business",
};

export const categoryIconMap = {
	development: FaCode,
	design: MdOutlineDesignServices,
	marketing: FaMoneyCheckAlt,
	business: IoIosBusiness,
} as const;

export const ICON_MAP = {
	menu_book: MdMenuBook,
	person: MdPerson,
	groups: MdGroups,
	fact_check: MdFactCheck,
	check: FaCheckCircle,
} as const;

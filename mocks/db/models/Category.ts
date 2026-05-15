export const Category = [
	"development",
	"design",
	"marketing",
	"business",
] as const;

export type Category = (typeof Category)[number];

import { Button, ButtonGroup } from "@shared/design-system";
import type { CourseCategoryType } from "@shared/types";
import type React from "react";
import { COURSE_CATEGORIES } from "../../../constants";

interface CategoryTabsProps {
	currentCategory: CourseCategoryType;
	onCategoryChange: (category: CourseCategoryType) => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
	currentCategory,
	onCategoryChange,
}) => {
	return (
		<ButtonGroup orientation="horizontal" marginBottom={4}>
			{COURSE_CATEGORIES.map((cat) => (
				<Button
					key={cat}
					variant={currentCategory === cat ? "primary" : "outline"}
					onClick={() => onCategoryChange(cat as CourseCategoryType)}
					style={{ flex: 1 }}
					data-testid={`category-tab-${cat}`}
					type="button"
				>
					{cat.charAt(0).toUpperCase() + cat.slice(1)}
				</Button>
			))}
		</ButtonGroup>
	);
};

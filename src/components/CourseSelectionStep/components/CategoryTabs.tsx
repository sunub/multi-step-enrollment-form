import { Button, ButtonGroup, vars } from "@shared/design-system";
import type { CourseCategoryType } from "@shared/types";
import { COURSE_CATEGORIES, categoryColorMap } from "../../../constants";

interface CategoryTabsProps {
	currentCategory: CourseCategoryType;
	onCategoryChange: (category: CourseCategoryType) => void;
}

export const CategoryTabs = ({
	currentCategory,
	onCategoryChange,
}: CategoryTabsProps) => {
	return (
		<ButtonGroup orientation="horizontal" marginBottom={4}>
			{COURSE_CATEGORIES.map((cat) => {
				const isActive = currentCategory === cat;
				const colorKey = categoryColorMap[cat as CourseCategoryType];
				const categoryColor = vars.color[colorKey];

				return (
					<Button
						key={cat}
						variant={isActive ? "primary" : "outline"}
						onClick={() => onCategoryChange(cat as CourseCategoryType)}
						style={{
							flex: 1,
							backgroundColor: isActive ? categoryColor : undefined,
							borderColor: isActive ? categoryColor : undefined,
						}}
						data-testid={`category-tab-${cat}`}
						type="button"
					>
						{cat.charAt(0).toUpperCase() + cat.slice(1)}
					</Button>
				);
			})}
		</ButtonGroup>
	);
};

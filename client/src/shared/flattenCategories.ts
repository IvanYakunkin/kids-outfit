import { CategoryDto } from "@/types/categories";
import { CategorySelect } from "@/types/common/common";

export const flattenCategories = (categories: CategoryDto[], level = 0) => {
  let result: CategorySelect[] = [];
  categories.forEach((cat) => {
    result.push({
      id: cat.id,
      label: `${"—".repeat(level)} ${cat.name}`,
    });
    if (cat.children && cat.children.length > 0) {
      result = result.concat(flattenCategories(cat.children, level + 1));
    }
  });
  return result;
};

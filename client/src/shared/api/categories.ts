import { CategoryDto } from "@/types/categories";
import { fetchJson, FetchJsonResult } from "./fetchJson";

// 🔹 Получение всех категорий
export async function getCategories(): Promise<FetchJsonResult<CategoryDto[]>> {
  return fetchJson<CategoryDto[]>("/categories", { revalidate: 3600 });
}

// 🔹 Получение категории по массиву slugs
export async function getCategoryBySlugs(
  slugs: string[]
): Promise<FetchJsonResult<CategoryDto>> {
  const slugsStr = slugs.join("/");
  return fetchJson<CategoryDto>(`/categories/path/${slugsStr}`);
}

import { CategoryDto, CreateCategoryDto } from "@/types/categories";
import { fetchJson, FetchJsonResult } from "../fetchJson";

export async function getCategories(): Promise<FetchJsonResult<CategoryDto[]>> {
  return fetchJson<CategoryDto[]>("categories");
}

export async function getCategoryBySlugs(
  slugs: string[]
): Promise<FetchJsonResult<CategoryDto>> {
  const slugsStr = slugs.join("/");
  return fetchJson<CategoryDto>(`categories/path/${slugsStr}`);
}

export async function getCategoryById(
  id: number
): Promise<FetchJsonResult<CategoryDto>> {
  return fetchJson<CategoryDto>(`categories/${id}`);
}

export async function getCategoryHierarchy(
  categoryId: number
): Promise<FetchJsonResult<CategoryDto[]>> {
  return fetchJson<CategoryDto[]>(`categories/hierarchy/${categoryId}`);
}

// Find all categories without children
export async function getPlainCategories(): Promise<
  FetchJsonResult<CategoryDto[]>
> {
  return fetchJson<CategoryDto[]>("categories/plain");
}

export async function createCategory(
  createCategoryDto: CreateCategoryDto
): Promise<FetchJsonResult<CategoryDto>> {
  return fetchJson<CategoryDto>("categories", {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(createCategoryDto),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function deleteCategory(categoryId: number) {
  return fetchJson(`categories/${categoryId}`, {
    method: "DELETE",
    credentials: "include",
  });
}

// TODO: use UpdateCategoryDto
export async function updateCategory(
  categoryId: number,
  updateCategoryDto: CreateCategoryDto
): Promise<FetchJsonResult<CategoryDto>> {
  return fetchJson<CategoryDto>(`categories/${categoryId}`, {
    method: "PATCH",
    credentials: "include",
    body: JSON.stringify(updateCategoryDto),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

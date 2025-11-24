import { operations } from "./generated/api";

export type CategoryDto =
  operations["CategoriesController_findAll"]["responses"][200]["content"]["application/json"];

"use client";

import CategoryDialog from "@/components/Dialogs/CategoryDialog";
import {
  createCategory,
  getPlainCategories,
  updateCategory,
} from "@/shared/api/categories";
import { authRequestWrapper } from "@/shared/authRequestWrapper";
import getCategoriesColumns from "@/shared/columns/categories";
import { CategoryDto, CreateCategoryDto } from "@/types/categories";
import { Box, Fab, Paper } from "@mui/material";
import { DataGrid, GridFilterModel } from "@mui/x-data-grid";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function CategdoriesAdminPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: [],
  });
  const [editCategory, setEditCategory] = useState<CategoryDto | null>(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    const getCharsFromDB = async () => {
      const categoriesResponse = await getPlainCategories();
      if (!categoriesResponse.ok || !categoriesResponse.data) {
        console.log(categoriesResponse.error);
        alert("Ошибка получения категорий");
        return;
      }
      setCategories(categoriesResponse.data);
    };

    getCharsFromDB();
  }, []);

  const openEditPage = (selectedCategory: CategoryDto) => {
    setEditCategory(selectedCategory);
  };

  const saveCategory = async (category: CreateCategoryDto) => {
    if (editCategory) {
      if (category.parentId === -1) {
        category.parentId = undefined;
      }
      const updateCategoryResponse = await authRequestWrapper(
        () =>
          updateCategory(editCategory.id, {
            name: category.name,
            ...(category.parentId && { parentId: category.parentId }),
          }),
        router
      );
      if (!updateCategoryResponse.ok || !updateCategoryResponse.data) {
        console.log(
          "Не удалось обновить категорию: ",
          updateCategoryResponse.error
        );
        alert(`Не удалось обновить категорию: ${updateCategoryResponse.error}`);
        return;
      }
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editCategory.id
            ? (updateCategoryResponse.data as typeof c)
            : c
        )
      );
    } else {
      const createResponse = await authRequestWrapper(
        () => createCategory(category),
        router
      );
      if (!createResponse.ok || !createResponse.data) {
        alert(`Не удалось создать категорию: ${createResponse.error}`);
        console.log("Не удалось создать категорию:", createResponse.error);
        return;
      }
      setCategories([...categories, createResponse.data]);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.title}>Категории</div>
      <div style={{ width: "100%" }}>
        <Paper sx={{ height: 700 }}>
          <Box sx={{ textAlign: "right", marginBottom: 2 }}>
            <Fab
              color="success"
              sx={{ mr: 1 }}
              onClick={() => setIsCreateOpen(true)}
            >
              <Image src="/images/add.png" width={20} height={20} alt="Add" />
            </Fab>
          </Box>
          <DataGrid
            label="Категории"
            rows={categories}
            columns={getCategoriesColumns(openEditPage, router)}
            autoPageSize
            pagination
            sortingOrder={["asc", "desc"]}
            filterMode="client"
            disableRowSelectionOnClick
            showToolbar
            loading={categories.length ? false : true}
            filterModel={filterModel}
            onFilterModelChange={(model) => setFilterModel(model)}
            initialState={{
              sorting: {
                sortModel: [{ field: "id", sort: "asc" }],
              },
            }}
          />
        </Paper>
      </div>
      {isCreateOpen && (
        <CategoryDialog
          title="Добавить категорию"
          onSave={saveCategory}
          handleClose={() => setIsCreateOpen(false)}
        />
      )}

      {editCategory && (
        <CategoryDialog
          title="Изменить категорию"
          onSave={saveCategory}
          handleClose={() => setEditCategory(null)}
          initCategory={{
            name: editCategory.name,
            parentCategory: editCategory.parent && {
              id: editCategory.parent.id,
              label: editCategory.parent.name,
            },
          }}
        />
      )}
    </main>
  );
}

import { CategoryDto } from "@/types/categories";
import { Box, Fab } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Image from "next/image";
import { deleteCategory } from "../api/categories";
import { authRequestWrapper } from "../authRequestWrapper";

export default function getCategoriesColumns(
  openEditPage: (selectedCategory: CategoryDto) => void,
  router: AppRouterInstance
) {
  const handleDeleteBtn = async (
    e: React.MouseEvent<HTMLButtonElement>,
    categoryId: number
  ) => {
    e.stopPropagation();
    const errorRes = await authRequestWrapper(
      () => deleteCategory(categoryId),
      router
    );
    if (!errorRes.ok) {
      alert(
        "Невозможно удалить запись, так как она уже связана с другими данными!"
      );
      console.log(errorRes.error);
    } else {
      alert("Запись удалена!");
    }
  };

  const productColumns: GridColDef<CategoryDto>[] = [
    {
      field: "id",
      headerName: "ID",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "value",
      headerName: "Название категории",
      flex: 1,
      headerAlign: "center",
      align: "center",
      valueGetter: (value, row) => row.name,
    },
    {
      field: "slug",
      headerName: "slug",
      flex: 1,
      headerAlign: "center",
      align: "center",
      valueGetter: (value, row) => row.slug,
    },
    {
      field: "parentName",
      headerName: "Родительская категория",
      flex: 1,
      headerAlign: "center",
      align: "center",
      valueGetter: (value, row) => row.parent?.name || " - ",
    },
    {
      field: "actions",
      headerName: "Действия",
      flex: 1,
      headerAlign: "center",
      filterable: false,
      align: "center",
      sortable: false,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            height: "100%",
            justifyContent: "center",
          }}
        >
          <Fab
            color="primary"
            aria-label="edit"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              openEditPage(params.row);
            }}
          >
            <Image
              src="/images/pen.png"
              width={20}
              height={20}
              alt="Edit data"
            />
          </Fab>
          <Fab
            color="error"
            size="small"
            aria-label="delete"
            onClick={(e) => handleDeleteBtn(e, params.row.id)}
          >
            <Image
              src="/images/delete.png"
              width={20}
              height={20}
              alt="Delete"
            />
          </Fab>
        </Box>
      ),
    },
  ];
  return productColumns;
}

import { Size } from "@/types/productSizes";
import { Box, Fab } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Image from "next/image";
import { deleteSize } from "../api/productSizes";
import { authRequestWrapper } from "../authRequestWrapper";

export default function getSizesColumns(router: AppRouterInstance) {
  const handleDeleteBtn = async (
    e: React.MouseEvent<HTMLButtonElement>,
    sizeId: number
  ) => {
    e.stopPropagation();
    const errorRes = await authRequestWrapper(() => deleteSize(sizeId), router);
    if (!errorRes.ok) {
      alert(
        "Невозможно удалить запись, так как она уже связана с другими данными!"
      );
      console.log(errorRes.error);
    } else {
      alert("Запись удалена!");
    }
  };
  const sizesColumns: GridColDef<Size>[] = [
    {
      field: "id",
      headerName: "ID",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "value",
      headerName: "Размер",
      flex: 1,
      headerAlign: "center",
      align: "center",
      valueGetter: (value, row) => row.name,
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
  return sizesColumns;
}

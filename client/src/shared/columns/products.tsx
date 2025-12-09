import { ProductResponseDto } from "@/types/products";
import { Box, Fab } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Image from "next/image";
import { deleteProduct } from "../api/products";
import { getDiscountedPrice } from "../getDiscountedPrice";

export default function getProductColumns(router: AppRouterInstance) {
  const toProductPage = (
    e: React.MouseEvent<HTMLButtonElement>,
    productId: number,
    mode: "view" | "edit"
  ) => {
    e.stopPropagation();
    let url: string = "";
    if (mode === "view") {
      url = `/admin/products/view/${productId}`;
    } else if (mode === "edit") {
      url = `/admin/products/edit/${productId}`;
    }

    router.push(url);
  };

  const handleDeleteProduct = async (
    e: React.MouseEvent<HTMLButtonElement>,
    productId: number
  ) => {
    e.stopPropagation();
    const deletedResponse = await deleteProduct(productId);
    if (deletedResponse.status === 409) {
      alert(deletedResponse.error);
    } else {
      alert("Запись удалена");
    }
  };

  const productColumns: GridColDef<ProductResponseDto>[] = [
    {
      field: "id",
      headerName: "ID",
      flex: 1,
      headerAlign: "center",
      filterable: false,
      align: "center",
    },
    {
      field: "name",
      headerName: "Название",
      flex: 2,
      filterable: false,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "sku",
      headerName: "SKU",
      flex: 1,
      filterable: false,
      type: "string",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "isActive",
      headerName: "Активность",
      flex: 1,
      filterable: false,
      type: "boolean",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "category",
      headerName: "Категория",
      filterable: false,
      flex: 1,
      headerAlign: "center",
      align: "center",
      valueGetter: (value, row) => row.category.name,
    },
    {
      field: "priceWithDiscount",
      headerName: "Цена, руб.",
      flex: 1,
      type: "number",
      headerAlign: "center",
      align: "center",
      sortable: false,
      filterable: false,
      valueGetter: (value, row) =>
        getDiscountedPrice(row.price, row.discount || 0),
    },
    {
      field: "price",
      headerName: "Без скидки, руб.",
      flex: 1,
      type: "number",
      filterable: false,
      headerAlign: "center",
      align: "center",
      valueGetter: (value, row) => row.price,
    },
    {
      field: "discount",
      headerName: "Скидка, %",
      flex: 1,
      type: "number",
      headerAlign: "center",
      filterable: false,
      align: "center",
      valueGetter: (value, row) => row.discount,
    },
    {
      field: "sold",
      headerName: "Продано, шт.",
      flex: 1,
      type: "number",
      filterable: false,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "actions",
      headerName: "Действия",
      flex: 2,
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
            color="success"
            aria-label="view"
            size="small"
            onClick={(e) => toProductPage(e, params.row.id, "view")}
          >
            <Image
              src="/images/eye.png"
              width={20}
              height={20}
              alt="View data"
            />
          </Fab>

          <Fab
            color="primary"
            aria-label="edit"
            size="small"
            onClick={(e) => toProductPage(e, params.row.id, "edit")}
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
            onClick={(e) => handleDeleteProduct(e, params.row.id)}
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

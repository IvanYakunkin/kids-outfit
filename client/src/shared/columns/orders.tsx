"use client";

import { AutocompleteOption } from "@/components/Dialogs/AutocompleteDialog";
import { GetOrdersDto } from "@/types/order";
import { Box, Fab } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import Image from "next/image";
import { formatDate } from "../formatDate";

export default function getOrdersColumns(
  openEditPage: (orderId: number, selectedOption: AutocompleteOption) => void
) {
  const productColumns: GridColDef<GetOrdersDto>[] = [
    {
      field: "id",
      headerName: "ID",
      flex: 1,
      headerAlign: "center",
      filterable: false,
      align: "center",
    },
    {
      field: "userId",
      headerName: "ID покупателя",
      flex: 2,
      filterable: false,
      headerAlign: "center",
      align: "center",
      valueGetter: (value, row) => row.user.id,
    },
    {
      field: "user",
      headerName: "ФИО покупателя",
      flex: 2,
      filterable: false,
      headerAlign: "center",
      align: "center",
      valueGetter: (value, row) =>
        `${row.user.lastname} ${row.user.firstname} ${row.user.middlename}`,
    },
    {
      field: "userPhone",
      headerName: "Номер покупателя",
      flex: 2,
      filterable: false,
      headerAlign: "center",
      align: "center",
      valueGetter: (value, row) => row.user.phone,
    },
    {
      field: "address",
      headerName: "Адрес доставки",
      flex: 2,
      filterable: false,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "total",
      headerName: "Сумма заказа, руб.",
      flex: 2,
      filterable: false,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "status",
      headerName: "Сатус",
      flex: 2,
      filterable: false,
      headerAlign: "center",
      align: "center",
      valueGetter: (value, row) => row.status.name,
    },
    {
      field: "createdAt",
      headerName: "Дата оформления",
      flex: 2,
      filterable: false,
      headerAlign: "center",
      align: "center",
      valueGetter: (value, row) => {
        return formatDate(row.createdAt);
      },
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
            href={`/admin/orders/view/${params.row.id}`}
            color="success"
            target="blank"
            aria-label="view"
            size="small"
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
            onClick={(e) => {
              e.stopPropagation();
              openEditPage(params.row.id, {
                id: params.row.status.id,
                label: params.row.status.name,
              });
            }}
          >
            <Image
              src="/images/pen.png"
              width={20}
              height={20}
              alt="Edit data"
            />
          </Fab>
        </Box>
      ),
    },
  ];
  return productColumns;
}

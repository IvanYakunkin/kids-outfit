"use client";

import AutocompleteDialog, {
  AutocompleteOption,
} from "@/components/Dialogs/AutocompleteDialog";
import { getOrders, getStatuses, updateOrder } from "@/shared/api/orders";
import { authRequestWrapper } from "@/shared/authRequestWrapper";
import getOrdersColumns from "@/shared/columns/orders";
import { GetOrdersDto, PaginatedOrdersDto } from "@/types/order";
import { Box, Button, Paper, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// TODO: Use separate component for orders DataGrid
export default function RecentOrdersTable() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<GetOrdersDto[] | null>();
  const [isStatusDialog, setIsStatusDialog] = useState(false);
  const [statuses, setStatuses] = useState<AutocompleteOption[]>([]);
  const [editOrderId, setEditOrderId] = useState<number | null>(null);
  const [statusDefault, setStatusDefault] = useState<AutocompleteOption | null>(
    null
  );

  const saveNewStatus = async (status: AutocompleteOption | null) => {
    if (status && editOrderId) {
      const updateOrderRes = await authRequestWrapper(
        () =>
          updateOrder(editOrderId, {
            statusId: status.id,
          }),
        router
      );
      if (!updateOrderRes.ok) {
        alert("Не удалось обновить статус заказа");
        console.log("Не удалось обновить статус заказа", updateOrderRes.error);
      } else {
        if (!orders || orders.length < 1) return;
        setOrders((prev) => {
          if (!prev) return prev;

          return prev.map((row) =>
            row.id === editOrderId
              ? {
                  ...row,
                  status: { ...row.status, id: status.id, name: status.label },
                }
              : row
          );
        });
      }
    }
  };

  const openEditPage = (orderId: number, status: AutocompleteOption) => {
    setStatusDefault(status);
    setEditOrderId(orderId);
    setIsStatusDialog(true);
  };

  useEffect(() => {
    const getUnprocessedOrders = async () => {
      const ordersRes = await getOrders<PaginatedOrdersDto>({
        statusId: 1,
      });
      if (ordersRes.ok && ordersRes.data) {
        setOrders(ordersRes.data.data);
      } else {
        console.log(ordersRes.error);
      }

      setIsLoading(false);
    };

    getUnprocessedOrders();
  }, []);

  useEffect(() => {
    const getStatusesFromDB = async () => {
      const statusesResponse = await getStatuses();
      if (statusesResponse.ok && statusesResponse.data) {
        setStatuses(
          statusesResponse.data.map((st) => ({ id: st.id, label: st.name }))
        );
      } else {
        console.log(
          "Не удалось получить список статусов заказа",
          statusesResponse.error
        );
      }
    };
    getStatusesFromDB();
  }, []);

  if (isLoading) return;

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          width: "100%",
        }}
      >
        <Box
          sx={{
            mb: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" fontWeight="600">
            Необработанные заказы {`(${orders?.length || 0})`}
          </Typography>
          <Button variant="text" size="small" href="/admin/orders">
            Посмотреть все
          </Button>
        </Box>
        <Box sx={{ height: 500, width: "100%" }}>
          <DataGrid
            label="Необработанные заказы"
            rows={orders || []}
            loading={orders ? false : true}
            columns={getOrdersColumns(openEditPage)}
            autoPageSize
            filterMode="client"
            disableRowSelectionOnClick
            showToolbar
            pagination
            slotProps={{
              loadingOverlay: {
                variant: "linear-progress",
                noRowsVariant: "skeleton",
              },
            }}
          />
        </Box>
      </Paper>
      {isStatusDialog && (
        <AutocompleteDialog
          initialOptions={statuses}
          defaultOption={statusDefault}
          handleClose={() => setIsStatusDialog(false)}
          onSave={saveNewStatus}
          label="Управление статусом "
        />
      )}
    </>
  );
}

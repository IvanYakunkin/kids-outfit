"use client";
import Breadcrumbs from "@/app/components/Breadcrumbs/Breadcrumbs";
import AutocompleteDialog, {
  AutocompleteOption,
} from "@/components/Dialogs/AutocompleteDialog";
import { getOrders, getStatuses, updateOrder } from "@/shared/api/orders";
import { authRequestWrapper } from "@/shared/authRequestWrapper";
import getOrdersColumns from "@/shared/columns/orders";
import { GetOrdersDto, PaginatedOrdersDto } from "@/types/order";
import { DataGrid, GridFilterModel, GridSortModel } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function OrdersAdminPage() {
  const [rows, setRows] = useState<GetOrdersDto[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: [],
  });
  const router = useRouter();
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const [isStatusDialog, setIsStatusDialog] = useState(false);
  const [statusDefault, setStatusDefault] = useState<AutocompleteOption | null>(
    null
  );
  const [statuses, setStatuses] = useState<AutocompleteOption[]>([]);
  const [editOrderId, setEditOrderId] = useState<number | null>(null);

  useEffect(() => {
    const getOrdersData = async () => {
      setIsLoading(true);
      const searchText = filterModel.quickFilterValues?.[0];
      const ordersResponse = await getOrders<PaginatedOrdersDto>({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        ...(sortModel[0]?.field && { sort: sortModel[0].field }),
        ...(sortModel[0]?.sort
          ? { order: sortModel[0].sort.toUpperCase() as "ASC" | "DESC" }
          : {}),
        ...(searchText ? { search: searchText } : {}),
      });

      if (
        ordersResponse.ok &&
        ordersResponse.data &&
        ordersResponse.data.data
      ) {
        setRows(ordersResponse.data.data);
        setRowCount(ordersResponse.data.meta.total);
      } else {
        console.log("Не удалось получить список товаров", ordersResponse.error);
      }
      setIsLoading(false);
    };

    getOrdersData();
  }, [
    paginationModel.page,
    paginationModel.pageSize,
    sortModel,
    filterModel.quickFilterValues,
  ]);

  // get statuses list
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

  const openEditPage = (orderId: number, status: AutocompleteOption) => {
    setStatusDefault(status);
    setEditOrderId(orderId);
    setIsStatusDialog(true);
  };

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
        setRows((prevRows) =>
          prevRows.map((row) =>
            row.id === editOrderId
              ? {
                  ...row,
                  status: { ...row.status, id: status.id, name: status.label },
                }
              : row
          )
        );
      }
    }
  };

  const pathParts = [
    { name: "Админ-панель", url: "/admin" },
    { name: "Заказы" },
  ];

  return (
    <main className={styles.admin}>
      <Breadcrumbs pathParts={pathParts} />
      <>
        <div className={styles.options}>
          <div className={styles.title}>Заказы</div>
        </div>
        <div style={{ width: "100%", height: 700 }}>
          <DataGrid
            label="Заказы"
            rows={rows}
            columns={getOrdersColumns(openEditPage)}
            rowCount={rowCount}
            paginationMode="server"
            sortingMode="server"
            filterMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            sortModel={sortModel}
            onSortModelChange={setSortModel}
            filterModel={filterModel}
            onFilterModelChange={setFilterModel}
            checkboxSelection
            loading={isLoading}
            showToolbar
            pageSizeOptions={[10, 30, 50, 100]}
            slotProps={{
              loadingOverlay: {
                variant: "linear-progress",
                noRowsVariant: "skeleton",
              },
            }}
          />
        </div>
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
    </main>
  );
}

"use client";

import Breadcrumbs from "@/app/components/Breadcrumbs/Breadcrumbs";
import FieldDialog from "@/components/Dialogs/FieldDialog";
import { createStatus, getStatuses } from "@/shared/api/orders";
import { authRequestWrapper } from "@/shared/authRequestWrapper";
import getStatusesColumns from "@/shared/columns/statuses";
import { StatusResponseDto } from "@/types/order";
import { Size } from "@/types/productSizes";
import { Box, Fab } from "@mui/material";
import { DataGrid, GridFilterModel } from "@mui/x-data-grid";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function AdminStatusesPage() {
  const router = useRouter();

  const [statuses, setStatuses] = useState<StatusResponseDto[]>([]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: [],
  });
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    const getStatusesFromDB = async () => {
      const statusesRes = await getStatuses();
      if (!statusesRes.ok || !statusesRes.data) {
        console.log(statusesRes.error);
        alert("Ошибка получения статусов");
        return;
      }
      setStatuses(statusesRes.data);
    };

    getStatusesFromDB();
  }, []);

  const saveStatus = async (value: string) => {
    const createResponse = await authRequestWrapper(
      () => createStatus(value),
      router
    );
    if (!createResponse.ok || !createResponse.data) {
      alert(`Не удалось добавить статус: ${createResponse.error}`);
      return;
    }
    setStatuses((prev) => [...prev, createResponse.data as Size]);
  };

  const pathParts = [
    { name: "Админ-панель", url: "/admin/" },
    { name: "Статусы" },
  ];

  return (
    <main className={styles.main}>
      <Breadcrumbs pathParts={pathParts} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <div className={styles.title}>Статусы</div>
        <Fab
          color="success"
          sx={{ mr: 1 }}
          onClick={() => setIsCreateOpen(true)}
        >
          <Image src="/images/add.png" width={20} height={20} alt="Add" />
        </Fab>
      </Box>
      <div>
        <div style={{ width: "100%", height: 700 }}>
          <DataGrid
            label="Статусы"
            rows={statuses}
            columns={getStatusesColumns(router)}
            autoPageSize
            pagination
            sortingOrder={["asc", "desc"]}
            filterMode="client"
            disableRowSelectionOnClick
            showToolbar
            loading={statuses.length ? false : true}
            filterModel={filterModel}
            onFilterModelChange={(model) => setFilterModel(model)}
            initialState={{
              sorting: {
                sortModel: [{ field: "id", sort: "asc" }],
              },
            }}
          />
        </div>
      </div>

      {isCreateOpen && (
        <FieldDialog
          label="Добавить статус"
          handleClose={() => setIsCreateOpen(false)}
          onSave={saveStatus}
          bgcolor="success"
        />
      )}
    </main>
  );
}

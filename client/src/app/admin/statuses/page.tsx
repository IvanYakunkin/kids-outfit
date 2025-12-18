"use client";

import FieldDialog from "@/components/Dialogs/FieldDialog";
import { getStatuses } from "@/shared/api/orders";
import { createSize } from "@/shared/api/productSizes";
import { authRequestWrapper } from "@/shared/authRequestWrapper";
import getStatusesColumns from "@/shared/columns/statuses";
import { StatusResponseDto } from "@/types/order";
import { Size } from "@/types/productSizes";
import { Box, Fab, Paper } from "@mui/material";
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
      () => createSize(value),
      router
    );
    if (!createResponse.ok || !createResponse.data) {
      alert(`Не удалось добавить статус: ${createResponse.error}`);
      return;
    }
    setStatuses((prev) => [...prev, createResponse.data as Size]);
  };

  return (
    <main className={styles.main}>
      <div className={styles.title}>Статусы</div>
      <div>
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
          </Paper>
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

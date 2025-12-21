"use client";

import Breadcrumbs from "@/app/components/Breadcrumbs/Breadcrumbs";
import FieldDialog from "@/components/Dialogs/FieldDialog";
import { createSize, getSizes } from "@/shared/api/productSizes";
import { authRequestWrapper } from "@/shared/authRequestWrapper";
import getSizesColumns from "@/shared/columns/sizes";
import { Size } from "@/types/productSizes";
import { Box, Fab } from "@mui/material";
import { DataGrid, GridFilterModel } from "@mui/x-data-grid";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function AdminSizesPage() {
  const router = useRouter();

  const [sizes, setSizes] = useState<Size[]>([]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: [],
  });
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    const getSizesFromDB = async () => {
      const sizesRes = await getSizes();
      if (!sizesRes.ok || !sizesRes.data) {
        console.log(sizesRes.error);
        alert("Ошибка получения размеров");
        return;
      }
      setSizes(sizesRes.data);
    };

    getSizesFromDB();
  }, []);

  const saveSize = async (value: string) => {
    const createResponse = await authRequestWrapper(
      () => createSize(value),
      router
    );
    if (!createResponse.ok || !createResponse.data) {
      alert(`Не удалось добавить размер: ${createResponse.error}`);
      return;
    }
    setSizes((prev) => [...prev, createResponse.data as Size]);
  };

  const pathParts = [
    { name: "Админ-панель", url: "/admin/" },
    { name: "Размеры" },
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
        <div className={styles.title}>Размеры</div>
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
            label="Размеры"
            rows={sizes}
            columns={getSizesColumns(router)}
            autoPageSize
            pagination
            sortingOrder={["asc", "desc"]}
            filterMode="client"
            disableRowSelectionOnClick
            showToolbar
            loading={sizes.length ? false : true}
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
          label="Добавить размер"
          handleClose={() => setIsCreateOpen(false)}
          onSave={saveSize}
          bgcolor="success"
        />
      )}
    </main>
  );
}

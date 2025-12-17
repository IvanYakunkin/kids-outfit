"use client";

import FieldDialog from "@/components/Dialogs/FieldDialog";
import {
  createCharacteristic,
  getCharacteristics,
  updateCharacteristic,
} from "@/shared/api/productCharacteristics";
import { authRequestWrapper } from "@/shared/authRequestWrapper";
import getCharacteristicsColumns from "@/shared/columns/characteristics";
import { CharacteristicsDto } from "@/types/productCharacteristics";
import { Box, Fab, Paper } from "@mui/material";
import { DataGrid, GridFilterModel } from "@mui/x-data-grid";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function AdminCharacteristicsPage() {
  const router = useRouter();

  const [characteristics, setCharacteristics] = useState<CharacteristicsDto[]>(
    []
  );
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: [],
  });
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editCharId, setEditCharId] = useState<number | null>(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    const getCharsFromDB = async () => {
      const characteristicsRes = await getCharacteristics();
      if (!characteristicsRes.ok || !characteristicsRes.data) {
        console.log(characteristicsRes.error);
        alert("Ошибка получения характеристик");
        return;
      }
      setCharacteristics(characteristicsRes.data);
    };

    getCharsFromDB();
  }, []);

  const saveEditCharacteristic = async (newValue: string) => {
    if (newValue && editCharId) {
      const charUpdateRes = await authRequestWrapper(
        () => updateCharacteristic(editCharId, newValue),
        router
      );
      if (!charUpdateRes.ok) {
        alert("Не удалось изменить характеристику");
        console.log(charUpdateRes.error);
      } else {
        setCharacteristics((prev) =>
          prev?.map((char) =>
            char.id === editCharId ? { ...char, value: newValue } : char
          )
        );
      }
    }
  };

  const saveCreateCharacteristic = async (newValue: string) => {
    if (!newValue) return;
    const createRes = await createCharacteristic(newValue);
    if (!createRes.ok || !createRes.data) {
      alert(`Не удалось создать характеристику: ${createRes.error}`);
      console.log("Не удалось создать характеристику", createRes.error);
    } else {
      setIsCreateOpen(false);
      setCharacteristics([...characteristics, createRes.data]);
    }
  };

  const openEditPage = (id: number) => {
    setIsEditOpen(true);
    setEditCharId(id);
  };

  return (
    <main className={styles.main}>
      <div className={styles.title}>Характеристики</div>
      <div>
        <div style={{ width: "100%" }}>
          <Paper sx={{ height: 600 }}>
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
              label="Характеристики"
              rows={characteristics}
              columns={getCharacteristicsColumns(openEditPage, router)}
              autoPageSize
              pagination
              sortingOrder={["asc", "desc"]}
              filterMode="client"
              disableRowSelectionOnClick
              showToolbar
              loading={characteristics.length ? false : true}
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
          label="Создать характеристику"
          handleClose={() => setIsCreateOpen(false)}
          onSave={saveCreateCharacteristic}
          bgcolor="success"
        />
      )}

      {isEditOpen && (
        <FieldDialog
          label="Изменить значение характеристики"
          handleClose={() => setIsEditOpen(false)}
          onSave={saveEditCharacteristic}
          initialValue={
            characteristics?.find((c) => c.id === editCharId)?.value
          }
        />
      )}
    </main>
  );
}

"use client";
import Breadcrumbs from "@/app/components/Breadcrumbs/Breadcrumbs";
import { getProducts } from "@/shared/api/products";
import getProductColumns from "@/shared/columns/products";
import { PaginatedProductsDto, ProductResponseDto } from "@/types/products";
import { Box, Fab } from "@mui/material";
import { DataGrid, GridFilterModel, GridSortModel } from "@mui/x-data-grid";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function ProductsAdminPage() {
  const [rows, setRows] = useState<ProductResponseDto[]>([]);
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
  useEffect(() => {
    const getProductsData = async () => {
      setIsLoading(true);
      const searchText = filterModel.quickFilterValues?.[0];
      const productsResponse = await getProducts<PaginatedProductsDto>({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        ...(sortModel[0]?.field && { sort: sortModel[0].field }),
        ...(sortModel[0]?.sort
          ? { order: sortModel[0].sort.toUpperCase() as "ASC" | "DESC" }
          : {}),
        ...(searchText ? { search: searchText } : {}),
      });

      if (
        productsResponse.ok &&
        productsResponse.data &&
        productsResponse.data.data
      ) {
        setRows(productsResponse.data.data);
        setRowCount(productsResponse.data.meta.total);
      } else {
        console.log(
          "Не удалось получить список товаров",
          productsResponse.error
        );
      }
      setIsLoading(false);
    };

    getProductsData();
  }, [
    paginationModel.page,
    paginationModel.pageSize,
    sortModel,
    filterModel.quickFilterValues,
  ]);

  const pathParts = [
    { name: "Админ-панель", url: "/admin/" },
    { name: "Товары" },
  ];

  return (
    <main className={styles.admin}>
      <>
        <Breadcrumbs pathParts={pathParts} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 3,
            alignItems: "center",
          }}
        >
          <div className={styles.title}>Товары</div>
          <Fab color="success" href="/admin/products/create">
            <Image src="/images/add.png" width={20} height={20} alt="Add" />
          </Fab>
        </Box>
        <div style={{ width: "100%", height: 700 }}>
          <DataGrid
            label="Товары"
            rows={rows}
            columns={getProductColumns(router)}
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
      </>
    </main>
  );
}

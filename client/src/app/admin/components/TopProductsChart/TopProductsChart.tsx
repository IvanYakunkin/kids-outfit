"use client";

import { getProducts } from "@/shared/api/products";
import { PaginatedProductsDto } from "@/types/products";
import { Box, Paper, Typography, useTheme } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { useEffect, useState } from "react";

type ChartValue = string | number | boolean | null | undefined;

interface IChartProduct extends Record<string, ChartValue> {
  name: string;
  sales: number;
}

export default function TopProductsChart() {
  const theme = useTheme();
  const [products, setProducts] = useState<IChartProduct[]>([]);

  useEffect(() => {
    const findPopularProducts = async () => {
      const productsResponse = await getProducts<PaginatedProductsDto>({
        sort: "sold",
        limit: 5,
      });
      if (!productsResponse.ok || !productsResponse.data) {
        console.log(productsResponse.error);
        return;
      }
      const transformed: IChartProduct[] = productsResponse.data.data.map(
        (item) => ({
          name: item.name,
          sales: Number(item.sold),
        })
      );

      setProducts(transformed);
    };

    findPopularProducts();
  }, []);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        height: "100%",
      }}
    >
      <Typography variant="h6" fontWeight="600">
        Популярные товары
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Топ-5 товаров по количеству продаж
      </Typography>

      <Box sx={{ width: "100%", height: 300 }}>
        <BarChart
          layout="horizontal"
          dataset={products}
          yAxis={[
            {
              scaleType: "band",
              dataKey: "name",
            },
          ]}
          xAxis={[
            {
              label: "Продано (шт.)",
            },
          ]}
          series={[
            {
              dataKey: "sales",
              color: theme.palette.secondary.main,
              valueFormatter: (value) => `${value} шт.`,
            },
          ]}
          margin={{ left: 120, right: 20, top: 10, bottom: 50 }}
          borderRadius={5}
        />
      </Box>
    </Paper>
  );
}

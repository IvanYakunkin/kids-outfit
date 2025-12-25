"use client";

import { getSalesPerMonth, getSalesPerYear } from "@/shared/api/analytics";
import { YearlySalesResponseDto } from "@/types/analytics";
import {
  IFormattedSalesChart,
  IFormattedYearlySales,
} from "@/types/common/common";
import { Box, Paper, Stack, Tab, Tabs, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import React, { useEffect, useState } from "react";

export default function SalesChart() {
  const [activeTab, setActiveTab] = useState(0);
  const [monthlySales, setMonthlySales] = useState<IFormattedSalesChart[]>([]);
  const [yearlySales, setYearlySales] = useState<IFormattedYearlySales[]>([]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    async function findSalesPerMonth() {
      const salesResponse = await getSalesPerMonth();
      if (!salesResponse.ok || !salesResponse.data) {
        console.log(salesResponse.error);
        return;
      }

      const formattedSalesData = salesResponse.data.map((item) => ({
        ...item,
        displayDate: new Date(item.date).toLocaleDateString("ru-RU", {
          day: "numeric",
          month: "short",
        }),
        amount: item.sales,
      }));
      setMonthlySales(formattedSalesData);
    }

    findSalesPerMonth();
  }, []);

  useEffect(() => {
    async function findSalesPerYear() {
      const salesResponse = await getSalesPerYear();
      if (!salesResponse.ok || !salesResponse.data) {
        console.log(salesResponse.error);
        return;
      }
      const formattedYearly: IFormattedYearlySales[] = salesResponse.data.map(
        (item: YearlySalesResponseDto) => ({
          ...item,
          monthDisplay: new Date(item.month).toLocaleDateString("ru-RU", {
            month: "short",
          }),
        })
      );
      setYearlySales(formattedYearly);
    }

    findSalesPerYear();
  }, []);

  const soldPerMonth = monthlySales.reduce((acc, item) => acc + item.sales, 0);
  const soldPerYear = yearlySales.reduce((acc, item) => acc + item.sales, 0);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        sx={{ mb: 4 }}
      >
        <Box>
          <Typography variant="h6" fontWeight="600">
            {activeTab === 0 ? "Продажи за месяц" : "Продажи за год"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {activeTab === 0
              ? "Ежедневная выручка (текущий месяц)"
              : "Динамика выручки по месяцам"}
          </Typography>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="sales timeframe tabs"
          >
            <Tab
              label="Месяц"
              sx={{ textTransform: "none", fontWeight: 600 }}
            />
            <Tab label="Год" sx={{ textTransform: "none", fontWeight: 600 }} />
          </Tabs>
        </Box>
      </Stack>

      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" color="primary.main" fontWeight="bold">
          {activeTab === 0 ? `${soldPerMonth} Руб.` : `${soldPerYear} Руб.`}
        </Typography>
      </Box>

      <Box sx={{ width: "100%", height: 350 }}>
        {activeTab === 0 ? (
          <BarChart
            dataset={monthlySales}
            xAxis={[
              {
                scaleType: "band",
                dataKey: "displayDate",
              },
            ]}
            series={[
              {
                dataKey: "sales",
                label: "Продажи (руб.)",
                color: "#0288d1",
                valueFormatter: (value) => `${value} ₽`,
              },
            ]}
            borderRadius={4}
            margin={{ top: 10, bottom: 50, left: 60, right: 10 }}
            hideLegend
          />
        ) : (
          <LineChart
            dataset={yearlySales}
            xAxis={[
              {
                scaleType: "band",
                dataKey: "month",
              },
            ]}
            series={[
              {
                dataKey: "sales",
                label: "Выручка (руб.)",
                color: "#2e7d32",
                area: true,
                valueFormatter: (value) => `${value?.toLocaleString()} ₽`,
              },
            ]}
            margin={{ top: 10, bottom: 50, left: 60, right: 10 }}
            hideLegend
          />
        )}
      </Box>
    </Paper>
  );
}

"use client";

import { VisitorsHistoryDto } from "@/types/analytics";
import { Box, Paper, Typography, useTheme } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";

interface Props {
  history: VisitorsHistoryDto[];
}

export interface IVisitsChartData extends VisitorsHistoryDto {
  [key: string]: string | number;
}

export default function VisitsChart({ history }: Props) {
  const theme = useTheme();

  const formattedDataset: IVisitsChartData[] = history.map((item) => ({
    ...item,
    dateDisplay: new Date(item.date).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "short",
    }),
  }));

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        height: "100%",
        minHeight: 400,
      }}
    >
      <Typography variant="h6" fontWeight="600" gutterBottom>
        Посещаемость
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Уникальные посетители за последние 30 дней
      </Typography>

      <Box sx={{ width: "100%", height: 300 }}>
        <LineChart
          dataset={formattedDataset}
          xAxis={[
            {
              dataKey: "dateDisplay",
              scaleType: "point",
              tickLabelStyle: { fontSize: 12 },
              tickInterval: (value, index) => index % 5 === 0,
            },
          ]}
          series={[
            {
              dataKey: "count",
              label: "Посетители",
              color: theme.palette.primary.main,
              area: true,
              showMark: true,
              valueFormatter: (value) => `${value} чел.`,
            },
          ]}
          margin={{ left: 50, right: 20, top: 20, bottom: 50 }}
          hideLegend
          sx={{
            ".MuiLineElement-root": {
              strokeWidth: 3,
            },
            ".MuiAreaElement-root": {
              fill: `url(#gradient-${theme.palette.primary.main})`,
              opacity: 0.2,
            },
          }}
        />
      </Box>
    </Paper>
  );
}

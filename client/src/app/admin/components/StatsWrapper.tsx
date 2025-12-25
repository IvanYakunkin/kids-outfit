import { getKpis } from "@/shared/api/analytics";
import { Paper, Typography } from "@mui/material";
import { cookies } from "next/headers";
import SalesChart from "./SalesChart/SalesChart";
import Statistics from "./Statistics/Statistics";
import TopProductsChart from "./TopProductsChart/TopProductsChart";
import VisitsChart from "./VisitsChart/VisitsChart";

export default async function StatsWrapper() {
  const cookieStore = await cookies();
  const cookiesHeader = cookieStore.toString();
  const adminKPIs = await getKpis(cookiesHeader);

  if (!adminKPIs.ok || !adminKPIs.data) {
    return (
      <Paper
        sx={{
          p: 3,
          textAlign: "center",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography color="text.secondary">
          Не удалось загрузить статистику. Пожалуйста, обновите страницу.
        </Typography>
      </Paper>
    );
  }

  return (
    <>
      <Statistics adminKPIs={adminKPIs.data} />
      <SalesChart />
      <VisitsChart history={adminKPIs.data.visitors.history} />
      <TopProductsChart />
    </>
  );
}

import { DashboardKpis } from "@/types/analytics";
import { Box } from "@mui/material";
import MetricCard from "./MetricCart";
import styles from "./Statistics.module.css";

interface StatisticsProps {
  adminKPIs: DashboardKpis;
}

export default async function Statistics({ adminKPIs }: StatisticsProps) {
  const visitorsYesterday = adminKPIs.visitors.history.at(-1)?.count || 0;
  const visitorsDiff = adminKPIs.visitors.today - visitorsYesterday;
  const visitorsTrend = visitorsDiff >= 0 ? "up" : "down";

  return (
    <Box>
      <div className={styles.subtitle}>Статистика</div>

      <Box sx={{ display: "flex", gap: 2 }}>
        <MetricCard
          title="Выручка за месяц"
          value={`${adminKPIs.revenue.total} ₽`}
          change={`${adminKPIs.revenue.trend}%`}
          icon="💰"
        />
        <MetricCard
          title="Заказов за месяц"
          value={adminKPIs.orders.total}
          change={`+${adminKPIs.orders.added}`}
          icon="📦"
        />
        <MetricCard
          title="Клиентов за месяц"
          value={adminKPIs.customers.total}
          change={`+${adminKPIs.customers.added}`}
          icon="👥"
        />
        <MetricCard
          title="Уникальных посетителей за сегодня"
          value={adminKPIs.visitors.today}
          change={
            visitorsDiff > 0
              ? `+${visitorsDiff.toString()}`
              : visitorsDiff.toString()
          }
          trend={visitorsTrend}
          icon="📈"
        />
      </Box>
    </Box>
  );
}

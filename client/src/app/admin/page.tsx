import { Box, CircularProgress } from "@mui/material";
import { Suspense } from "react";
import Breadcrumbs from "../components/Breadcrumbs/Breadcrumbs";
import AdminNavigation from "./components/AdminNavigation/AdminNavigation";
import RecentOrdersTable from "./components/RecentOrdersTable/RecentOrdersTable";
import StatsWrapper from "./components/StatsWrapper";
import styles from "./page.module.css";

export default function AdminPage() {
  const pathParts = [{ name: "Админ-панель" }];

  return (
    <main className={styles.main}>
      <Breadcrumbs pathParts={pathParts} />
      <div className={styles.title}>Админ-панель</div>
      <div className={styles.content}>
        <Suspense fallback={<>Loading...</>}>
          <AdminNavigation />
        </Suspense>

        <Suspense
          fallback={
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "700px",
              }}
            >
              <CircularProgress />
            </Box>
          }
        >
          <StatsWrapper />
        </Suspense>

        <RecentOrdersTable />
      </div>
    </main>
  );
}

import { Card, CardContent, Stack, Typography } from "@mui/material";
import { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon?: ReactNode;
  trend?: "up" | "down";
  description?: string;
}

export default function MetricCard({
  title,
  value,
  change,
  icon,
  trend = "up",
  description,
}: MetricCardProps) {
  const isPositive = trend === "up";
  const changeColor = isPositive ? "#10B981" : "#EF4444";

  return (
    <Card variant="outlined" sx={{ flex: 1, borderRadius: 2, boxShadow: 1 }}>
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            {title}
          </Typography>

          <Typography variant="h4" fontWeight="bold">
            {value}
          </Typography>

          {(change || description) && (
            <Stack direction="row" alignItems="center" spacing={1}>
              {change && (
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  {isPositive ? <>{icon}</> : <>{icon}</>}
                  <Typography
                    variant="body2"
                    sx={{ color: changeColor, fontWeight: 500 }}
                  >
                    {change}
                  </Typography>
                </Stack>
              )}
              {description && (
                <Typography variant="body2" color="text.secondary">
                  {description}
                </Typography>
              )}
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

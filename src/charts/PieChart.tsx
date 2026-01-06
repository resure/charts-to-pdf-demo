import React from "react";
import { Chart } from "@gravity-ui/charts";
import type { PieChartSegment } from "./chartData";

interface PieChartProps {
  data: PieChartSegment[];
}

export const PieChart: React.FC<PieChartProps> = ({ data }) => {
  const chartData = {
    series: {
      data: [
        {
          type: "pie" as const,
          data: data.map((segment) => ({
            name: segment.name,
            value: segment.value,
          })),
        },
      ],
    },
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Chart data={chartData} />
    </div>
  );
};

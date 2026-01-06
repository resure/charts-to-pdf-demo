import type { ChartData, PieChartSegment } from "../charts/chartData";

export interface PptxChartSeries {
  name: string;
  labels: string[];
  values: number[];
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function convertChartData(data: ChartData): PptxChartSeries[] {
  return data.series.map((series) => {
    const labels: string[] = [];
    const values: number[] = [];

    series.data.forEach(([timestamp, value]) => {
      labels.push(formatDate(timestamp));
      values.push(value);
    });

    return {
      name: series.name,
      labels,
      values,
    };
  });
}

export function convertPieChartData(pieData: PieChartSegment[]): PptxChartSeries[] {
  return [
    {
      name: "Distribution",
      labels: pieData.map((segment) => segment.name),
      values: pieData.map((segment) => segment.value),
    },
  ];
}

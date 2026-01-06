export interface ChartDataPoint {
  timestamp: number;
  value: number;
}

export interface ChartSeries {
  name: string;
  data: [number, number][]; // [timestamp, value]
}

export interface PieChartSegment {
  name: string;
  value: number;
  color?: string;
}

export interface ChartData {
  title: string;
  subtitle?: string;
  series: ChartSeries[];
  pieData?: PieChartSegment[];
  description?: string;
  links?: { label: string; url: string }[];
}

// Mock data for demonstration
export const chartData: ChartData = {
  title: "Monthly Revenue Growth",
  subtitle: "Comparison between 2024 and 2025",
  description:
    "Our revenue has shown consistent growth over the past two years. The 2025 projections indicate a 25% increase compared to 2024, driven by new product launches and market expansion.",
  links: [
    { label: "Full Report", url: "https://example.com/report" },
    { label: "Documentation", url: "https://example.com/docs" },
  ],
  pieData: [
    { name: "Product A", value: 35 },
    { name: "Product B", value: 25 },
    { name: "Product C", value: 20 },
    { name: "Product D", value: 12 },
    { name: "Other", value: 8 },
  ],
  series: [
    {
      name: "2024",
      data: [
        [Date.parse("2024-01-01"), 1500],
        [Date.parse("2024-02-01"), 2300],
        [Date.parse("2024-03-01"), 2100],
        [Date.parse("2024-04-01"), 2800],
        [Date.parse("2024-05-01"), 3200],
        [Date.parse("2024-06-01"), 3500],
        [Date.parse("2024-07-01"), 3800],
        [Date.parse("2024-08-01"), 4100],
        [Date.parse("2024-09-01"), 4300],
        [Date.parse("2024-10-01"), 4600],
        [Date.parse("2024-11-01"), 4900],
        [Date.parse("2024-12-01"), 5200],
      ],
    },
    {
      name: "2025",
      data: [
        [Date.parse("2024-01-01"), 1800],
        [Date.parse("2024-02-01"), 2600],
        [Date.parse("2024-03-01"), 2500],
        [Date.parse("2024-04-01"), 3200],
        [Date.parse("2024-05-01"), 3700],
        [Date.parse("2024-06-01"), 4100],
        [Date.parse("2024-07-01"), 4500],
        [Date.parse("2024-08-01"), 4900],
        [Date.parse("2024-09-01"), 5200],
        [Date.parse("2024-10-01"), 5600],
        [Date.parse("2024-11-01"), 6000],
        [Date.parse("2024-12-01"), 6500],
      ],
    },
  ],
};

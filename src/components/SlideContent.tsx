import React from "react";
import { LineChart } from "../charts/LineChart";
import type { ChartData } from "../charts/chartData";

interface SlideContentProps {
  data: ChartData;
}

export const SlideContent: React.FC<SlideContentProps> = ({ data }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <h1 style={{ margin: 0, marginBottom: "8px", fontSize: "32px", color: "#363636" }}>
        {data.title}
      </h1>
      {data.subtitle && (
        <p style={{ margin: 0, marginBottom: "24px", fontSize: "16px", color: "#666666" }}>
          {data.subtitle}
        </p>
      )}
      <div style={{ flex: 1, minHeight: 0 }}>
        <LineChart series={data.series} />
      </div>
    </div>
  );
};

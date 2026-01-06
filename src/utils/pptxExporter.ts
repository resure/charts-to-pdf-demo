import pptxgen from "pptxgenjs";
import type { ChartData } from "../charts/chartData";
import { convertChartData } from "./chartConverter";

export async function exportToPPTX(data: ChartData): Promise<void> {
  const pptx = new pptxgen();

  // Set 16:9 layout
  pptx.layout = "LAYOUT_16x9";

  // Add a slide
  const slide = pptx.addSlide();

  // Add title
  slide.addText(data.title, {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.6,
    fontSize: 32,
    bold: true,
    color: "363636",
  });

  // Add subtitle if exists
  if (data.subtitle) {
    slide.addText(data.subtitle, {
      x: 0.5,
      y: 0.9,
      w: 9,
      h: 0.3,
      fontSize: 16,
      color: "666666",
    });
  }

  // Convert and add chart
  const chartDataForPptx = convertChartData(data);

  slide.addChart(pptx.ChartType.line, chartDataForPptx, {
    x: 0.5,
    y: 1.5,
    w: 9,
    h: 4.5,
    showLegend: true,
    legendPos: "r",
    chartColors: ["0066CC", "00CC66"],
    lineSize: 3,
    showTitle: false,
  });

  // Download the file
  await pptx.writeFile({ fileName: "presentation.pptx" });
}

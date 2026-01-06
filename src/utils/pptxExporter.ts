import PptxGenJS from 'pptxgenjs';
import type {ChartData} from '../charts/chartData';
import {convertChartData, convertPieChartData} from './chartConverter';

export async function exportToPPTX(data: ChartData): Promise<void> {
    const pptx = new PptxGenJS();

    // Set 16:9 layout
    pptx.layout = 'LAYOUT_16x9';

    // Add a slide
    const slide = pptx.addSlide();

    let currentY = 0.3;

    // Add title
    slide.addText(data.title, {
        x: 0.5,
        y: currentY,
        w: 9,
        h: 0.5,
        fontSize: 28,
        bold: true,
        color: '363636',
    });
    currentY += 0.5;

    // Add subtitle if exists
    if (data.subtitle) {
        slide.addText(data.subtitle, {
            x: 0.5,
            y: currentY,
            w: 9,
            h: 0.3,
            fontSize: 14,
            color: '666666',
        });
        currentY += 0.35;
    }

    // Add description if exists
    if (data.description) {
        slide.addText(data.description, {
            x: 0.5,
            y: currentY,
            w: 9,
            h: 0.5,
            fontSize: 11,
            color: '444444',
        });
        currentY += 0.55;
    }

    // Add links if exist
    if (data.links && data.links.length > 0) {
        const linksText = data.links.map((link) => ({
            text: link.label + '  ',
            options: {
                hyperlink: {url: link.url},
                color: '0066CC',
                fontSize: 11,
            },
        }));
        slide.addText(linksText, {
            x: 0.5,
            y: currentY,
            w: 9,
            h: 0.3,
        });
        currentY += 0.4;
    }

    const chartY = currentY + 0.1;
    const chartHeight = 5.5 - chartY;

    // Convert and add line chart
    const chartDataForPptx = convertChartData(data);
    const lineChartWidth = data.pieData ? 5.5 : 9;

    slide.addChart(pptx.ChartType.line, chartDataForPptx, {
        x: 0.5,
        y: chartY,
        w: lineChartWidth,
        h: chartHeight,
        showLegend: true,
        legendPos: 'b',
        chartColors: ['0066CC', '00CC66'],
        lineSize: 2,
        showTitle: false,
    });

    // Add pie chart if data exists
    if (data.pieData) {
        const pieDataForPptx = convertPieChartData(data.pieData);
        slide.addChart(pptx.ChartType.pie, pieDataForPptx, {
            x: 6.2,
            y: chartY,
            w: 3.5,
            h: chartHeight,
            showLegend: true,
            legendPos: 'b',
            showTitle: false,
            showPercent: true,
        });
    }

    // Download the file
    await pptx.writeFile({fileName: 'presentation.pptx'});
}

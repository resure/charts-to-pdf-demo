import React from 'react';
import type {ChartData as GravityChartData} from '@gravity-ui/charts';
import {Chart} from '@gravity-ui/charts';
import type {ChartSeries} from './chartData';

interface LineChartProps {
    title?: string;
    series: ChartSeries[];
}

export const LineChart: React.FC<LineChartProps> = ({title, series}) => {
    // Transform data to Gravity UI Charts format
    const chartData = {
        series: {
            data: series.map((s) => ({
                type: 'line' as const,
                name: s.name,
                data: s.data.map(([x, y]) => ({x, y})),
            })),
        },
        xAxis: [
            {
                type: 'datetime' as const,
            },
        ],
        yAxis: [
            {
                title: {
                    text: 'Revenue ($)',
                },
            },
        ],
        title: title
            ? {
                  text: title,
              }
            : undefined,
    };

    return (
        <div style={{width: '100%', height: '100%'}}>
            <Chart data={chartData as GravityChartData} />
        </div>
    );
};

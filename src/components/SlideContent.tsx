import React from 'react';
import {Link} from '@gravity-ui/uikit';
import {LineChart} from '../charts/LineChart';
import {PieChart} from '../charts/PieChart';
import type {ChartData} from '../charts/chartData';

interface SlideContentProps {
    data: ChartData;
}

export const SlideContent: React.FC<SlideContentProps> = ({data}) => {
    return (
        <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
            <h1
                data-element="title"
                style={{margin: 0, marginBottom: '8px', fontSize: '28px', color: '#363636'}}
            >
                {data.title}
            </h1>
            {data.subtitle && (
                <p
                    data-element="subtitle"
                    style={{margin: 0, marginBottom: '12px', fontSize: '14px', color: '#666666'}}
                >
                    {data.subtitle}
                </p>
            )}

            {data.description && (
                <p
                    data-element="description"
                    style={{
                        margin: 0,
                        marginBottom: '16px',
                        fontSize: '13px',
                        color: '#444444',
                        lineHeight: 1.5,
                    }}
                >
                    {data.description}
                </p>
            )}

            {data.links && data.links.length > 0 && (
                <div
                    data-element="links"
                    style={{marginBottom: '16px', display: 'flex', gap: '16px'}}
                >
                    {data.links.map((link, index) => (
                        <Link key={index} href={link.url} target="_blank">
                            {link.label}
                        </Link>
                    ))}
                </div>
            )}

            <div style={{flex: 1, minHeight: 0, display: 'flex', gap: '20px'}}>
                <div data-chart="line" style={{flex: 2, minWidth: 0}}>
                    <LineChart series={data.series} />
                </div>
                {data.pieData && (
                    <div data-chart="pie" style={{flex: 1, minWidth: 0}}>
                        <PieChart data={data.pieData} />
                    </div>
                )}
            </div>
        </div>
    );
};

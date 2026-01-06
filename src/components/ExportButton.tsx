import React, {useState} from 'react';
import {Button} from '@gravity-ui/uikit';
import type {ChartData} from '../charts/chartData';
import {exportToPPTX} from '../utils/pptxExporter';
import {exportToPDF} from '../utils/pdfExporter';
import {exportToPPTXWithImages} from '../utils/pptxImageExporter';
import {exportToPNG} from '../utils/pngExporter';

interface ExportButtonProps {
    data: ChartData;
    slideRef?: React.RefObject<HTMLDivElement | null>;
}

export const ExportButton: React.FC<ExportButtonProps> = ({data, slideRef}) => {
    const [loadingPptx, setLoadingPptx] = useState(false);
    const [loadingPdf, setLoadingPdf] = useState(false);
    const [loadingPptxAlt, setLoadingPptxAlt] = useState(false);
    const [loadingPng, setLoadingPng] = useState(false);

    const handleExportPptx = async () => {
        setLoadingPptx(true);
        try {
            await exportToPPTX(data);
        } catch (error) {
            console.error('Error exporting to PPTX:', error);
            alert('Failed to export PPTX. Please check the console for details.');
        } finally {
            setLoadingPptx(false);
        }
    };

    const handleExportPdf = async () => {
        if (!slideRef?.current) {
            alert('Slide element not found');
            return;
        }
        setLoadingPdf(true);
        try {
            await exportToPDF(slideRef.current);
        } catch (error) {
            console.error('Error exporting to PDF:', error);
            alert('Failed to export PDF. Please check the console for details.');
        } finally {
            setLoadingPdf(false);
        }
    };

    const handleExportPptxAlt = async () => {
        if (!slideRef?.current) {
            alert('Slide element not found');
            return;
        }
        setLoadingPptxAlt(true);
        try {
            await exportToPPTXWithImages(data, slideRef.current);
        } catch (error) {
            console.error('Error exporting to PPTX (alternate):', error);
            alert('Failed to export PPTX. Please check the console for details.');
        } finally {
            setLoadingPptxAlt(false);
        }
    };

    const handleExportPng = async () => {
        if (!slideRef?.current) {
            alert('Slide element not found');
            return;
        }
        setLoadingPng(true);
        try {
            await exportToPNG(slideRef.current);
        } catch (error) {
            console.error('Error exporting to PNG:', error);
            alert('Failed to export PNG. Please check the console for details.');
        } finally {
            setLoadingPng(false);
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '16px',
                padding: '20px',
                flexWrap: 'wrap',
            }}
        >
            <Button size="xl" view="normal" onClick={handleExportPptx} loading={loadingPptx}>
                Export to PPTX (native)
            </Button>
            <Button size="xl" view="normal" onClick={handleExportPptxAlt} loading={loadingPptxAlt}>
                Export to PPTX (charts as images)
            </Button>
            <Button size="xl" view="normal" onClick={handleExportPdf} loading={loadingPdf}>
                Export to PDF
            </Button>
            <Button size="xl" view="normal" onClick={handleExportPng} loading={loadingPng}>
                Export to PNG
            </Button>
        </div>
    );
};

import {jsPDF} from 'jspdf';
import html2canvas from 'html2canvas';

interface LinkInfo {
    url: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

function extractLinks(element: HTMLElement): LinkInfo[] {
    const links: LinkInfo[] = [];
    const linkElements = element.querySelectorAll('a[href]');
    const elementRect = element.getBoundingClientRect();

    linkElements.forEach((link) => {
        const rect = link.getBoundingClientRect();
        const href = link.getAttribute('href');

        if (href) {
            links.push({
                url: href,
                x: rect.left - elementRect.left,
                y: rect.top - elementRect.top,
                width: rect.width,
                height: rect.height,
            });
        }
    });

    return links;
}

export async function exportToPDF(slideElement: HTMLElement): Promise<void> {
    // Extract links before rendering to canvas
    const links = extractLinks(slideElement);
    const elementRect = slideElement.getBoundingClientRect();

    // Create canvas from the slide element
    const canvas = await html2canvas(slideElement, {
        scale: 2, // Higher quality
        useCORS: true,
        backgroundColor: '#ffffff',
    });

    // Create PDF with 16:9 aspect ratio (landscape)
    const pdf = new jsPDF({
        // eslint-disable-line new-cap
        orientation: 'landscape',
        unit: 'mm',
        format: [254, 143], // 16:9 ratio in mm
    });

    // Calculate dimensions to fit the slide
    const pdfWidth = 254;
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    // Scale factors from element pixels to PDF mm
    const scaleX = pdfWidth / elementRect.width;
    const scaleY = pdfHeight / elementRect.height;

    // Add the image to the PDF
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

    // Add clickable link annotations
    links.forEach((link) => {
        const x = link.x * scaleX;
        const y = link.y * scaleY;
        const width = link.width * scaleX;
        const height = link.height * scaleY;

        pdf.link(x, y, width, height, {url: link.url});
    });

    // Download the PDF
    pdf.save('presentation.pdf');
}

import {type GState, jsPDF} from 'jspdf';
import html2canvas from 'html2canvas';

interface LinkInfo {
    url: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

interface TextInfo {
    text: string;
    x: number;
    y: number;
    fontSize: number;
    width: number;
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

function extractTextElements(element: HTMLElement): TextInfo[] {
    const textElements: TextInfo[] = [];
    const elementRect = element.getBoundingClientRect();

    // Find text-containing elements (headings, paragraphs, links)
    const textSelectors = 'h1, h2, h3, h4, h5, h6, p, a, span, div';
    const candidates = element.querySelectorAll(textSelectors);

    candidates.forEach((el) => {
        // Only process leaf text nodes or elements with direct text
        const directText = Array.from(el.childNodes)
            .filter((node) => node.nodeType === Node.TEXT_NODE)
            .map((node) => node.textContent?.trim())
            .filter(Boolean)
            .join(' ');

        if (directText) {
            const rect = el.getBoundingClientRect();
            const style = window.getComputedStyle(el);
            const fontSize = parseFloat(style.fontSize);

            textElements.push({
                text: directText,
                x: rect.left - elementRect.left,
                y: rect.top - elementRect.top,
                fontSize,
                width: rect.width,
            });
        }
    });

    return textElements;
}

export async function exportToPDF(slideElement: HTMLElement): Promise<void> {
    // Extract links and text before rendering to canvas
    const links = extractLinks(slideElement);
    const textElements = extractTextElements(slideElement);
    const elementRect = slideElement.getBoundingClientRect();

    // Create canvas from the slide element
    const canvas = await html2canvas(slideElement, {
        scale: 2, // Higher quality
        useCORS: true,
        backgroundColor: '#ffffff',
    });

    // Create PDF with 16:9 aspect ratio (landscape)
    // eslint-disable-next-line new-cap
    const pdf = new jsPDF({
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

    // Add invisible text layer for copy/paste support
    // Use GState to make text fully transparent
    const invisibleTextState: GState = {opacity: 0, 'stroke-opacity': 0};
    // eslint-disable-next-line new-cap
    pdf.setGState(pdf.GState(invisibleTextState));

    textElements.forEach((textEl) => {
        // Convert font size: pixels -> mm (scaled) -> points
        // 1pt = 0.353mm, so points = mm / 0.353
        const fontSizeInMm = textEl.fontSize * scaleY;
        const fontSizePt = fontSizeInMm / 0.353;
        pdf.setFontSize(fontSizePt);

        const x = textEl.x * scaleX;
        // PDF text y is at baseline, offset from top by ~80% of font height (in mm)
        const y = textEl.y * scaleY + fontSizeInMm * 0.8;

        pdf.text(textEl.text, x, y, {
            maxWidth: textEl.width * scaleX,
        });
    });

    // Reset GState for link annotations
    // eslint-disable-next-line new-cap
    pdf.setGState(pdf.GState({opacity: 1, 'stroke-opacity': 1}));

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

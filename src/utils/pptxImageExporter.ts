import pptxgen from 'pptxgenjs';
import html2canvas from 'html2canvas';
import type {ChartData} from '../charts/chartData';

interface ElementPosition {
    x: number;
    y: number;
    w: number;
    h: number;
}

interface TextStyles {
    fontSize: number;
    color: string;
    bold: boolean;
    fontFace: string;
    align: 'left' | 'center' | 'right' | 'justify';
}

function getRelativePosition(
    element: Element,
    container: HTMLElement,
    scaleX: number,
    scaleY: number,
): ElementPosition {
    const elemRect = element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    return {
        x: (elemRect.left - containerRect.left) * scaleX,
        y: (elemRect.top - containerRect.top) * scaleY,
        w: elemRect.width * scaleX,
        h: elemRect.height * scaleY,
    };
}

function getComputedTextStyles(element: Element): TextStyles {
    const computed = window.getComputedStyle(element);

    // Convert px to pt (1px ≈ 0.75pt)
    const fontSizePx = parseFloat(computed.fontSize);
    const fontSize = Math.round(fontSizePx * 0.75);

    // Convert rgb/rgba to hex
    const rgbMatch = computed.color.match(/\d+/g);
    let color = '000000';
    if (rgbMatch && rgbMatch.length >= 3) {
        const r = parseInt(rgbMatch[0], 10).toString(16).padStart(2, '0');
        const g = parseInt(rgbMatch[1], 10).toString(16).padStart(2, '0');
        const b = parseInt(rgbMatch[2], 10).toString(16).padStart(2, '0');
        color = `${r}${g}${b}`;
    }

    const fontWeight = parseInt(computed.fontWeight, 10) || 400;
    const bold = fontWeight >= 700;

    // Extract font family (first one, clean up quotes)
    const fontFace = computed.fontFamily.split(',')[0].replace(/["']/g, '').trim();

    // Extract text alignment
    const textAlign = computed.textAlign as 'left' | 'center' | 'right' | 'justify';
    const align = ['left', 'center', 'right', 'justify'].includes(textAlign) ? textAlign : 'left';

    return {fontSize, color, bold, fontFace, align};
}

export async function exportToPPTXWithImages(
    data: ChartData,
    slideElement: HTMLElement,
): Promise<void> {
    // eslint-disable-next-line new-cap
    const pptx = new pptxgen();

    // Set 16:9 layout
    pptx.layout = 'LAYOUT_16x9';

    // Get slide dimensions for scaling calculations
    const slideRect = slideElement.getBoundingClientRect();
    const slideWidth = slideRect.width;
    const slideHeight = slideRect.height;

    // PowerPoint slide dimensions in inches (16:9)
    const pptWidth = 10;
    const pptHeight = 5.625;

    // Scale factors
    const scaleX = pptWidth / slideWidth;
    const scaleY = pptHeight / slideHeight;

    // Add a slide with white background
    const slide = pptx.addSlide();
    slide.background = {color: 'FFFFFF'};

    // Add native title
    const titleEl = slideElement.querySelector('[data-element="title"]');
    if (titleEl) {
        const pos = getRelativePosition(titleEl, slideElement, scaleX, scaleY);
        const styles = getComputedTextStyles(titleEl);
        slide.addText(data.title, {
            x: pos.x,
            y: pos.y,
            w: pos.w,
            h: pos.h,
            fontSize: styles.fontSize,
            bold: styles.bold,
            color: styles.color,
            fontFace: styles.fontFace,
            align: styles.align,
            valign: 'top',
        });
    }

    // Add native subtitle
    const subtitleEl = slideElement.querySelector('[data-element="subtitle"]');
    if (data.subtitle && subtitleEl) {
        const pos = getRelativePosition(subtitleEl, slideElement, scaleX, scaleY);
        const styles = getComputedTextStyles(subtitleEl);
        slide.addText(data.subtitle, {
            x: pos.x,
            y: pos.y,
            w: pos.w,
            h: pos.h,
            fontSize: styles.fontSize,
            color: styles.color,
            fontFace: styles.fontFace,
            align: styles.align,
            valign: 'top',
        });
    }

    // Add native description
    const descriptionEl = slideElement.querySelector('[data-element="description"]');
    if (data.description && descriptionEl) {
        const pos = getRelativePosition(descriptionEl, slideElement, scaleX, scaleY);
        const styles = getComputedTextStyles(descriptionEl);
        slide.addText(data.description, {
            x: pos.x,
            y: pos.y,
            w: pos.w,
            h: pos.h,
            fontSize: styles.fontSize,
            color: styles.color,
            fontFace: styles.fontFace,
            align: styles.align,
            valign: 'top',
        });
    }

    // Add native links with hyperlinks
    const linksContainer = slideElement.querySelector('[data-element="links"]');
    if (data.links && data.links.length > 0 && linksContainer) {
        const linkElements = linksContainer.querySelectorAll('a');

        linkElements.forEach((linkEl, index) => {
            if (index < data.links!.length) {
                const pos = getRelativePosition(linkEl, slideElement, scaleX, scaleY);
                const styles = getComputedTextStyles(linkEl);
                slide.addText(data.links![index].label, {
                    x: pos.x,
                    y: pos.y,
                    w: pos.w * 1.5,
                    h: pos.h,
                    fontSize: styles.fontSize,
                    color: styles.color,
                    fontFace: styles.fontFace,
                    align: styles.align,
                    hyperlink: {url: data.links![index].url},
                    valign: 'top',
                });
            }
        });
    }

    // Capture and add chart images
    const chartContainers = slideElement.querySelectorAll('[data-chart]');

    for (const chartContainer of chartContainers) {
        const htmlContainer = chartContainer as HTMLElement;

        // Get position before capturing
        const pos = getRelativePosition(chartContainer, slideElement, scaleX, scaleY);

        // Capture the chart as an image
        const canvas = await html2canvas(htmlContainer, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
        });

        const imgData = canvas.toDataURL('image/png');

        // Add the chart image to the slide
        slide.addImage({
            data: imgData,
            x: pos.x,
            y: pos.y,
            w: pos.w,
            h: pos.h,
        });
    }

    // Download the file
    await pptx.writeFile({fileName: 'presentation-styled.pptx'});
}

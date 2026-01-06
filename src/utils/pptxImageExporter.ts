import pptxgen from 'pptxgenjs';
import html2canvas from 'html2canvas';
import type {ChartData} from '../charts/chartData';

interface ElementPosition {
    x: number;
    y: number;
    w: number;
    h: number;
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
        slide.addText(data.title, {
            x: pos.x,
            y: pos.y,
            w: pos.w,
            h: pos.h,
            fontSize: 28,
            bold: true,
            color: '363636',
            valign: 'top',
        });
    }

    // Add native subtitle
    const subtitleEl = slideElement.querySelector('[data-element="subtitle"]');
    if (data.subtitle && subtitleEl) {
        const pos = getRelativePosition(subtitleEl, slideElement, scaleX, scaleY);
        slide.addText(data.subtitle, {
            x: pos.x,
            y: pos.y,
            w: pos.w,
            h: pos.h,
            fontSize: 14,
            color: '666666',
            valign: 'top',
        });
    }

    // Add native description
    const descriptionEl = slideElement.querySelector('[data-element="description"]');
    if (data.description && descriptionEl) {
        const pos = getRelativePosition(descriptionEl, slideElement, scaleX, scaleY);
        slide.addText(data.description, {
            x: pos.x,
            y: pos.y,
            w: pos.w,
            h: pos.h,
            fontSize: 11,
            color: '444444',
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
                slide.addText(data.links![index].label, {
                    x: pos.x,
                    y: pos.y,
                    w: pos.w * 1.5,
                    h: pos.h,
                    fontSize: 11,
                    color: '0066CC',
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

import html2canvas from 'html2canvas';

export async function exportToPNG(slideElement: HTMLElement): Promise<void> {
    // Temporarily remove scale transform to capture at full size
    const originalTransform = slideElement.style.transform;
    slideElement.style.transform = 'none';

    // Force reflow to ensure layout is recalculated
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    slideElement.offsetHeight;

    // Create canvas from the slide element
    const canvas = await html2canvas(slideElement, {
        scale: 2, // Higher quality
        useCORS: true,
        backgroundColor: '#ffffff',
    });

    // Restore original transform
    slideElement.style.transform = originalTransform;

    // Convert canvas to blob and download
    canvas.toBlob((blob) => {
        if (!blob) {
            throw new Error('Failed to create PNG blob');
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'presentation.png';
        link.click();

        // Clean up
        URL.revokeObjectURL(url);
    }, 'image/png');
}

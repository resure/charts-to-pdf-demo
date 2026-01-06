import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export async function exportToPDF(slideElement: HTMLElement): Promise<void> {
  // Create canvas from the slide element
  const canvas = await html2canvas(slideElement, {
    scale: 2, // Higher quality
    useCORS: true,
    backgroundColor: "#ffffff",
  });

  // Create PDF with 16:9 aspect ratio (landscape)
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [254, 143], // 16:9 ratio in mm
  });

  // Calculate dimensions to fit the slide
  const imgWidth = 254;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  // Add the image to the PDF
  const imgData = canvas.toDataURL("image/png");
  pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

  // Download the PDF
  pdf.save("presentation.pdf");
}

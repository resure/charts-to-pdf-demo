import React, { useState } from "react";
import { Button } from "@gravity-ui/uikit";
import type { ChartData } from "../charts/chartData";
import { exportToPPTX } from "../utils/pptxExporter";

interface ExportButtonProps {
  data: ChartData;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      await exportToPPTX(data);
    } catch (error) {
      console.error("Error exporting to PPTX:", error);
      alert("Failed to export presentation. Please check the console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
      <Button size="xl" view="action" onClick={handleExport} loading={loading}>
        Export to PPTX
      </Button>
    </div>
  );
};

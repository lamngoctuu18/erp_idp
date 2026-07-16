import { useState } from "react";
import { Button } from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";
import { NotificationExtension } from "../../extension/NotificationExtension";

export interface ExportButtonProps {
  onClick: () => Promise<void>;
  fileName?: string;
  label?: string;
}

export function ExportButton({
  onClick,
  fileName = "export_data.xlsx",
  label = "Xuất Excel",
}: ExportButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      await onClick();
    } catch (err) {
      console.error("Export error:", err);
      NotificationExtension.Fails("Lỗi khi xuất dữ liệu ra Excel.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      color="green"
      variant="outline"
      leftSection={<IconDownload size={14} />}
      loading={loading}
      onClick={handleExport}
    >
      {label}
    </Button>
  );
}

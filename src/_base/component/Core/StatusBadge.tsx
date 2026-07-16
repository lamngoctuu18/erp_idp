import { Badge } from "@mantine/core";

export interface StatusBadgeProps {
  statusType?: "document" | "masterdata";
  value: string | boolean | number;
}

export function StatusBadge({ statusType = "masterdata", value }: StatusBadgeProps) {
  const getBadgeProps = () => {
    const valStr = String(value).toLowerCase().trim();

    if (statusType === "masterdata") {
      if (valStr === "true" || valStr === "active" || valStr === "hoạt động" || valStr === "1") {
        return { color: "teal", text: "Hoạt động" };
      }
      return { color: "red", text: "Ngưng" };
    }

    // Luồng chứng từ / tài liệu nghiệp vụ
    switch (valStr) {
      case "draft":
      case "bản nháp":
      case "nháp":
        return { color: "gray", text: "Bản nháp" };
      case "pending":
      case "chờ duyệt":
      case "chờ phê duyệt":
        return { color: "yellow", text: "Chờ duyệt" };
      case "approved":
      case "đã duyệt":
      case "phê duyệt":
        return { color: "green", text: "Đã duyệt" };
      case "rejected":
      case "từ chối":
      case "bị từ chối":
        return { color: "red", text: "Từ chối" };
      default:
        return { color: "blue", text: String(value) };
    }
  };

  const { color, text } = getBadgeProps();

  return (
    <Badge color={color} variant="light" size="sm" radius="sm">
      {text}
    </Badge>
  );
}

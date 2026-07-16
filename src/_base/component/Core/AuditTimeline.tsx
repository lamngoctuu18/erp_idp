import { Timeline, Text } from "@mantine/core";
import { IconGitCommit } from "@tabler/icons-react";
import { formatDateTime } from "../../../common/FormatDate/FormatDate";

export interface AuditLogItem {
  actionName: string;
  actorName: string;
  actionDate: string | Date;
  comment?: string;
}

export interface AuditTimelineProps {
  data: AuditLogItem[];
}

export function AuditTimeline({ data }: AuditTimelineProps) {
  if (!data || data.length === 0) {
    return (
      <Text c="dimmed" size="sm">
        Không có lịch sử nhật ký.
      </Text>
    );
  }

  return (
    <Timeline active={data.length - 1} bulletSize={24} lineWidth={2}>
      {data.map((item, index) => (
        <Timeline.Item
          key={index}
          title={item.actionName}
          bullet={<IconGitCommit size={14} />}
        >
          <Text size="sm" fw={500} mt={4}>
            Người thực hiện: <span style={{ color: "#1687e8" }}>{item.actorName}</span>
          </Text>
          {item.comment && (
            <Text size="xs" c="dimmed" mt={4} style={{ fontStyle: "italic" }}>
              Ý kiến: "{item.comment}"
            </Text>
          )}
          <Text size="xs" c="dimmed" mt={4}>
            {item.actionDate
              ? formatDateTime(String(item.actionDate), "DD/MM/YYYY HH:mm")
              : "—"}
          </Text>
        </Timeline.Item>
      ))}
    </Timeline>
  );
}

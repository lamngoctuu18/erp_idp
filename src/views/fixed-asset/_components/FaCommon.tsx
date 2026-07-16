/**
 * Thành phần giao diện dùng chung cho phân hệ Tài sản cố định.
 * Gói header + breadcrumb, hộp lưu ý, thẻ số liệu, thanh bước và
 * bảng lịch sử Request để các màn hình tái sử dụng, giảm lặp code.
 */
import { ReactNode } from "react";
import {
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Grid,
  Group,
  Paper,
  Table,
  Text,
  Title,
} from "@mantine/core";
import {
  IconInfoCircle,
  IconAlertTriangle,
  IconDeviceFloppy,
  IconTrash,
} from "@tabler/icons-react";
import BreadCrumb from "../../../_base/component/_layout/_breadcrumb";
import { StatusBadge } from "../../../_base/component/Core/StatusBadge";
import { FaRequest } from "../../../model/FixedAssetModel";

/** Định dạng tiền VND */
export const money = (n: number | undefined | null) =>
  `${new Intl.NumberFormat("vi-VN").format(Math.round(n || 0))} ₫`;

/** Định dạng tiền rút gọn theo tỷ */
export const moneyShort = (n: number) => {
  if (Math.abs(n) >= 1e9) return `${(n / 1e9).toFixed(1)} tỷ`;
  if (Math.abs(n) >= 1e6) return `${(n / 1e6).toFixed(0)} tr`;
  return new Intl.NumberFormat("vi-VN").format(n);
};

/** Header chuẩn: breadcrumb bên trái, nhóm nút hành động bên phải */
export function FaPageHeader({ actions }: { actions?: ReactNode }) {
  return (
    <Flex
      justify="space-between"
      align="center"
      style={{
        border: "1px solid #dee2e6",
        padding: "5px 10px",
        backgroundColor: "#f8f9fa",
        borderRadius: 4,
      }}
      mb={16}
    >
      <BreadCrumb />
      {actions && <Group gap="sm">{actions}</Group>}
    </Flex>
  );
}

/** Hộp lưu ý (cảnh báo nghiệp vụ / ràng buộc) */
export function FaNotice({
  children,
  type = "warning",
}: {
  children: ReactNode;
  type?: "warning" | "info";
}) {
  const cfg =
    type === "info"
      ? { bg: "#eff6ff", border: "#bfdbfe", color: "#1e40af", Icon: IconInfoCircle }
      : { bg: "#fffbeb", border: "#fde68a", color: "#854d0e", Icon: IconAlertTriangle };
  const { Icon } = cfg;
  return (
    <Flex
      gap={10}
      align="flex-start"
      mb={16}
      p="sm"
      style={{
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        borderRadius: 9,
        color: cfg.color,
      }}
    >
      <Icon size={18} style={{ flexShrink: 0, marginTop: 2 }} />
      <Text size="sm" style={{ color: cfg.color }}>
        {children}
      </Text>
    </Flex>
  );
}

/** Thẻ số liệu tổng quan (Dashboard) */
export function FaStatCard({
  label,
  value,
  sub,
  color = "#2563eb",
}: {
  label: string;
  value: string;
  sub?: string;
  color?: string;
}) {
  return (
    <Card withBorder shadow="sm" radius="md" p="md">
      <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
        {label}
      </Text>
      <Text fw={800} style={{ fontSize: 24, marginTop: 4, color }}>
        {value}
      </Text>
      {sub && (
        <Text size="xs" c="dimmed" mt={2}>
          {sub}
        </Text>
      )}
    </Card>
  );
}

/** Thanh hiển thị các bước (read-only stepper) */
export function FaSteps({ labels, active }: { labels: string[]; active: number }) {
  return (
    <Paper withBorder radius="md" p="sm" mb={16}>
      <Flex gap="lg" wrap="wrap">
        {labels.map((l, i) => {
          const done = i < active;
          const current = i === active;
          const on = done || current;
          return (
            <Flex key={l} gap={8} align="center" style={{ opacity: on ? 1 : 0.55 }}>
              <Box
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  fontSize: 12,
                  fontWeight: 700,
                  color: on ? "#fff" : "#64748b",
                  background: on ? "#2563eb" : "#eef2f7",
                }}
              >
                {done ? "✓" : i + 1}
              </Box>
              <Text size="sm" fw={on ? 700 : 500}>
                {l}
              </Text>
            </Flex>
          );
        })}
      </Flex>
    </Paper>
  );
}

/**
 * Khung màn hình giao dịch điều chỉnh vòng đời (Reclass, Assignment, Book,
 * Group Transfer, CIP, Unplanned...). Gộp header + nút hành động chuẩn +
 * hộp lưu ý + card chứa lưới trường nhập. `footer` để chèn bảng chi tiết.
 */
export function FaTxnForm({
  title,
  cardTitle = "Thông tin giao dịch",
  badge = "Bản nháp",
  notice,
  noticeType = "warning",
  children,
  footer,
  completeLabel = "Hoàn tất",
  onComplete,
  onSaveDraft,
  onDiscard,
}: {
  title: string;
  cardTitle?: string;
  badge?: string;
  notice?: ReactNode;
  noticeType?: "warning" | "info";
  children: ReactNode;
  footer?: ReactNode;
  completeLabel?: string;
  onComplete: () => void;
  onSaveDraft?: () => void;
  onDiscard?: () => void;
}) {
  return (
    <Box>
      <FaPageHeader
        actions={
          <>
            {onDiscard && (
              <Button variant="light" color="red" leftSection={<IconTrash size={14} />} onClick={onDiscard}>
                Xóa nháp
              </Button>
            )}
            {onSaveDraft && (
              <Button variant="light" onClick={onSaveDraft}>
                Lưu nháp
              </Button>
            )}
            <Button color="blue" leftSection={<IconDeviceFloppy size={14} />} onClick={onComplete}>
              {completeLabel}
            </Button>
          </>
        }
      />
      <Title order={3} mb={8}>
        {title}
      </Title>
      {notice && <FaNotice type={noticeType}>{notice}</FaNotice>}
      <Card withBorder shadow="sm" radius="md" p="lg">
        <Flex justify="space-between" align="center" mb="md">
          <Title order={5}>{cardTitle}</Title>
          {badge && (
            <Badge color="yellow" variant="light">
              {badge}
            </Badge>
          )}
        </Flex>
        <Grid>{children}</Grid>
      </Card>
      {footer}
    </Box>
  );
}

/** Bảng lịch sử Request (Run Depreciation / Create Accounting...) */
export function FaRequestTable({ rows, title }: { rows: FaRequest[]; title: string }) {
  return (
    <Card withBorder shadow="sm" radius="md" p="lg" mt={16}>
      <Title order={5} mb="sm">
        Lịch sử Request — {title}
      </Title>
      <Table.ScrollContainer minWidth={720}>
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead style={{ background: "#f8fafc" }}>
            <Table.Tr>
              <Table.Th>Request ID</Table.Th>
              <Table.Th>Book</Table.Th>
              <Table.Th>Period / End Date</Table.Th>
              <Table.Th>Mode</Table.Th>
              <Table.Th>Người chạy</Table.Th>
              <Table.Th>Trạng thái</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={6} style={{ textAlign: "center", padding: 24 }}>
                  Chưa có request nào.
                </Table.Td>
              </Table.Tr>
            ) : (
              rows.map((r) => (
                <Table.Tr key={r.requestId}>
                  <Table.Td style={{ color: "#2563eb", fontWeight: 600 }}>{r.requestId}</Table.Td>
                  <Table.Td>{r.book}</Table.Td>
                  <Table.Td>{r.period}</Table.Td>
                  <Table.Td>{r.mode}</Table.Td>
                  <Table.Td>{r.runBy}</Table.Td>
                  <Table.Td>
                    <StatusBadge statusType="document" value={r.status} />
                  </Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Card>
  );
}

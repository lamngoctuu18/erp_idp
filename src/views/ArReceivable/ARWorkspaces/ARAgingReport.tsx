import { useMemo } from "react";
import { Badge, Box, Card, Grid, Table, Text, Title } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { ARMockStorage } from "../mock/arMockStorage";
import { MOCK_CUSTOMERS } from "../mock/arMockData";
import { formatDateTime, formatNumber } from "../../../common/FormatDate/FormatDate";

const bucketDefinitions = [
  { key: "current", label: "Chưa đến hạn", color: "teal" },
  { key: "1-30", label: "1–30 ngày", color: "yellow" },
  { key: "31-60", label: "31–60 ngày", color: "orange" },
  { key: "61-90", label: "61–90 ngày", color: "red" },
  { key: "90+", label: "Trên 90 ngày", color: "grape" },
] as const;

function getBucket(dueDate: string) {
  const age = Math.floor((Date.now() - new Date(dueDate).getTime()) / 86_400_000);
  if (age <= 0) return "current";
  if (age <= 30) return "1-30";
  if (age <= 60) return "31-60";
  if (age <= 90) return "61-90";
  return "90+";
}

export default function ARAgingReport() {
  const navigate = useNavigate();
  const schedules = useMemo(
    () => ARMockStorage.getPaymentSchedules().filter((item) => (item.amountDueRemaining || 0) > 0),
    []
  );
  const invoices = useMemo(() => ARMockStorage.getInvoices(), []);

  const totals = useMemo(() => {
    return schedules.reduce<Record<string, number>>((result, schedule) => {
      const key = getBucket(schedule.dueDate);
      result[key] = (result[key] || 0) + (schedule.amountDueRemaining || 0);
      return result;
    }, {});
  }, [schedules]);

  return (
    <Box>
      <Title order={4} mb={4}>Báo cáo tuổi nợ</Title>
      <Text c="dimmed" size="sm" mb="md">Chọn một bucket để mở danh sách hóa đơn tương ứng.</Text>

      <Grid mb="lg">
        {bucketDefinitions.map((bucket) => (
          <Grid.Col key={bucket.key} span={{ base: 12, sm: 6, lg: 2.4 }}>
            <Card
              withBorder
              radius="md"
              padding="md"
              style={{ cursor: "pointer", height: "100%" }}
              onClick={() => navigate(`/cong-no-phai-thu/cong-no?tab=hoa-don&status=${bucket.key === "current" ? "OPEN" : "OVERDUE"}&aging=${bucket.key}`)}
            >
              <Text size="xs" c="dimmed" tt="uppercase" fw={700}>{bucket.label}</Text>
              <Text fw={800} size="lg" c={bucket.color} mt={6}>{formatNumber(totals[bucket.key] || 0)}</Text>
              <Text size="xs" c="dimmed">VND</Text>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      <Card withBorder radius="md">
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Hóa đơn</Table.Th>
              <Table.Th>Khách hàng</Table.Th>
              <Table.Th>Ngày đến hạn</Table.Th>
              <Table.Th>Bucket</Table.Th>
              <Table.Th ta="right">Còn phải thu</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {schedules.slice(0, 20).map((schedule) => {
              const invoice = invoices.find((item) => item.invoiceId === schedule.invoiceId);
              const customer = MOCK_CUSTOMERS.find((item) => Number(item.id) === Number(schedule.customerId));
              const bucket = bucketDefinitions.find((item) => item.key === getBucket(schedule.dueDate));
              return (
                <Table.Tr key={schedule.paymentScheduleId}>
                  <Table.Td>
                    <Text c="indigo" fw={700} style={{ cursor: "pointer" }} onClick={() => navigate(`/cong-no-phai-thu/hoa-don/${schedule.invoiceId}`)}>
                      {invoice?.invoiceNumber || `#${schedule.invoiceId}`}
                    </Text>
                  </Table.Td>
                  <Table.Td>{customer?.name || `KH #${schedule.customerId}`}</Table.Td>
                  <Table.Td>{formatDateTime(schedule.dueDate, "DD/MM/YYYY")}</Table.Td>
                  <Table.Td><Badge color={bucket?.color} variant="light">{bucket?.label}</Badge></Table.Td>
                  <Table.Td ta="right" fw={700}>{formatNumber(schedule.amountDueRemaining || 0)}</Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </Card>
    </Box>
  );
}

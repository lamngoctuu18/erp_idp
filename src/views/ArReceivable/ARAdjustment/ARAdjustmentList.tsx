import { useEffect, useState } from "react";
import { Box, Table, Card, Button, Flex, Title, Badge, Grid, Group, Text } from "@mantine/core";
import { arLedgerService } from "../services/arLedgerService";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import { formatNumber, formatDateTime } from "../../../common/FormatDate/FormatDate";
import { IconCheck, IconChevronRight, IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

export default function ARAdjustmentList() {
  const [adjustments, setAdjustments] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);

  const fetchAdjs = () => {
    arLedgerService.getAdjustments().then(res => {
      if (res.success) setAdjustments(res.data || []);
    });
    arLedgerService.getAutoAdjustmentBatches().then(res => {
      if (res.success) setBatches(res.data || []);
    });
  };

  useEffect(() => {
    fetchAdjs();
  }, []);

  const handleApprove = async (id: number) => {
    const res = await arLedgerService.approveAdjustment(id);
    if (res.success) {
      NotificationExtension.Success("Đã duyệt điều chỉnh công nợ!");
      fetchAdjs();
    }
  };

  return (
    <Box>
      <Flex
        justify="space-between"
        align="center"
        style={{ border: "1px solid #dee2e6", padding: "8px 12px", background: "#f8f9fa", borderRadius: 4 }}
        mb={20}
      >
        <Text size="sm" fw={700} c="dimmed">Điều chỉnh công nợ (Adjustments & Auto-Batches)</Text>
      </Flex>

      <Grid mb="lg">
        {/* Column 1: Manual Adjustments */}
        <Grid.Col span={{ base: 12, md: 7 }}>
          <Card withBorder shadow="sm" radius="md">
            <Title order={5} mb="md" c="indigo">Yêu cầu điều chỉnh công nợ thủ công (Manual Adjustments)</Title>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Số giao dịch</Table.Th>
                  <Table.Th>Số hóa đơn</Table.Th>
                  <Table.Th style={{ textAlign: "right" }}>Số tiền (VND)</Table.Th>
                  <Table.Th>Trạng thái</Table.Th>
                  <Table.Th style={{ textAlign: "center" }}>Hành động</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {adjustments.map((a, idx) => (
                  <Table.Tr key={idx}>
                    <Table.Td fw={700}>{a.adjustmentNumber}</Table.Td>
                    <Table.Td fw={700} c="indigo">INV-2026-{(a.invoiceId).toString().padStart(4, "0")}</Table.Td>
                    <Table.Td style={{ textAlign: "right" }} fw={700} c={a.amount < 0 ? "red" : "blue"}>
                      <Flex align="center" justify="flex-end" gap="xs">
                        {a.amount < 0 ? <IconTrendingDown size={14} /> : <IconTrendingUp size={14} />}
                        {formatNumber(a.amount)}
                      </Flex>
                    </Table.Td>
                    <Table.Td>
                      <Badge color={a.status === "APPROVED" ? "green" : "yellow"}>
                        {a.status}
                      </Badge>
                    </Table.Td>
                    <Table.Td style={{ textAlign: "center" }}>
                      {a.status === "PENDING_APPROVAL" ? (
                        <Button 
                          color="teal" 
                          size="xs" 
                          leftSection={<IconCheck size={12} />} 
                          onClick={() => handleApprove(a.adjustmentId)}
                        >
                          Phê duyệt
                        </Button>
                      ) : (
                        <Badge color="gray" variant="outline">Đã duyệt</Badge>
                      )}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Card>
        </Grid.Col>

        {/* Column 2: Auto Adjustment Batches */}
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Card withBorder shadow="sm" radius="md">
            <Title order={5} mb="md" c="indigo">Đợt chạy điều chỉnh tự động (Auto-Adjustment Batch)</Title>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Số đợt chạy</Table.Th>
                  <Table.Th>Ngày chạy</Table.Th>
                  <Table.Th>Trạng thái</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {batches.map((b, idx) => (
                  <Table.Tr key={idx}>
                    <Table.Td fw={700} c="teal">{b.batchNumber}</Table.Td>
                    <Table.Td>{formatDateTime(b.glDate, "DD/MM/YYYY")}</Table.Td>
                    <Table.Td>
                      <Badge color={b.status === "PROCESSED" ? "green" : "gray"}>
                        {b.status}
                      </Badge>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Card>
        </Grid.Col>
      </Grid>
    </Box>
  );
}

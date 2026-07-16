import { useState } from "react";
import { Alert, Badge, Box, Button, Card, Flex, Group, Table, Text, Title } from "@mantine/core";
import { IconAlertCircle, IconPlayerPlay, IconPlus, IconRefresh } from "@tabler/icons-react";
import { ARMockStorage } from "../mock/arMockStorage";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import { formatDateTime } from "../../../common/FormatDate/FormatDate";

export default function ARGLTransferDemo() {
  const [batches, setBatches] = useState(() => ARMockStorage.getGlTransferBatches());

  const createBatch = () => {
    const nextId = Math.max(0, ...batches.map((batch) => batch.transferBatchId)) + 1;
    setBatches((current) => [{
      transferBatchId: nextId,
      ledgerId: 1,
      transferStatus: "DRAFT",
      createdDate: new Date().toISOString(),
      lastUpdateDate: new Date().toISOString(),
    }, ...current]);
    NotificationExtension.Success("Đã tạo batch chuyển GL mô phỏng.");
  };

  const updateStatus = (id: number, status: string) => {
    setBatches((current) => current.map((batch) => batch.transferBatchId === id
      ? { ...batch, transferStatus: status, lastUpdateDate: new Date().toISOString() }
      : batch));
    NotificationExtension.Success(`Batch #${id}: ${status}`);
  };

  return (
    <Box>
      <Alert icon={<IconAlertCircle size={18} />} color="blue" variant="light" mb="md" title="Môi trường Demo">
        <b>Mô phỏng chuyển GL nội bộ – chưa gửi sang hệ thống GL thật.</b>
      </Alert>

      <Flex justify="space-between" align="center" mb="md">
        <Box>
          <Title order={4}>GL Transfer Demo</Title>
          <Text c="dimmed" size="sm">Tạo, kiểm tra và submit batch trong phạm vi dữ liệu mô phỏng.</Text>
        </Box>
        <Button leftSection={<IconPlus size={16} />} onClick={createBatch}>Tạo batch</Button>
      </Flex>

      <Card withBorder radius="md">
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Batch</Table.Th>
              <Table.Th>Ledger</Table.Th>
              <Table.Th>Ngày tạo</Table.Th>
              <Table.Th>Trạng thái</Table.Th>
              <Table.Th>Thao tác</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {batches.map((batch) => (
              <Table.Tr key={batch.transferBatchId}>
                <Table.Td fw={700}>GL-DEMO-{String(batch.transferBatchId).padStart(4, "0")}</Table.Td>
                <Table.Td>{batch.ledgerId}</Table.Td>
                <Table.Td>{formatDateTime(batch.createdDate, "DD/MM/YYYY")}</Table.Td>
                <Table.Td><Badge color={batch.transferStatus === "COMPLETED" ? "teal" : batch.transferStatus === "ERROR" ? "red" : "blue"}>{batch.transferStatus}</Badge></Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <Button size="xs" variant="light" onClick={() => updateStatus(batch.transferBatchId, "VALIDATED")}>Validate</Button>
                    <Button size="xs" leftSection={<IconPlayerPlay size={13} />} onClick={() => updateStatus(batch.transferBatchId, "COMPLETED")}>Submit Demo</Button>
                    {batch.transferStatus === "ERROR" && (
                      <Button size="xs" color="orange" leftSection={<IconRefresh size={13} />} onClick={() => updateStatus(batch.transferBatchId, "SUBMITTED")}>Retry</Button>
                    )}
                    {!["COMPLETED", "CANCELLED"].includes(batch.transferStatus) && (
                      <Button size="xs" variant="subtle" color="red" onClick={() => updateStatus(batch.transferBatchId, "CANCELLED")}>Cancel</Button>
                    )}
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>
    </Box>
  );
}

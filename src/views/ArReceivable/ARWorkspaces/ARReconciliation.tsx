import { useMemo } from "react";
import { Badge, Box, Card, Grid, Table, Text, Title } from "@mantine/core";
import { ARMockStorage } from "../mock/arMockStorage";
import { formatNumber } from "../../../common/FormatDate/FormatDate";

export default function ARReconciliation() {
  const { debit, credit, transferred, pending, errors } = useMemo(() => {
    const lines = ARMockStorage.getJournalLines();
    const events = ARMockStorage.getAccountingEvents();
    return {
      debit: lines.reduce((sum, line) => sum + (line.accountedDr || line.enteredDr || 0), 0),
      credit: lines.reduce((sum, line) => sum + (line.accountedCr || line.enteredCr || 0), 0),
      transferred: events.filter((event) => event.transferToGlStatus === "TRANSFERRED").length,
      pending: events.filter((event) => event.transferToGlStatus !== "TRANSFERRED").length,
      errors: events.filter((event) => event.transferToGlStatus === "ERROR"),
    };
  }, []);

  const metrics = [
    ["Tổng Debit AR", debit, "blue"],
    ["Tổng Credit AR", credit, "teal"],
    ["Đã Transfer Demo", transferred, "indigo"],
    ["Chưa Transfer", pending, "orange"],
    ["Chênh lệch", debit - credit, debit === credit ? "teal" : "red"],
  ] as const;

  return (
    <Box>
      <Title order={4} mb="md">Đối soát AR</Title>
      <Grid mb="lg">
        {metrics.map(([label, value, color]) => (
          <Grid.Col key={label} span={{ base: 12, sm: 6, lg: 2.4 }}>
            <Card withBorder radius="md" h="100%">
              <Text size="xs" c="dimmed" tt="uppercase" fw={700}>{label}</Text>
              <Text size="xl" fw={800} c={color} mt={8}>{formatNumber(value)}</Text>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      <Card withBorder radius="md">
        <Title order={5} mb="sm">Sự kiện lỗi</Title>
        <Table striped>
          <Table.Thead><Table.Tr><Table.Th>Event</Table.Th><Table.Th>Chứng từ</Table.Th><Table.Th>Loại</Table.Th><Table.Th>Trạng thái</Table.Th></Table.Tr></Table.Thead>
          <Table.Tbody>
            {errors.length === 0 ? (
              <Table.Tr><Table.Td colSpan={4} ta="center"><Text c="dimmed">Không có sự kiện lỗi.</Text></Table.Td></Table.Tr>
            ) : errors.map((event) => (
              <Table.Tr key={event.eventId}>
                <Table.Td fw={700}>EVT-{event.eventId}</Table.Td>
                <Table.Td>#{event.sourceDocumentId}</Table.Td>
                <Table.Td>{event.sourceDocumentType}</Table.Td>
                <Table.Td><Badge color="red">{event.transferToGlStatus}</Badge></Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>
    </Box>
  );
}

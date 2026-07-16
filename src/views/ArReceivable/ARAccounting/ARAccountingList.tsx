import { useCallback, useEffect, useState } from "react";
import { Box, Table, Card, Button, Flex, Title, Badge, Grid, Group, Text } from "@mantine/core";
import { arAccountingService } from "../services/arAccountingService";
import { formatNumber, formatDateTime } from "../../../common/FormatDate/FormatDate";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import { useSearchParams } from "react-router-dom";

export default function ARAccountingList() {
  const [searchParams] = useSearchParams();
  const [events, setEvents] = useState<any[]>([]);
  const [journals, setJournals] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  const handleSelectEvent = useCallback((id: number) => {
    setSelectedEventId(id);
    arAccountingService.getJournalLines(id).then(res => {
      if (res.success) setJournals(res.data || []);
    });
  }, []);

  const pendingOnly = searchParams.get("filter") === "pending";
  const fetchEvents = useCallback(() => {
    arAccountingService.getEvents().then(res => {
      if (res.success && res.data) {
        const visibleEvents = pendingOnly
          ? res.data.filter(event => event.accountingStatus !== "FINAL")
          : res.data;
        setEvents(visibleEvents);
        if (visibleEvents.length > 0) {
          handleSelectEvent(visibleEvents[0].eventId);
        }
      }
    });
  }, [handleSelectEvent, pendingOnly]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleAccounting = async (eventId: number, mode: "DRAFT" | "FINAL") => {
    const res = await arAccountingService.runAccounting(eventId, mode);
    if (res.success) {
      NotificationExtension.Success(res.message);
      fetchEvents();
    }
  };

  // Balance Check
  const sumDebit = journals.reduce((sum, j) => sum + (j.accountedDr || j.enteredDr || j.enteredDebit || 0), 0);
  const sumCredit = journals.reduce((sum, j) => sum + (j.accountedCr || j.enteredCr || j.enteredCredit || 0), 0);
  const isBalanced = sumDebit === sumCredit;

  return (
    <Box>
      <Title order={4} mb={4} c="indigo">Accounting Events</Title>
      <Text c="dimmed" size="sm" mb="md">
        {searchParams.get("filter") === "pending" ? "Đang lọc các sự kiện kế toán chưa xử lý." : "Theo dõi trạng thái hạch toán và các dòng bút toán AR."}
      </Text>
      
      <Grid>
        {/* Left side: Accounting Events */}
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Card withBorder>
            <Title order={5} mb="sm" c="dimmed">Nhật ký sự kiện hạch toán (Accounting Events)</Title>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Event / Tài liệu</Table.Th>
                  <Table.Th>Ngày GL</Table.Th>
                  <Table.Th>Trạng thái</Table.Th>
                  <Table.Th>Transfer</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {events.map((e, idx) => (
                  <Table.Tr
                    key={idx}
                    style={{ cursor: "pointer", background: selectedEventId === e.eventId ? "#e8f0fe" : undefined }}
                    onClick={() => handleSelectEvent(e.eventId)}
                  >
                    <Table.Td><Text fw={700}>EVT-{e.eventId}</Text><Text size="xs" c="dimmed">{e.sourceDocumentType} #{e.sourceDocumentId}</Text></Table.Td>
                    <Table.Td>{formatDateTime(e.glDate, "DD/MM/YYYY")}</Table.Td>
                    <Table.Td><Badge color={e.accountingStatus === "FINAL" ? "green" : "gray"}>{e.accountingStatus}</Badge></Table.Td>
                    <Table.Td><Badge variant="light" color={e.transferToGlStatus === "TRANSFERRED" ? "teal" : e.transferToGlStatus === "ERROR" ? "red" : "gray"}>{e.transferToGlStatus || "NOT_TRANSFERRED"}</Badge></Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Card>
        </Grid.Col>

        {/* Right side: Journal lines & Balance check */}
        <Grid.Col span={{ base: 12, md: 7 }}>
          <Card withBorder>
            <Flex justify="space-between" align="center" mb="md">
              <Title order={5} c="dimmed">Bút toán định khoản chi tiết</Title>
              {selectedEventId && (
                <Group gap="xs">
                  <Button size="xs" variant="outline" color="blue" onClick={() => handleAccounting(selectedEventId, "DRAFT")}>
                    Hạch toán nháp
                  </Button>
                  <Button size="xs" color="teal" onClick={() => handleAccounting(selectedEventId, "FINAL")}>
                    Hạch toán chính thức
                  </Button>
                </Group>
              )}
            </Flex>

            <Table striped mb="md">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Tài khoản</Table.Th>
                  <Table.Th>Mô tả tài khoản</Table.Th>
                  <Table.Th style={{ textAlign: "right" }}>Nợ (Debit)</Table.Th>
                  <Table.Th style={{ textAlign: "right" }}>Có (Credit)</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {journals.map((j, idx) => (
                  <Table.Tr key={idx}>
                    <Table.Td fw={700}>{j.glAccount || j.accountCcid || "—"}</Table.Td>
                    <Table.Td>{j.accountDescription || j.accountingClass || "—"}</Table.Td>
                    <Table.Td style={{ textAlign: "right" }}>{(j.accountedDr || j.enteredDr || j.enteredDebit || 0) > 0 ? formatNumber(j.accountedDr || j.enteredDr || j.enteredDebit) : "-"}</Table.Td>
                    <Table.Td style={{ textAlign: "right" }}>{(j.accountedCr || j.enteredCr || j.enteredCredit || 0) > 0 ? formatNumber(j.accountedCr || j.enteredCr || j.enteredCredit) : "-"}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>

            <Flex justify="space-between" align="center" style={{ borderTop: "1px solid #dee2e6", paddingTop: 10 }}>
              <Badge color={isBalanced ? "teal" : "red"}>
                {isBalanced ? "Nợ Có cân bằng (Balanced)" : "Nợ Có chênh lệch (Unbalanced)"}
              </Badge>
              <Group gap="xs">
                <Text size="sm">Tổng Nợ: <b>{formatNumber(sumDebit)}</b></Text>
                <Text size="sm">|</Text>
                <Text size="sm">Tổng Có: <b>{formatNumber(sumCredit)}</b></Text>
              </Group>
            </Flex>
          </Card>
        </Grid.Col>
      </Grid>
    </Box>
  );
}

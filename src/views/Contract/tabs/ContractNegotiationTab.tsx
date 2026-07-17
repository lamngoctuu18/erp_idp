import {
  Anchor,
  Badge,
  Box,
  Button,
  Card,
  Grid,
  Group,
  Paper,
  Progress,
  Stack,
  Stepper,
  Table,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { IconSend } from "@tabler/icons-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Contract,
  ContractTerm,
  NegotiationMessage,
  TERM_STATUS_LABEL,
} from "../../../model/ContractModel";
import { contractService } from "../../../api/contract/contractMockService";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import { formatDateTimeVi, formatMoney } from "../components/contractShared";

interface Props {
  contract: Contract;
  onChanged: () => void;
}

const TERM_STATUS_COLOR: Record<ContractTerm["status"], string> = {
  pending: "yellow",
  accepted: "green",
  revising: "blue",
  rejected: "red",
};

const ContractNegotiationTab = ({ contract, onChanged }: Props) => {
  const [terms, setTerms] = useState<ContractTerm[]>([]);
  const [messages, setMessages] = useState<NegotiationMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [newTermTitle, setNewTermTitle] = useState("");
  const [newTermContent, setNewTermContent] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const [t, m] = await Promise.all([
      contractService.getTerms(contract.contractId),
      contractService.getMessages(contract.contractId),
    ]);
    setTerms(t);
    setMessages(m);
  }, [contract.contractId]);

  useEffect(() => {
    load();
  }, [load]);

  const stats = useMemo(() => {
    const total = terms.length;
    const accepted = terms.filter((t) => t.status === "accepted").length;
    const discussing = terms.filter((t) => t.status === "pending" || t.status === "revising").length;
    const rejected = terms.filter((t) => t.status === "rejected").length;
    const percent = total > 0 ? Math.round((accepted / total) * 100) : 0;
    return { total, accepted, discussing, rejected, percent };
  }, [terms]);

  // Bước tiến trình hiện tại dựa vào dữ liệu.
  const activeStep = useMemo(() => {
    if (contract.status === "pending_approval") return 3;
    if (stats.accepted === stats.total && stats.total > 0) return 3;
    if (messages.length > 1) return 1;
    return 0;
  }, [contract.status, stats, messages.length]);

  const setTermStatus = async (term: ContractTerm, status: ContractTerm["status"]) => {
    await contractService.updateTermStatus(term.termId, status);
    await load();
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    await contractService.sendMessage(contract.contractId, chatInput.trim(), "buyer");
    setChatInput("");
    await load();
  };

  const handleAddTerm = async () => {
    if (!newTermTitle.trim() || !newTermContent.trim()) {
      NotificationExtension.Fails("Nhập đủ tên và nội dung điều khoản.");
      return;
    }
    setBusy(true);
    try {
      await contractService.addTerm(contract.contractId, newTermTitle.trim(), newTermContent.trim());
      setNewTermTitle("");
      setNewTermContent("");
      await load();
      NotificationExtension.Success("Đã thêm điều khoản mới.");
    } finally {
      setBusy(false);
    }
  };

  const handleEndNegotiation = async () => {
    setBusy(true);
    try {
      await contractService.changeStatus(
        contract.contractId,
        "pending_approval",
        "close_negotiation",
        "Kết thúc đàm phán và chuyển sang chờ phê duyệt."
      );
      await contractService.sendMessage(
        contract.contractId,
        "Kết thúc đàm phán và chuyển sang chờ phê duyệt.",
        "system"
      );
      NotificationExtension.Success("Đã kết thúc đàm phán.");
      onChanged();
    } finally {
      setBusy(false);
    }
  };

  const negotiating = contract.status === "in_negotiation";

  return (
    <Stack gap="md">
      {/* Tiến trình đàm phán */}
      <Card withBorder>
        <Group justify="space-between" mb="xs">
          <div>
            <Title order={5}>Tiến trình đàm phán - {contract.contractCode}</Title>
            <Text size="sm" c="dimmed">
              {contract.refCode || contract.name} - {contract.supplierName}
            </Text>
          </div>
          <Group>
            <Badge color="yellow" variant="light">
              {contract.status === "pending_approval" ? "pending_approval" : "in_negotiation"}
            </Badge>
            <Text size="sm" c="dimmed">
              {stats.accepted}/{stats.total} điều khoản đã chốt
            </Text>
          </Group>
        </Group>
        <Stepper active={activeStep} size="sm" iconSize={32}>
          <Stepper.Step label="Khởi tạo" />
          <Stepper.Step label="Thảo luận" />
          <Stepper.Step label="Đề xuất / phản hồi" />
          <Stepper.Step label="Chốt điều khoản" />
        </Stepper>
      </Card>

      {/* So sánh phiên bản điều khoản */}
      <Card withBorder>
        <Title order={5} mb="sm">
          So sánh phiên bản điều khoản
        </Title>
        <Table.ScrollContainer minWidth={640}>
          <Table verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>ĐIỀU KHOẢN</Table.Th>
                <Table.Th>PHIÊN BẢN GỐC</Table.Th>
                <Table.Th>ĐỀ XUẤT HIỆN TẠI</Table.Th>
                <Table.Th>TRẠNG THÁI</Table.Th>
                <Table.Th>HÀNH ĐỘNG</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {terms.length === 0 && (
                <Table.Tr>
                  <Table.Td colSpan={5}>
                    <Text size="sm" c="dimmed" ta="center">
                      Chưa có điều khoản nào
                    </Text>
                  </Table.Td>
                </Table.Tr>
              )}
              {terms.map((t) => (
                <Table.Tr key={t.termId}>
                  <Table.Td>
                    <Text fw={600} size="sm">
                      {t.code}
                    </Text>
                    <Text size="xs" c="dimmed">
                      Phiên bản {t.version}
                    </Text>
                  </Table.Td>
                  <Table.Td>{t.originalContent}</Table.Td>
                  <Table.Td>
                    <Text c="blue">{t.currentContent}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge variant="light" color={TERM_STATUS_COLOR[t.status]}>
                      {TERM_STATUS_LABEL[t.status]}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    {negotiating ? (
                      <Stack gap={2}>
                        <Anchor c="green" size="sm" onClick={() => setTermStatus(t, "accepted")}>
                          Chấp nhận
                        </Anchor>
                        <Anchor c="blue" size="sm" onClick={() => setTermStatus(t, "revising")}>
                          Đề xuất sửa
                        </Anchor>
                        <Anchor c="red" size="sm" onClick={() => setTermStatus(t, "rejected")}>
                          Từ chối
                        </Anchor>
                      </Stack>
                    ) : (
                      <Text size="xs" c="dimmed">
                        —
                      </Text>
                    )}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Card>

      <Grid>
        {/* Lịch sử đàm phán */}
        <Grid.Col span={{ base: 12, md: 7 }}>
          <Card withBorder h="100%">
            <Title order={5} mb="sm">
              Lịch sử đàm phán
            </Title>
            <Stack gap="sm" mah={360} style={{ overflowY: "auto" }}>
              {messages.map((m) => (
                <Group key={m.messageId} align="flex-start" wrap="nowrap">
                  <Badge
                    size="sm"
                    variant="light"
                    color={m.senderType === "system" ? "gray" : "green"}
                    style={{ minWidth: 42 }}
                  >
                    {m.senderType === "system" ? "SYS" : "BẠN"}
                  </Badge>
                  <Box style={{ flex: 1 }}>
                    <Paper
                      p="xs"
                      radius="sm"
                      bg={m.senderType === "system" ? "var(--mantine-color-gray-1)" : "var(--mantine-color-blue-0)"}
                    >
                      <Text size="sm">{m.content}</Text>
                    </Paper>
                    <Text size="xs" c="dimmed" mt={2}>
                      {m.senderType === "system" ? "System" : "Bạn"} - {formatDateTimeVi(m.createdAt)}
                    </Text>
                  </Box>
                </Group>
              ))}
            </Stack>
            {negotiating && (
              <Group mt="sm" wrap="nowrap">
                <TextInput
                  style={{ flex: 1 }}
                  placeholder="Nhập tin nhắn..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.currentTarget.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button leftSection={<IconSend size={16} />} onClick={handleSendMessage}>
                  Gửi
                </Button>
              </Group>
            )}
          </Card>
        </Grid.Col>

        {/* Hành động nhanh + thống kê */}
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Card withBorder>
            <Title order={5} mb="sm">
              Hành động nhanh
            </Title>
            <Stack gap="sm">
              <TextInput
                placeholder="Tên điều khoản mới"
                value={newTermTitle}
                disabled={!negotiating}
                onChange={(e) => setNewTermTitle(e.currentTarget.value)}
              />
              <Textarea
                placeholder="Nội dung điều khoản mới"
                minRows={3}
                autosize
                value={newTermContent}
                disabled={!negotiating}
                onChange={(e) => setNewTermContent(e.currentTarget.value)}
              />
              <Button variant="light" loading={busy} disabled={!negotiating} onClick={handleAddTerm}>
                Thêm điều khoản
              </Button>
              <Button color="red" loading={busy} disabled={!negotiating} onClick={handleEndNegotiation}>
                Kết thúc đàm phán
              </Button>
            </Stack>

            <Title order={6} mt="lg" mb="xs">
              Thống kê đàm phán
            </Title>
            <Stack gap={4}>
              <StatRow label="Điều khoản đã đồng ý" value={`${stats.accepted}/${stats.total}`} color="green" />
              <StatRow label="Điều khoản đang thảo luận" value={`${stats.discussing}/${stats.total}`} color="orange" />
              <StatRow label="Điều khoản bị từ chối" value={`${stats.rejected}/${stats.total}`} color="red" />
            </Stack>
            <Progress value={stats.percent} mt="sm" />
            <Text size="xs" c="dimmed" ta="center" mt={4}>
              {stats.percent}% hoàn thành
            </Text>

            <Box mt="md">
              <Text size="sm">Tên hợp đồng: {contract.refCode || contract.name}</Text>
              <Text size="sm">Nhà cung cấp: {contract.supplierName}</Text>
              <Text size="sm">Giá trị: {formatMoney(contract.value, contract.currency)}</Text>
            </Box>
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  );
};

const StatRow = ({ label, value, color }: { label: string; value: string; color: string }) => (
  <Group justify="space-between">
    <Text size="sm">{label}:</Text>
    <Text size="sm" fw={700} c={color}>
      {value}
    </Text>
  </Group>
);

export default ContractNegotiationTab;

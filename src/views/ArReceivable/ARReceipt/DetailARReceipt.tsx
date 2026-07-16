import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  Alert,
  Anchor,
  Badge,
  Box,
  Breadcrumbs,
  Button,
  Card,
  Divider,
  Drawer,
  Flex,
  Grid,
  Group,
  Loader,
  Modal,
  ScrollArea,
  SimpleGrid,
  Stack,
  Table,
  Tabs,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import {
  IconAlertTriangle,
  IconArrowBackUp,
  IconArrowLeft,
  IconArrowsExchange,
  IconBuildingBank,
  IconCheck,
  IconEdit,
  IconEye,
  IconReceipt,
  IconUserCheck,
} from "@tabler/icons-react";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import { formatDateTime, formatNumber } from "../../../common/FormatDate/FormatDate";
import { ARMockStorage } from "../mock/arMockStorage";
import { MOCK_CUSTOMERS } from "../mock/arMockData";
import { arAccountingService } from "../services/arAccountingService";
import { arCashService } from "../services/arCashService";
import CreateARReceivableApplication from "../ARReceivableApplication/CreateARReceivableApplication";
import {
  ARAccountingEvent,
  ARJournalLine,
  ARReceipt,
  ARReceiptHistory,
  ARReceiptReversal,
  ARReceivableApplication,
} from "../types/arTypes";

const RECEIPT_WORKSPACE_PATH = "/cong-no-phai-thu/thu-tien?tab=phieu-thu";

const receiptStatusLabels: Record<string, string> = {
  DRAFT: "Nháp",
  APPROVED: "Đã duyệt",
  UNAPPLIED: "Chưa cấn trừ",
  PARTIALLY_APPLIED: "Đã cấn trừ một phần",
  APPLIED: "Đã cấn trừ",
  UNIDENTIFIED: "Chưa xác định khách hàng",
  ON_ACCOUNT: "On-account",
  CLEARED: "Đã đối soát ngân hàng",
  REVERSED: "Đã đảo",
};

const statusColor = (status?: string | null) => {
  switch (status) {
    case "APPLIED":
    case "FINAL":
    case "CLEARED":
    case "TRANSFERRED":
      return "teal";
    case "PARTIALLY_APPLIED":
    case "DRAFT":
    case "UNAPPLIED":
      return "yellow";
    case "UNIDENTIFIED":
    case "ON_ACCOUNT":
      return "orange";
    case "REVERSED":
    case "ERROR":
      return "red";
    default:
      return "gray";
  }
};

const displayDate = (value?: string | null) =>
  value ? formatDateTime(value, "DD/MM/YYYY") : "—";

const money = (value?: number | null) => formatNumber(Number(value) || 0);

export default function DetailARReceipt() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const receiptId = Number(id);

  const [header, setHeader] = useState<ARReceipt | null>(null);
  const [applications, setApplications] = useState<ARReceivableApplication[]>([]);
  const [history, setHistory] = useState<ARReceiptHistory[]>([]);
  const [reversals, setReversals] = useState<ARReceiptReversal[]>([]);
  const [accountingEvents, setAccountingEvents] = useState<ARAccountingEvent[]>([]);
  const [journalLines, setJournalLines] = useState<ARJournalLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [accountingLoadingId, setAccountingLoadingId] = useState<number | null>(null);

  const [reverseOpened, setReverseOpened] = useState(false);
  const [applyOpened, setApplyOpened] = useState(searchParams.get("action") === "apply");
  const [reverseReason, setReverseReason] = useState("");
  const [selectedApplication, setSelectedApplication] = useState<ARReceivableApplication | null>(null);
  const [unapplyReason, setUnapplyReason] = useState("");

  const loadReceipt = useCallback(async () => {
    if (!Number.isFinite(receiptId)) {
      setLoadError("Mã phiếu thu không hợp lệ.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setLoadError("");
    try {
      const res = await arCashService.getById(receiptId);
      if (!res.success || !res.data) {
        setHeader(null);
        setLoadError(res.message || "Không tìm thấy phiếu thu.");
        return;
      }

      setHeader(res.data);

      const receiptApplications = ARMockStorage.getReceivableApplications().filter(
        (application) => application.receiptId === receiptId,
      );
      setApplications(receiptApplications);
      setHistory(ARMockStorage.getReceiptHistory().filter((item) => item.receiptId === receiptId));
      setReversals(ARMockStorage.getReceiptReversals().filter((item) => item.receiptId === receiptId));

      const events = ARMockStorage.getAccountingEvents().filter(
        (event) => event.sourceDocumentType === "RECEIPT" && event.sourceDocumentId === receiptId,
      );
      setAccountingEvents(events);

      const eventIds = new Set(events.map((event) => event.eventId));
      setJournalLines(ARMockStorage.getJournalLines().filter((line) => eventIds.has(line.eventId)));
    } catch {
      setLoadError("Không thể tải chi tiết phiếu thu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, [receiptId]);

  useEffect(() => {
    void loadReceipt();
  }, [loadReceipt]);

  const activeApplications = useMemo(
    () => applications.filter((application) => application.status === "APPLIED" && application.reversedFlag !== "Y"),
    [applications],
  );

  const appliedFromApplications = useMemo(
    () => activeApplications.reduce((sum, application) => sum + (Number(application.amountApplied) || 0), 0),
    [activeApplications],
  );

  const amounts = useMemo(() => {
    const total = Number(header?.totalAmount) || 0;
    const applied = header?.appliedAmount == null
      ? appliedFromApplications
      : Number(header.appliedAmount) || 0;
    const unidentified = header?.unidentifiedAmount == null
      ? header?.status === "UNIDENTIFIED" ? Math.max(total - applied, 0) : 0
      : Number(header.unidentifiedAmount) || 0;
    const onAccount = header?.onAccountAmount == null
      ? header?.status === "ON_ACCOUNT" ? Math.max(total - applied - unidentified, 0) : 0
      : Number(header.onAccountAmount) || 0;
    const unapplied = header?.unappliedAmount == null
      ? Math.max(total - applied - unidentified - onAccount, 0)
      : Number(header.unappliedAmount) || 0;
    const allocated = applied + unapplied + unidentified + onAccount;

    return {
      total,
      applied,
      unapplied,
      unidentified,
      onAccount,
      difference: total - allocated,
    };
  }, [appliedFromApplications, header]);

  const invoicesById = useMemo(
    () => new Map(ARMockStorage.getInvoices().map((invoice) => [invoice.invoiceId, invoice])),
    [],
  );

  const getInvoiceNumber = useCallback(
    (invoiceId: number) => invoicesById.get(invoiceId)?.invoiceNumber || `INV-2026-${String(invoiceId).padStart(4, "0")}`,
    [invoicesById],
  );

  const affectedInvoiceCount = useMemo(
    () => new Set(activeApplications.map((application) => application.appliedInvoiceId)).size,
    [activeApplications],
  );

  const historyEntries = useMemo(() => {
    if (!header) return [];

    const entries = [
      {
        key: `created-${header.receiptId}`,
        date: header.createdDate,
        action: "Tạo phiếu thu",
        status: "CREATED",
        actor: header.createdBy,
        note: header.note,
      },
      ...history.map((item) => ({
        key: `history-${item.receiptHistoryId}`,
        date: item.actionDate || item.glDate || item.createdDate,
        action: item.actionCode || "Cập nhật phiếu thu",
        status: item.newStatus || header.status,
        actor: item.actionBy ?? item.createdBy,
        note: item.note,
      })),
      ...applications.map((application) => ({
        key: `application-${application.applicationId}`,
        date: application.applyDate || application.createdDate,
        action: application.status === "UNAPPLIED" ? "Unapply công nợ" : "Apply công nợ",
        status: application.status,
        actor: application.createdBy,
        note: `Hóa đơn ${getInvoiceNumber(application.appliedInvoiceId)} · ${money(application.amountApplied)} ${header.currencyCode}`,
      })),
      ...reversals.map((reversal) => ({
        key: `reversal-${reversal.reversalId}`,
        date: reversal.reversalDate || reversal.createdDate,
        action: "Reverse phiếu thu",
        status: reversal.status || "REVERSED",
        actor: reversal.reversedBy ?? reversal.createdBy,
        note: reversal.reversalReason,
      })),
    ];

    return entries.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA;
    });
  }, [applications, getInvoiceNumber, header, history, reversals]);

  const updateReceipt = async (changes: Partial<ARReceipt>, successMessage: string) => {
    if (!header) return;

    setActionLoading(true);
    try {
      const res = await arCashService.update(receiptId, { ...changes, versionNo: header.versionNo });
      if (!res.success) {
        NotificationExtension.Fails(res.message || "Không thể cập nhật phiếu thu.");
        return;
      }
      NotificationExtension.Success(successMessage);
      await loadReceipt();
    } catch {
      NotificationExtension.Fails("Không thể cập nhật phiếu thu.");
    } finally {
      setActionLoading(false);
    }
  };

  const moveToUnapplied = () => updateReceipt(
    {
      appliedAmount: amounts.applied,
      unidentifiedAmount: 0,
      unappliedAmount: amounts.unapplied + amounts.unidentified,
      onAccountAmount: amounts.onAccount,
      status: amounts.applied > 0 ? "PARTIALLY_APPLIED" : "UNAPPLIED",
    },
    "Đã chuyển số tiền sang trạng thái chưa phân bổ.",
  );

  const moveToOnAccount = () => updateReceipt(
    {
      appliedAmount: amounts.applied,
      unidentifiedAmount: amounts.unidentified,
      unappliedAmount: 0,
      onAccountAmount: amounts.onAccount + amounts.unapplied,
      status: amounts.applied > 0 ? "PARTIALLY_APPLIED" : "ON_ACCOUNT",
    },
    "Đã chuyển số tiền chưa phân bổ sang On-account.",
  );

  const releaseOnAccount = () => updateReceipt(
    {
      appliedAmount: amounts.applied,
      unidentifiedAmount: amounts.unidentified,
      unappliedAmount: amounts.unapplied + amounts.onAccount,
      onAccountAmount: 0,
      status: amounts.applied > 0 ? "PARTIALLY_APPLIED" : "UNAPPLIED",
    },
    "Đã giải phóng số tiền On-account về chưa phân bổ.",
  );

  const handleReverse = async () => {
    if (!header || !reverseReason.trim()) return;

    setActionLoading(true);
    try {
      const res = await arCashService.reverseReceipt(receiptId, reverseReason.trim());
      if (!res.success) {
        NotificationExtension.Fails(res.message || "Không thể reverse phiếu thu.");
        return;
      }
      NotificationExtension.Success("Đã reverse phiếu thu.");
      setReverseOpened(false);
      setReverseReason("");
      await loadReceipt();
    } catch {
      NotificationExtension.Fails("Không thể reverse phiếu thu.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnapply = async () => {
    if (!selectedApplication || !unapplyReason.trim()) return;

    setActionLoading(true);
    try {
      const res = await arCashService.unapplyReceipt(selectedApplication.applicationId);
      if (!res.success) {
        NotificationExtension.Fails(res.message || "Không thể Unapply công nợ.");
        return;
      }
      NotificationExtension.Success("Đã Unapply và cập nhật lại số dư công nợ.");
      setSelectedApplication(null);
      setUnapplyReason("");
      await loadReceipt();
    } catch {
      NotificationExtension.Fails("Không thể Unapply công nợ.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAccounting = async (eventId: number, mode: "DRAFT" | "FINAL") => {
    setAccountingLoadingId(eventId);
    try {
      const res = await arAccountingService.runAccounting(eventId, mode);
      if (!res.success) {
        NotificationExtension.Fails(res.message || "Không thể thực hiện hạch toán.");
        return;
      }
      NotificationExtension.Success(mode === "FINAL" ? "Đã hoàn tất hạch toán chính thức." : "Đã tạo hạch toán nháp.");
      await loadReceipt();
    } catch {
      NotificationExtension.Fails("Không thể thực hiện hạch toán.");
    } finally {
      setAccountingLoadingId(null);
    }
  };

  if (loading && !header) {
    return (
      <Flex justify="center" align="center" mih={240}>
        <Loader color="indigo" />
      </Flex>
    );
  }

  if (!header) {
    return (
      <Alert color="red" title="Không thể mở phiếu thu" icon={<IconAlertTriangle size={18} />}>
        {loadError || "Không tìm thấy phiếu thu."}
      </Alert>
    );
  }

  const customerName = MOCK_CUSTOMERS.find((customer) => customer.id === header.customerId)?.name;
  const canEdit = !["REVERSED", "APPLIED"].includes(header.status);
  const canApply = header.status !== "REVERSED" && Boolean(header.customerId) && amounts.unapplied > 0;
  const isReversed = header.status === "REVERSED";
  const isBalanced = Math.abs(amounts.difference) < 0.01;

  return (
    <Box>
      <Breadcrumbs separator="›" mb="xs">
        <Anchor size="sm" onClick={() => navigate(RECEIPT_WORKSPACE_PATH)}>
          Thu tiền &amp; Cấn trừ
        </Anchor>
        <Anchor size="sm" onClick={() => navigate(RECEIPT_WORKSPACE_PATH)}>
          Phiếu thu
        </Anchor>
        <Text size="sm" fw={600}>{header.receiptNumber}</Text>
      </Breadcrumbs>

      <Flex justify="space-between" align="center" gap="md" wrap="wrap" mb="lg">
        <Button
          variant="subtle"
          leftSection={<IconArrowLeft size={16} />}
          onClick={() => navigate(RECEIPT_WORKSPACE_PATH)}
        >
          Quay lại danh sách
        </Button>

        <Group gap="xs">
          {canEdit && (
            <Button
              variant="outline"
              color="indigo"
              leftSection={<IconEdit size={16} />}
              onClick={() => navigate(`/cong-no-phai-thu/phieu-thu/${receiptId}/chinh-sua`)}
            >
              Sửa phiếu thu
            </Button>
          )}
          {canApply && (
            <Button
              color="indigo"
              leftSection={<IconArrowsExchange size={16} />}
              onClick={() => setApplyOpened(true)}
            >
              Apply tiền
            </Button>
          )}
          {!isReversed && (
            <Button
              variant="outline"
              color="red"
              leftSection={<IconArrowBackUp size={16} />}
              onClick={() => setReverseOpened(true)}
            >
              Reverse
            </Button>
          )}
        </Group>
      </Flex>

      <Card withBorder shadow="sm" radius="md" mb="md" bg="gray.0">
        <Grid align="center">
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Số phiếu thu</Text>
            <Title order={3}>{header.receiptNumber}</Title>
            <Text size="sm" c="dimmed" mt={4}>Ngày thu: {displayDate(header.receiptDate)}</Text>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Khách hàng</Text>
            <Text size="md" fw={700}>{customerName || "Chưa xác định khách hàng"}</Text>
            <Text size="sm" c="dimmed" mt={4}>
              Phương thức thu: {header.paymentMethod || `Mã phương thức #${header.receiptMethodId}`}
            </Text>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }} style={{ borderLeft: "1px solid var(--mantine-color-gray-3)" }}>
            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Tổng phiếu thu</Text>
            <Title order={3} c="indigo">{money(amounts.total)} {header.currencyCode}</Title>
            <Group mt="xs" gap="xs">
              <Badge color={statusColor(header.status)}>
                {receiptStatusLabels[header.status] || header.status}
              </Badge>
              <Badge variant="light" color={statusColor(header.clearingStatus)}>
                {header.clearingStatus === "CLEARED" ? "Đã Clear" : "Chưa Clear"}
              </Badge>
            </Group>
          </Grid.Col>
        </Grid>
      </Card>

      <Tabs defaultValue={searchParams.get("tab") === "applications" ? "applications" : "tong-quan"} color="indigo" variant="pills" radius="sm">
        <Tabs.List style={{ overflowX: "auto", flexWrap: "nowrap", marginBottom: 16 }}>
          <Tabs.Tab value="tong-quan">Tổng quan</Tabs.Tab>
          <Tabs.Tab value="applications">Cấn trừ công nợ ({activeApplications.length})</Tabs.Tab>
          <Tabs.Tab value="history">Lịch sử ({historyEntries.length})</Tabs.Tab>
          <Tabs.Tab value="accounting">Hạch toán ({accountingEvents.length})</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="tong-quan">
          <Stack gap="md">
            <Card withBorder radius="md">
              <Flex justify="space-between" align="flex-start" gap="md" wrap="wrap" mb="md">
                <Box>
                  <Title order={5}>Phân bổ số tiền phiếu thu</Title>
                  <Text size="sm" c="dimmed">
                    Tổng phiếu thu = Đã Apply + Chưa Apply + Unidentified + On-account
                  </Text>
                </Box>
                <Badge color={isBalanced ? "teal" : "red"} variant="light">
                  {isBalanced ? "Số tiền đã cân bằng" : `Chênh lệch ${money(amounts.difference)} ${header.currencyCode}`}
                </Badge>
              </Flex>

              <SimpleGrid cols={{ base: 1, sm: 2, lg: 5 }} spacing="sm">
                <AmountCard label="Tổng phiếu thu" value={amounts.total} currency={header.currencyCode} color="indigo" />
                <AmountCard label="Đã Apply" value={amounts.applied} currency={header.currencyCode} color="teal" />
                <AmountCard label="Chưa Apply" value={amounts.unapplied} currency={header.currencyCode} color="orange" />
                <AmountCard label="Unidentified" value={amounts.unidentified} currency={header.currencyCode} color="red" />
                <AmountCard label="On-account" value={amounts.onAccount} currency={header.currencyCode} color="blue" />
              </SimpleGrid>
            </Card>

            <Card withBorder radius="md">
              <Title order={5} mb="md">Thông tin phiếu thu</Title>
              <Grid>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <InfoItem label="Ngày thu" value={displayDate(header.receiptDate)} />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <InfoItem label="Ngày hạch toán" value={displayDate(header.glDate)} />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <InfoItem label="Loại phiếu thu" value={header.receiptType || "—"} />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <InfoItem label="Trạng thái Clearing" value={header.clearingStatus || "Chưa thiết lập"} />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <InfoItem label="Trạng thái hạch toán" value={header.accountingStatus || "UNACCOUNTED"} />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <InfoItem label="GL Transfer" value={header.transferToGlStatus || "NOT_TRANSFERRED"} />
                </Grid.Col>
                <Grid.Col span={12}>
                  <Divider my="xs" />
                  <InfoItem label="Ghi chú" value={header.note || "Không có ghi chú"} />
                </Grid.Col>
              </Grid>
            </Card>

            {!isReversed && (
              <Card withBorder radius="md">
                <Title order={5} mb={4}>Thao tác theo trạng thái</Title>
                <Text size="sm" c="dimmed" mb="md">
                  Chỉ các thao tác phù hợp với trạng thái hiện tại được hiển thị.
                </Text>
                <Group gap="xs">
                  {!header.customerId && (
                    <Button
                      variant="light"
                      leftSection={<IconUserCheck size={16} />}
                      onClick={() => navigate(`/cong-no-phai-thu/phieu-thu/${receiptId}/chinh-sua`)}
                    >
                      Identify khách hàng
                    </Button>
                  )}
                  {Boolean(header.customerId) && amounts.unidentified > 0 && (
                    <Button variant="light" onClick={moveToUnapplied} loading={actionLoading}>
                      Chuyển sang Unapplied
                    </Button>
                  )}
                  {amounts.unapplied > 0 && (
                    <Button variant="light" color="blue" onClick={moveToOnAccount} loading={actionLoading}>
                      Chuyển sang On-account
                    </Button>
                  )}
                  {amounts.onAccount > 0 && (
                    <Button variant="light" color="blue" onClick={releaseOnAccount} loading={actionLoading}>
                      Release On-account
                    </Button>
                  )}
                  {header.clearingStatus === "CLEARED" ? (
                    <Button
                      variant="outline"
                      color="orange"
                      onClick={() => updateReceipt({ clearingStatus: "UNCLEARED" }, "Đã Unclear phiếu thu.")}
                      loading={actionLoading}
                    >
                      Unclear
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      color="teal"
                      leftSection={<IconBuildingBank size={16} />}
                      onClick={() => updateReceipt({ clearingStatus: "CLEARED" }, "Đã Clear phiếu thu.")}
                      loading={actionLoading}
                    >
                      Clear
                    </Button>
                  )}
                </Group>
              </Card>
            )}
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="applications">
          <Card withBorder radius="md">
            <Flex justify="space-between" align="flex-start" gap="md" wrap="wrap" mb="md">
              <Box>
                <Title order={5}>Các khoản đã cấn trừ</Title>
                <Text size="sm" c="dimmed">
                  Theo dõi hóa đơn, số tiền Apply, chiết khấu và người thực hiện ngay trên phiếu thu.
                </Text>
              </Box>
              {canApply && (
                <Button
                  size="sm"
                  color="indigo"
                  leftSection={<IconArrowsExchange size={16} />}
                  onClick={() => setApplyOpened(true)}
                >
                  Apply thêm
                </Button>
              )}
            </Flex>

            <ScrollArea>
              <Table striped highlightOnHover miw={900}>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Hóa đơn</Table.Th>
                    <Table.Th>Ngày Apply</Table.Th>
                    <Table.Th style={{ textAlign: "right" }}>Số tiền Apply</Table.Th>
                    <Table.Th style={{ textAlign: "right" }}>Discount</Table.Th>
                    <Table.Th>Trạng thái</Table.Th>
                    <Table.Th>Người thực hiện</Table.Th>
                    <Table.Th>Thao tác</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {applications.map((application) => (
                    <Table.Tr key={application.applicationId}>
                      <Table.Td>
                        <Anchor
                          fw={700}
                          onClick={() => navigate(`/cong-no-phai-thu/hoa-don/${application.appliedInvoiceId}`)}
                        >
                          {getInvoiceNumber(application.appliedInvoiceId)}
                        </Anchor>
                      </Table.Td>
                      <Table.Td>{displayDate(application.applyDate)}</Table.Td>
                      <Table.Td style={{ textAlign: "right" }} fw={700}>
                        {money(application.amountApplied)} {header.currencyCode}
                      </Table.Td>
                      <Table.Td style={{ textAlign: "right" }}>
                        {money(application.discountTaken)}
                      </Table.Td>
                      <Table.Td>
                        <Badge color={statusColor(application.status)} variant="light">
                          {application.status}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        {application.createdBy == null ? "Hệ thống" : `Người dùng #${application.createdBy}`}
                      </Table.Td>
                      <Table.Td>
                        <Group gap={4} wrap="nowrap">
                          <Button
                            size="compact-xs"
                            variant="subtle"
                            leftSection={<IconEye size={14} />}
                            onClick={() => navigate(`/cong-no-phai-thu/hoa-don/${application.appliedInvoiceId}`)}
                          >
                            Xem hóa đơn
                          </Button>
                          {application.status === "APPLIED" && !isReversed && (
                            <Button
                              size="compact-xs"
                              variant="subtle"
                              color="red"
                              onClick={() => {
                                setSelectedApplication(application);
                                setUnapplyReason("");
                              }}
                            >
                              Unapply
                            </Button>
                          )}
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                  {applications.length === 0 && (
                    <Table.Tr>
                      <Table.Td colSpan={7}>
                        <Stack align="center" gap={4} py="xl">
                          <IconReceipt size={28} color="var(--mantine-color-gray-5)" />
                          <Text fw={600}>Chưa có khoản cấn trừ</Text>
                          <Text size="sm" c="dimmed">Phiếu thu chưa được Apply vào hóa đơn nào.</Text>
                        </Stack>
                      </Table.Td>
                    </Table.Tr>
                  )}
                </Table.Tbody>
              </Table>
            </ScrollArea>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="history">
          <Card withBorder radius="md">
            <Title order={5} mb={4}>Lịch sử thao tác</Title>
            <Text size="sm" c="dimmed" mb="md">
              Nhật ký hợp nhất từ phiếu thu, các lần Apply/Unapply và Reverse.
            </Text>
            <ScrollArea>
              <Table striped highlightOnHover miw={760}>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Ngày</Table.Th>
                    <Table.Th>Hành động</Table.Th>
                    <Table.Th>Trạng thái</Table.Th>
                    <Table.Th>Người thực hiện</Table.Th>
                    <Table.Th>Ghi chú</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {historyEntries.map((entry) => (
                    <Table.Tr key={entry.key}>
                      <Table.Td>{displayDate(entry.date)}</Table.Td>
                      <Table.Td fw={600}>{entry.action}</Table.Td>
                      <Table.Td>
                        <Badge color={statusColor(entry.status)} variant="light">
                          {receiptStatusLabels[entry.status] || entry.status || "—"}
                        </Badge>
                      </Table.Td>
                      <Table.Td>{entry.actor == null ? "Hệ thống" : `Người dùng #${entry.actor}`}</Table.Td>
                      <Table.Td>{entry.note || "—"}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </ScrollArea>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="accounting">
          <Stack gap="md">
            <Card withBorder radius="md">
              <Flex justify="space-between" align="flex-start" gap="md" wrap="wrap" mb="md">
                <Box>
                  <Title order={5}>Accounting Events</Title>
                  <Text size="sm" c="dimmed">Các sự kiện hạch toán phát sinh từ phiếu thu này.</Text>
                </Box>
                <Badge color={statusColor(header.accountingStatus)} variant="light" size="lg">
                  {header.accountingStatus || "UNACCOUNTED"}
                </Badge>
              </Flex>
              <ScrollArea>
                <Table striped highlightOnHover miw={760}>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Event</Table.Th>
                      <Table.Th>Ngày GL</Table.Th>
                      <Table.Th>Trạng thái</Table.Th>
                      <Table.Th>GL Transfer</Table.Th>
                      <Table.Th>Thao tác</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {accountingEvents.map((event) => (
                      <Table.Tr key={event.eventId}>
                        <Table.Td>
                          <Text fw={700}>#{event.eventId} · {event.eventType}</Text>
                          <Text size="xs" c="dimmed">{event.eventClass}</Text>
                        </Table.Td>
                        <Table.Td>{displayDate(event.glDate)}</Table.Td>
                        <Table.Td>
                          <Badge color={statusColor(event.accountingStatus)}>{event.accountingStatus}</Badge>
                        </Table.Td>
                        <Table.Td>{event.transferToGlStatus || "NOT_TRANSFERRED"}</Table.Td>
                        <Table.Td>
                          <Group gap={4} wrap="nowrap">
                            <Button
                              size="compact-xs"
                              variant="outline"
                              loading={accountingLoadingId === event.eventId}
                              onClick={() => handleAccounting(event.eventId, "DRAFT")}
                            >
                              Draft
                            </Button>
                            <Button
                              size="compact-xs"
                              color="teal"
                              leftSection={<IconCheck size={13} />}
                              loading={accountingLoadingId === event.eventId}
                              onClick={() => handleAccounting(event.eventId, "FINAL")}
                            >
                              Final
                            </Button>
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                    {accountingEvents.length === 0 && (
                      <Table.Tr>
                        <Table.Td colSpan={5} ta="center" py="xl">
                          Chưa có Accounting Event cho phiếu thu này.
                        </Table.Td>
                      </Table.Tr>
                    )}
                  </Table.Tbody>
                </Table>
              </ScrollArea>
            </Card>

            <Card withBorder radius="md">
              <Title order={5} mb="md">Định khoản Nợ / Có</Title>
              <ScrollArea>
                <Table striped miw={700}>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Tài khoản</Table.Th>
                      <Table.Th>Accounting Class</Table.Th>
                      <Table.Th style={{ textAlign: "right" }}>Nợ (Debit)</Table.Th>
                      <Table.Th style={{ textAlign: "right" }}>Có (Credit)</Table.Th>
                      <Table.Th>Ngày GL</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {journalLines.map((line) => {
                      const debit = Number(line.enteredDr ?? (line as ARJournalLine & { enteredDebit?: number }).enteredDebit) || 0;
                      const credit = Number(line.enteredCr ?? (line as ARJournalLine & { enteredCredit?: number }).enteredCredit) || 0;
                      return (
                        <Table.Tr key={line.journalLineId}>
                          <Table.Td fw={700}>CCID #{line.accountCcid}</Table.Td>
                          <Table.Td>{line.accountingClass}</Table.Td>
                          <Table.Td style={{ textAlign: "right" }}>{debit ? money(debit) : "—"}</Table.Td>
                          <Table.Td style={{ textAlign: "right" }}>{credit ? money(credit) : "—"}</Table.Td>
                          <Table.Td>{displayDate(line.glDate)}</Table.Td>
                        </Table.Tr>
                      );
                    })}
                    {journalLines.length === 0 && (
                      <Table.Tr>
                        <Table.Td colSpan={5} ta="center" py="xl">Chưa phát sinh dòng định khoản.</Table.Td>
                      </Table.Tr>
                    )}
                  </Table.Tbody>
                </Table>
              </ScrollArea>
            </Card>
          </Stack>
        </Tabs.Panel>
      </Tabs>

      <Drawer
        opened={applyOpened}
        onClose={() => {
          setApplyOpened(false);
          void loadReceipt();
        }}
        title={`Apply phiếu thu ${header.receiptNumber}`}
        position="right"
        size="92%"
        padding="lg"
      >
        <CreateARReceivableApplication
          receiptId={receiptId}
          embedded
          preferredInvoiceId={Number(searchParams.get("invoiceId")) || undefined}
          onCompleted={() => void loadReceipt()}
        />
      </Drawer>

      <Modal
        opened={reverseOpened}
        onClose={() => {
          if (!actionLoading) {
            setReverseOpened(false);
            setReverseReason("");
          }
        }}
        title={<Text fw={700}>Xác nhận Reverse phiếu thu</Text>}
        centered
        size="lg"
        closeOnClickOutside={!actionLoading}
        closeOnEscape={!actionLoading}
      >
        <Stack gap="md">
          <Alert color="red" variant="light" icon={<IconAlertTriangle size={18} />}>
            Reverse sẽ làm mở lại các hóa đơn liên quan. Thao tác này không thể hoàn tác trực tiếp.
          </Alert>

          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs">
            <ImpactItem label="Phiếu thu" value={header.receiptNumber} />
            <ImpactItem label="Tổng tiền" value={`${money(amounts.total)} ${header.currencyCode}`} />
            <ImpactItem label="Application sẽ đảo" value={String(activeApplications.length)} />
            <ImpactItem label="Hóa đơn bị ảnh hưởng" value={String(affectedInvoiceCount)} />
            <ImpactItem label="Số tiền hoàn lại công nợ" value={`${money(appliedFromApplications)} ${header.currencyCode}`} />
          </SimpleGrid>

          {activeApplications.length > 0 && (
            <ScrollArea h={Math.min(180, activeApplications.length * 42 + 42)}>
              <Table striped withTableBorder>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Hóa đơn</Table.Th>
                    <Table.Th style={{ textAlign: "right" }}>Số tiền sẽ đảo</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {activeApplications.map((application) => (
                    <Table.Tr key={application.applicationId}>
                      <Table.Td fw={600}>{getInvoiceNumber(application.appliedInvoiceId)}</Table.Td>
                      <Table.Td style={{ textAlign: "right" }}>
                        {money(application.amountApplied)} {header.currencyCode}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </ScrollArea>
          )}

          <Textarea
            label="Lý do Reverse"
            placeholder="Nhập lý do đảo phiếu thu"
            required
            minRows={3}
            value={reverseReason}
            onChange={(event) => setReverseReason(event.currentTarget.value)}
          />

          <Group justify="flex-end">
            <Button variant="default" onClick={() => setReverseOpened(false)} disabled={actionLoading}>
              Hủy
            </Button>
            <Button
              color="red"
              leftSection={<IconArrowBackUp size={16} />}
              onClick={handleReverse}
              disabled={!reverseReason.trim()}
              loading={actionLoading}
            >
              Xác nhận Reverse
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Modal
        opened={Boolean(selectedApplication)}
        onClose={() => {
          if (!actionLoading) {
            setSelectedApplication(null);
            setUnapplyReason("");
          }
        }}
        title={<Text fw={700}>Xác nhận Unapply</Text>}
        centered
        closeOnClickOutside={!actionLoading}
        closeOnEscape={!actionLoading}
      >
        {selectedApplication && (
          <Stack gap="md">
            <Alert color="orange" variant="light" icon={<IconAlertTriangle size={18} />}>
              Số tiền sẽ được hoàn lại vào phần chưa phân bổ của phiếu thu và số dư hóa đơn sẽ được mở lại.
            </Alert>
            <SimpleGrid cols={2} spacing="xs">
              <ImpactItem label="Hóa đơn" value={getInvoiceNumber(selectedApplication.appliedInvoiceId)} />
              <ImpactItem
                label="Số tiền hoàn lại"
                value={`${money(selectedApplication.amountApplied)} ${header.currencyCode}`}
              />
            </SimpleGrid>
            <Textarea
              label="Lý do Unapply"
              placeholder="Nhập lý do Unapply"
              required
              minRows={3}
              value={unapplyReason}
              onChange={(event) => setUnapplyReason(event.currentTarget.value)}
            />
            <Group justify="flex-end">
              <Button variant="default" onClick={() => setSelectedApplication(null)} disabled={actionLoading}>
                Hủy
              </Button>
              <Button
                color="orange"
                onClick={handleUnapply}
                disabled={!unapplyReason.trim()}
                loading={actionLoading}
              >
                Xác nhận Unapply
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Box>
  );
}

function AmountCard({
  label,
  value,
  currency,
  color,
}: {
  label: string;
  value: number;
  currency: string;
  color: string;
}) {
  return (
    <Card withBorder radius="sm" padding="sm" bg={`${color}.0`}>
      <Text size="xs" c="dimmed" fw={600}>{label}</Text>
      <Text fw={800} c={`${color}.8`} mt={4}>{money(value)}</Text>
      <Text size="xs" c="dimmed">{currency}</Text>
    </Card>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Text size="xs" c="dimmed">{label}</Text>
      <Text size="sm" fw={600}>{value}</Text>
    </Box>
  );
}

function ImpactItem({ label, value }: { label: string; value: string }) {
  return (
    <Card withBorder padding="xs" radius="sm">
      <Text size="xs" c="dimmed">{label}</Text>
      <Text size="sm" fw={700}>{value}</Text>
    </Card>
  );
}

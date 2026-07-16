import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  Anchor,
  Badge,
  Box,
  Breadcrumbs,
  Button,
  Card,
  Flex,
  Grid,
  Group,
  SimpleGrid,
  Stack,
  Table,
  Tabs,
  Text,
  Timeline,
  Title,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import {
  IconArrowLeft,
  IconBan,
  IconCheck,
  IconCoin,
  IconEdit,
  IconFileMinus,
  IconHistory,
  IconSettings,
} from "@tabler/icons-react";
import { arBillingService } from "../services/arBillingService";
import { arCashService } from "../services/arCashService";
import { ARMockStorage } from "../mock/arMockStorage";
import { MOCK_CREDIT_MEMO_APPLICATIONS, MOCK_CUSTOMERS } from "../mock/arMockData";
import { formatDateTime, formatNumber } from "../../../common/FormatDate/FormatDate";
import { StatusBadge } from "../../../_base/component/Core/StatusBadge";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";

const invoiceWorkspacePath = "/cong-no-phai-thu/cong-no?tab=hoa-don";

const asAmount = (value: unknown) => Number(value || 0);

function AmountCard({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <Card withBorder padding="sm" radius="sm">
      <Text size="xs" c="dimmed">{label}</Text>
      <Text size="lg" fw={700} c={color}>{formatNumber(value)} VND</Text>
    </Card>
  );
}

export default function DetailARInvoice() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [header, setHeader] = useState<any>(null);
  const [lines, setLines] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [distributions, setDistributions] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [cmApplications, setCmApplications] = useState<any[]>([]);
  const [adjustments, setAdjustments] = useState<any[]>([]);
  const [promotions, setPromotions] = useState<any[]>([]);
  const [accountingEvents, setAccountingEvents] = useState<any[]>([]);
  const [journalLines, setJournalLines] = useState<any[]>([]);
  const [actionLogs, setActionLogs] = useState<any[]>([]);

  const fetchData = useCallback(async () => {
    const invoiceId = Number(id);
    const res = await arBillingService.getById(invoiceId);

    if (!res.success || !res.data) return;

    setHeader(res.data.header);
    setLines(res.data.lines);

    setSchedules(ARMockStorage.getPaymentSchedules().filter(x => x.invoiceId === invoiceId));
    setDistributions(ARMockStorage.getTransactionDistributions().filter(x => x.invoiceId === invoiceId));
    setApplications(
      ARMockStorage.getReceivableApplications().filter(
        x => x.appliedInvoiceId === invoiceId && x.status === "APPLIED" && x.applicationType !== "CREDIT_MEMO",
      ),
    );
    setCmApplications(MOCK_CREDIT_MEMO_APPLICATIONS.filter(x => x.invoiceId === invoiceId));
    setAdjustments(ARMockStorage.getAdjustments().filter(x => x.invoiceId === invoiceId));
    setPromotions(ARMockStorage.getInvoicePromotions().filter(x => x.invoiceId === invoiceId));

    const events = ARMockStorage.getAccountingEvents().filter(
      x => x.sourceDocumentId === invoiceId && x.sourceDocumentType === "INVOICE",
    );
    setAccountingEvents(events);
    const eventIds = events.map(x => x.eventId);
    setJournalLines(ARMockStorage.getJournalLines().filter(x => eventIds.includes(x.eventId)));
    setActionLogs(
      ARMockStorage.getDocumentActionLogs()
        .filter(x => x.documentId === invoiceId && x.documentType === "INVOICE")
        .sort((a, b) => String(b.actionDate).localeCompare(String(a.actionDate))),
    );
  }, [id]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  if (!header) return <Text>Đang tải chi tiết hóa đơn...</Text>;

  const invoiceId = Number(id);
  const customerName = MOCK_CUSTOMERS.find(c => c.id === header.soldToCustomerId)?.name || "Khách hàng vãng lai";
  const currency = header.invoiceCurrencyCode || header.currency || "VND";
  const status = String(header.status || "DRAFT").toUpperCase();
  const isDraft = status === "DRAFT";
  const isPaid = status === "PAID";
  const isVoided = status === "VOID" || status === "VOIDED";
  const canProcessReceivable = ["COMPLETE", "OPEN", "PARTIALLY_PAID"].includes(status);

  const totalPaid = schedules.reduce((sum, item) => sum + asAmount(item.amountApplied), 0);
  const totalCredited = schedules.reduce((sum, item) => sum + asAmount(item.amountCredited), 0);
  const totalAdjusted = schedules.reduce((sum, item) => sum + asAmount(item.amountAdjusted), 0);
  const totalRemaining = schedules.length
    ? schedules.reduce((sum, item) => sum + asAmount(item.amountDueRemaining), 0)
    : asAmount(header.totalAmountRemaining ?? header.totalAmount);
  const totalTax = lines.reduce((sum, line) => sum + asAmount(line.amountTax ?? line.taxAmount), 0);
  const totalDiscount = lines.reduce((sum, line) => sum + asAmount(line.amountDiscount ?? line.discountAmount), 0);
  const totalVoucher = lines.reduce((sum, line) => sum + asAmount(line.amountVoucher), asAmount(header.totalAmountVoucher));
  const extendedAttributes = Array.from({ length: 15 })
    .map((_, index) => ({ label: `ATTRIBUTE${index + 1}`, value: header[`attribute${index + 1}`] }))
    .filter(item => item.value);

  const getTimelineActiveStep = () => {
    switch (status) {
      case "DRAFT": return 0;
      case "COMPLETE": return 1;
      case "OPEN": return 2;
      case "PARTIALLY_PAID": return 3;
      case "PAID": return 4;
      default: return 0;
    }
  };

  const goToApply = () => {
    navigate(`/cong-no-phai-thu/thu-tien?tab=phieu-thu&invoiceId=${invoiceId}&customerId=${header.soldToCustomerId}&action=apply`);
  };

  const goToCreateCreditMemo = () => {
    navigate(`/cong-no-phai-thu/credit-memo/tao-moi?invoiceId=${invoiceId}`);
  };

  const goToCreateAdjustment = () => {
    navigate(`/cong-no-phai-thu/dieu-chinh/tao-moi?invoiceId=${invoiceId}`);
  };

  const handleComplete = () => {
    modals.openConfirmModal({
      title: "Hoàn tất hóa đơn",
      children: (
        <Stack gap={4}>
          <Text size="sm">Hóa đơn: <b>{header.invoiceNumber}</b></Text>
          <Text size="sm">Tổng tiền: <b>{formatNumber(asAmount(header.totalAmount))} {currency}</b></Text>
          <Text size="sm" c="dimmed">Sau khi hoàn tất, hóa đơn sẵn sàng cho các nghiệp vụ thu tiền và giảm trừ.</Text>
        </Stack>
      ),
      labels: { confirm: "Hoàn tất", cancel: "Hủy" },
      confirmProps: { color: "teal" },
      onConfirm: async () => {
        const res = await arBillingService.completeInvoice(invoiceId);
        if (res.success) {
          NotificationExtension.Success("Đã hoàn tất hóa đơn!");
          await fetchData();
        } else {
          NotificationExtension.Fails(res.message);
        }
      },
    });
  };

  const handleVoid = () => {
    modals.openConfirmModal({
      title: "Vô hiệu hóa đơn",
      children: (
        <Stack gap={4}>
          <Text size="sm">Hóa đơn: <b>{header.invoiceNumber}</b></Text>
          <Text size="sm">Công nợ còn lại: <b>{formatNumber(totalRemaining)} {currency}</b></Text>
          <Text size="sm" c="red">Hóa đơn sẽ không còn được phép thu tiền, giảm trừ hoặc điều chỉnh.</Text>
        </Stack>
      ),
      labels: { confirm: "Vô hiệu", cancel: "Hủy" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        const res = await arBillingService.voidInvoice(invoiceId, "Hủy từ màn hình chi tiết hóa đơn");
        if (res.success) {
          NotificationExtension.Success("Đã vô hiệu hóa đơn!");
          await fetchData();
        } else {
          NotificationExtension.Fails(res.message);
        }
      },
    });
  };

  const handleUnapply = (application: any) => {
    modals.openConfirmModal({
      title: "Xác nhận Unapply",
      children: (
        <Stack gap={4}>
          <Text size="sm">Phiếu thu: <b>RCT-2026-{String(application.receiptId).padStart(4, "0")}</b></Text>
          <Text size="sm">Số tiền hoàn lại phiếu thu: <b>{formatNumber(asAmount(application.amountApplied))} {currency}</b></Text>
          <Text size="sm" c="dimmed">Số dư hóa đơn và phiếu thu sẽ được tính lại sau khi xác nhận.</Text>
        </Stack>
      ),
      labels: { confirm: "Unapply", cancel: "Hủy" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        const res = await arCashService.unapplyReceipt(application.applicationId);
        if (res.success) {
          NotificationExtension.Success("Đã Unapply phiếu thu!");
          await fetchData();
        } else {
          NotificationExtension.Fails(res.message);
        }
      },
    });
  };

  return (
    <Box>
      <Breadcrumbs separator="›" mb="xs">
        <Anchor href={invoiceWorkspacePath} onClick={(event) => { event.preventDefault(); navigate(invoiceWorkspacePath); }}>
          Công nợ phải thu
        </Anchor>
        <Anchor href={invoiceWorkspacePath} onClick={(event) => { event.preventDefault(); navigate(invoiceWorkspacePath); }}>
          Hóa đơn
        </Anchor>
        <Text>{header.invoiceNumber}</Text>
      </Breadcrumbs>

      <Flex justify="space-between" align="center" gap="md" wrap="wrap" mb="lg">
        <Button
          variant="subtle"
          leftSection={<IconArrowLeft size={16} />}
          onClick={() => navigate(invoiceWorkspacePath)}
        >
          Quay lại danh sách
        </Button>

        <Group gap="xs" wrap="wrap">
          {isDraft && (
            <>
              <Button
                variant="outline"
                color="indigo"
                leftSection={<IconEdit size={16} />}
                onClick={() => navigate(`/cong-no-phai-thu/hoa-don/${invoiceId}/chinh-sua`)}
              >
                Sửa
              </Button>
              <Button color="teal" leftSection={<IconCheck size={16} />} onClick={handleComplete}>
                Complete
              </Button>
            </>
          )}
          {canProcessReceivable && (
            <>
              <Button color="indigo" leftSection={<IconCoin size={16} />} onClick={goToApply}>
                Apply tiền
              </Button>
              <Button variant="outline" leftSection={<IconFileMinus size={16} />} onClick={goToCreateCreditMemo}>
                Tạo Credit Memo
              </Button>
              <Button variant="outline" leftSection={<IconSettings size={16} />} onClick={goToCreateAdjustment}>
                Tạo Adjustment
              </Button>
            </>
          )}
          {!isDraft && !isPaid && !isVoided && (
            <Button variant="outline" color="red" leftSection={<IconBan size={16} />} onClick={handleVoid}>
              Void
            </Button>
          )}
        </Group>
      </Flex>

      <Card withBorder shadow="sm" radius="sm" mb="md" style={{ background: "#f8f9fa" }}>
        <Grid align="center">
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Text size="xs" c="dimmed">Số hóa đơn</Text>
            <Title order={3}>{header.invoiceNumber}</Title>
            <Text size="xs" mt="xs">Hóa đơn GTGT: <b>{header.invoiceNum || "N/A"}</b></Text>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Text size="xs" c="dimmed">Khách hàng</Text>
            <Text size="md" fw={700}>{customerName}</Text>
            <Text size="xs" mt="xs">Ngày HĐ: {formatDateTime(header.invoiceDate, "DD/MM/YYYY")}</Text>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Text size="xs" c="dimmed">Tổng tiền hóa đơn</Text>
            <Title order={3} c="indigo">{formatNumber(asAmount(header.totalAmount))} {currency}</Title>
            <Group mt="xs" gap="xs">
              <StatusBadge statusType="document" value={header.status} />
              <Badge color={header.accountingStatus === "FINAL" ? "teal" : "gray"}>
                {header.accountingStatus === "FINAL" ? "Đã hạch toán" : "Chưa hạch toán"}
              </Badge>
            </Group>
          </Grid.Col>
        </Grid>
      </Card>

      <Tabs
        defaultValue={searchParams.get("tab") === "thu-tien" ? "thu-tien-can-tru" : "tong-quan"}
        color="indigo"
        variant="pills"
        radius="sm"
        keepMounted={false}
      >
        <Tabs.List style={{ overflowX: "auto", flexWrap: "nowrap", marginBottom: 15 }}>
          <Tabs.Tab value="tong-quan">Tổng quan</Tabs.Tab>
          <Tabs.Tab value="dong-hoa-don">Dòng hóa đơn</Tabs.Tab>
          <Tabs.Tab value="lich-thanh-toan">Lịch thanh toán</Tabs.Tab>
          <Tabs.Tab value="thu-tien-can-tru">Thu tiền &amp; Cấn trừ</Tabs.Tab>
          <Tabs.Tab value="giam-tru-dieu-chinh">Giảm trừ &amp; Điều chỉnh</Tabs.Tab>
          <Tabs.Tab value="hach-toan">Hạch toán</Tabs.Tab>
          <Tabs.Tab value="lich-su">Lịch sử</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="tong-quan">
          <Stack gap="md">
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 5 }}>
              <AmountCard label="Tổng hóa đơn" value={asAmount(header.totalAmount)} color="indigo" />
              <AmountCard label="Đã thu" value={totalPaid} color="teal" />
              <AmountCard label="Credit" value={totalCredited} color="orange" />
              <AmountCard label="Adjustment" value={totalAdjusted} color="blue" />
              <AmountCard label="Còn phải thu" value={totalRemaining} color="red" />
            </SimpleGrid>

            <Card withBorder padding="md">
              <Title order={5} mb="sm" c="indigo">Thông tin hóa đơn và khách hàng</Title>
              <Grid>
                <Grid.Col span={{ base: 12, md: 4 }}><Text size="sm">Khách hàng: <b>{customerName}</b></Text></Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}><Text size="sm">Đơn vị (Org ID): <b>{header.orgId}</b></Text></Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}><Text size="sm">Pháp nhân: <b>{header.legalEntityId || "N/A"}</b></Text></Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}><Text size="sm">Nguồn giao dịch: <b>{header.transactionSourceId}</b></Text></Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}><Text size="sm">Loại giao dịch: <b>{header.transactionTypeId}</b></Text></Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}><Text size="sm">Loại tiền tệ: <b>{currency}</b></Text></Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}><Text size="sm">Tỷ giá: <b>{header.exchangeRate || 1}</b></Text></Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}><Text size="sm">Hạn thanh toán: <b>{header.dueDate ? formatDateTime(header.dueDate, "DD/MM/YYYY") : "Theo lịch thanh toán"}</b></Text></Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}><Text size="sm">Hợp đồng tham chiếu: <b>{header.referenceNumber || "N/A"}</b></Text></Grid.Col>
              </Grid>
            </Card>

            <SimpleGrid cols={{ base: 1, sm: 3 }}>
              <AmountCard label="Thuế VAT" value={totalTax} />
              <AmountCard label="Chiết khấu" value={totalDiscount} />
              <AmountCard label="Voucher" value={totalVoucher} />
            </SimpleGrid>

            <Card withBorder padding="md">
              <Title order={5} mb="sm" c="indigo">Thông tin hệ thống</Title>
              <Grid>
                <Grid.Col span={{ base: 12, md: 4 }}><Text size="sm">Người tạo: <b>{header.createdBy ?? "N/A"}</b></Text></Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}><Text size="sm">Ngày tạo: <b>{formatDateTime(header.createdDate, "DD/MM/YYYY")}</b></Text></Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}><Text size="sm">Người cập nhật cuối: <b>{header.lastUpdateBy ?? "N/A"}</b></Text></Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}><Text size="sm">Ngày cập nhật: <b>{formatDateTime(header.lastUpdateDate, "DD/MM/YYYY")}</b></Text></Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}><Text size="sm">Phiên bản: <b>{header.versionNo}</b></Text></Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}><Text size="sm">Mã nguồn: <b>{header.sourceRefId || "N/A"}</b></Text></Grid.Col>
              </Grid>
              {extendedAttributes.length > 0 && (
                <Grid mt="xs">
                  {extendedAttributes.map(item => (
                    <Grid.Col span={{ base: 12, md: 4 }} key={item.label}>
                      <Text size="sm">{item.label}: <b>{item.value}</b></Text>
                    </Grid.Col>
                  ))}
                </Grid>
              )}
            </Card>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="dong-hoa-don">
          <Stack gap="md">
            <Card withBorder padding="md">
              <Flex justify="space-between" align="center" mb="sm" gap="sm" wrap="wrap">
                <Title order={5} c="indigo">Dòng hóa đơn ({lines.length})</Title>
                {isDraft && (
                  <Button
                    size="xs"
                    variant="outline"
                    leftSection={<IconEdit size={14} />}
                    onClick={() => navigate(`/cong-no-phai-thu/hoa-don/${invoiceId}/chinh-sua`)}
                  >
                    Chỉnh sửa dòng
                  </Button>
                )}
              </Flex>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Dòng</Table.Th>
                    <Table.Th>Mã hàng</Table.Th>
                    <Table.Th>Tên hàng / Diễn giải</Table.Th>
                    <Table.Th ta="right">Số lượng</Table.Th>
                    <Table.Th ta="right">Đơn giá</Table.Th>
                    <Table.Th ta="right">Tiền trước thuế</Table.Th>
                    <Table.Th ta="right">VAT</Table.Th>
                    <Table.Th ta="right">Chiết khấu</Table.Th>
                    <Table.Th ta="right">Tổng tiền</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {lines.map((line, index) => {
                    const lineTax = asAmount(line.amountTax ?? line.taxAmount);
                    const lineDiscount = asAmount(line.amountDiscount ?? line.discountAmount);
                    const lineTotal = asAmount(line.lineAmount) + lineTax + asAmount(line.amountFee) + asAmount(line.freightAmount) - lineDiscount - asAmount(line.amountVoucher);
                    return (
                      <Table.Tr key={line.lineId ?? index}>
                        <Table.Td>{line.lineNumber}</Table.Td>
                        <Table.Td>{line.itemCode || line.inventoryItemId || "-"}</Table.Td>
                        <Table.Td>{line.itemName || line.description || "-"}</Table.Td>
                        <Table.Td ta="right">{line.quantityOrdered ?? 0}</Table.Td>
                        <Table.Td ta="right">{formatNumber(asAmount(line.unitSellingPrice ?? line.unitStandardPrice))}</Table.Td>
                        <Table.Td ta="right">{formatNumber(asAmount(line.lineAmount))}</Table.Td>
                        <Table.Td ta="right">{formatNumber(lineTax)} ({line.taxRate || 0}%)</Table.Td>
                        <Table.Td ta="right">{formatNumber(lineDiscount)}</Table.Td>
                        <Table.Td ta="right" fw={700}>{formatNumber(lineTotal)}</Table.Td>
                      </Table.Tr>
                    );
                  })}
                </Table.Tbody>
              </Table>
            </Card>

            <Card withBorder padding="md">
              <Title order={5} mb="sm" c="indigo">Khuyến mại và voucher đã áp dụng</Title>
              <Table striped>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Mã chương trình</Table.Th>
                    <Table.Th>Dòng hóa đơn</Table.Th>
                    <Table.Th ta="right">Số tiền giảm</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {promotions.map((promotion, index) => (
                    <Table.Tr key={promotion.invoicePromotionId ?? index}>
                      <Table.Td fw={700}>PROMO_{String(promotion.promotionId).padStart(2, "0")}</Table.Td>
                      <Table.Td>Dòng {promotion.invoiceLineId}</Table.Td>
                      <Table.Td ta="right" fw={700} c="red">-{formatNumber(asAmount(promotion.appliedAmount))}</Table.Td>
                    </Table.Tr>
                  ))}
                  {promotions.length === 0 && (
                    <Table.Tr><Table.Td colSpan={3} ta="center">Hóa đơn không áp dụng chương trình khuyến mại.</Table.Td></Table.Tr>
                  )}
                </Table.Tbody>
              </Table>
            </Card>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="lich-thanh-toan">
          <Card withBorder padding="md">
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Kỳ</Table.Th>
                  <Table.Th>Ngày đến hạn</Table.Th>
                  <Table.Th ta="right">Số tiền gốc</Table.Th>
                  <Table.Th ta="right">Đã thu</Table.Th>
                  <Table.Th ta="right">Đã Credit</Table.Th>
                  <Table.Th ta="right">Đã Adjustment</Table.Th>
                  <Table.Th ta="right">Còn lại</Table.Th>
                  <Table.Th>Trạng thái</Table.Th>
                  <Table.Th>Thao tác</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {schedules.map((schedule, index) => (
                  <Table.Tr key={schedule.paymentScheduleId ?? index}>
                    <Table.Td>{schedule.installmentNum || index + 1}</Table.Td>
                    <Table.Td>{formatDateTime(schedule.dueDate, "DD/MM/YYYY")}</Table.Td>
                    <Table.Td ta="right">{formatNumber(asAmount(schedule.amountDueOriginal))}</Table.Td>
                    <Table.Td ta="right" c="green">{formatNumber(asAmount(schedule.amountApplied))}</Table.Td>
                    <Table.Td ta="right" c="orange">{formatNumber(asAmount(schedule.amountCredited))}</Table.Td>
                    <Table.Td ta="right" c="blue">{formatNumber(asAmount(schedule.amountAdjusted))}</Table.Td>
                    <Table.Td ta="right" fw={700} c="red">{formatNumber(asAmount(schedule.amountDueRemaining))}</Table.Td>
                    <Table.Td>
                      <Badge color={schedule.status === "PAID" ? "green" : "orange"}>
                        {schedule.status === "PAID" ? "Đã thanh toán" : "Đang mở"}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      {canProcessReceivable && asAmount(schedule.amountDueRemaining) > 0 && (
                        <Button size="xs" variant="subtle" onClick={goToApply}>Apply tiền</Button>
                      )}
                    </Table.Td>
                  </Table.Tr>
                ))}
                {schedules.length === 0 && (
                  <Table.Tr><Table.Td colSpan={9} ta="center">Chưa có lịch thanh toán.</Table.Td></Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="thu-tien-can-tru">
          <Card withBorder padding="md">
            <Flex justify="space-between" align="center" mb="sm" gap="sm" wrap="wrap">
              <Box>
                <Title order={5} c="indigo">Phiếu thu đã Apply ({applications.length})</Title>
                <Text size="xs" c="dimmed">Theo dõi số tiền, discount và trạng thái cấn trừ trên hóa đơn.</Text>
              </Box>
              {canProcessReceivable && (
                <Button leftSection={<IconCoin size={16} />} onClick={goToApply}>Apply thêm</Button>
              )}
            </Flex>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Số phiếu thu</Table.Th>
                  <Table.Th>Ngày Apply</Table.Th>
                  <Table.Th ta="right">Số tiền Apply</Table.Th>
                  <Table.Th ta="right">Discount</Table.Th>
                  <Table.Th>Trạng thái</Table.Th>
                  <Table.Th>Thao tác</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {applications.map((application, index) => (
                  <Table.Tr key={application.applicationId ?? index}>
                    <Table.Td>
                      <Anchor fw={700} onClick={() => navigate(`/cong-no-phai-thu/phieu-thu/${application.receiptId}`)}>
                        RCT-2026-{String(application.receiptId).padStart(4, "0")}
                      </Anchor>
                    </Table.Td>
                    <Table.Td>{formatDateTime(application.applyDate, "DD/MM/YYYY")}</Table.Td>
                    <Table.Td ta="right" fw={700}>{formatNumber(asAmount(application.amountApplied))}</Table.Td>
                    <Table.Td ta="right">{formatNumber(asAmount(application.discountTaken))}</Table.Td>
                    <Table.Td><Badge color="green">{application.status}</Badge></Table.Td>
                    <Table.Td>
                      <Group gap={4} wrap="nowrap">
                        <Button size="xs" variant="subtle" onClick={() => navigate(`/cong-no-phai-thu/phieu-thu/${application.receiptId}`)}>
                          Xem phiếu thu
                        </Button>
                        {!isPaid && !isVoided && (
                          <Button size="xs" variant="subtle" color="red" onClick={() => handleUnapply(application)}>
                            Unapply
                          </Button>
                        )}
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
                {applications.length === 0 && (
                  <Table.Tr><Table.Td colSpan={6} ta="center">Chưa có phiếu thu nào được Apply.</Table.Td></Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="giam-tru-dieu-chinh">
          <Stack gap="md">
            <Card withBorder padding="md">
              <Flex justify="space-between" align="center" mb="sm" gap="sm" wrap="wrap">
                <Title order={5} c="indigo">Credit Memo ({cmApplications.length})</Title>
                {canProcessReceivable && (
                  <Button size="xs" variant="outline" leftSection={<IconFileMinus size={14} />} onClick={goToCreateCreditMemo}>
                    Tạo Credit Memo
                  </Button>
                )}
              </Flex>
              <Table striped>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Mã Credit Memo</Table.Th>
                    <Table.Th>Ngày Apply</Table.Th>
                    <Table.Th>Phạm vi giảm trừ</Table.Th>
                    <Table.Th ta="right">Số tiền</Table.Th>
                    <Table.Th>Trạng thái</Table.Th>
                    <Table.Th>Thao tác</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {cmApplications.map((application, index) => (
                    <Table.Tr key={application.creditApplicationId ?? index}>
                      <Table.Td fw={700}>CM-2026-{String(application.creditMemoId).padStart(4, "0")}</Table.Td>
                      <Table.Td>{application.applicationDate ? formatDateTime(application.applicationDate, "DD/MM/YYYY") : "-"}</Table.Td>
                      <Table.Td>{application.creditAllocation || "Toàn bộ chứng từ"}</Table.Td>
                      <Table.Td ta="right" fw={700} c="orange">{formatNumber(asAmount(application.totalAmount))}</Table.Td>
                      <Table.Td><Badge color={application.status === "REVERSED" ? "gray" : "orange"}>{application.status || "APPLIED"}</Badge></Table.Td>
                      <Table.Td>
                        <Button size="xs" variant="subtle" onClick={() => navigate(`/cong-no-phai-thu/credit-memo/${application.creditMemoId}`)}>
                          Xem Credit Memo
                        </Button>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                  {cmApplications.length === 0 && (
                    <Table.Tr><Table.Td colSpan={6} ta="center">Chưa phát sinh Credit Memo.</Table.Td></Table.Tr>
                  )}
                </Table.Tbody>
              </Table>
            </Card>

            <Card withBorder padding="md">
              <Flex justify="space-between" align="center" mb="sm" gap="sm" wrap="wrap">
                <Title order={5} c="indigo">Điều chỉnh công nợ ({adjustments.length})</Title>
                {canProcessReceivable && (
                  <Button size="xs" variant="outline" leftSection={<IconSettings size={14} />} onClick={goToCreateAdjustment}>
                    Tạo Adjustment
                  </Button>
                )}
              </Flex>
              <Table striped>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Số chứng từ</Table.Th>
                    <Table.Th>Hoạt động</Table.Th>
                    <Table.Th ta="right">Số tiền điều chỉnh</Table.Th>
                    <Table.Th>Ngày điều chỉnh</Table.Th>
                    <Table.Th>Trạng thái</Table.Th>
                    <Table.Th>Thao tác</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {adjustments.map((adjustment, index) => {
                    const amount = asAmount(adjustment.adjustmentAmount ?? adjustment.amount);
                    return (
                      <Table.Tr key={adjustment.adjustmentId ?? index}>
                        <Table.Td fw={700}>{adjustment.adjustmentNumber}</Table.Td>
                        <Table.Td>{adjustment.receivableActivityId === 3 ? "Xóa nợ khó đòi" : "Điều chỉnh công nợ"}</Table.Td>
                        <Table.Td ta="right" fw={700} c={amount < 0 ? "red" : "blue"}>{formatNumber(amount)}</Table.Td>
                        <Table.Td>{formatDateTime(adjustment.adjustmentDate, "DD/MM/YYYY")}</Table.Td>
                        <Table.Td><Badge color={adjustment.status === "APPROVED" ? "green" : "yellow"}>{adjustment.status}</Badge></Table.Td>
                        <Table.Td>
                          <Button size="xs" variant="subtle" onClick={() => navigate(`/cong-no-phai-thu/dieu-chinh/${adjustment.adjustmentId}`)}>
                            Xem chi tiết
                          </Button>
                        </Table.Td>
                      </Table.Tr>
                    );
                  })}
                  {adjustments.length === 0 && (
                    <Table.Tr><Table.Td colSpan={6} ta="center">Không phát sinh giao dịch điều chỉnh.</Table.Td></Table.Tr>
                  )}
                </Table.Tbody>
              </Table>
            </Card>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="hach-toan">
          <Stack gap="md">
            <Card withBorder padding="md">
              <Title order={5} mb="sm" c="indigo">Phân bổ tài khoản</Title>
              <Table striped>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Ngày GL</Table.Th>
                    <Table.Th>Tài khoản kế toán</Table.Th>
                    <Table.Th ta="right">Số tiền phân bổ</Table.Th>
                    <Table.Th>Diễn giải</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {distributions.map((distribution, index) => (
                    <Table.Tr key={distribution.distributionId ?? index}>
                      <Table.Td>{formatDateTime(distribution.glDate, "DD/MM/YYYY")}</Table.Td>
                      <Table.Td fw={700}>{distribution.glAccount}</Table.Td>
                      <Table.Td ta="right">{formatNumber(asAmount(distribution.amount))}</Table.Td>
                      <Table.Td>{distribution.description}</Table.Td>
                    </Table.Tr>
                  ))}
                  {distributions.length === 0 && (
                    <Table.Tr><Table.Td colSpan={4} ta="center">Chưa có phân bổ tài khoản.</Table.Td></Table.Tr>
                  )}
                </Table.Tbody>
              </Table>
            </Card>

            <Card withBorder padding="md">
              <Title order={5} mb="sm" c="indigo">Accounting Events</Title>
              <Table striped>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Sự kiện</Table.Th>
                    <Table.Th>Ngày GL</Table.Th>
                    <Table.Th>Trạng thái</Table.Th>
                    <Table.Th>GL Transfer</Table.Th>
                    <Table.Th>Request ID</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {accountingEvents.map((event, index) => (
                    <Table.Tr key={event.eventId ?? index}>
                      <Table.Td>{event.eventType || "Hạch toán hóa đơn"}</Table.Td>
                      <Table.Td>{formatDateTime(event.glDate, "DD/MM/YYYY")}</Table.Td>
                      <Table.Td><Badge color={event.accountingStatus === "FINAL" ? "teal" : "gray"}>{event.accountingStatus}</Badge></Table.Td>
                      <Table.Td><Badge variant="light">{event.transferStatus || header.transferToGlStatus || "NOT_TRANSFERRED"}</Badge></Table.Td>
                      <Table.Td>{event.requestId || "-"}</Table.Td>
                    </Table.Tr>
                  ))}
                  {accountingEvents.length === 0 && (
                    <Table.Tr><Table.Td colSpan={5} ta="center">Chưa có Accounting Event.</Table.Td></Table.Tr>
                  )}
                </Table.Tbody>
              </Table>
            </Card>

            <Card withBorder padding="md">
              <Title order={5} mb="sm" c="indigo">Chi tiết định khoản Nợ/Có</Title>
              <Table striped>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Tài khoản</Table.Th>
                    <Table.Th>Diễn giải</Table.Th>
                    <Table.Th ta="right">Nợ (Debit)</Table.Th>
                    <Table.Th ta="right">Có (Credit)</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {journalLines.map((journalLine, index) => (
                    <Table.Tr key={journalLine.journalLineId ?? index}>
                      <Table.Td fw={700}>{journalLine.glAccount}</Table.Td>
                      <Table.Td>{journalLine.accountDescription}</Table.Td>
                      <Table.Td ta="right" fw={asAmount(journalLine.enteredDebit) > 0 ? 700 : 400}>
                        {asAmount(journalLine.enteredDebit) > 0 ? formatNumber(asAmount(journalLine.enteredDebit)) : "-"}
                      </Table.Td>
                      <Table.Td ta="right" fw={asAmount(journalLine.enteredCredit) > 0 ? 700 : 400}>
                        {asAmount(journalLine.enteredCredit) > 0 ? formatNumber(asAmount(journalLine.enteredCredit)) : "-"}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                  {journalLines.length === 0 && (
                    <Table.Tr><Table.Td colSpan={4} ta="center">Chưa có định khoản chính thức.</Table.Td></Table.Tr>
                  )}
                </Table.Tbody>
              </Table>
            </Card>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="lich-su">
          <Stack gap="md">
            <Card withBorder padding="md">
              <Title order={5} mb="sm" c="indigo">Vòng đời hóa đơn</Title>
              <Timeline active={getTimelineActiveStep()} bulletSize={24} lineWidth={2}>
                <Timeline.Item bullet={<IconHistory size={12} />} title="Nháp (Draft)">
                  <Text size="xs" c="dimmed">Hóa đơn được khởi tạo ở chế độ nháp.</Text>
                </Timeline.Item>
                <Timeline.Item title="Hoàn tất (Complete)">
                  <Text size="xs" c="dimmed">Thông tin hóa đơn được kiểm tra và hoàn tất.</Text>
                </Timeline.Item>
                <Timeline.Item title="Đang mở (Open)">
                  <Text size="xs" c="dimmed">Khoản phải thu sẵn sàng được xử lý.</Text>
                </Timeline.Item>
                <Timeline.Item title="Thanh toán một phần (Partially Paid)">
                  <Text size="xs" c="dimmed">Đã nhận và Apply một phần tiền thanh toán.</Text>
                </Timeline.Item>
                <Timeline.Item title="Đã thanh toán (Paid)">
                  <Text size="xs" c="dimmed">Hóa đơn đã được thanh toán đầy đủ.</Text>
                </Timeline.Item>
              </Timeline>
            </Card>

            <Card withBorder padding="md">
              <Title order={5} mb="sm" c="indigo">Lịch sử thao tác</Title>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Thời gian</Table.Th>
                    <Table.Th>Thao tác</Table.Th>
                    <Table.Th>Trạng thái trước</Table.Th>
                    <Table.Th>Trạng thái sau</Table.Th>
                    <Table.Th>Người thực hiện</Table.Th>
                    <Table.Th>Ghi chú</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {actionLogs.map((log, index) => (
                    <Table.Tr key={log.actionId ?? index}>
                      <Table.Td>{formatDateTime(log.actionDate, "DD/MM/YYYY")}</Table.Td>
                      <Table.Td><Badge variant="light">{log.actionCode}</Badge></Table.Td>
                      <Table.Td>{log.oldStatus || "-"}</Table.Td>
                      <Table.Td>{log.newStatus || "-"}</Table.Td>
                      <Table.Td>{log.actionBy || log.createdBy || "Hệ thống"}</Table.Td>
                      <Table.Td>{log.note || log.reasonCode || "-"}</Table.Td>
                    </Table.Tr>
                  ))}
                  {actionLogs.length === 0 && (
                    <Table.Tr><Table.Td colSpan={6} ta="center">Chưa có lịch sử thao tác.</Table.Td></Table.Tr>
                  )}
                </Table.Tbody>
              </Table>
            </Card>
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </Box>
  );
}

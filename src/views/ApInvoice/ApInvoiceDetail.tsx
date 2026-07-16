import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Card, Title, Text, Group, Button, Grid, Divider, Center, Loader, Tabs, Table, Badge, Modal, Select, NumberInput, TextInput, Drawer, ActionIcon, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconArrowLeft, IconEdit, IconTrash, IconLock, IconLockOpen, IconLink, IconPlus } from "@tabler/icons-react";
import { apInvoiceMasterService, apHoldDefinitionService } from "../../api/apVendor/apInvoiceMasterMockService";
import { apVendorMasterService } from "../../api/apVendor/apVendorMasterMockService";
import { apPaymentTermService } from "../../api/apVendor/apPaymentMockService";
import { ApInvoice, ApInvoiceLine, ApInvoiceDistribution, ApInvoiceHold, ApHoldDefinition, ApPrepaymentApplication } from "../../model/ApInvoiceMasterModel";
import { ApVendor } from "../../model/ApVendorMasterModel";
import { ApPaymentTerm } from "../../model/ApPaymentModel";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

export default function ApInvoiceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState<ApInvoice | null>(null);
  const [lines, setLines] = useState<ApInvoiceLine[]>([]);
  const [distributions, setDistributions] = useState<ApInvoiceDistribution[]>([]);
  const [holds, setHolds] = useState<ApInvoiceHold[]>([]);
  const [prepayments, setPrepayments] = useState<ApPrepaymentApplication[]>([]);
  const [vendors, setVendors] = useState<ApVendor[]>([]);
  const [terms, setTerms] = useState<ApPaymentTerm[]>([]);
  const [holdDefs, setHoldDefs] = useState<ApHoldDefinition[]>([]);
  const [prepaymentInvoices, setPrepaymentInvoices] = useState<ApInvoice[]>([]);

  const [loading, setLoading] = useState(true);

  // Modals state
  const [holdModalOpen, setHoldModalOpen] = useState(false);
  const [releaseModalOpen, setReleaseModalOpen] = useState(false);
  const [prepayModalOpen, setPrepayModalOpen] = useState(false);
  const [distDrawerOpen, setDistDrawerOpen] = useState(false);

  const [selectedHoldId, setSelectedHoldId] = useState<number | null>(null);
  const [selectedLineForDist, setSelectedLineForDist] = useState<ApInvoiceLine | null>(null);

  // Forms
  const holdForm = useForm({
    initialValues: { holdCode: "", holdReason: "" },
    validate: { holdCode: (val: any) => (val ? null : "Vui lòng chọn mã khóa giữ") }
  });

  const releaseForm = useForm({
    initialValues: { releaseCode: "RELEASE MANUAL", releaseReason: "" },
    validate: { releaseCode: (val: any) => (val ? null : "Vui lòng nhập lý do giải tỏa") }
  });

  const prepayForm = useForm({
    initialValues: { prepaymentInvoiceId: "", amount: 1000000 },
    validate: { prepaymentInvoiceId: (val: any) => (val ? null : "Vui lòng chọn Hóa đơn tạm ứng") }
  });

  const distForm = useForm({
    initialValues: {
      drCcid: 62701,
      crCcid: 33101,
      lineType: "ITEM",
      amount: 1000000,
      description: "Phân bổ hạch toán"
    }
  });

  const loadMetadata = async () => {
    try {
      const vList = await apVendorMasterService.getAll();
      setVendors(vList);
      const tList = await apPaymentTermService.getAll();
      setTerms(tList);
      const hList = await apHoldDefinitionService.getAll();
      setHoldDefs(hList);
    } catch {
      console.error("Lỗi tải metadata.");
    }
  };

  const loadPrepaymentInvoices = async () => {
    try {
      const res = await apInvoiceMasterService.getList({ take: 200 });
      if (res.success && res.data) {
        // Lấy các hóa đơn tạm ứng PREPAYMENT có dư nợ còn lại (remainingAmount) > 0
        const prepays = res.data.items.filter((x) => x.invoiceTypeLookupCode === "PREPAYMENT" && (x.remainingAmount || 0) > 0);
        setPrepaymentInvoices(prepays);
      }
    } catch {
      console.error("Lỗi tải hóa đơn tạm ứng.");
    }
  };

  const loadDetails = async () => {
    if (!id) return;
    try {
      const invRes = await apInvoiceMasterService.getById(Number(id));
      if (invRes.success && invRes.data) {
        setInvoice(invRes.data);

        // Load lines
        const linesList = await apInvoiceMasterService.getLines(Number(id));
        setLines(linesList);

        // Load distributions
        const distsList = await apInvoiceMasterService.getDistributions(Number(id));
        setDistributions(distsList);

        // Load holds
        const holdsList = await apInvoiceMasterService.getHolds(Number(id));
        setHolds(holdsList);

        // Load prepayment applications
        const prepayList = await apInvoiceMasterService.getPrepayments(Number(id));
        setPrepayments(prepayList);
      } else {
        NotificationExtension.Fails(invRes.message || "Không tìm thấy hóa đơn.");
        navigate("/ApInvoice/ApInvoiceList");
      }
    } catch {
      NotificationExtension.Fails("Lỗi khi tải thông tin hóa đơn.");
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await loadMetadata();
      await loadPrepaymentInvoices();
      await loadDetails();
      setLoading(false);
    };
    init();
  }, [id]);

  const vendorName = useMemo(() => {
    if (!invoice) return "-";
    const v = vendors.find((x) => x.vendorId === invoice.vendorId);
    return v ? v.vendorName : `ID: ${invoice.vendorId}`;
  }, [invoice, vendors]);

  const termName = useMemo(() => {
    if (!invoice) return "-";
    const t = terms.find((x) => x.paymentTermId === invoice.termsId);
    return t ? t.termName : `ID: ${invoice.termsId}`;
  }, [invoice, terms]);

  // Áp dụng khóa giữ (Apply Hold)
  const handleApplyHoldSubmit = async (values: typeof holdForm.values) => {
    if (!id) return;
    try {
      const res = await apInvoiceMasterService.applyHold(Number(id), values.holdCode, values.holdReason);
      if (res.success) {
        NotificationExtension.Success("Đã áp dụng khóa giữ hóa đơn!");
        setHoldModalOpen(false);
        holdForm.reset();
        await loadDetails();
      } else {
        NotificationExtension.Fails(res.message || "Lỗi khi áp khóa giữ.");
      }
    } catch {
      NotificationExtension.Fails("Không thể áp dụng khóa giữ.");
    }
  };

  // Giải tỏa khóa giữ (Release Hold)
  const handleReleaseHoldSubmit = async (values: typeof releaseForm.values) => {
    if (!selectedHoldId) return;
    try {
      const res = await apInvoiceMasterService.releaseHold(selectedHoldId, values.releaseCode, values.releaseReason);
      if (res.success) {
        NotificationExtension.Success("Giải tỏa khóa giữ thành công!");
        setReleaseModalOpen(false);
        releaseForm.reset();
        await loadDetails();
      } else {
        NotificationExtension.Fails(res.message || "Lỗi khi giải tỏa.");
      }
    } catch {
      NotificationExtension.Fails("Không thể giải tỏa khóa giữ.");
    }
  };

  // Cấn trừ tạm ứng (Apply Prepayment)
  const handleApplyPrepaymentSubmit = async (values: typeof prepayForm.values) => {
    if (!id) return;
    try {
      const res = await apInvoiceMasterService.applyPrepayment(Number(id), Number(values.prepaymentInvoiceId), values.amount);
      if (res.success) {
        NotificationExtension.Success("Cấn trừ tạm ứng thành công!");
        setPrepayModalOpen(false);
        prepayForm.reset();
        await loadDetails();
        await loadPrepaymentInvoices();
      } else {
        NotificationExtension.Fails(res.message || "Cấn trừ thất bại.");
      }
    } catch {
      NotificationExtension.Fails("Không thể thực hiện cấn trừ tạm ứng.");
    }
  };

  // Xem/Sửa dòng hạch toán
  const handleOpenDistDrawer = (line: ApInvoiceLine) => {
    setSelectedLineForDist(line);
    const existingDists = distributions.filter((x) => x.invoiceLineId === line.invoiceLineId);
    if (existingDists.length > 0) {
      distForm.setValues({
        drCcid: existingDists[0].drCcid || 62701,
        crCcid: existingDists[0].crCcid || 33101,
        lineType: existingDists[0].lineType || "ITEM",
        amount: existingDists[0].amount || line.amount || 0,
        description: existingDists[0].description || "Phân bổ hạch toán"
      });
    } else {
      distForm.setValues({
        drCcid: 62701,
        crCcid: 33101,
        lineType: "ITEM",
        amount: line.amount || 0,
        description: "Phân bổ dòng hạch toán"
      });
    }
    setDistDrawerOpen(true);
  };

  const handleSaveDistribution = async (values: typeof distForm.values) => {
    if (!selectedLineForDist || !id) return;
    try {
      const existingDists = distributions.filter((x) => x.invoiceLineId === selectedLineForDist.invoiceLineId);
      const existingId = existingDists.length > 0 ? existingDists[0].id : undefined;

      const res = await apInvoiceMasterService.saveDistribution({
        setOfBooksId: Number(invoice?.setOfBooksId || 1),
        orgId: Number(invoice?.orgId || 10),
        invoiceId: Number(id),
        id: existingId as any,
        rcvTransactionId: null,
        poDistributionId: null,
        periodName: "JUL-26",
        accountingDate: new Date().toISOString().substring(0, 10),
        accountingEventId: null,
        distributionLineNumber: selectedLineForDist.lineLineNumber,
        drCcid: values.drCcid,
        crCcid: values.crCcid,
        lineType: values.lineType,
        amount: values.amount,
        baseAmount: values.amount * (invoice?.exchangeRate || 1),
        prepayDistributionId: null,
        prepayAmountRemaining: null,
        description: values.description,
        invoiceLineId: selectedLineForDist.invoiceLineId,
        taxType: values.lineType === "TAX" ? "VAT" : null,
        voucherNumber: null,
        vendorTaxCode: null,
        lastUpdateBy: 1,
        lastUpdateDate: new Date().toISOString(),
        createBy: 1,
        createDate: new Date().toISOString()
      });

      if (res.success) {
        NotificationExtension.Success("Cập nhật phân bổ hạch toán thành công!");
        setDistDrawerOpen(false);
        await loadDetails();
      } else {
        NotificationExtension.Fails("Lỗi khi lưu phân bổ.");
      }
    } catch {
      NotificationExtension.Fails("Không thể lưu phân bổ hạch toán.");
    }
  };

  if (loading) {
    return (
      <Center style={{ height: "300px" }}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (!invoice) return null;

  return (
    <Box>
      <Group justify="space-between" align="center" mb="lg">
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/ApInvoice/ApInvoiceList")}>
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="xl" mb="lg">
        <Group justify="space-between" align="center" mb="xs">
          <Title order={3}>Hóa đơn: {invoice.invoiceNum}</Title>
          <Group>
            <Button
              leftSection={<IconEdit size={16} />}
              color="yellow"
              variant="light"
              onClick={() => navigate(`/ApInvoice/Edit/${invoice.invoiceId}`)}
            >
              Chỉnh sửa hóa đơn
            </Button>
            <Button
              leftSection={<IconTrash size={16} />}
              color="red"
              variant="light"
              onClick={() => navigate(`/ApInvoice/Delete/${invoice.invoiceId}`)}
            >
              Xóa hóa đơn
            </Button>
          </Group>
        </Group>
        <Divider mb="xl" />

        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Mã hóa đơn (ID)</Text>
            <Text fw={600} size="md">{invoice.invoiceId}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Số hóa đơn</Text>
            <Text fw={700} size="md">{invoice.invoiceNum}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Nhà cung cấp xuất</Text>
            <Text fw={600} size="md" style={{ color: "#228be6" }}>{vendorName}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Chi nhánh giao dịch (Site)</Text>
            <Text fw={600} size="md">{invoice.vendorSiteCode || "N/A"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Text size="sm" c="dimmed">Tổng tiền hóa đơn</Text>
            <Text fw={700} size="md" style={{ color: "#2b8a3e" }}>
              {invoice.invoiceAmount?.toLocaleString("vi-VN")} {invoice.invoiceCurrencyCode}
            </Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Text size="sm" c="dimmed">Số tiền đã trả</Text>
            <Text fw={600} size="md">
              {invoice.amountPaid?.toLocaleString("vi-VN")} {invoice.invoiceCurrencyCode}
            </Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Text size="sm" c="dimmed">Dư nợ công nợ còn lại (Remaining)</Text>
            <Text fw={700} size="md" style={{ color: (invoice.remainingAmount || 0) > 0 ? "red" : "green" }}>
              {invoice.remainingAmount?.toLocaleString("vi-VN")} {invoice.invoiceCurrencyCode}
            </Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Text size="sm" c="dimmed">Ngày lập hóa đơn</Text>
            <Text fw={600} size="md">
              {invoice.invoiceDate ? new Date(invoice.invoiceDate).toLocaleDateString("vi-VN") : "-"}
            </Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Text size="sm" c="dimmed">Điều khoản thanh toán</Text>
            <Text fw={600} size="md">{termName}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Text size="sm" c="dimmed">Kiểm tra hợp lệ (Hold Validation)</Text>
            <Box mt="xs">
              <Badge color={invoice.validationStatus === "Y" ? "green" : "orange"}>
                {invoice.status}
              </Badge>
            </Box>
          </Grid.Col>

          <Grid.Col span={12}>
            <Text size="sm" c="dimmed">Diễn giải / Nội dung hóa đơn</Text>
            <Text fw={600} size="md">{invoice.description || "-"}</Text>
          </Grid.Col>
        </Grid>
      </Card>

      <Tabs defaultValue="lines" variant="outline" mt="xl">
        <Tabs.List>
          <Tabs.Tab value="lines">Dòng hàng hóa & Hạch toán ({lines.length})</Tabs.Tab>
          <Tabs.Tab value="holds">Lịch sử khóa giữ ({holds.length})</Tabs.Tab>
          <Tabs.Tab value="prepayments">Cấn trừ tạm ứng ({prepayments.length})</Tabs.Tab>
        </Tabs.List>

        {/* TAB LINES */}
        <Tabs.Panel value="lines" pt="md">
          <Card withBorder padding="lg">
            <Title order={4} mb="md">Chi tiết các dòng hóa đơn (Invoice Lines)</Title>
            <Table striped highlightOnHover withTableBorder style={{ fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f8f9fa" }}>
                  <th style={{ width: 60, padding: 8 }}>Dòng</th>
                  <th style={{ width: 150, padding: 8 }}>Mã vật tư</th>
                  <th style={{ padding: 8 }}>Tên vật tư/dịch vụ</th>
                  <th style={{ width: 100, padding: 8, textAlign: "right" }}>Số lượng</th>
                  <th style={{ width: 130, padding: 8, textAlign: "right" }}>Đơn giá</th>
                  <th style={{ width: 140, padding: 8, textAlign: "right" }}>Thành tiền (đ)</th>
                  <th style={{ width: 120, padding: 8 }}>Thuế VAT</th>
                  <th style={{ width: 120, padding: 8, textAlign: "center" }}>Hạch toán</th>
                </tr>
              </thead>
              <tbody>
                {lines.map((l) => {
                  const hasDist = distributions.some((d) => d.invoiceLineId === l.invoiceLineId);
                  return (
                    <tr key={l.invoiceLineId}>
                      <td style={{ padding: 8, textAlign: "center" }}>{l.lineLineNumber}</td>
                      <td style={{ padding: 8 }}>{l.itemCode}</td>
                      <td style={{ padding: 8, fontWeight: 600 }}>{l.itemName}</td>
                      <td style={{ padding: 8, textAlign: "right" }}>{l.quantity?.toLocaleString()}</td>
                      <td style={{ padding: 8, textAlign: "right" }}>{l.price?.toLocaleString()}</td>
                      <td style={{ padding: 8, textAlign: "right", fontWeight: 700 }}>{l.amount?.toLocaleString()}</td>
                      <td style={{ padding: 8 }}>{l.vatTaxCode ? `${l.vatTaxCode} (${l.vatTaxAmount?.toLocaleString()}đ)` : "-"}</td>
                      <td style={{ padding: 8, textAlign: "center" }}>
                        <Button
                          size="xs"
                          variant="light"
                          color={hasDist ? "green" : "blue"}
                          onClick={() => handleOpenDistDrawer(l)}
                        >
                          {hasDist ? "Xem/Sửa hạch toán" : "Phân bổ CCID"}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Card>
        </Tabs.Panel>

        {/* TAB HOLDS */}
        <Tabs.Panel value="holds" pt="md">
          <Card withBorder padding="lg">
            <Group justify="space-between" mb="md">
              <Title order={4}>Lịch sử Khóa giữ Hóa đơn (Holds & Releases)</Title>
              <Button
                leftSection={<IconLock size={16} />}
                color="orange"
                onClick={() => setHoldModalOpen(true)}
              >
                Áp dụng Khóa giữ
              </Button>
            </Group>

            <Table striped withTableBorder style={{ fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f8f9fa" }}>
                  <th style={{ padding: 8 }}>Mã khóa</th>
                  <th style={{ padding: 8 }}>Tên khóa giữ</th>
                  <th style={{ padding: 8 }}>Ngày áp giữ</th>
                  <th style={{ padding: 8 }}>Lý do giữ</th>
                  <th style={{ padding: 8 }}>Ngày giải tỏa</th>
                  <th style={{ padding: 8 }}>Lý do giải tỏa</th>
                  <th style={{ padding: 8, textAlign: "center" }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {holds.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: 12, color: "#868e96" }}>Hóa đơn này sạch, hiện tại không có lỗi khóa giữ nào.</td>
                  </tr>
                ) : (
                  holds.map((h) => (
                    <tr key={h.holdId}>
                      <td style={{ padding: 8 }}><Badge color="orange">{h.holdLookupCode}</Badge></td>
                      <td style={{ padding: 8, fontWeight: 600 }}>{h.holdName}</td>
                      <td style={{ padding: 8 }}>{h.holdDate ? new Date(h.holdDate).toLocaleString("vi-VN") : "-"}</td>
                      <td style={{ padding: 8 }}>{h.holdReason}</td>
                      <td style={{ padding: 8 }}>{h.releaseDate ? new Date(h.releaseDate).toLocaleString("vi-VN") : "-"}</td>
                      <td style={{ padding: 8 }}>{h.releaseReason || "-"}</td>
                      <td style={{ padding: 8, textAlign: "center" }}>
                        {!h.releaseLookupCode ? (
                          <Button
                            size="xs"
                            color="green"
                            variant="outline"
                            leftSection={<IconLockOpen size={12} />}
                            onClick={() => {
                              setSelectedHoldId(h.holdId);
                              setReleaseModalOpen(true);
                            }}
                          >
                            Giải tỏa
                          </Button>
                        ) : (
                          <Badge color="green">ĐÃ GIẢI TỎA</Badge>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Card>
        </Tabs.Panel>

        {/* TAB PREPAYMENTS */}
        <Tabs.Panel value="prepayments" pt="md">
          <Card withBorder padding="lg">
            <Group justify="space-between" mb="md">
              <Title order={4}>Lịch sử cấn trừ hóa đơn tạm ứng (Prepayment Applications)</Title>
              {invoice.invoiceTypeLookupCode !== "PREPAYMENT" && (
                <Button
                  leftSection={<IconLink size={16} />}
                  color="blue"
                  onClick={() => setPrepayModalOpen(true)}
                  disabled={(invoice.remainingAmount || 0) === 0}
                >
                  Thực hiện cấn trừ tạm ứng
                </Button>
              )}
            </Group>

            <Table striped withTableBorder style={{ fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f8f9fa" }}>
                  <th style={{ padding: 8 }}>Mã cấn trừ</th>
                  <th style={{ padding: 8 }}>Số hóa đơn tạm ứng</th>
                  <th style={{ padding: 8, textAlign: "right" }}>Số tiền cấn trừ (USD/VND)</th>
                  <th style={{ padding: 8 }}>Ngày cấn trừ (GL Date)</th>
                  <th style={{ padding: 8 }}>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {prepayments.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: 12, color: "#868e96" }}>Chưa thực hiện cấn trừ hóa đơn tạm ứng nào.</td>
                  </tr>
                ) : (
                  prepayments.map((app) => (
                    <tr key={app.applicationId}>
                      <td style={{ padding: 8 }}>{app.applicationId}</td>
                      <td style={{ padding: 8, fontWeight: 700, color: "#228be6" }}>{app.prepaymentInvoiceNum}</td>
                      <td style={{ padding: 8, textAlign: "right", fontWeight: 600, color: "#2b8a3e" }}>{app.amountApplied?.toLocaleString()}</td>
                      <td style={{ padding: 8 }}>{app.glDate ? new Date(app.glDate).toLocaleDateString("vi-VN") : "-"}</td>
                      <td style={{ padding: 8 }}><Badge color="indigo">{app.status}</Badge></td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Card>
        </Tabs.Panel>
      </Tabs>

      {/* DRAWER PHÂN BỔ HẠCH TOÁN */}
      <Drawer
        opened={distDrawerOpen}
        onClose={() => setDistDrawerOpen(false)}
        title={selectedLineForDist ? `Phân bổ hạch toán nợ/có cho Dòng ${selectedLineForDist.lineLineNumber}: ${selectedLineForDist.itemName}` : "Phân bổ hạch toán"}
        position="right"
        size="md"
      >
        {selectedLineForDist && (
          <form onSubmit={distForm.onSubmit(handleSaveDistribution)}>
            <Stack gap="md" p="md">
              <NumberInput
                required
                label="Tài khoản Nợ (Debit CCID)"
                placeholder="Ví dụ: 62701"
                {...distForm.getInputProps("drCcid")}
              />

              <NumberInput
                required
                label="Tài khoản Có (Credit CCID)"
                placeholder="Ví dụ: 33101"
                {...distForm.getInputProps("crCcid")}
              />

              <Select
                required
                label="Loại dòng phân bổ"
                data={[
                  { value: "ITEM", label: "Mua hàng / Chi phí (ITEM)" },
                  { value: "TAX", label: "Thuế VAT (TAX)" },
                  { value: "FREIGHT", label: "Phí vận chuyển (FREIGHT)" }
                ]}
                {...distForm.getInputProps("lineType")}
              />

              <NumberInput
                required
                label="Số tiền phân bổ"
                thousandSeparator=","
                {...distForm.getInputProps("amount")}
              />

              <TextInput
                label="Mô tả hạch toán"
                placeholder="Nhập diễn giải dòng..."
                {...distForm.getInputProps("description")}
              />

              <Group justify="flex-end" mt="md">
                <Button variant="outline" color="gray" onClick={() => setDistDrawerOpen(false)}>Hủy</Button>
                <Button type="submit" color="blue">Cập nhật hạch toán</Button>
              </Group>
            </Stack>
          </form>
        )}
      </Drawer>

      {/* MODAL ÁP DỤNG KHÓA GIỮ */}
      <Modal opened={holdModalOpen} onClose={() => setHoldModalOpen(false)} title="Áp dụng khóa giữ hóa đơn (Hold)">
        <form onSubmit={holdForm.onSubmit(handleApplyHoldSubmit)}>
          <Select
            required
            label="Chọn mã lỗi khóa giữ"
            placeholder="Mã hold code"
            data={holdDefs.map((def) => ({ value: def.holdCode, label: `${def.holdCode} - ${def.holdName}` }))}
            {...holdForm.getInputProps("holdCode")}
          />
          <TextInput
            label="Lý do khóa giữ chi tiết"
            placeholder="Nhập lý do chặn thanh toán..."
            mt="md"
            {...holdForm.getInputProps("holdReason")}
          />
          <Group justify="flex-end" mt="xl">
            <Button variant="outline" color="gray" onClick={() => setHoldModalOpen(false)}>Hủy</Button>
            <Button type="submit" color="orange">Áp dụng khóa giữ</Button>
          </Group>
        </form>
      </Modal>

      {/* MODAL GIẢI TỎA KHÓA GIỮ */}
      <Modal opened={releaseModalOpen} onClose={() => setReleaseModalOpen(false)} title="Giải tỏa khóa giữ (Release Hold)">
        <form onSubmit={releaseForm.onSubmit(handleReleaseHoldSubmit)}>
          <TextInput
            required
            label="Mã giải tỏa (Release Code)"
            {...releaseForm.getInputProps("releaseCode")}
          />
          <TextInput
            label="Diễn giải giải tỏa"
            placeholder="Nhập lý do giải tỏa khóa chặn..."
            mt="md"
            {...releaseForm.getInputProps("releaseReason")}
          />
          <Group justify="flex-end" mt="xl">
            <Button variant="outline" color="gray" onClick={() => setReleaseModalOpen(false)}>Hủy</Button>
            <Button type="submit" color="green">Xác nhận giải tỏa</Button>
          </Group>
        </form>
      </Modal>

      {/* MODAL CẤN TRỪ TẠM ỨNG */}
      <Modal opened={prepayModalOpen} onClose={() => setPrepayModalOpen(false)} title="Cấn trừ hóa đơn tạm ứng (Prepayment Application)">
        <form onSubmit={prepayForm.onSubmit(handleApplyPrepaymentSubmit)}>
          <Select
            required
            label="Chọn hóa đơn tạm ứng khả dụng"
            placeholder="Hóa đơn PREPAYMENT"
            data={prepaymentInvoices.map((inv) => ({ value: String(inv.invoiceId), label: `Số: ${inv.invoiceNum} (Còn dư nợ: ${inv.remainingAmount?.toLocaleString()} ${inv.invoiceCurrencyCode})` }))}
            {...prepayForm.getInputProps("prepaymentInvoiceId")}
          />
          <NumberInput
            required
            label="Số tiền cấn trừ"
            thousandSeparator=","
            mt="md"
            {...prepayForm.getInputProps("amount")}
          />
          <Group justify="flex-end" mt="xl">
            <Button variant="outline" color="gray" onClick={() => setPrepayModalOpen(false)}>Hủy</Button>
            <Button type="submit" color="blue">Thực hiện cấn trừ</Button>
          </Group>
        </form>
      </Modal>
    </Box>
  );
}



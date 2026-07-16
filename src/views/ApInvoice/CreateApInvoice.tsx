import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";
import { Box, Card, Title, TextInput, Select, Group, Button, Grid, Divider, NumberInput, Table, ActionIcon, Text } from "@mantine/core";
import { IconArrowLeft, IconDeviceFloppy, IconPlus, IconTrash } from "@tabler/icons-react";
import { apInvoiceMasterService } from "../../api/apVendor/apInvoiceMasterMockService";
import { apVendorMasterService, apVendorSiteMasterService } from "../../api/apVendor/apVendorMasterMockService";
import { apPaymentTermService } from "../../api/apVendor/apPaymentMockService";
import { ApVendor, ApVendorSite } from "../../model/ApVendorMasterModel";
import { ApPaymentTerm } from "../../model/ApPaymentModel";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

interface LineFormItem {
  lineLineNumber: number;
  itemCode: string;
  itemName: string;
  quantity: number;
  price: number;
  amount: number;
  distCodeCombinationId: number;
  lineTypeLookupCode: string;
  vatTaxCode: string;
  vatTaxAmount: number;
  description: string;
}

export default function CreateApInvoice() {
  const navigate = useNavigate();

  const [vendors, setVendors] = useState<ApVendor[]>([]);
  const [sites, setSites] = useState<ApVendorSite[]>([]);
  const [terms, setTerms] = useState<ApPaymentTerm[]>([]);

  // Dòng hóa đơn
  const [lines, setLines] = useState<LineFormItem[]>([
    {
      lineLineNumber: 1,
      itemCode: "MILK-RAW",
      itemName: "Sữa tươi nguyên chất",
      quantity: 1000,
      price: 15000,
      amount: 15000000,
      distCodeCombinationId: 62701,
      lineTypeLookupCode: "ITEM",
      vatTaxCode: "VAT10",
      vatTaxAmount: 1500000,
      description: "Nhập sữa tươi nguyên liệu"
    }
  ]);

  const form = useForm({
    initialValues: {
      setOfBooksId: 1,
      orgId: 10,
      batchId: "",
      vendorId: "",
      vendorSiteId: "",
      invoiceNum: "",
      invoiceDate: new Date().toISOString().substring(0, 10),
      invoiceCurrencyCode: "VND",
      exchangeRate: 1,
      invoiceAmount: 16500000, // Header total (including VAT)
      baseAmount: 16500000,
      invoiceTypeLookupCode: "STANDARD",
      description: "Mua sữa tươi sản xuất",
      termsId: "",
      termsDate: new Date().toISOString().substring(0, 10),
      paymentCurrencyCode: "VND",
      paymentMethodLookupCode: "WIRE",
      acctsPayCodeCombinationId: 33101,
      poNumber: "",
    },
    validate: {
      vendorId: (val: any) => (val ? null : "Vui lòng chọn Nhà cung cấp"),
      vendorSiteId: (val: any) => (val ? null : "Vui lòng chọn Chi nhánh nhà cung cấp"),
      invoiceNum: (val: any) => (val ? null : "Số hóa đơn bắt buộc nhập")
    }
  });

  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const vList = await apVendorMasterService.getAll();
        setVendors(vList);
        const sList = await apVendorSiteMasterService.getAll();
        setSites(sList);
        const tList = await apPaymentTermService.getAll();
        setTerms(tList);

        if (vList.length > 0) {
          form.setFieldValue("vendorId", String(vList[0].vendorId));
        }
        if (tList.length > 0) {
          form.setFieldValue("termsId", String(tList[0].paymentTermId));
        }
      } catch {
        NotificationExtension.Fails("Không thể tải danh sách danh mục liên quan.");
      }
    };
    loadMetadata();
  }, []);

  const filteredSites = useMemo(() => {
    const vId = form.values.vendorId;
    if (!vId) return [];
    return sites.filter((x) => x.vendorId === Number(vId));
  }, [sites, form.values.vendorId]);

  useEffect(() => {
    if (filteredSites.length > 0) {
      form.setFieldValue("vendorSiteId", String(filteredSites[0].vendorSiteId));
    } else {
      form.setFieldValue("vendorSiteId", "");
    }
  }, [filteredSites]);

  // Tự động tính tổng tiền trên các dòng
  const calculatedTotal = useMemo(() => {
    return lines.reduce((sum, item) => sum + item.amount + (item.vatTaxAmount || 0), 0);
  }, [lines]);

  // Cập nhật tổng tiền hóa đơn khi dòng thay đổi
  useEffect(() => {
    form.setFieldValue("invoiceAmount", calculatedTotal);
    form.setFieldValue("baseAmount", calculatedTotal * form.values.exchangeRate);
  }, [calculatedTotal, form.values.exchangeRate]);

  const handleAddLine = () => {
    const nextLineNum = lines.length > 0 ? Math.max(...lines.map((x) => x.lineLineNumber)) + 1 : 1;
    setLines([
      ...lines,
      {
        lineLineNumber: nextLineNum,
        itemCode: "",
        itemName: "",
        quantity: 0,
        price: 0,
        amount: 0,
        distCodeCombinationId: 62701,
        lineTypeLookupCode: "ITEM",
        vatTaxCode: "VAT10",
        vatTaxAmount: 0,
        description: ""
      }
    ]);
  };

  const handleRemoveLine = (lineNum: number) => {
    setLines(lines.filter((x) => x.lineLineNumber !== lineNum));
  };

  const handleLineChange = (lineNum: number, field: keyof LineFormItem, value: any) => {
    const updated = lines.map((line) => {
      if (line.lineLineNumber === lineNum) {
        const newLine = { ...line, [field]: value };
        if (field === "quantity" || field === "price") {
          newLine.amount = Number(newLine.quantity || 0) * Number(newLine.price || 0);
          newLine.vatTaxAmount = newLine.vatTaxCode === "VAT10" ? Math.round(newLine.amount * 0.1) : 0;
        }
        if (field === "vatTaxCode") {
          newLine.vatTaxAmount = value === "VAT10" ? Math.round(newLine.amount * 0.1) : 0;
        }
        return newLine;
      }
      return line;
    });
    setLines(updated);
  };

  const handleSubmit = async (values: typeof form.values) => {
    if (lines.length === 0) {
      NotificationExtension.Fails("Vui lòng nhập ít nhất 1 dòng chi tiết hóa đơn.");
      return;
    }

    try {
      const selectedVendor = vendors.find((x) => x.vendorId === Number(values.vendorId));
      const selectedSite = sites.find((x) => x.vendorSiteId === Number(values.vendorSiteId));
      const selectedTerm = terms.find((x) => x.paymentTermId === Number(values.termsId));

      const standardLines = lines.map((l) => ({
        setOfBooksId: Number(values.setOfBooksId),
        orgId: Number(values.orgId),
        rcvTransactionId: null,
        poLineId: null,
        itemId: null,
        itemCode: l.itemCode,
        itemName: l.itemName,
        uomId: 1,
        quantity: l.quantity,
        price: l.price,
        amount: l.amount,
        baseAmount: l.amount * values.exchangeRate,
        periodName: null,
        accountingDate: null,
        accountingEventId: null,
        lineLineNumber: l.lineLineNumber,
        distCodeCombinationId: l.distCodeCombinationId,
        lineTypeLookupCode: l.lineTypeLookupCode,
        prepayLineId: null,
        prepayAmountRemaining: values.invoiceTypeLookupCode === "PREPAYMENT" ? l.amount : null,
        discountProgram: null,
        discountAmount: null,
        vatTaxCode: l.vatTaxCode || null,
        vatTaxAmount: l.vatTaxAmount || null,
        feeAmount: null,
        importTaxCode: null,
        importAmount: null,
        specialConsumptionTaxCode: null,
        specialConsumptionTaxAmount: null,
        description: l.description || null,
        poNumber: values.poNumber || null,
        receiptNum: null,
        matchStatus: "UNMATCHED",
        lastUpdatedBy: 1,
        createdBy: 1
      }));

      // Tính tổng thuế
      const totalTax = lines.reduce((sum, item) => sum + (item.vatTaxAmount || 0), 0);

      const res = await apInvoiceMasterService.create({
        setOfBooksId: Number(values.setOfBooksId),
        orgId: Number(values.orgId),
        batchId: values.batchId ? Number(values.batchId) : null,
        vendorId: Number(values.vendorId),
        vendorSiteId: Number(values.vendorSiteId),
        invoiceNum: values.invoiceNum,
        invoiceDate: values.invoiceDate,
        invoiceCurrencyCode: values.invoiceCurrencyCode,
        exchangeRate: Number(values.exchangeRate),
        invoiceAmount: Number(values.invoiceAmount),
        baseAmount: Number(values.baseAmount),
        invoiceTypeLookupCode: values.invoiceTypeLookupCode,
        description: values.description || null,
        termsId: values.termsId ? Number(values.termsId) : null,
        termsDate: values.termsDate || null,
        paymentCurrencyCode: values.paymentCurrencyCode,
        paymentMethodLookupCode: values.paymentMethodLookupCode,
        prepayFlag: values.invoiceTypeLookupCode === "PREPAYMENT" ? "Y" : "N",
        amountPaid: 0,
        cancelledAmount: 0,
        discountAmountTaken: 0,
        taxAmount: totalTax,
        acctsPayCodeCombinationId: Number(values.acctsPayCodeCombinationId),
        status: "NEEDS_REVALIDATION",
        poNumber: values.poNumber || null,
        validationStatus: "N",
        accountingStatus: "N",
        cancelledFlag: "N",
        cancelDate: null,
        cancelGlDate: null,
        remainingAmount: Number(values.invoiceAmount),
        vendorName: selectedVendor ? selectedVendor.vendorName : undefined,
        vendorSiteCode: selectedSite ? selectedSite.vendorSiteCode : undefined,
        termName: selectedTerm ? selectedTerm.termName : undefined,
        lastUpdatedBy: 1,
        createdBy: 1
      }, standardLines);

      if (res.success) {
        NotificationExtension.Success("Thêm mới hóa đơn mua hàng thành công!");
        navigate("/ApInvoice/ApInvoiceList");
      } else {
        NotificationExtension.Fails(res.message || "Lỗi khi lưu hóa đơn.");
      }
    } catch {
      NotificationExtension.Fails("Không thể kết nối đến Mock API Service.");
    }
  };

  return (
    <Box>
      <Group justify="space-between" align="center" mb="lg">
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/ApInvoice/ApInvoiceList")}>
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="xl" mb="xl">
        <Title order={3} mb="xs">Tạo Hóa đơn Mua hàng mới (AP Invoice Entry)</Title>
        <Divider mb="xl" />

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                required
                label="Số hóa đơn (Invoice Num)"
                placeholder="Ví dụ: INV2026-001"
                {...form.getInputProps("invoiceNum")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select
                required
                label="Nhà cung cấp xuất hóa đơn"
                placeholder="Chọn nhà cung cấp"
                data={vendors.map((v) => ({ value: String(v.vendorId), label: v.vendorName }))}
                {...form.getInputProps("vendorId")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select
                required
                label="Chi nhánh nhà cung cấp (Site)"
                placeholder="Chọn chi nhánh"
                disabled={!form.values.vendorId}
                data={filteredSites.map((s) => ({ value: String(s.vendorSiteId), label: s.vendorSiteCode }))}
                {...form.getInputProps("vendorSiteId")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                type="date"
                required
                label="Ngày lập hóa đơn"
                {...form.getInputProps("invoiceDate")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select
                required
                label="Loại hóa đơn"
                data={[
                  { value: "STANDARD", label: "Hóa đơn mua hàng chuẩn (STANDARD)" },
                  { value: "PREPAYMENT", label: "Hóa đơn tạm ứng (PREPAYMENT)" }
                ]}
                {...form.getInputProps("invoiceTypeLookupCode")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select
                required
                label="Điều khoản thanh toán"
                data={terms.map((t) => ({ value: String(t.paymentTermId), label: t.termName }))}
                {...form.getInputProps("termsId")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select
                required
                label="Loại tiền tệ"
                data={[
                  { value: "VND", label: "VND" },
                  { value: "USD", label: "USD" }
                ]}
                {...form.getInputProps("invoiceCurrencyCode")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <NumberInput
                required
                label="Tỷ giá hạch toán"
                decimalScale={4}
                {...form.getInputProps("exchangeRate")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                label="Số PO liên kết (nếu có)"
                placeholder="Ví dụ: PO-2026-0091"
                {...form.getInputProps("poNumber")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <NumberInput
                disabled
                label="Tổng tiền hóa đơn (đã gồm thuế)"
                thousandSeparator=","
                {...form.getInputProps("invoiceAmount")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <NumberInput
                required
                label="Tài khoản công nợ (CCID)"
                placeholder="Ví dụ: 33101"
                {...form.getInputProps("acctsPayCodeCombinationId")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <NumberInput
                required
                label="Mã Lô hóa đơn (Tùy chọn)"
                placeholder="Ví dụ: 101"
                {...form.getInputProps("batchId")}
              />
            </Grid.Col>

            <Grid.Col span={12}>
              <TextInput
                label="Nội dung diễn giải"
                placeholder="Diễn giải chung của hóa đơn..."
                {...form.getInputProps("description")}
              />
            </Grid.Col>
          </Grid>

          <Divider my="xl" label="Chi tiết các dòng hóa đơn (ApInvoiceLine)" labelPosition="center" />

          <Box style={{ overflowX: "auto" }}>
            <Table striped withTableBorder withColumnBorders style={{ minWidth: 1000, fontSize: 13 }} mb="lg">
              <thead>
                <tr style={{ background: "#f8f9fa" }}>
                  <th style={{ width: 60, padding: 6 }}>Dòng</th>
                  <th style={{ width: 150, padding: 6 }}>Mã hàng hóa</th>
                  <th style={{ width: 220, padding: 6 }}>Tên hàng hóa/dịch vụ</th>
                  <th style={{ width: 100, padding: 6, textAlign: "right" }}>Số lượng</th>
                  <th style={{ width: 130, padding: 6, textAlign: "right" }}>Đơn giá</th>
                  <th style={{ width: 140, padding: 6, textAlign: "right" }}>Thành tiền</th>
                  <th style={{ width: 120, padding: 6 }}>Thuế suất</th>
                  <th style={{ width: 120, padding: 6, textAlign: "right" }}>Tiền thuế</th>
                  <th style={{ width: 120, padding: 6 }}>Tài khoản nợ</th>
                  <th style={{ width: 60, padding: 6, textAlign: "center" }}>Xóa</th>
                </tr>
              </thead>
              <tbody>
                {lines.length === 0 ? (
                  <tr>
                    <td colSpan={10} style={{ textAlign: "center", padding: 12, color: "#868e96" }}>Chưa nhập dòng hàng hóa nào. Bấm nút "Thêm dòng" phía dưới.</td>
                  </tr>
                ) : (
                  lines.map((l) => (
                    <tr key={l.lineLineNumber}>
                      <td style={{ padding: 6, textAlign: "center" }}>{l.lineLineNumber}</td>
                      <td style={{ padding: 4 }}>
                        <TextInput
                          required
                          value={l.itemCode}
                          placeholder="Mã vật tư"
                          onChange={(e) => handleLineChange(l.lineLineNumber, "itemCode", e.target.value)}
                        />
                      </td>
                      <td style={{ padding: 4 }}>
                        <TextInput
                          required
                          value={l.itemName}
                          placeholder="Tên vật tư"
                          onChange={(e) => handleLineChange(l.lineLineNumber, "itemName", e.target.value)}
                        />
                      </td>
                      <td style={{ padding: 4 }}>
                        <NumberInput
                          required
                          value={l.quantity}
                          min={0}
                          onChange={(val) => handleLineChange(l.lineLineNumber, "quantity", Number(val || 0))}
                        />
                      </td>
                      <td style={{ padding: 4 }}>
                        <NumberInput
                          required
                          value={l.price}
                          min={0}
                          thousandSeparator=","
                          onChange={(val) => handleLineChange(l.lineLineNumber, "price", Number(val || 0))}
                        />
                      </td>
                      <td style={{ padding: 6, textAlign: "right", fontWeight: 600 }}>
                        {l.amount.toLocaleString()}
                      </td>
                      <td style={{ padding: 4 }}>
                        <Select
                          data={[
                            { value: "VAT10", label: "VAT 10%" },
                            { value: "NO_VAT", label: "Không thuế" }
                          ]}
                          value={l.vatTaxCode}
                          onChange={(val) => handleLineChange(l.lineLineNumber, "vatTaxCode", val || "VAT10")}
                        />
                      </td>
                      <td style={{ padding: 6, textAlign: "right" }}>
                        {l.vatTaxAmount.toLocaleString()}
                      </td>
                      <td style={{ padding: 4 }}>
                        <NumberInput
                          required
                          value={l.distCodeCombinationId}
                          onChange={(val) => handleLineChange(l.lineLineNumber, "distCodeCombinationId", Number(val || 0))}
                        />
                      </td>
                      <td style={{ padding: 4, textAlign: "center" }}>
                        <ActionIcon color="red" variant="subtle" onClick={() => handleRemoveLine(l.lineLineNumber)}>
                          <IconTrash size={18} />
                        </ActionIcon>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Box>

          <Button variant="outline" leftSection={<IconPlus size={16} />} onClick={handleAddLine} mb="xl">
            Thêm dòng hàng hóa
          </Button>

          <Group justify="flex-end" mt="xl" pt="md" style={{ borderTop: "1px solid #dee2e6" }}>
            <Button variant="outline" color="gray" onClick={() => navigate("/ApInvoice/ApInvoiceList")}>
              Hủy bỏ
            </Button>
            <Button type="submit" color="blue" leftSection={<IconDeviceFloppy size={18} />}>
              Tạo hóa đơn
            </Button>
          </Group>
        </form>
      </Card>
    </Box>
  );
}

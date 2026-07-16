import { useState, useEffect } from "react";
import { Box, Button, Grid, TextInput, Select, Group, Title, Card, Table, ActionIcon, NumberInput, Flex, Text, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconTrash, IconArrowLeft, IconDeviceFloppy } from "@tabler/icons-react";
import { useNavigate, useParams } from "react-router-dom";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import { arBillingService } from "../services/arBillingService";
import { arSetupService } from "../services/arSetupService";
import { glReferenceService } from "../services/glReferenceService";
import { MOCK_CUSTOMERS } from "../mock/arMockData";
import { formatNumber } from "../../../common/FormatDate/FormatDate";

export default function EditARInvoice() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [sources, setSources] = useState<any[]>([]);
  const [types, setTypes] = useState<any[]>([]);
  const [terms, setTerms] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [versionNo, setVersionNo] = useState(1);

  const form = useForm({
    initialValues: {
      orgId: 101,
      legalEntityId: 201,
      sobId: 1,
      transactionSourceId: 1,
      transactionTypeId: 1,
      invoiceNumber: "",
      invoiceNum: "",
      invoiceDate: "",
      glDate: "",
      invoiceCurrencyCode: "VND",
      exchangeRate: 1,
      termsId: 1,
      soldToCustomerId: "",
      dueDate: "",
      referenceNumber: "",
      saleId: 0,
      deptId: 0,
      note: "",
      lines: [] as any[]
    }
  });

  // Load Reference & Invoice Data
  useEffect(() => {
    const loadData = async () => {
      const [srcRes, typeRes, termRes, accRes, invRes] = await Promise.all([
        arSetupService.getTransactionSources(),
        arSetupService.getTransactionTypes(),
        arSetupService.getPaymentTerms(),
        glReferenceService.getAccounts(),
        arBillingService.getById(Number(id))
      ]);

      if (srcRes.success) setSources(srcRes.data || []);
      if (typeRes.success) setTypes(typeRes.data || []);
      if (termRes.success) setTerms(termRes.data || []);
      if (accRes.success) setAccounts(accRes.data || []);

      if (invRes.success && invRes.data) {
        const { header, lines } = invRes.data;
        setVersionNo(header.versionNo || 1);
        form.setValues({
          orgId: header.orgId,
          legalEntityId: header.legalEntityId || 201,
          sobId: header.sobId || 1,
          transactionSourceId: header.transactionSourceId || 1,
          transactionTypeId: header.transactionTypeId,
          invoiceNumber: header.invoiceNumber,
          invoiceNum: header.invoiceNum || "",
          invoiceDate: header.invoiceDate ? header.invoiceDate.split("T")[0] : "",
          glDate: header.glDate ? header.glDate.split("T")[0] : "",
          invoiceCurrencyCode: header.invoiceCurrencyCode || "VND",
          exchangeRate: header.exchangeRate || 1,
          termsId: header.termsId || 1,
          soldToCustomerId: String(header.soldToCustomerId),
          dueDate: header.dueDate ? header.dueDate.split("T")[0] : "",
          referenceNumber: header.referenceNumber || "",
          saleId: header.saleId || 0,
          deptId: header.deptId || 0,
          note: header.note || "",
          lines: lines.map(l => ({ ...l }))
        });
      }
    };
    loadData();
  }, [id]);

  const handleLineChange = (index: number, field: string, value: any) => {
    const lines = [...form.values.lines];
    const line = { ...lines[index], [field]: value };

    if (field === "quantityOrdered" || field === "unitStandardPrice" || field === "discountAmount" || field === "taxRate") {
      const qty = field === "quantityOrdered" ? value : (line.quantityOrdered || 0);
      const price = field === "unitStandardPrice" ? value : (line.unitStandardPrice || 0);
      const disc = field === "discountAmount" ? value : (line.discountAmount || 0);
      const rate = field === "taxRate" ? value : (line.taxRate || 0);

      line.unitSellingPrice = price;
      line.lineAmount = qty * price;
      line.taxAmount = Math.round(line.lineAmount * (rate / 100));
      line.totalAmount = line.lineAmount + line.taxAmount - disc;
    }

    lines[index] = line;
    form.setFieldValue("lines", lines);
  };

  const deleteLine = (index: number) => {
    if (form.values.lines.length === 1) {
      NotificationExtension.Fails("Hóa đơn phải có ít nhất 1 dòng.");
      return;
    }
    const lines = form.values.lines.filter((_, i) => i !== index).map((l, i) => ({ ...l, lineNumber: i + 1 }));
    form.setFieldValue("lines", lines);
  };

  const lineTotal = form.values.lines.reduce((sum, l) => sum + (l.lineAmount || 0), 0);
  const taxTotal = form.values.lines.reduce((sum, l) => sum + (l.taxAmount || 0), 0);
  const discountTotal = form.values.lines.reduce((sum, l) => sum + (l.discountAmount || 0), 0);
  const grandTotal = lineTotal + taxTotal - discountTotal;

  const handleSubmit = async (values: typeof form.values, status: string) => {
    const req = {
      ...values,
      soldToCustomerId: Number(values.soldToCustomerId),
      billToCustomerId: Number(values.soldToCustomerId),
      status,
      totalAmount: grandTotal,
      dueAmount: grandTotal,
      versionNo
    };

    const res = await arBillingService.update(Number(id), req as any);
    if (res.success) {
      NotificationExtension.Success("Đã cập nhật hóa đơn thành công!");
      navigate("/cong-no-phai-thu/hoa-don");
    } else {
      NotificationExtension.Fails(res.message);
    }
  };

  return (
    <Box component="form" onSubmit={form.onSubmit(v => handleSubmit(v, "DRAFT"))}>
      <Flex justify="space-between" align="center" mb="lg">
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/cong-no-phai-thu/hoa-don")}>
          Quay lại danh sách
        </Button>
        <Group>
          <Button variant="outline" color="indigo" leftSection={<IconDeviceFloppy size={16} />} type="submit">
            Lưu thay đổi
          </Button>
          <Button color="teal" onClick={() => handleSubmit(form.values, "COMPLETE")}>
            Lưu &amp; Hoàn tất
          </Button>
        </Group>
      </Flex>

      <Grid mb="md">
        <Grid.Col span={12}>
          <Card withBorder shadow="sm" radius="sm">
            <Title order={5} mb="sm" c="indigo">Thông tin chung (Header)</Title>
            <Grid>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Select
                  label="Nguồn giao dịch"
                  data={sources.map(s => ({ value: String(s.transactionSourceId), label: s.sourceName }))}
                  {...form.getInputProps("transactionSourceId")}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Select
                  label="Loại giao dịch"
                  data={types.map(t => ({ value: String(t.transactionTypeId), label: t.description || t.typeName || ("Loại giao dịch " + t.transactionTypeId) }))}
                  {...form.getInputProps("transactionTypeId")}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <TextInput label="Số hóa đơn" disabled {...form.getInputProps("invoiceNumber")} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <TextInput label="Số hóa đơn GTGT thực tế" placeholder="Nhập số hóa đơn..." {...form.getInputProps("invoiceNum")} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <TextInput type="date" label="Ngày hóa đơn" {...form.getInputProps("invoiceDate")} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <TextInput type="date" label="Ngày hạch toán (GL Date)" {...form.getInputProps("glDate")} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Select
                  label="Điều khoản thanh toán"
                  data={terms.map(t => ({ value: String(t.termId), label: t.termName }))}
                  {...form.getInputProps("termsId")}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <TextInput type="date" label="Hạn thanh toán" {...form.getInputProps("dueDate")} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Select
                  label="Tiền tệ"
                  required
                  data={[
                    { value: "VND", label: "VND - Đồng Việt Nam (₫)" },
                    { value: "USD", label: "USD - Đô la Mỹ ($)" },
                    { value: "EUR", label: "EUR - Euro (€)" },
                    { value: "GBP", label: "GBP - Bảng Anh (£)" },
                    { value: "JPY", label: "JPY - Yên Nhật (¥)" },
                    { value: "CNY", label: "CNY - Nhân dân tệ (¥)" },
                    { value: "RUB", label: "RUB - Rúp Nga (₽)" },
                    { value: "SGD", label: "SGD - Đô la Singapore ($)" },
                    { value: "AUD", label: "AUD - Đô la Úc ($)" },
                  ]}
                  value={form.values.invoiceCurrencyCode}
                  onChange={(val: string | null) => {
                    const newCurr = val || "VND";
                    form.setFieldValue("invoiceCurrencyCode", newCurr);
                    const rates: Record<string, number> = {
                      VND: 1,
                      USD: 25000,
                      EUR: 27000,
                      GBP: 32000,
                      JPY: 165,
                      CNY: 3500,
                      RUB: 280,
                      SGD: 18500,
                      AUD: 16500,
                    };
                    form.setFieldValue("exchangeRate", rates[newCurr] || 1);
                  }}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <NumberInput
                  label="Tỷ giá hối đoái"
                  required
                  min={1}
                  value={form.values.exchangeRate}
                  onChange={(val: string | number) => form.setFieldValue("exchangeRate", Number(val) || 1)}
                />
              </Grid.Col>
            </Grid>
          </Card>
        </Grid.Col>

        <Grid.Col span={12}>
          <Card withBorder shadow="sm" radius="sm">
            <Title order={5} mb="sm" c="indigo">Thông tin khách hàng</Title>
            <Grid>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Select
                  label="Khách hàng"
                  data={MOCK_CUSTOMERS.map(c => ({ value: String(c.id), label: c.name }))}
                  {...form.getInputProps("soldToCustomerId")}
                />
              </Grid.Col>
            </Grid>
          </Card>
        </Grid.Col>

        <Grid.Col span={12}>
          <Card withBorder shadow="sm" radius="sm" style={{ overflowX: "auto" }}>
            <Title order={5} mb="sm" c="indigo">Chi tiết dòng hóa đơn (Invoice Lines)</Title>
            <Table striped withTableBorder withColumnBorders>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th style={{ width: 60 }}>STT</Table.Th>
                  <Table.Th style={{ width: 140 }}>Mã hàng</Table.Th>
                  <Table.Th style={{ width: 180 }}>Tên hàng</Table.Th>
                  <Table.Th style={{ width: 100 }}>Số lượng</Table.Th>
                  <Table.Th style={{ width: 150 }}>Đơn giá (VND)</Table.Th>
                  <Table.Th style={{ width: 100 }}>Thuế (%)</Table.Th>
                  <Table.Th style={{ width: 120 }}>Chiết khấu</Table.Th>
                  <Table.Th style={{ width: 150 }}>Thành tiền</Table.Th>
                  <Table.Th style={{ width: 60 }}>Xóa</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {form.values.lines.map((item, idx) => (
                  <Table.Tr key={idx}>
                    <Table.Td>{item.lineNumber}</Table.Td>
                    <Table.Td>
                      <TextInput value={item.itemCode} onChange={(e) => handleLineChange(idx, "itemCode", e.target.value)} />
                    </Table.Td>
                    <Table.Td>
                      <TextInput value={item.itemName} onChange={(e) => handleLineChange(idx, "itemName", e.target.value)} />
                    </Table.Td>
                    <Table.Td>
                      <NumberInput value={item.quantityOrdered} onChange={(val) => handleLineChange(idx, "quantityOrdered", Number(val))} min={1} />
                    </Table.Td>
                    <Table.Td>
                      <NumberInput value={item.unitStandardPrice} onChange={(val) => handleLineChange(idx, "unitStandardPrice", Number(val))} min={0} />
                    </Table.Td>
                    <Table.Td>
                      <Select
                        data={[
                          { value: "0", label: "0% - Xuất khẩu" },
                          { value: "5", label: "5% - Thiết bị, nông nghiệp" },
                          { value: "8", label: "8% - Ưu đãi giảm thuế" },
                          { value: "10", label: "10% - Phổ thông chuẩn" },
                        ]}
                        value={String(item.taxRate)}
                        onChange={(val) => handleLineChange(idx, "taxRate", Number(val))}
                      />
                    </Table.Td>
                    <Table.Td>
                      <NumberInput value={item.discountAmount} onChange={(val) => handleLineChange(idx, "discountAmount", Number(val))} min={0} />
                    </Table.Td>
                    <Table.Td style={{ textAlign: "right", fontWeight: 700 }}>
                      {formatNumber(item.totalAmount)} {form.values.invoiceCurrencyCode}
                    </Table.Td>
                    <Table.Td>
                      <ActionIcon color="red" variant="subtle" onClick={() => deleteLine(idx)}>
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Card>
        </Grid.Col>

        <Grid.Col span={12}>
          <Card withBorder shadow="sm" radius="sm">
            <Group justify="flex-end">
              <Stack gap="xs" style={{ width: 450 }}>
                <Flex justify="space-between">
                  <Text size="sm">Tiền hàng (Chưa thuế):</Text>
                  <Text size="sm" fw={700}>
                    {formatNumber(lineTotal)} {form.values.invoiceCurrencyCode}
                    {form.values.invoiceCurrencyCode !== "VND" && ` (≈ ${formatNumber(lineTotal * (form.values.exchangeRate || 1))} VND)`}
                  </Text>
                </Flex>
                <Flex justify="space-between">
                  <Text size="sm">Thuế VAT:</Text>
                  <Text size="sm" fw={700} c="blue">
                    +{formatNumber(taxTotal)} {form.values.invoiceCurrencyCode}
                    {form.values.invoiceCurrencyCode !== "VND" && ` (≈ ${formatNumber(taxTotal * (form.values.exchangeRate || 1))} VND)`}
                  </Text>
                </Flex>
                <Flex justify="space-between">
                  <Text size="sm">Tổng chiết khấu:</Text>
                  <Text size="sm" fw={700} c="red">
                    -{formatNumber(discountTotal)} {form.values.invoiceCurrencyCode}
                    {form.values.invoiceCurrencyCode !== "VND" && ` (≈ ${formatNumber(discountTotal * (form.values.exchangeRate || 1))} VND)`}
                  </Text>
                </Flex>
                <Flex justify="space-between" style={{ borderTop: "1px solid #dee2e6", paddingTop: 8 }}>
                  <Text size="md" fw={700}>Tổng thanh toán:</Text>
                  <Text size="lg" fw={700} c="indigo">
                    {formatNumber(grandTotal)} {form.values.invoiceCurrencyCode}
                    {form.values.invoiceCurrencyCode !== "VND" && ` (≈ ${formatNumber(grandTotal * (form.values.exchangeRate || 1))} VND)`}
                  </Text>
                </Flex>
              </Stack>
            </Group>
          </Card>
        </Grid.Col>
      </Grid>
    </Box>
  );
}

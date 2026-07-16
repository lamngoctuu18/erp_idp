import { useState, useEffect } from "react";
import { Box, Button, Grid, TextInput, Select, Card, NumberInput, Flex, Title, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconArrowLeft, IconDeviceFloppy } from "@tabler/icons-react";
import { useNavigate, useParams } from "react-router-dom";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import { arCashService } from "../services/arCashService";
import { arSetupService } from "../services/arSetupService";
import { MOCK_CUSTOMERS } from "../mock/arMockData";
import { formatNumber } from "../../../common/FormatDate/FormatDate";

export default function EditARReceipt() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [methods, setMethods] = useState<any[]>([]);

  const form = useForm({
    initialValues: {
      receiptId: 0,
      orgId: 101,
      legalEntityId: 201,
      receiptNumber: "",
      receiptDate: "",
      glDate: "",
      receiptType: "STANDARD",
      receiptClassId: 2,
      receiptMethodId: 2,
      customerId: "",
      totalAmount: 0,
      currency: "VND",
      exchangeRate: 1,
      note: "",
      versionNo: 1
    },
    validate: {
      customerId: (v: any) => (!v ? "Khách hàng là bắt buộc" : null),
      totalAmount: (v: any) => (v <= 0 ? "Số tiền phải lớn hơn 0" : null)
    }
  });

  useEffect(() => {
    arSetupService.getReceiptMethods().then(res => {
      if (res.success) setMethods(res.data || []);
    });
    if (id) {
      arCashService.getById(Number(id)).then(res => {
        if (res.success && res.data) {
          const rec = res.data;
          form.setValues({
            receiptId: rec.receiptId,
            orgId: rec.orgId,
            legalEntityId: rec.legalEntityId || 201,
            receiptNumber: rec.receiptNumber,
            receiptDate: rec.receiptDate,
            glDate: rec.glDate,
            receiptType: rec.receiptType || "STANDARD",
            receiptClassId: rec.receiptClassId || 2,
            receiptMethodId: rec.receiptMethodId || 2,
            customerId: String(rec.customerId),
            totalAmount: rec.totalAmount || 0,
            currency: rec.currencyCode || "VND",
            exchangeRate: rec.exchangeRate || 1,
            note: rec.note || "",
            versionNo: rec.versionNo
          });
        }
      });
    }
  }, [id]);

  const handleSubmit = async (values: typeof form.values) => {
    const req = {
      ...values,
      customerId: Number(values.customerId),
      totalAmount: values.totalAmount,
      currencyCode: values.currency,
    };
    const res = await arCashService.update(Number(id), req as any);
    if (res.success) {
      NotificationExtension.Success("Cập nhật phiếu thu thành công!");
      navigate("/cong-no-phai-thu/phieu-thu");
    } else {
      NotificationExtension.Fails(res.message);
    }
  };

  return (
    <Box component="form" onSubmit={form.onSubmit(handleSubmit)}>
      <Flex justify="space-between" align="center" mb="lg">
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/cong-no-phai-thu/phieu-thu")}>
          Quay lại
        </Button>
        <Button color="indigo" leftSection={<IconDeviceFloppy size={16} />} type="submit">
          Lưu thay đổi
        </Button>
      </Flex>

      <Card withBorder shadow="sm" radius="sm">
        <Title order={5} mb="sm" c="indigo">Chỉnh sửa thông tin phiếu thu #{form.values.receiptNumber}</Title>
        <Grid>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Select
              label="Khách hàng"
              placeholder="Chọn khách hàng"
              data={MOCK_CUSTOMERS.map(c => ({ value: String(c.id), label: c.name }))}
              {...form.getInputProps("customerId")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Select
              label="Phương thức thanh toán"
              data={methods.map(m => ({ value: String(m.receiptMethodId), label: m.methodName }))}
              {...form.getInputProps("receiptMethodId")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <NumberInput 
              label={`Số tiền thu (${form.values.currency})`} 
              min={1} 
              {...form.getInputProps("totalAmount")} 
            />
            {form.values.currency !== "VND" && (
              <Text size="xs" c="dimmed" mt="xs">
                ≈ {formatNumber(form.values.totalAmount * (form.values.exchangeRate || 1))} VND
              </Text>
            )}
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
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
              value={form.values.currency}
              onChange={(val: string | null) => {
                const newCurr = val || "VND";
                form.setFieldValue("currency", newCurr);
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
          <Grid.Col span={{ base: 12, md: 4 }}>
            <NumberInput
              label="Tỷ giá hối đoái"
              required
              min={1}
              value={form.values.exchangeRate}
              onChange={(val: string | number) => form.setFieldValue("exchangeRate", Number(val) || 1)}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <TextInput type="date" label="Ngày thu" {...form.getInputProps("receiptDate")} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <TextInput type="date" label="Ngày hạch toán" {...form.getInputProps("glDate")} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Select
              label="Loại phiếu thu"
              data={[
                { value: "STANDARD", label: "Tiêu chuẩn (Thanh toán nợ)" },
                { value: "MISCELLANEOUS", label: "Hỗn hợp/Khác (Doanh thu khác)" }
              ]}
              {...form.getInputProps("receiptType")}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <TextInput label="Ghi chú/Mô tả" placeholder="Nhập ghi chú..." {...form.getInputProps("note")} />
          </Grid.Col>
        </Grid>
      </Card>
    </Box>
  );
}

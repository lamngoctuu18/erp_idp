import { useState, useEffect } from "react";
import { Box, Button, Grid, TextInput, Select, Card, NumberInput, Flex, Title, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconArrowLeft, IconDeviceFloppy } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import { arCashService } from "../services/arCashService";
import { arSetupService } from "../services/arSetupService";
import { MOCK_CUSTOMERS } from "../mock/arMockData";
import { formatNumber } from "../../../common/FormatDate/FormatDate";

export default function CreateARReceipt() {
  const navigate = useNavigate();
  const [methods, setMethods] = useState<any[]>([]);

  useEffect(() => {
    arSetupService.getReceiptMethods().then(res => {
      if (res.success) setMethods(res.data || []);
    });
  }, []);

  const form = useForm({
    initialValues: {
      orgId: 101,
      legalEntityId: 201,
      receiptNumber: "",
      receiptDate: new Date().toISOString().split("T")[0],
      glDate: new Date().toISOString().split("T")[0],
      receiptType: "STANDARD",
      receiptClassId: 2,
      receiptMethodId: 2,
      customerId: "",
      totalAmount: 1000000,
      currency: "VND",
      exchangeRate: 1,
      comments: ""
    },
    validate: {
      customerId: (v: any) => (!v ? "Khách hàng là bắt buộc" : null),
      totalAmount: (v: any) => (v <= 0 ? "Số tiền phải lớn hơn 0" : null)
    }
  });

  const handleSubmit = async (values: typeof form.values) => {
    const req = {
      ...values,
      customerId: Number(values.customerId),
      totalAmount: values.totalAmount,
      currencyCode: values.currency,
      status: "UNAPPLIED",
      versionNo: 1
    };
    const res = await arCashService.create(req as any);
    if (res.success) {
      NotificationExtension.Success("Tạo phiếu thu thành công!");
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
          Lưu phiếu thu
        </Button>
      </Flex>

      <Card withBorder shadow="sm" radius="sm">
        <Title order={5} mb="sm" c="indigo">Nhập thông tin phiếu thu (Standard/Miscellaneous)</Title>
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
            <TextInput label="Ghi chú/Mô tả" placeholder="Nhập ghi chú..." {...form.getInputProps("comments")} />
          </Grid.Col>
        </Grid>
      </Card>
    </Box>
  );
}

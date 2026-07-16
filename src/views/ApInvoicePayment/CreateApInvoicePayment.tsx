import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";
import { Box, Card, Title, Select, Group, Button, Grid, Divider, NumberInput, TextInput } from "@mantine/core";
import { IconArrowLeft, IconDeviceFloppy } from "@tabler/icons-react";
import { apInvoicePaymentService, apPaymentService } from "../../api/apVendor/apPaymentMockService";
import { ApPayment } from "../../model/ApPaymentModel";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

export default function CreateApInvoicePayment() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<ApPayment[]>([]);

  const form = useForm({
    initialValues: {
      setOfBooksId: 1,
      orgId: 10,
      invoiceId: "",
      paymentId: "",
      accountingDate: new Date().toISOString().substring(0, 10),
      periodName: "JUL-26",
      amount: 50000000,
      ccidDr: 33101,
      ccidCr: 112101,
      reversalFlag: "N",
      currencyCode: "VND",
      exchangeRate: 1,
      invoiceAmount: 150000000,
      invoiceBaseAmount: 150000000,
      paymentAmount: 50000000,
      paymentBaseAmount: 50000000,
      paymentNum: 1
    },
    validate: {
      paymentId: (val: any) => (val ? null : "Vui lòng chọn Phiếu chi nguồn để phân bổ"),
      invoiceId: (val: any) => (val ? null : "Mã hóa đơn nhận phân bổ bắt buộc nhập"),
      amount: (val: any) => (val ? null : "Số tiền phân bổ bắt buộc nhập")
    }
  });

  useEffect(() => {
    const loadPayments = async () => {
      try {
        const list = await apPaymentService.getAll();
        setPayments(list);
        if (list.length > 0) {
          form.setFieldValue("paymentId", String(list[0].paymentId));
        }
      } catch {
        NotificationExtension.Fails("Không thể tải danh sách phiếu chi.");
      }
    };
    loadPayments();
  }, []);

  useEffect(() => {
    const pId = form.values.paymentId;
    if (!pId) return;
    const selectedPay = payments.find((x) => x.paymentId === Number(pId));
    if (selectedPay) {
      form.setFieldValue("currencyCode", selectedPay.currencyCode);
      form.setFieldValue("exchangeRate", selectedPay.exchangeRate || 1);
      form.setFieldValue("orgId", selectedPay.orgId);
    }
  }, [form.values.paymentId, payments]);

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const res = await apInvoicePaymentService.create({
        setOfBooksId: Number(values.setOfBooksId),
        orgId: Number(values.orgId),
        invoiceId: Number(values.invoiceId),
        paymentId: Number(values.paymentId),
        accountingEventId: null,
        accountingDate: values.accountingDate || null,
        periodName: values.periodName,
        amount: values.amount ? Number(values.amount) : null,
        ccidDr: values.ccidDr ? Number(values.ccidDr) : null,
        ccidCr: values.ccidCr ? Number(values.ccidCr) : null,
        reversalFlag: values.reversalFlag,
        currencyCode: values.currencyCode,
        exchangeRate: values.exchangeRate ? Number(values.exchangeRate) : null,
        invoiceAmount: values.invoiceAmount ? Number(values.invoiceAmount) : null,
        invoiceBaseAmount: values.invoiceBaseAmount ? Number(values.invoiceBaseAmount) : null,
        paymentAmount: values.paymentAmount ? Number(values.paymentAmount) : null,
        paymentBaseAmount: values.paymentBaseAmount ? Number(values.paymentBaseAmount) : null,
        paymentNum: values.paymentNum ? Number(values.paymentNum) : null,
        lastUpdateBy: 1,
        createBy: 1
      });

      if (res.success) {
        NotificationExtension.Success("Thêm mới phân bổ thanh toán hóa đơn thành công!");
        navigate("/ApInvoicePayment/ApInvoicePaymentList");
      } else {
        NotificationExtension.Fails(res.message || "Lỗi khi lưu.");
      }
    } catch {
      NotificationExtension.Fails("Không thể kết nối đến Mock API Service.");
    }
  };

  return (
    <Box>
      <Group justify="space-between" align="center" mb="lg">
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/ApInvoicePayment/ApInvoicePaymentList")}>
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="xl">
        <Title order={3} mb="xs">Lập Phân bổ Thanh toán Hóa đơn mới (AP Invoice Payment Entry)</Title>
        <Divider mb="xl" />

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                required
                label="Phiếu chi nguồn (Payment / Check)"
                placeholder="Chọn phiếu chi thanh toán"
                data={payments.map((p) => ({ value: String(p.paymentId), label: `Số phiếu: ${p.paymentNumber} (${p.amount?.toLocaleString()} ${p.currencyCode}) - ${p.vendorName}` }))}
                {...form.getInputProps("paymentId")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                required
                label="Mã hóa đơn nhận đối trừ (Invoice ID)"
                placeholder="Ví dụ: 1001"
                {...form.getInputProps("invoiceId")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                type="date"
                required
                label="Ngày hạch toán phân bổ (Accounting Date)"
                {...form.getInputProps("accountingDate")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                required
                label="Kỳ kế toán ghi nhận"
                placeholder="Ví dụ: JUL-26"
                {...form.getInputProps("periodName")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select
                required
                label="Cờ đảo bút toán (Reversal)"
                data={[
                  { value: "N", label: "Ghi nhận bình thường" },
                  { value: "Y", label: "Đảo bút toán (REVERSED)" }
                ]}
                {...form.getInputProps("reversalFlag")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <NumberInput
                required
                label="Số tiền phân bổ (Amount)"
                thousandSeparator=","
                {...form.getInputProps("amount")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                disabled
                label="Mã tiền tệ"
                {...form.getInputProps("currencyCode")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <NumberInput
                disabled
                label="Tỷ giá hạch toán"
                decimalScale={4}
                {...form.getInputProps("exchangeRate")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label="Tổng số tiền hóa đơn nhận phân bổ"
                thousandSeparator=","
                {...form.getInputProps("invoiceAmount")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label="Số tiền hóa đơn quy đổi (VND)"
                thousandSeparator=","
                {...form.getInputProps("invoiceBaseAmount")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <NumberInput
                label="Tài khoản nợ (Dr CCID)"
                placeholder="Ví dụ: 33101"
                {...form.getInputProps("ccidDr")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <NumberInput
                label="Tài khoản có (Cr CCID)"
                placeholder="Ví dụ: 112101"
                {...form.getInputProps("ccidCr")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <NumberInput
                required
                label="Mã Sổ kế toán (Ledger / Set of Books)"
                {...form.getInputProps("setOfBooksId")}
              />
            </Grid.Col>
          </Grid>

          <Group justify="flex-end" mt="xl" pt="md" style={{ borderTop: "1px solid #dee2e6" }}>
            <Button variant="outline" color="gray" onClick={() => navigate("/ApInvoicePayment/ApInvoicePaymentList")}>
              Hủy bỏ
            </Button>
            <Button type="submit" color="blue" leftSection={<IconDeviceFloppy size={18} />}>
              Thực hiện phân bổ
            </Button>
          </Group>
        </form>
      </Card>
    </Box>
  );
}

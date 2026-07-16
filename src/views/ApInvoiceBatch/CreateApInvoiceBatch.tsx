import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";
import { Box, Card, Title, TextInput, Select, Group, Button, Grid, Divider, NumberInput } from "@mantine/core";
import { IconArrowLeft, IconDeviceFloppy } from "@tabler/icons-react";
import { apInvoiceBatchService } from "../../api/apVendor/apInvoiceMasterMockService";
import { apPaymentTermService } from "../../api/apVendor/apPaymentMockService";
import { ApPaymentTerm } from "../../model/ApPaymentModel";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

export default function CreateApInvoiceBatch() {
  const navigate = useNavigate();
  const [terms, setTerms] = useState<ApPaymentTerm[]>([]);

  const form = useForm({
    initialValues: {
      batchName: "",
      batchStatus: "PENDING",
      estimatedAmount: 500000000,
      actualAmount: 0,
      invoiceCount: 5,
      actualInvoiceCount: 0,
      invoiceCurrencyCode: "VND",
      paymentTermId: "",
      payGroup: "DOMESTIC SUPPLIER"
    },
    validate: {
      batchName: (val: any) => (val ? null : "Tên lô hóa đơn bắt buộc nhập")
    }
  });

  useEffect(() => {
    const loadTerms = async () => {
      try {
        const list = await apPaymentTermService.getAll();
        setTerms(list);
        if (list.length > 0) {
          form.setFieldValue("paymentTermId", String(list[0].paymentTermId));
        }
      } catch {
        console.error("Không tải được danh mục điều khoản.");
      }
    };
    loadTerms();
  }, []);

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const res = await apInvoiceBatchService.create({
        batchName: values.batchName,
        batchStatus: values.batchStatus,
        estimatedAmount: values.estimatedAmount ? Number(values.estimatedAmount) : null,
        actualAmount: values.actualAmount ? Number(values.actualAmount) : null,
        invoiceCount: values.invoiceCount ? Number(values.invoiceCount) : null,
        actualInvoiceCount: values.actualInvoiceCount ? Number(values.actualInvoiceCount) : null,
        invoiceCurrencyCode: values.invoiceCurrencyCode,
        paymentTermId: values.paymentTermId ? Number(values.paymentTermId) : null,
        payGroup: values.payGroup || null,
        createdBy: 1
      });

      if (res.success) {
        NotificationExtension.Success("Thêm mới lô hóa đơn thành công!");
        navigate("/ApInvoiceBatch/ApInvoiceBatchList");
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
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/ApInvoiceBatch/ApInvoiceBatchList")}>
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="xl">
        <Title order={3} mb="xs">Thêm mới Lô hóa đơn (AP Invoice Batch Entry)</Title>
        <Divider mb="xl" />

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                required
                label="Tên lô hóa đơn"
                placeholder="Ví dụ: Lô hóa đơn mua sữa tươi tháng 7"
                {...form.getInputProps("batchName")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                required
                label="Trạng thái lô"
                data={[
                  { value: "PENDING", label: "Chờ duyệt (PENDING)" },
                  { value: "APPROVED", label: "Đã phê duyệt (APPROVED)" },
                  { value: "CLOSED", label: "Đã đóng (CLOSED)" }
                ]}
                {...form.getInputProps("batchStatus")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label="Số tiền dự kiến của lô"
                thousandSeparator=","
                {...form.getInputProps("estimatedAmount")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label="Số tiền thực tế nhập"
                thousandSeparator=","
                {...form.getInputProps("actualAmount")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label="Số lượng hóa đơn dự kiến"
                {...form.getInputProps("invoiceCount")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label="Số lượng hóa đơn thực tế"
                {...form.getInputProps("actualInvoiceCount")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select
                required
                label="Đồng tiền lô hóa đơn"
                data={[
                  { value: "VND", label: "VND" },
                  { value: "USD", label: "USD" }
                ]}
                {...form.getInputProps("invoiceCurrencyCode")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select
                required
                label="Điều khoản thanh toán mặc định"
                data={terms.map((t) => ({ value: String(t.paymentTermId), label: t.termName }))}
                {...form.getInputProps("paymentTermId")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                label="Nhóm chi trả (Pay Group)"
                placeholder="Ví dụ: DOMESTIC SUPPLIER"
                {...form.getInputProps("payGroup")}
              />
            </Grid.Col>
          </Grid>

          <Group justify="flex-end" mt="xl" pt="md" style={{ borderTop: "1px solid #dee2e6" }}>
            <Button variant="outline" color="gray" onClick={() => navigate("/ApInvoiceBatch/ApInvoiceBatchList")}>
              Hủy bỏ
            </Button>
            <Button type="submit" color="blue" leftSection={<IconDeviceFloppy size={18} />}>
              Lưu lô hóa đơn
            </Button>
          </Group>
        </form>
      </Card>
    </Box>
  );
}

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "@mantine/form";
import { Box, Card, Title, TextInput, Select, Group, Button, Grid, Divider, Text, Center, Loader, NumberInput } from "@mantine/core";
import { IconArrowLeft, IconDeviceFloppy } from "@tabler/icons-react";
import { apInvoiceBatchService } from "../../api/apVendor/apInvoiceMasterMockService";
import { apPaymentTermService } from "../../api/apVendor/apPaymentMockService";
import { ApPaymentTerm } from "../../model/ApPaymentModel";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

export default function EditApInvoiceBatch() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [terms, setTerms] = useState<ApPaymentTerm[]>([]);

  const form = useForm({
    initialValues: {
      batchName: "",
      batchStatus: "PENDING",
      estimatedAmount: 0,
      actualAmount: 0,
      invoiceCount: 0,
      actualInvoiceCount: 0,
      invoiceCurrencyCode: "VND",
      paymentTermId: "",
      payGroup: ""
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
      } catch {
        console.error("Không tải được danh mục điều khoản.");
      }
    };
    loadTerms();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const res = await apInvoiceBatchService.getById(Number(id));
        if (res.success && res.data) {
          form.setValues({
            batchName: res.data.batchName,
            batchStatus: res.data.batchStatus || "PENDING",
            estimatedAmount: res.data.estimatedAmount || 0,
            actualAmount: res.data.actualAmount || 0,
            invoiceCount: res.data.invoiceCount || 0,
            actualInvoiceCount: res.data.actualInvoiceCount || 0,
            invoiceCurrencyCode: res.data.invoiceCurrencyCode || "VND",
            paymentTermId: res.data.paymentTermId ? String(res.data.paymentTermId) : "",
            payGroup: res.data.payGroup || ""
          });
        } else {
          NotificationExtension.Fails(res.message || "Không tải được dữ liệu.");
          navigate("/ApInvoiceBatch/ApInvoiceBatchList");
        }
      } catch {
        NotificationExtension.Fails("Lỗi khi tải thông tin lô hóa đơn.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleSubmit = async (values: typeof form.values) => {
    if (!id) return;
    try {
      const res = await apInvoiceBatchService.update(Number(id), {
        batchName: values.batchName,
        batchStatus: values.batchStatus,
        estimatedAmount: values.estimatedAmount ? Number(values.estimatedAmount) : null,
        actualAmount: values.actualAmount ? Number(values.actualAmount) : null,
        invoiceCount: values.invoiceCount ? Number(values.invoiceCount) : null,
        actualInvoiceCount: values.actualInvoiceCount ? Number(values.actualInvoiceCount) : null,
        invoiceCurrencyCode: values.invoiceCurrencyCode,
        paymentTermId: values.paymentTermId ? Number(values.paymentTermId) : null,
        payGroup: values.payGroup || null
      });

      if (res.success) {
        NotificationExtension.Success("Cập nhật lô hóa đơn thành công!");
        navigate("/ApInvoiceBatch/ApInvoiceBatchList");
      } else {
        NotificationExtension.Fails(res.message || "Lỗi khi lưu.");
      }
    } catch {
      NotificationExtension.Fails("Không thể lưu thay đổi.");
    }
  };

  if (loading) {
    return (
      <Center style={{ height: "300px" }}>
        <Loader size="lg" />
      </Center>
    );
  }

  return (
    <Box>
      <Group justify="space-between" align="center" mb="lg">
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/ApInvoiceBatch/ApInvoiceBatchList")}>
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="xl">
        <Title order={3} mb="xs">Cập nhật Lô hóa đơn mua hàng đầu vào</Title>
        <Text size="sm" c="dimmed" mb="lg">Mã lô (ID): <b>{id}</b></Text>
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
              Cập nhật lô hóa đơn
            </Button>
          </Group>
        </form>
      </Card>
    </Box>
  );
}

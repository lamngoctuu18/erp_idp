import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "@mantine/form";
import { Box, Card, Title, TextInput, Select, Group, Button, Grid, Divider, Text, Center, Loader, NumberInput } from "@mantine/core";
import { IconArrowLeft, IconDeviceFloppy } from "@tabler/icons-react";
import { apPaymentScheduleService } from "../../api/apVendor/apPaymentMockService";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

export default function EditApPaymentSchedule() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const form = useForm({
    initialValues: {
      orgId: 10,
      invoiceId: "",
      dueDate: "",
      grossAmount: 0,
      amountRemaining: 0,
      holdFlag: "N",
      discountDate: "",
      discountAmount: 0,
      paymentMethod: "WIRE",
      paymentNum: 1,
      paymentStatusFlag: "N",
      paymentStatus: "UNPAID"
    },
    validate: {
      invoiceId: (val: any) => (val ? null : "Mã hóa đơn liên kết bắt buộc nhập"),
      grossAmount: (val: any) => (val ? null : "Tổng số nợ gốc bắt buộc nhập")
    }
  });

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const res = await apPaymentScheduleService.getById(Number(id));
        if (res.success && res.data) {
          form.setValues({
            orgId: res.data.orgId,
            invoiceId: String(res.data.invoiceId),
            dueDate: res.data.dueDate ? res.data.dueDate.substring(0, 10) : "",
            grossAmount: res.data.grossAmount || 0,
            amountRemaining: res.data.amountRemaining || 0,
            holdFlag: res.data.holdFlag || "N",
            discountDate: res.data.discountDate ? res.data.discountDate.substring(0, 10) : "",
            discountAmount: res.data.discountAmount || 0,
            paymentMethod: res.data.paymentMethod || "WIRE",
            paymentNum: res.data.paymentNum || 1,
            paymentStatusFlag: res.data.paymentStatusFlag || "N",
            paymentStatus: res.data.paymentStatus || "UNPAID"
          });
        } else {
          NotificationExtension.Fails(res.message || "Không tải được dữ liệu.");
          navigate("/ApPaymentSchedule/ApPaymentScheduleList");
        }
      } catch {
        NotificationExtension.Fails("Lỗi khi tải thông tin lịch thanh toán.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleSubmit = async (values: typeof form.values) => {
    if (!id) return;
    try {
      const res = await apPaymentScheduleService.update(Number(id), {
        orgId: Number(values.orgId),
        invoiceId: Number(values.invoiceId),
        dueDate: values.dueDate || null,
        grossAmount: values.grossAmount ? Number(values.grossAmount) : null,
        amountRemaining: values.amountRemaining ? Number(values.amountRemaining) : null,
        holdFlag: values.holdFlag,
        discountDate: values.discountDate || null,
        discountAmount: values.discountAmount ? Number(values.discountAmount) : null,
        paymentMethod: values.paymentMethod,
        paymentNum: values.paymentNum ? Number(values.paymentNum) : null,
        paymentStatusFlag: values.paymentStatusFlag,
        paymentStatus: values.paymentStatus
      });

      if (res.success) {
        NotificationExtension.Success("Cập nhật lịch trả nợ thành công!");
        navigate("/ApPaymentSchedule/ApPaymentScheduleList");
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
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/ApPaymentSchedule/ApPaymentScheduleList")}>
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="xl">
        <Title order={3} mb="xs">Cập nhật Lịch Trả Nợ dự kiến</Title>
        <Text size="sm" c="dimmed" mb="lg">Mã lịch trả nợ (ID): <b>{id}</b></Text>
        <Divider mb="xl" />

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                required
                label="Mã hóa đơn liên kết (Invoice ID)"
                placeholder="Ví dụ: 1001"
                {...form.getInputProps("invoiceId")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                type="date"
                required
                label="Hạn thanh toán (Due Date)"
                {...form.getInputProps("dueDate")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <NumberInput
                required
                label="Tổng số nợ gốc (Gross Amount)"
                thousandSeparator=","
                {...form.getInputProps("grossAmount")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <NumberInput
                required
                label="Dư nợ còn lại (Amount Remaining)"
                thousandSeparator=","
                {...form.getInputProps("amountRemaining")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select
                required
                label="Trạng thái chặn thanh toán (Hold)"
                data={[
                  { value: "N", label: "Không chặn" },
                  { value: "Y", label: "Đang chặn thanh toán (HOLD)" }
                ]}
                {...form.getInputProps("holdFlag")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                type="date"
                label="Hạn thanh toán sớm để hưởng chiết khấu"
                {...form.getInputProps("discountDate")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label="Số tiền chiết khấu dự kiến"
                thousandSeparator=","
                {...form.getInputProps("discountAmount")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select
                required
                label="Phương thức thanh toán dự kiến"
                data={[
                  { value: "WIRE", label: "Ủy nhiệm chi (WIRE)" },
                  { value: "CHECK", label: "Séc (CHECK)" },
                  { value: "CASH", label: "Tiền mặt (CASH)" }
                ]}
                {...form.getInputProps("paymentMethod")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select
                required
                label="Tình trạng chi trả"
                data={[
                  { value: "UNPAID", label: "Chưa thanh toán (UNPAID)" },
                  { value: "PARTIALLY_PAID", label: "Thanh toán một phần (PARTIALLY_PAID)" },
                  { value: "PAID", label: "Đã tất toán (PAID)" }
                ]}
                {...form.getInputProps("paymentStatus")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <NumberInput
                required
                label="Mã đơn vị hoạt động (Org ID)"
                placeholder="Ví dụ: 10"
                {...form.getInputProps("orgId")}
              />
            </Grid.Col>
          </Grid>

          <Group justify="flex-end" mt="xl" pt="md" style={{ borderTop: "1px solid #dee2e6" }}>
            <Button variant="outline" color="gray" onClick={() => navigate("/ApPaymentSchedule/ApPaymentScheduleList")}>
              Hủy bỏ
            </Button>
            <Button type="submit" color="blue" leftSection={<IconDeviceFloppy size={18} />}>
              Cập nhật lịch trả nợ
            </Button>
          </Group>
        </form>
      </Card>
    </Box>
  );
}

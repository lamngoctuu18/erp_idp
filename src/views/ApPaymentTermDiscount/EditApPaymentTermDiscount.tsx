import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "@mantine/form";
import { Box, Card, Title, TextInput, Select, Group, Button, Grid, Divider, Text, Center, Loader, NumberInput } from "@mantine/core";
import { IconArrowLeft, IconDeviceFloppy } from "@tabler/icons-react";
import { apPaymentTermDiscountService, apPaymentTermService } from "../../api/apVendor/apPaymentMockService";
import { ApPaymentTerm } from "../../model/ApPaymentModel";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

export default function EditApPaymentTermDiscount() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [terms, setTerms] = useState<ApPaymentTerm[]>([]);

  const form = useForm({
    initialValues: {
      paymentTermId: "",
      discountLevel: 1,
      discountPercent: 0,
      days: 0,
      dayOfMonth: 0,
      monthsAhead: 0
    },
    validate: {
      paymentTermId: (val: any) => (val ? null : "Vui lòng chọn Điều khoản thanh toán liên kết"),
      discountLevel: (val: any) => (val ? null : "Bậc chiết khấu bắt buộc nhập")
    }
  });

  useEffect(() => {
    const loadTerms = async () => {
      try {
        const list = await apPaymentTermService.getAll();
        setTerms(list);
      } catch {
        console.error("Không tải được danh sách điều khoản thanh toán.");
      }
    };
    loadTerms();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const res = await apPaymentTermDiscountService.getById(Number(id));
        if (res.success && res.data) {
          form.setValues({
            paymentTermId: String(res.data.paymentTermId),
            discountLevel: res.data.discountLevel || 1,
            discountPercent: res.data.discountPercent || 0,
            days: res.data.days || 0,
            dayOfMonth: res.data.dayOfMonth || 0,
            monthsAhead: res.data.monthsAhead || 0
          });
        } else {
          NotificationExtension.Fails(res.message || "Không tải được dữ liệu.");
          navigate("/ApPaymentTermDiscount/ApPaymentTermDiscountList");
        }
      } catch {
        NotificationExtension.Fails("Lỗi khi tải thông tin chiết khấu.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleSubmit = async (values: typeof form.values) => {
    if (!id) return;
    try {
      const res = await apPaymentTermDiscountService.update(Number(id), {
        paymentTermId: Number(values.paymentTermId),
        discountLevel: Number(values.discountLevel),
        discountPercent: values.discountPercent ? Number(values.discountPercent) : null,
        days: values.days ? Number(values.days) : null,
        dayOfMonth: values.dayOfMonth ? Number(values.dayOfMonth) : null,
        monthsAhead: values.monthsAhead ? Number(values.monthsAhead) : null
      });

      if (res.success) {
        NotificationExtension.Success("Cập nhật chiết khấu thành công!");
        navigate("/ApPaymentTermDiscount/ApPaymentTermDiscountList");
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
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/ApPaymentTermDiscount/ApPaymentTermDiscountList")}>
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="xl">
        <Title order={3} mb="xs">Cập nhật Chiết khấu Điều khoản</Title>
        <Text size="sm" c="dimmed" mb="lg">Mã chiết khấu (ID): <b>{id}</b></Text>
        <Divider mb="xl" />

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                required
                label="Điều khoản thanh toán liên kết"
                placeholder="Chọn điều khoản"
                data={terms.map((t) => ({ value: String(t.paymentTermId), label: t.termName }))}
                {...form.getInputProps("paymentTermId")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                required
                label="Bậc chiết khấu (Discount Level)"
                placeholder="Ví dụ: 1"
                {...form.getInputProps("discountLevel")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label="Tỷ lệ chiết khấu (%)"
                placeholder="Ví dụ: 2"
                min={0}
                max={100}
                decimalScale={2}
                {...form.getInputProps("discountPercent")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label="Số ngày thanh toán sớm được hưởng"
                placeholder="Ví dụ: 10"
                {...form.getInputProps("days")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label="Ngày trong tháng cố định (tùy chọn)"
                min={0}
                max={31}
                {...form.getInputProps("dayOfMonth")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label="Số tháng cộng trước (Months Ahead)"
                {...form.getInputProps("monthsAhead")}
              />
            </Grid.Col>
          </Grid>

          <Group justify="flex-end" mt="xl" pt="md" style={{ borderTop: "1px solid #dee2e6" }}>
            <Button variant="outline" color="gray" onClick={() => navigate("/ApPaymentTermDiscount/ApPaymentTermDiscountList")}>
              Hủy bỏ
            </Button>
            <Button type="submit" color="blue" leftSection={<IconDeviceFloppy size={18} />}>
              Cập nhật chiết khấu
            </Button>
          </Group>
        </form>
      </Card>
    </Box>
  );
}

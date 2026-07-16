import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "@mantine/form";
import { Box, Card, Title, TextInput, Select, Group, Button, Grid, Divider, Text, Center, Loader, NumberInput } from "@mantine/core";
import { IconArrowLeft, IconDeviceFloppy } from "@tabler/icons-react";
import { apPaymentTermLineService, apPaymentTermService } from "../../api/apVendor/apPaymentMockService";
import { ApPaymentTerm } from "../../model/ApPaymentModel";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

export default function EditApPaymentTermLine() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [terms, setTerms] = useState<ApPaymentTerm[]>([]);

  const form = useForm({
    initialValues: {
      paymentTermId: "",
      lineNum: 1,
      duePercent: 100,
      dueAmount: 0,
      days: 30,
      dayOfMonth: 0,
      monthAhead: 0
    },
    validate: {
      paymentTermId: (val: any) => (val ? null : "Vui lòng chọn Điều khoản thanh toán liên kết"),
      lineNum: (val: any) => (val ? null : "Số dòng bắt buộc nhập")
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
        const res = await apPaymentTermLineService.getById(Number(id));
        if (res.success && res.data) {
          form.setValues({
            paymentTermId: String(res.data.paymentTermId),
            lineNum: res.data.lineNum || 1,
            duePercent: res.data.duePercent || 0,
            dueAmount: res.data.dueAmount || 0,
            days: res.data.days || 0,
            dayOfMonth: res.data.dayOfMonth || 0,
            monthAhead: res.data.monthAhead || 0
          });
        } else {
          NotificationExtension.Fails(res.message || "Không tải được dữ liệu.");
          navigate("/ApPaymentTermLine/ApPaymentTermLineList");
        }
      } catch {
        NotificationExtension.Fails("Lỗi khi tải thông tin dòng điều khoản.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleSubmit = async (values: typeof form.values) => {
    if (!id) return;
    try {
      const res = await apPaymentTermLineService.update(Number(id), {
        paymentTermId: Number(values.paymentTermId),
        lineNum: Number(values.lineNum),
        duePercent: values.duePercent ? Number(values.duePercent) : null,
        dueAmount: values.dueAmount ? Number(values.dueAmount) : null,
        fixedDate: null,
        days: values.days ? Number(values.days) : null,
        dayOfMonth: values.dayOfMonth ? Number(values.dayOfMonth) : null,
        monthAhead: values.monthAhead ? Number(values.monthAhead) : null
      });

      if (res.success) {
        NotificationExtension.Success("Cập nhật dòng điều khoản thành công!");
        navigate("/ApPaymentTermLine/ApPaymentTermLineList");
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
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/ApPaymentTermLine/ApPaymentTermLineList")}>
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="xl">
        <Title order={3} mb="xs">Cập nhật Dòng chi tiết điều khoản</Title>
        <Text size="sm" c="dimmed" mb="lg">Mã dòng (ID): <b>{id}</b></Text>
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
                label="Số thứ tự dòng (Line Number)"
                placeholder="Ví dụ: 1"
                {...form.getInputProps("lineNum")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label="Tỷ lệ nợ đến hạn (%)"
                placeholder="Ví dụ: 100"
                min={0}
                max={100}
                {...form.getInputProps("duePercent")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label="Số tiền nợ cố định (tùy chọn)"
                thousandSeparator=","
                {...form.getInputProps("dueAmount")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <NumberInput
                label="Số ngày nợ được gia hạn"
                placeholder="Ví dụ: 30"
                {...form.getInputProps("days")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <NumberInput
                label="Ngày trong tháng cố định (tùy chọn)"
                min={0}
                max={31}
                {...form.getInputProps("dayOfMonth")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <NumberInput
                label="Số tháng cộng thêm (tùy chọn)"
                {...form.getInputProps("monthAhead")}
              />
            </Grid.Col>
          </Grid>

          <Group justify="flex-end" mt="xl" pt="md" style={{ borderTop: "1px solid #dee2e6" }}>
            <Button variant="outline" color="gray" onClick={() => navigate("/ApPaymentTermLine/ApPaymentTermLineList")}>
              Hủy bỏ
            </Button>
            <Button type="submit" color="blue" leftSection={<IconDeviceFloppy size={18} />}>
              Cập nhật dòng điều khoản
            </Button>
          </Group>
        </form>
      </Card>
    </Box>
  );
}

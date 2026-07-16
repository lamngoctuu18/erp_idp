import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";
import { Box, Card, Title, TextInput, Select, Group, Button, Grid, Divider, NumberInput } from "@mantine/core";
import { IconArrowLeft, IconDeviceFloppy } from "@tabler/icons-react";
import { apPaymentTermLineService, apPaymentTermService } from "../../api/apVendor/apPaymentMockService";
import { ApPaymentTerm } from "../../model/ApPaymentModel";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

export default function CreateApPaymentTermLine() {
  const navigate = useNavigate();
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
        if (list.length > 0) {
          form.setFieldValue("paymentTermId", String(list[0].paymentTermId));
        }
      } catch {
        NotificationExtension.Fails("Không thể tải danh sách điều khoản thanh toán.");
      }
    };
    loadTerms();
  }, []);

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const res = await apPaymentTermLineService.create({
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
        NotificationExtension.Success("Thêm mới dòng điều khoản thành công!");
        navigate("/ApPaymentTermLine/ApPaymentTermLineList");
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
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/ApPaymentTermLine/ApPaymentTermLineList")}>
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="xl">
        <Title order={3} mb="xs">Thêm mới Dòng chi tiết điều khoản (AP Term Line Entry)</Title>
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
              Lưu dòng điều khoản
            </Button>
          </Group>
        </form>
      </Card>
    </Box>
  );
}

import { useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";
import { Box, Card, Title, TextInput, Select, Group, Button, Grid, Divider, NumberInput } from "@mantine/core";
import { IconArrowLeft, IconDeviceFloppy } from "@tabler/icons-react";
import { apPaymentTermService } from "../../api/apVendor/apPaymentMockService";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

export default function CreateApPaymentTerm() {
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      termName: "",
      description: "",
      cutoffDay: 30,
      effectiveFrom: new Date().toISOString().substring(0, 10),
      effectiveTo: "",
      rankNo: 1,
      status: "ACTIVE"
    },
    validate: {
      termName: (val: any) => (val ? null : "Tên điều khoản bắt buộc nhập")
    }
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const res = await apPaymentTermService.create({
        termName: values.termName,
        description: values.description || null,
        cutoffDay: values.cutoffDay ? Number(values.cutoffDay) : null,
        effectiveFrom: values.effectiveFrom || null,
        effectiveTo: values.effectiveTo || null,
        rankNo: values.rankNo ? Number(values.rankNo) : null,
        status: values.status || null
      });

      if (res.success) {
        NotificationExtension.Success("Thêm mới điều khoản thanh toán thành công!");
        navigate("/ApPaymentTerm/ApPaymentTermList");
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
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/ApPaymentTerm/ApPaymentTermList")}>
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="xl">
        <Title order={3} mb="xs">Thêm mới Điều khoản Thanh toán (AP Payment Term Entry)</Title>
        <Divider mb="xl" />

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                required
                label="Tên điều khoản thanh toán"
                placeholder="Ví dụ: 30 Net"
                {...form.getInputProps("termName")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                required
                label="Trạng thái"
                data={[
                  { value: "ACTIVE", label: "Hoạt động (ACTIVE)" },
                  { value: "INACTIVE", label: "Ngừng hoạt động (INACTIVE)" }
                ]}
                {...form.getInputProps("status")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <NumberInput
                label="Số ngày chốt thanh toán (Cutoff Day)"
                placeholder="Ví dụ: 30"
                {...form.getInputProps("cutoffDay")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                type="date"
                label="Có hiệu lực từ ngày"
                {...form.getInputProps("effectiveFrom")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                type="date"
                label="Có hiệu lực đến ngày"
                {...form.getInputProps("effectiveTo")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <NumberInput
                label="Độ ưu tiên điều khoản (Rank No.)"
                placeholder="Ví dụ: 1"
                {...form.getInputProps("rankNo")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 8 }}>
              <TextInput
                label="Mô tả điều khoản"
                placeholder="Nhập ghi chú chi tiết về điều khoản..."
                {...form.getInputProps("description")}
              />
            </Grid.Col>
          </Grid>

          <Group justify="flex-end" mt="xl" pt="md" style={{ borderTop: "1px solid #dee2e6" }}>
            <Button variant="outline" color="gray" onClick={() => navigate("/ApPaymentTerm/ApPaymentTermList")}>
              Hủy bỏ
            </Button>
            <Button type="submit" color="blue" leftSection={<IconDeviceFloppy size={18} />}>
              Lưu điều khoản
            </Button>
          </Group>
        </form>
      </Card>
    </Box>
  );
}

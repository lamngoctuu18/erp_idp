import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "@mantine/form";
import { Box, Card, Title, TextInput, Select, Group, Button, Grid, Divider, Text, Center, Loader, NumberInput } from "@mantine/core";
import { IconArrowLeft, IconDeviceFloppy } from "@tabler/icons-react";
import { apPaymentTermService } from "../../api/apVendor/apPaymentMockService";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

export default function EditApPaymentTerm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const form = useForm({
    initialValues: {
      termName: "",
      description: "",
      cutoffDay: 30,
      effectiveFrom: "",
      effectiveTo: "",
      rankNo: 1,
      status: "ACTIVE"
    },
    validate: {
      termName: (val: any) => (val ? null : "Tên điều khoản bắt buộc nhập")
    }
  });

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const res = await apPaymentTermService.getById(Number(id));
        if (res.success && res.data) {
          form.setValues({
            termName: res.data.termName,
            description: res.data.description || "",
            cutoffDay: res.data.cutoffDay || 0,
            effectiveFrom: res.data.effectiveFrom ? res.data.effectiveFrom.substring(0, 10) : "",
            effectiveTo: res.data.effectiveTo ? res.data.effectiveTo.substring(0, 10) : "",
            rankNo: res.data.rankNo || 1,
            status: res.data.status || "ACTIVE"
          });
        } else {
          NotificationExtension.Fails(res.message || "Không tải được dữ liệu.");
          navigate("/ApPaymentTerm/ApPaymentTermList");
        }
      } catch {
        NotificationExtension.Fails("Lỗi khi tải thông tin điều khoản.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleSubmit = async (values: typeof form.values) => {
    if (!id) return;
    try {
      const res = await apPaymentTermService.update(Number(id), {
        termName: values.termName,
        description: values.description || null,
        cutoffDay: values.cutoffDay ? Number(values.cutoffDay) : null,
        effectiveFrom: values.effectiveFrom || null,
        effectiveTo: values.effectiveTo || null,
        rankNo: values.rankNo ? Number(values.rankNo) : null,
        status: values.status || null
      });

      if (res.success) {
        NotificationExtension.Success("Cập nhật điều khoản thanh toán thành công!");
        navigate("/ApPaymentTerm/ApPaymentTermList");
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
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/ApPaymentTerm/ApPaymentTermList")}>
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="xl">
        <Title order={3} mb="xs">Cập nhật Điều khoản Thanh toán</Title>
        <Text size="sm" c="dimmed" mb="lg">Mã điều khoản (ID): <b>{id}</b></Text>
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
              Cập nhật điều khoản
            </Button>
          </Group>
        </form>
      </Card>
    </Box>
  );
}

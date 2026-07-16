import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "@mantine/form";
import { Box, Card, Title, TextInput, Select, Group, Button, Grid, Divider, Text, Center, Loader } from "@mantine/core";
import { IconArrowLeft, IconDeviceFloppy } from "@tabler/icons-react";
import { apHoldDefinitionService } from "../../api/apVendor/apInvoiceMasterMockService";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

export default function EditApHoldDefinition() {
  const { id } = useParams<{ id: string }>(); // id holds the holdCode string
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const form = useForm({
    initialValues: {
      holdName: "",
      holdReason: "",
      systemFlag: "N",
      manualReleaseAllowedFlag: "Y",
      activeFlag: "Y"
    },
    validate: {
      holdName: (val: any) => (val ? null : "Tên lý do bắt buộc nhập")
    }
  });

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const res = await apHoldDefinitionService.getById(id);
        if (res.success && res.data) {
          form.setValues({
            holdName: res.data.holdName,
            holdReason: res.data.holdReason || "",
            systemFlag: res.data.systemFlag || "N",
            manualReleaseAllowedFlag: res.data.manualReleaseAllowedFlag || "Y",
            activeFlag: res.data.activeFlag || "Y"
          });
        } else {
          NotificationExtension.Fails(res.message || "Không tải được dữ liệu.");
          navigate("/ApHoldDefinition/ApHoldDefinitionList");
        }
      } catch {
        NotificationExtension.Fails("Lỗi khi tải thông tin lý do khóa giữ.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleSubmit = async (values: typeof form.values) => {
    if (!id) return;
    try {
      const res = await apHoldDefinitionService.update(id, {
        holdName: values.holdName,
        holdReason: values.holdReason || null,
        systemFlag: values.systemFlag,
        manualReleaseAllowedFlag: values.manualReleaseAllowedFlag,
        activeFlag: values.activeFlag
      });

      if (res.success) {
        NotificationExtension.Success("Cập nhật lý do khóa giữ thành công!");
        navigate("/ApHoldDefinition/ApHoldDefinitionList");
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
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/ApHoldDefinition/ApHoldDefinitionList")}>
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="xl">
        <Title order={3} mb="xs">Cập nhật Lý do khóa giữ hóa đơn</Title>
        <Text size="sm" c="dimmed" mb="lg">Mã khóa giữ (Hold Code): <b>{id}</b></Text>
        <Divider mb="xl" />

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                required
                label="Tên lý do khóa giữ"
                placeholder="Ví dụ: Chênh lệch đơn giá mua"
                {...form.getInputProps("holdName")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                required
                label="Do hệ thống áp tự động (System Flag)"
                data={[
                  { value: "Y", label: "Có (System Hold)" },
                  { value: "N", label: "Không (Manual Hold)" }
                ]}
                {...form.getInputProps("systemFlag")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                required
                label="Cho phép kế toán mở thủ công"
                data={[
                  { value: "Y", label: "Được giải tỏa thủ công" },
                  { value: "N", label: "Bắt buộc sửa lỗi gốc để giải tỏa" }
                ]}
                {...form.getInputProps("manualReleaseAllowedFlag")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                required
                label="Trạng thái hiệu lực"
                data={[
                  { value: "Y", label: "Đang hoạt động" },
                  { value: "N", label: "Ngừng sử dụng" }
                ]}
                {...form.getInputProps("activeFlag")}
              />
            </Grid.Col>

            <Grid.Col span={12}>
              <TextInput
                label="Diễn giải lý do chi tiết"
                placeholder="Mô tả kỹ điều kiện xảy ra lỗi này..."
                {...form.getInputProps("holdReason")}
              />
            </Grid.Col>
          </Grid>

          <Group justify="flex-end" mt="xl" pt="md" style={{ borderTop: "1px solid #dee2e6" }}>
            <Button variant="outline" color="gray" onClick={() => navigate("/ApHoldDefinition/ApHoldDefinitionList")}>
              Hủy bỏ
            </Button>
            <Button type="submit" color="blue" leftSection={<IconDeviceFloppy size={18} />}>
              Cập nhật cấu hình
            </Button>
          </Group>
        </form>
      </Card>
    </Box>
  );
}

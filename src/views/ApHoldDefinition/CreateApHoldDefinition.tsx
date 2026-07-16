import { useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";
import { Box, Card, Title, TextInput, Select, Group, Button, Grid, Divider } from "@mantine/core";
import { IconArrowLeft, IconDeviceFloppy } from "@tabler/icons-react";
import { apHoldDefinitionService } from "../../api/apVendor/apInvoiceMasterMockService";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

export default function CreateApHoldDefinition() {
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      holdCode: "",
      holdName: "",
      holdReason: "",
      systemFlag: "N",
      manualReleaseAllowedFlag: "Y",
      activeFlag: "Y"
    },
    validate: {
      holdCode: (val: any) => (val ? null : "Mã lỗi bắt buộc nhập"),
      holdName: (val: any) => (val ? null : "Tên lý do bắt buộc nhập")
    }
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const res = await apHoldDefinitionService.create({
        holdCode: values.holdCode.toUpperCase().trim(),
        holdName: values.holdName,
        holdReason: values.holdReason || null,
        systemFlag: values.systemFlag,
        manualReleaseAllowedFlag: values.manualReleaseAllowedFlag,
        activeFlag: values.activeFlag,
        createdBy: 1,
        createdDate: new Date().toISOString().substring(0, 10),
        lastUpdateBy: 1,
        lastUpdateDate: new Date().toISOString().substring(0, 10)
      });

      if (res.success) {
        NotificationExtension.Success("Thêm mới lý do khóa giữ thành công!");
        navigate("/ApHoldDefinition/ApHoldDefinitionList");
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
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/ApHoldDefinition/ApHoldDefinitionList")}>
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="xl">
        <Title order={3} mb="xs">Thêm mới Lý do khóa giữ (AP Hold Definition Entry)</Title>
        <Divider mb="xl" />

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                required
                label="Mã lỗi khóa giữ (Hold Code)"
                placeholder="Ví dụ: PRICE VARIANCE"
                {...form.getInputProps("holdCode")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                required
                label="Tên lý do khóa giữ"
                placeholder="Ví dụ: Chênh lệch đơn giá mua"
                {...form.getInputProps("holdName")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
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

            <Grid.Col span={{ base: 12, md: 4 }}>
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

            <Grid.Col span={{ base: 12, md: 4 }}>
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
              Lưu lý do khóa giữ
            </Button>
          </Group>
        </form>
      </Card>
    </Box>
  );
}

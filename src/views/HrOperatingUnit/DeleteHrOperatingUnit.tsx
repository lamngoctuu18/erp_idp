import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Card, Title, Text, Button, Group, Center, Loader } from "@mantine/core";
import { IconAlertTriangle, IconArrowLeft, IconTrash } from "@tabler/icons-react";
import { hrOperatingUnitService } from "../../api/sharedConfig/sharedConfigMockService";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";
import { HrOperatingUnit } from "../../model/SharedConfigModel";

export default function DeleteHrOperatingUnit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [unit, setUnit] = useState<HrOperatingUnit | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkDelete = async () => {
      if (!id) return;
      try {
        const res = await hrOperatingUnitService.getById(Number(id));
        if (res.success && res.data) {
          setUnit(res.data);
        } else {
          NotificationExtension.Fails(res.message || "Không tìm thấy Đơn vị hoạt động.");
          navigate("/HrOperatingUnit/HrOperatingUnitList");
        }
      } catch {
        NotificationExtension.Fails("Lỗi kiểm tra thông tin Đơn vị hoạt động.");
      } finally {
        setLoading(false);
      }
    };

    checkDelete();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!id) return;
    try {
      const res = await hrOperatingUnitService.delete(Number(id));
      if (res.success) {
        NotificationExtension.Success("Xóa Đơn vị hoạt động thành công!");
        navigate("/HrOperatingUnit/HrOperatingUnitList");
      } else {
        NotificationExtension.Fails(res.message || "Lỗi khi xóa.");
      }
    } catch {
      NotificationExtension.Fails("Lỗi khi kết nối Mock API.");
    }
  };

  if (loading) {
    return (
      <Center style={{ height: "300px" }}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (!unit) return null;

  return (
    <Box>
      <Group justify="space-between" align="center" mb="lg">
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/HrOperatingUnit/HrOperatingUnitList")}>
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="lg">
        <Group mb="md">
          <IconAlertTriangle size={28} color="orange" />
          <Title order={3} c="orange">Xác nhận xóa Đơn vị hoạt động</Title>
        </Group>

        <Text mb="md">
          Mã đơn vị: <b>{unit.orgId}</b> | Tên Đơn vị hoạt động: <b>{unit.name}</b> (Sổ cái liên kết: {unit.setOfBooksName || "N/A"})
        </Text>

        <Box>
          <Text size="sm" mb="lg">
            Bạn có chắc chắn muốn xóa vĩnh viễn đơn vị hoạt động này khỏi hệ thống? Hành động này không thể hoàn tác.
          </Text>
          <Group>
            <Button color="red" leftSection={<IconTrash size={16} />} onClick={handleDelete}>
              Xác nhận xóa vĩnh viễn
            </Button>
            <Button variant="outline" color="gray" onClick={() => navigate("/HrOperatingUnit/HrOperatingUnitList")}>
              Hủy bỏ
            </Button>
          </Group>
        </Box>
      </Card>
    </Box>
  );
}

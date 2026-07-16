import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Card, Title, Text, Button, Group, Center, Loader } from "@mantine/core";
import { IconAlertTriangle, IconArrowLeft, IconTrash } from "@tabler/icons-react";
import { apVendorMergeHistoryService } from "../../api/apVendor/apVendorMasterMockService";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";
import { ApVendorMergeHistory } from "../../model/ApVendorMasterModel";

export default function DeleteApVendorMergeHistory() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [mergeInfo, setMergeInfo] = useState<ApVendorMergeHistory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkDelete = async () => {
      if (!id) return;
      try {
        const res = await apVendorMergeHistoryService.getById(Number(id));
        if (res.success && res.data) {
          setMergeInfo(res.data);
        } else {
          NotificationExtension.Fails(res.message || "Không tìm thấy lịch sử gộp.");
          navigate("/ApVendorMergeHistory/ApVendorMergeHistoryList");
        }
      } catch {
        NotificationExtension.Fails("Lỗi kiểm tra thông tin lịch sử gộp.");
      } finally {
        setLoading(false);
      }
    };

    checkDelete();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!id) return;
    try {
      const res = await apVendorMergeHistoryService.delete(Number(id));
      if (res.success) {
        NotificationExtension.Success("Xóa lịch sử gộp nhà cung cấp thành công!");
        navigate("/ApVendorMergeHistory/ApVendorMergeHistoryList");
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

  if (!mergeInfo) return null;

  return (
    <Box>
      <Group justify="space-between" align="center" mb="lg">
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/ApVendorMergeHistory/ApVendorMergeHistoryList")}>
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="lg">
        <Group mb="md">
          <IconAlertTriangle size={28} color="orange" />
          <Title order={3} c="orange">Xác nhận xóa Lịch sử Gộp nhà cung cấp</Title>
        </Group>

        <Text mb="md">
          Mã giao dịch gộp: <b>{mergeInfo.mergeId}</b> | Gộp từ nhà cung cấp: <b>{mergeInfo.fromVendorName}</b> sang <b>{mergeInfo.toVendorName}</b>
        </Text>

        <Box>
          <Text size="sm" mb="lg">
            Bạn có chắc chắn muốn xóa vĩnh viễn dòng lịch sử gộp nhà cung cấp này? Lưu ý: Hành động này chỉ xóa bản ghi nhật ký gộp lịch sử, không đảo ngược dữ liệu công nợ/PO đã gộp trên thực tế.
          </Text>
          <Group>
            <Button color="red" leftSection={<IconTrash size={16} />} onClick={handleDelete}>
              Xác nhận xóa vĩnh viễn
            </Button>
            <Button variant="outline" color="gray" onClick={() => navigate("/ApVendorMergeHistory/ApVendorMergeHistoryList")}>
              Hủy bỏ
            </Button>
          </Group>
        </Box>
      </Card>
    </Box>
  );
}

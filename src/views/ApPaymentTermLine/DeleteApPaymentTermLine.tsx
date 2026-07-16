import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Card, Title, Text, Button, Group, Center, Loader } from "@mantine/core";
import { IconAlertTriangle, IconArrowLeft, IconTrash } from "@tabler/icons-react";
import { apPaymentTermLineService } from "../../api/apVendor/apPaymentMockService";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";
import { ApPaymentTermLine } from "../../model/ApPaymentModel";

export default function DeleteApPaymentTermLine() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [line, setLine] = useState<ApPaymentTermLine | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkDelete = async () => {
      if (!id) return;
      try {
        const res = await apPaymentTermLineService.getById(Number(id));
        if (res.success && res.data) {
          setLine(res.data);
        } else {
          NotificationExtension.Fails(res.message || "Không tìm thấy dòng điều khoản.");
          navigate("/ApPaymentTermLine/ApPaymentTermLineList");
        }
      } catch {
        NotificationExtension.Fails("Lỗi kiểm tra thông tin dòng điều khoản.");
      } finally {
        setLoading(false);
      }
    };

    checkDelete();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!id) return;
    try {
      const res = await apPaymentTermLineService.delete(Number(id));
      if (res.success) {
        NotificationExtension.Success("Xóa dòng điều khoản thành công!");
        navigate("/ApPaymentTermLine/ApPaymentTermLineList");
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

  if (!line) return null;

  return (
    <Box>
      <Group justify="space-between" align="center" mb="lg">
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/ApPaymentTermLine/ApPaymentTermLineList")}>
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="lg">
        <Group mb="md">
          <IconAlertTriangle size={28} color="orange" />
          <Title order={3} c="orange">Xác nhận xóa Dòng điều khoản chi tiết</Title>
        </Group>

        <Text mb="md">
          Mã số dòng: <b>{line.termLineId}</b> | Thứ tự số: <b>{line.lineNum}</b> | Thuộc điều khoản: <b>{line.termName}</b>
        </Text>
        <Text size="sm" mb="md" c="dimmed">
          Tỷ lệ thanh toán đến hạn: {line.duePercent}% | Số ngày nợ được gia hạn: {line.days} ngày
        </Text>

        <Box>
          <Text size="sm" mb="lg">
            Bạn có chắc chắn muốn xóa vĩnh viễn dòng cấu hình điều khoản chi tiết này? Hành động này không thể hoàn tác.
          </Text>
          <Group>
            <Button color="red" leftSection={<IconTrash size={16} />} onClick={handleDelete}>
              Xác nhận xóa vĩnh viễn
            </Button>
            <Button variant="outline" color="gray" onClick={() => navigate("/ApPaymentTermLine/ApPaymentTermLineList")}>
              Hủy bỏ
            </Button>
          </Group>
        </Box>
      </Card>
    </Box>
  );
}

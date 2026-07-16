import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Card, Title, Text, Button, Group, Center, Loader, Alert } from "@mantine/core";
import { IconAlertTriangle, IconArrowLeft, IconTrash } from "@tabler/icons-react";
import { apPaymentBatchService } from "../../api/apVendor/apPaymentMockService";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";
import { ApPaymentBatch } from "../../model/ApPaymentModel";

export default function DeleteApPaymentBatch() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [batch, setBatch] = useState<ApPaymentBatch | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkDelete = async () => {
      if (!id) return;
      try {
        const res = await apPaymentBatchService.getById(Number(id));
        if (res.success && res.data) {
          setBatch(res.data);
        } else {
          NotificationExtension.Fails(res.message || "Không tìm thấy lô thanh toán.");
          navigate("/ApPaymentBatch/ApPaymentBatchList");
        }
      } catch {
        NotificationExtension.Fails("Lỗi kiểm tra thông tin lô thanh toán.");
      } finally {
        setLoading(false);
      }
    };

    checkDelete();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!id) return;
    try {
      const res = await apPaymentBatchService.delete(Number(id));
      if (res.success) {
        NotificationExtension.Success("Xóa lô thanh toán thành công!");
        navigate("/ApPaymentBatch/ApPaymentBatchList");
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

  if (!batch) return null;

  const canDelete = batch.status !== "APPROVED";

  return (
    <Box>
      <Group justify="space-between" align="center" mb="lg">
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/ApPaymentBatch/ApPaymentBatchList")}>
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="lg">
        <Group mb="md">
          <IconAlertTriangle size={28} color={canDelete ? "orange" : "red"} />
          <Title order={3} c={canDelete ? "orange" : "red"}>
            {canDelete ? "Xác nhận xóa Lô thanh toán" : "Không thể xóa Lô thanh toán này"}
          </Title>
        </Group>

        <Text mb="md">
          Mã số: <b>{batch.batchId}</b> | Tên lô: <b>{batch.batchName}</b> | Tổng tiền: <b>{batch.totalAmount?.toLocaleString("vi-VN")} VND</b> | Trạng thái: <b>{batch.status}</b>
        </Text>

        {!canDelete ? (
          <Box>
            <Alert color="red" icon={<IconAlertTriangle size={16} />} title="Lô đã được phê duyệt:">
              <Text size="sm">
                Lô thanh toán có trạng thái <b>APPROVED</b> đã hoàn thành giao dịch kế toán, không thể xóa để tránh mất dấu vết dòng tiền.
              </Text>
            </Alert>
          </Box>
        ) : (
          <Box>
            <Text size="sm" mb="lg">
              Bạn có chắc chắn muốn xóa vĩnh viễn lô thanh toán nháp này? Hành động này không thể hoàn tác.
            </Text>
            <Group>
              <Button color="red" leftSection={<IconTrash size={16} />} onClick={handleDelete}>
                Xác nhận xóa vĩnh viễn
              </Button>
              <Button variant="outline" color="gray" onClick={() => navigate("/ApPaymentBatch/ApPaymentBatchList")}>
                Hủy bỏ
              </Button>
            </Group>
          </Box>
        )}
      </Card>
    </Box>
  );
}

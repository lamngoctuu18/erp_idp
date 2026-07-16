import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Card, Title, Text, Button, Group, Center, Loader, Alert, Badge } from "@mantine/core";
import { IconAlertTriangle, IconArrowLeft, IconTrash } from "@tabler/icons-react";
import { apInvoiceBatchService, apInvoiceMasterService } from "../../api/apVendor/apInvoiceMasterMockService";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";
import { ApInvoiceBatch, ApInvoice } from "../../model/ApInvoiceMasterModel";

export default function DeleteApInvoiceBatch() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [batch, setBatch] = useState<ApInvoiceBatch | null>(null);
  const [loading, setLoading] = useState(true);
  const [blockingInvoices, setBlockingInvoices] = useState<ApInvoice[]>([]);

  useEffect(() => {
    const checkDelete = async () => {
      if (!id) return;
      try {
        const res = await apInvoiceBatchService.getById(Number(id));
        if (res.success && res.data) {
          setBatch(res.data);

          // Kiểm tra xem có hóa đơn nào liên kết trong lô này không
          const invRes = await apInvoiceMasterService.getList({ batchId: Number(id), take: 100 });
          if (invRes.success && invRes.data) {
            setBlockingInvoices(invRes.data.items);
          }
        } else {
          NotificationExtension.Fails(res.message || "Không tìm thấy lô hóa đơn.");
          navigate("/ApInvoiceBatch/ApInvoiceBatchList");
        }
      } catch {
        NotificationExtension.Fails("Lỗi kiểm tra thông tin lô hóa đơn.");
      } finally {
        setLoading(false);
      }
    };

    checkDelete();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!id) return;
    try {
      const res = await apInvoiceBatchService.delete(Number(id));
      if (res.success) {
        NotificationExtension.Success("Xóa lô hóa đơn thành công!");
        navigate("/ApInvoiceBatch/ApInvoiceBatchList");
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

  const canDelete = blockingInvoices.length === 0;

  return (
    <Box>
      <Group justify="space-between" align="center" mb="lg">
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/ApInvoiceBatch/ApInvoiceBatchList")}>
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="lg">
        <Group mb="md">
          <IconAlertTriangle size={28} color={canDelete ? "orange" : "red"} />
          <Title order={3} c={canDelete ? "orange" : "red"}>
            {canDelete ? "Xác nhận xóa Lô hóa đơn" : "Không thể xóa Lô hóa đơn này"}
          </Title>
        </Group>

        <Text mb="md">
          Mã số lô: <b>{batch.batchId}</b> | Tên lô: <b>{batch.batchName}</b> | Tổng tiền thực tế: <b>{batch.actualAmount?.toLocaleString()} {batch.invoiceCurrencyCode}</b>
        </Text>

        {!canDelete ? (
          <Box>
            <Alert color="red" icon={<IconAlertTriangle size={16} />} title="Đang chứa hóa đơn liên kết:">
              <Text size="sm" mb="xs">
                Không thể xóa lô này khi vẫn còn các hóa đơn mua hàng bên trong. Vui lòng chuyển các hóa đơn sang lô khác hoặc xóa hóa đơn trước.
              </Text>
              <Box mt="xs">
                {blockingInvoices.map((inv) => (
                  <Badge key={inv.invoiceId} color="gray" mr="xs" mb="xs" style={{ cursor: "pointer" }} onClick={() => navigate(`/ApInvoice/ApInvoiceDetail/${inv.invoiceId}`)}>
                    {inv.invoiceNum}
                  </Badge>
                ))}
              </Box>
            </Alert>
          </Box>
        ) : (
          <Box>
            <Text size="sm" mb="lg">
              Lô hóa đơn này hiện trống. Bạn có chắc chắn muốn xóa vĩnh viễn? Hành động này không thể hoàn tác.
            </Text>
            <Group>
              <Button color="red" leftSection={<IconTrash size={16} />} onClick={handleDelete}>
                Xác nhận xóa vĩnh viễn
              </Button>
              <Button variant="outline" color="gray" onClick={() => navigate("/ApInvoiceBatch/ApInvoiceBatchList")}>
                Hủy bỏ
              </Button>
            </Group>
          </Box>
        )}
      </Card>
    </Box>
  );
}

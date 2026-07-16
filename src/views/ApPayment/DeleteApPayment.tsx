import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Card, Title, Text, Button, List, Alert, Group, Center, Loader } from "@mantine/core";
import { IconAlertTriangle, IconArrowLeft, IconTrash } from "@tabler/icons-react";
import { apPaymentService, apInvoicePaymentService } from "../../api/apVendor/apPaymentMockService";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";
import { ApPayment, ApInvoicePayment } from "../../model/ApPaymentModel";

export default function DeleteApPayment() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [payment, setPayment] = useState<ApPayment | null>(null);
  const [loading, setLoading] = useState(true);
  const [blockingInvoicePayments, setBlockingInvoicePayments] = useState<ApInvoicePayment[]>([]);

  useEffect(() => {
    const checkDelete = async () => {
      if (!id) return;
      try {
        const payRes = await apPaymentService.getById(Number(id));
        if (payRes.success && payRes.data) {
          setPayment(payRes.data);

          // Kiểm tra xem đã có hóa đơn nào phân bổ từ phiếu chi này chưa
          const ipRes = await apInvoicePaymentService.getList({ paymentId: Number(id), take: 100 });
          if (ipRes.success && ipRes.data) {
            setBlockingInvoicePayments(ipRes.data.items);
          }
        } else {
          NotificationExtension.Fails(payRes.message || "Không tìm thấy phiếu chi.");
          navigate("/ApPayment/ApPaymentList");
        }
      } catch {
        NotificationExtension.Fails("Lỗi kiểm tra điều kiện xóa phiếu chi.");
      } finally {
        setLoading(false);
      }
    };

    checkDelete();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!id) return;
    try {
      const res = await apPaymentService.delete(Number(id));
      if (res.success) {
        NotificationExtension.Success("Xóa phiếu chi thành công!");
        navigate("/ApPayment/ApPaymentList");
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

  if (!payment) return null;

  const canDelete = blockingInvoicePayments.length === 0;

  return (
    <Box>
      <Group justify="space-between" align="center" mb="lg">
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/ApPayment/ApPaymentList")}>
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="lg">
        <Group mb="md">
          <IconAlertTriangle size={28} color={canDelete ? "orange" : "red"} />
          <Title order={3} c={canDelete ? "orange" : "red"}>
            {canDelete ? "Xác nhận xóa Phiếu Chi" : "Không thể xóa Phiếu chi này"}
          </Title>
        </Group>

        <Text mb="md">
          Mã số phiếu chi: <b>{payment.paymentNumber}</b> | Số tiền: <b>{payment.amount?.toLocaleString("vi-VN")} {payment.currencyCode}</b> | Thụ hưởng: <b>{payment.vendorName}</b>
        </Text>

        {!canDelete ? (
          <Box>
            <Alert color="red" icon={<IconAlertTriangle size={16} />} title="Có phân bổ thanh toán hóa đơn liên kết:">
              <Text size="sm" mb="xs">
                Không thể xóa phiếu chi này khi số tiền đã được đối trừ thanh toán cho các hóa đơn dưới đây.
              </Text>
              <List size="sm" withPadding>
                {blockingInvoicePayments.map((ip) => (
                  <List.Item key={ip.invoicePaymentId}>
                    Phân bổ hạch toán ID: <b>{ip.invoicePaymentId}</b> | Hóa đơn: <b>{ip.invoiceNum}</b> (Số tiền: {ip.amount?.toLocaleString("vi-VN")} {ip.currencyCode})
                  </List.Item>
                ))}
              </List>
            </Alert>

            <Alert color="blue" title="Hướng dẫn xử lý:" mt="md">
              <Text size="sm">
                Vui lòng xóa các bản ghi Phân bổ thanh toán hóa đơn liên kết trước khi thực hiện xóa phiếu chi này.
              </Text>
            </Alert>
          </Box>
        ) : (
          <Box>
            <Text size="sm" mb="lg">
              Phiếu chi này hiện không có phân bổ đối trừ hóa đơn nào. Bạn có chắc chắn muốn xóa vĩnh viễn? Hành động này không thể hoàn tác.
            </Text>
            <Group>
              <Button color="red" leftSection={<IconTrash size={16} />} onClick={handleDelete}>
                Xác nhận xóa vĩnh viễn
              </Button>
              <Button variant="outline" color="gray" onClick={() => navigate("/ApPayment/ApPaymentList")}>
                Hủy bỏ
              </Button>
            </Group>
          </Box>
        )}
      </Card>
    </Box>
  );
}

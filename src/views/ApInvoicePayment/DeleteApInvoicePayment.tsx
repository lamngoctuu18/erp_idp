import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Card, Title, Text, Button, Group, Center, Loader } from "@mantine/core";
import { IconAlertTriangle, IconArrowLeft, IconTrash } from "@tabler/icons-react";
import { apInvoicePaymentService } from "../../api/apVendor/apPaymentMockService";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";
import { ApInvoicePayment } from "../../model/ApPaymentModel";

export default function DeleteApInvoicePayment() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [payment, setPayment] = useState<ApInvoicePayment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkDelete = async () => {
      if (!id) return;
      try {
        const res = await apInvoicePaymentService.getById(Number(id));
        if (res.success && res.data) {
          setPayment(res.data);
        } else {
          NotificationExtension.Fails(res.message || "Không tìm thấy phân bổ thanh toán.");
          navigate("/ApInvoicePayment/ApInvoicePaymentList");
        }
      } catch {
        NotificationExtension.Fails("Lỗi kiểm tra thông tin phân bổ thanh toán.");
      } finally {
        setLoading(false);
      }
    };

    checkDelete();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!id) return;
    try {
      const res = await apInvoicePaymentService.delete(Number(id));
      if (res.success) {
        NotificationExtension.Success("Xóa phân bổ đối trừ hóa đơn thành công!");
        navigate("/ApInvoicePayment/ApInvoicePaymentList");
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

  return (
    <Box>
      <Group justify="space-between" align="center" mb="lg">
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/ApInvoicePayment/ApInvoicePaymentList")}>
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="lg">
        <Group mb="md">
          <IconAlertTriangle size={28} color="orange" />
          <Title order={3} c="orange">Xác nhận xóa Phân bổ Thanh toán Hóa đơn</Title>
        </Group>

        <Text mb="md">
          Mã số: <b>{payment.invoicePaymentId}</b> | Hóa đơn đối trừ: <b>{payment.invoiceNum}</b> | Số tiền đối trừ: <b>{payment.amount?.toLocaleString("vi-VN")} {payment.currencyCode}</b>
        </Text>

        <Box>
          <Text size="sm" mb="lg">
            Bạn có chắc chắn muốn xóa vĩnh viễn dòng phân bổ đối trừ hóa đơn này? Thao tác này sẽ hoàn trả số tiền nợ còn lại trong lịch trả nợ dự kiến của hóa đơn tương ứng.
          </Text>
          <Group>
            <Button color="red" leftSection={<IconTrash size={16} />} onClick={handleDelete}>
              Xác nhận xóa vĩnh viễn
            </Button>
            <Button variant="outline" color="gray" onClick={() => navigate("/ApInvoicePayment/ApInvoicePaymentList")}>
              Hủy bỏ
            </Button>
          </Group>
        </Box>
      </Card>
    </Box>
  );
}

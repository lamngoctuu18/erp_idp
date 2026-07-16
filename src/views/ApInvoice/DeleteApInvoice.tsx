import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Card, Title, Text, Button, Group, Center, Loader, Alert } from "@mantine/core";
import { IconAlertTriangle, IconArrowLeft, IconTrash } from "@tabler/icons-react";
import { apInvoiceMasterService } from "../../api/apVendor/apInvoiceMasterMockService";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";
import { ApInvoice } from "../../model/ApInvoiceMasterModel";

export default function DeleteApInvoice() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState<ApInvoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkDelete = async () => {
      if (!id) return;
      try {
        const res = await apInvoiceMasterService.getById(Number(id));
        if (res.success && res.data) {
          setInvoice(res.data);
        } else {
          NotificationExtension.Fails(res.message || "Không tìm thấy hóa đơn.");
          navigate("/ApInvoice/ApInvoiceList");
        }
      } catch {
        NotificationExtension.Fails("Lỗi kiểm tra thông tin hóa đơn.");
      } finally {
        setLoading(false);
      }
    };

    checkDelete();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!id) return;
    try {
      const res = await apInvoiceMasterService.delete(Number(id));
      if (res.success) {
        NotificationExtension.Success("Xóa hóa đơn mua hàng thành công!");
        navigate("/ApInvoice/ApInvoiceList");
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

  if (!invoice) return null;

  const canDelete = (invoice.amountPaid || 0) === 0;

  return (
    <Box>
      <Group justify="space-between" align="center" mb="lg">
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/ApInvoice/ApInvoiceList")}>
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="lg">
        <Group mb="md">
          <IconAlertTriangle size={28} color={canDelete ? "orange" : "red"} />
          <Title order={3} c={canDelete ? "orange" : "red"}>
            {canDelete ? "Xác nhận xóa Hóa đơn mua hàng" : "Không thể xóa Hóa đơn này"}
          </Title>
        </Group>

        <Text mb="md">
          Mã số: <b>{invoice.invoiceId}</b> | Số hóa đơn: <b>{invoice.invoiceNum}</b> | Tổng tiền: <b>{invoice.invoiceAmount?.toLocaleString()} {invoice.invoiceCurrencyCode}</b> | Số tiền đã trả: <b>{invoice.amountPaid?.toLocaleString()} {invoice.invoiceCurrencyCode}</b>
        </Text>

        {!canDelete ? (
          <Box>
            <Alert color="red" icon={<IconAlertTriangle size={16} />} title="Hóa đơn đã được thanh toán:">
              <Text size="sm">
                Hóa đơn đã có dòng tiền chi trả thanh toán thực tế ghi nhận, không thể xóa để tránh lỗi đồng bộ công nợ và sổ cái chính.
              </Text>
            </Alert>
          </Box>
        ) : (
          <Box>
            <Text size="sm" mb="lg">
              Bạn có chắc chắn muốn xóa vĩnh viễn hóa đơn mua hàng này? Mọi thông tin Dòng chi tiết (ApInvoiceLine) và Dòng hạch toán (ApInvoiceDistribution) liên kết sẽ bị xóa sạch. Hành động này không thể hoàn tác.
            </Text>
            <Group>
              <Button color="red" leftSection={<IconTrash size={16} />} onClick={handleDelete}>
                Xác nhận xóa vĩnh viễn
              </Button>
              <Button variant="outline" color="gray" onClick={() => navigate("/ApInvoice/ApInvoiceList")}>
                Hủy bỏ
              </Button>
            </Group>
          </Box>
        )}
      </Card>
    </Box>
  );
}

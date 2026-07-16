import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Card, Title, Text, Button, Group, Center, Loader } from "@mantine/core";
import { IconAlertTriangle, IconArrowLeft, IconTrash } from "@tabler/icons-react";
import { apPaymentTermDiscountService } from "../../api/apVendor/apPaymentMockService";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";
import { ApPaymentTermDiscount } from "../../model/ApPaymentModel";

export default function DeleteApPaymentTermDiscount() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [discount, setDiscount] = useState<ApPaymentTermDiscount | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkDelete = async () => {
      if (!id) return;
      try {
        const res = await apPaymentTermDiscountService.getById(Number(id));
        if (res.success && res.data) {
          setDiscount(res.data);
        } else {
          NotificationExtension.Fails(res.message || "Không tìm thấy chiết khấu.");
          navigate("/ApPaymentTermDiscount/ApPaymentTermDiscountList");
        }
      } catch {
        NotificationExtension.Fails("Lỗi kiểm tra thông tin chiết khấu.");
      } finally {
        setLoading(false);
      }
    };

    checkDelete();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!id) return;
    try {
      const res = await apPaymentTermDiscountService.delete(Number(id));
      if (res.success) {
        NotificationExtension.Success("Xóa chiết khấu điều khoản thành công!");
        navigate("/ApPaymentTermDiscount/ApPaymentTermDiscountList");
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

  if (!discount) return null;

  return (
    <Box>
      <Group justify="space-between" align="center" mb="lg">
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/ApPaymentTermDiscount/ApPaymentTermDiscountList")}>
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="lg">
        <Group mb="md">
          <IconAlertTriangle size={28} color="orange" />
          <Title order={3} c="orange">Xác nhận xóa Chiết khấu Điều khoản</Title>
        </Group>

        <Text mb="md">
          Mã số chiết khấu: <b>{discount.discountId}</b> | Bậc chiết khấu: <b>Cấp {discount.discountLevel}</b> | Tỷ lệ: <b>{discount.discountPercent}%</b> | Thuộc: <b>{discount.termName}</b>
        </Text>

        <Box>
          <Text size="sm" mb="lg">
            Bạn có chắc chắn muốn xóa vĩnh viễn dòng cấu hình chiết khấu này? Hành động này không thể hoàn tác.
          </Text>
          <Group>
            <Button color="red" leftSection={<IconTrash size={16} />} onClick={handleDelete}>
              Xác nhận xóa vĩnh viễn
            </Button>
            <Button variant="outline" color="gray" onClick={() => navigate("/ApPaymentTermDiscount/ApPaymentTermDiscountList")}>
              Hủy bỏ
            </Button>
          </Group>
        </Box>
      </Card>
    </Box>
  );
}

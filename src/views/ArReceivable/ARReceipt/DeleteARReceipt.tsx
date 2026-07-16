import { useEffect, useState } from "react";
import { Box, Button, Card, Flex, Title, Text, Stack } from "@mantine/core";
import { IconArrowLeft, IconTrash } from "@tabler/icons-react";
import { useNavigate, useParams } from "react-router-dom";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import { arCashService } from "../services/arCashService";
import { ARMockStorage } from "../mock/arMockStorage";

export default function DeleteARReceipt() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [receipt, setReceipt] = useState<any>(null);

  useEffect(() => {
    if (id) {
      arCashService.getById(Number(id)).then(res => {
        if (res.success) setReceipt(res.data);
      });
    }
  }, [id]);

  const handleDelete = async () => {
    try {
      const list = ARMockStorage.getReceipts();
      const filtered = list.filter(x => x.receiptId !== Number(id));
      localStorage.setItem("ar_receipts", JSON.stringify(filtered));
      NotificationExtension.Success("Xóa phiếu thu thành công!");
      navigate("/cong-no-phai-thu/phieu-thu");
    } catch (e: any) {
      NotificationExtension.Fails("Lỗi khi xóa phiếu thu");
    }
  };

  if (!receipt) return <Text>Đang tải...</Text>;

  return (
    <Box>
      <Flex justify="space-between" align="center" mb="lg">
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/cong-no-phai-thu/phieu-thu")}>
          Quay lại
        </Button>
      </Flex>

      <Card withBorder shadow="sm" color="red">
        <Stack gap="md">
          <Title order={4} c="red">Xác nhận xóa phiếu thu #{receipt.receiptNumber}</Title>
          <Text size="sm">Bạn có chắc chắn muốn xóa phiếu thu trị giá <b>{receipt.totalAmount?.toLocaleString()} VND</b> này không?</Text>
          <Text size="xs" c="dimmed">Lưu ý: Hành động này sẽ loại bỏ hoàn toàn chứng từ khỏi hệ thống.</Text>
          <Button color="red" leftSection={<IconTrash size={16} />} onClick={handleDelete}>
            Xác nhận xóa phiếu thu
          </Button>
        </Stack>
      </Card>
    </Box>
  );
}

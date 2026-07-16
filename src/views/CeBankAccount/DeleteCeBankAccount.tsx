import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Card, Title, Text, Button, Group, Center, Loader } from "@mantine/core";
import { IconAlertTriangle, IconArrowLeft, IconTrash } from "@tabler/icons-react";
import { ceBankAccountService } from "../../api/sharedConfig/ceBankMockService";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";
import { CeBankAccount } from "../../model/CeBankModel";

export default function DeleteCeBankAccount() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [account, setAccount] = useState<CeBankAccount | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkDelete = async () => {
      if (!id) return;
      try {
        const res = await ceBankAccountService.getById(Number(id));
        if (res.success && res.data) {
          setAccount(res.data);
        } else {
          NotificationExtension.Fails(res.message || "Không tìm thấy tài khoản ngân hàng.");
          navigate("/CeBankAccount/CeBankAccountList");
        }
      } catch {
        NotificationExtension.Fails("Lỗi kiểm tra thông tin tài khoản.");
      } finally {
        setLoading(false);
      }
    };

    checkDelete();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!id) return;
    try {
      const res = await ceBankAccountService.delete(Number(id));
      if (res.success) {
        NotificationExtension.Success("Xóa tài khoản ngân hàng thành công!");
        navigate("/CeBankAccount/CeBankAccountList");
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

  if (!account) return null;

  return (
    <Box>
      <Group justify="space-between" align="center" mb="lg">
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/CeBankAccount/CeBankAccountList")}>
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="lg">
        <Group mb="md">
          <IconAlertTriangle size={28} color="orange" />
          <Title order={3} c="orange">Xác nhận xóa Tài khoản Ngân hàng</Title>
        </Group>

        <Text mb="md">
          Mã tài khoản: <b>{account.bankAccountId}</b> | Số tài khoản: <b>{account.accountNumber}</b> | Tên tài khoản: <b>{account.accountName}</b> (Ngân hàng: {account.bankName})
        </Text>

        <Box>
          <Text size="sm" mb="lg">
            Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản ngân hàng nội bộ này khỏi hệ thống? Hành động này không thể hoàn tác.
          </Text>
          <Group>
            <Button color="red" leftSection={<IconTrash size={16} />} onClick={handleDelete}>
              Xác nhận xóa vĩnh viễn
            </Button>
            <Button variant="outline" color="gray" onClick={() => navigate("/CeBankAccount/CeBankAccountList")}>
              Hủy bỏ
            </Button>
          </Group>
        </Box>
      </Card>
    </Box>
  );
}

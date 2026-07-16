import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Card, Title, Text, Button, List, Alert, Group, Stack, Center, Loader } from "@mantine/core";
import { IconAlertTriangle, IconArrowLeft, IconTrash } from "@tabler/icons-react";
import { ceBankBranchService, ceBankAccountService } from "../../api/sharedConfig/ceBankMockService";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";
import { CeBankBranch, CeBankAccount } from "../../model/CeBankModel";

export default function DeleteCeBankBranch() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [branch, setBranch] = useState<CeBankBranch | null>(null);
  const [loading, setLoading] = useState(true);
  const [blockingAccounts, setBlockingAccounts] = useState<CeBankAccount[]>([]);

  useEffect(() => {
    const checkDelete = async () => {
      if (!id) return;
      try {
        const branchRes = await ceBankBranchService.getById(Number(id));
        if (branchRes.success && branchRes.data) {
          setBranch(branchRes.data);

          // Kiểm tra xem có tài khoản nào sử dụng chi nhánh này không
          const accountRes = await ceBankAccountService.getList({ branchId: Number(id), take: 100 });
          if (accountRes.success && accountRes.data) {
            setBlockingAccounts(accountRes.data.items);
          }
        } else {
          NotificationExtension.Fails(branchRes.message || "Không tìm thấy chi nhánh ngân hàng.");
          navigate("/CeBankBranch/CeBankBranchList");
        }
      } catch {
        NotificationExtension.Fails("Lỗi kiểm tra điều kiện xóa chi nhánh.");
      } finally {
        setLoading(false);
      }
    };

    checkDelete();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!id) return;
    try {
      const res = await ceBankBranchService.delete(Number(id));
      if (res.success) {
        NotificationExtension.Success("Xóa chi nhánh ngân hàng thành công!");
        navigate("/CeBankBranch/CeBankBranchList");
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

  if (!branch) return null;

  const canDelete = blockingAccounts.length === 0;

  return (
    <Box>
      <Group justify="space-between" align="center" mb="lg">
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/CeBankBranch/CeBankBranchList")}>
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="lg">
        <Group mb="md">
          <IconAlertTriangle size={28} color={canDelete ? "orange" : "red"} />
          <Title order={3} c={canDelete ? "orange" : "red"}>
            {canDelete ? "Xác nhận xóa Chi nhánh Ngân hàng" : "Không thể xóa Chi nhánh này"}
          </Title>
        </Group>

        <Text mb="md">
          Mã số: <b>{branch.branchId}</b> | Tên chi nhánh: <b>{branch.branchName}</b> (Thuộc ngân hàng: {branch.bankName})
        </Text>

        {!canDelete ? (
          <Stack gap="md">
            <Alert color="red" icon={<IconAlertTriangle size={16} />} title="Có tài khoản ngân hàng liên kết:">
              <Text size="sm" mb="xs">
                Không thể xóa chi nhánh này khi vẫn tồn tại các Tài khoản ngân hàng đang sử dụng trực tiếp dưới đây.
              </Text>
              <List size="sm" withPadding>
                {blockingAccounts.map((acc) => (
                  <List.Item key={acc.bankAccountId}>
                    Tài khoản: <b>{acc.accountName}</b> (Số tài khoản: {acc.accountNumber})
                  </List.Item>
                ))}
              </List>
            </Alert>

            <Alert color="blue" title="Hướng dẫn xử lý:">
              <Text size="sm">
                Vui lòng xóa các Tài khoản ngân hàng liên kết trước khi thực hiện xóa Chi nhánh ngân hàng.
              </Text>
            </Alert>
          </Stack>
        ) : (
          <Box>
            <Text size="sm" mb="lg">
              Chi nhánh ngân hàng này hiện không gán cho tài khoản ngân hàng nào. Bạn có chắc chắn muốn xóa vĩnh viễn? Hành động này không thể hoàn tác.
            </Text>
            <Group>
              <Button color="red" leftSection={<IconTrash size={16} />} onClick={handleDelete}>
                Xác nhận xóa vĩnh viễn
              </Button>
              <Button variant="outline" color="gray" onClick={() => navigate("/CeBankBranch/CeBankBranchList")}>
                Hủy bỏ
              </Button>
            </Group>
          </Box>
        )}
      </Card>
    </Box>
  );
}

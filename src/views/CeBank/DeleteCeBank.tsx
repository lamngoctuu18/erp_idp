import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Card, Title, Text, Button, List, Alert, Group, Stack, Center, Loader } from "@mantine/core";
import { IconAlertTriangle, IconArrowLeft, IconTrash } from "@tabler/icons-react";
import { ceBankService, ceBankBranchService, ceBankAccountService } from "../../api/sharedConfig/ceBankMockService";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";
import { CeBank, CeBankBranch, CeBankAccount } from "../../model/CeBankModel";

export default function DeleteCeBank() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [bank, setBank] = useState<CeBank | null>(null);
  const [loading, setLoading] = useState(true);
  const [blockingBranches, setBlockingBranches] = useState<CeBankBranch[]>([]);
  const [blockingAccounts, setBlockingAccounts] = useState<CeBankAccount[]>([]);

  useEffect(() => {
    const checkDelete = async () => {
      if (!id) return;
      try {
        const bankRes = await ceBankService.getById(Number(id));
        if (bankRes.success && bankRes.data) {
          setBank(bankRes.data);

          // Kiểm tra Chi nhánh trực thuộc
          const branchRes = await ceBankBranchService.getList({ bankId: Number(id), take: 100 });
          if (branchRes.success && branchRes.data) {
            setBlockingBranches(branchRes.data.items);
          }

          // Kiểm tra Tài khoản ngân hàng liên kết
          const accountRes = await ceBankAccountService.getList({ bankId: Number(id), take: 100 });
          if (accountRes.success && accountRes.data) {
            setBlockingAccounts(accountRes.data.items);
          }
        } else {
          NotificationExtension.Fails(bankRes.message || "Không tìm thấy ngân hàng.");
          navigate("/CeBank/CeBankList");
        }
      } catch {
        NotificationExtension.Fails("Lỗi kiểm tra điều kiện xóa ngân hàng.");
      } finally {
        setLoading(false);
      }
    };

    checkDelete();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!id) return;
    try {
      const res = await ceBankService.delete(Number(id));
      if (res.success) {
        NotificationExtension.Success("Xóa ngân hàng thành công!");
        navigate("/CeBank/CeBankList");
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

  if (!bank) return null;

  const canDelete = blockingBranches.length === 0 && blockingAccounts.length === 0;

  return (
    <Box>
      <Group justify="space-between" align="center" mb="lg">
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/CeBank/CeBankList")}>
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="lg">
        <Group mb="md">
          <IconAlertTriangle size={28} color={canDelete ? "orange" : "red"} />
          <Title order={3} c={canDelete ? "orange" : "red"}>
            {canDelete ? "Xác nhận xóa Ngân hàng" : "Không thể xóa Ngân hàng này"}
          </Title>
        </Group>

        <Text mb="md">
          Mã số: <b>{bank.bankId}</b> | Tên ngân hàng: <b>{bank.bankName}</b> ({bank.shortBankName || "-"})
        </Text>

        {!canDelete ? (
          <Stack gap="md">
            {blockingBranches.length > 0 && (
              <Alert color="red" icon={<IconAlertTriangle size={16} />} title="Có chi nhánh phụ thuộc trực tiếp:">
                <Text size="sm" mb="xs">
                  Không thể xóa ngân hàng này khi vẫn tồn tại các Chi nhánh trực thuộc bên dưới.
                </Text>
                <List size="sm" withPadding>
                  {blockingBranches.map((br) => (
                    <List.Item key={br.branchId}>
                      Chi nhánh: <b>{br.branchName}</b> (Mã: {br.branchNumber || "N/A"})
                    </List.Item>
                  ))}
                </List>
              </Alert>
            )}

            {blockingAccounts.length > 0 && (
              <Alert color="red" icon={<IconAlertTriangle size={16} />} title="Có tài khoản ngân hàng liên kết:">
                <Text size="sm" mb="xs">
                  Không thể xóa ngân hàng này khi vẫn tồn tại các Tài khoản ngân hàng đang sử dụng.
                </Text>
                <List size="sm" withPadding>
                  {blockingAccounts.map((acc) => (
                    <List.Item key={acc.bankAccountId}>
                      Tài khoản: <b>{acc.accountName}</b> (Số tài khoản: {acc.accountNumber})
                    </List.Item>
                  ))}
                </List>
              </Alert>
            )}

            <Alert color="blue" title="Hướng dẫn xử lý:">
              <Text size="sm">
                Vui lòng xóa các Tài khoản ngân hàng liên kết và Chi nhánh trực thuộc trước khi thực hiện xóa Ngân hàng chính.
              </Text>
            </Alert>
          </Stack>
        ) : (
          <Box>
            <Text size="sm" mb="lg">
              Ngân hàng này hiện không có dữ liệu chi nhánh hay tài khoản ngân hàng liên kết nào. Bạn có chắc chắn muốn xóa vĩnh viễn? Hành động này không thể hoàn tác.
            </Text>
            <Group>
              <Button color="red" leftSection={<IconTrash size={16} />} onClick={handleDelete}>
                Xác nhận xóa vĩnh viễn
              </Button>
              <Button variant="outline" color="gray" onClick={() => navigate("/CeBank/CeBankList")}>
                Hủy bỏ
              </Button>
            </Group>
          </Box>
        )}
      </Card>
    </Box>
  );
}

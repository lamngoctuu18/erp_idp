import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Card, Title, Text, Button, Group, Center, Loader } from "@mantine/core";
import { IconAlertTriangle, IconArrowLeft, IconTrash } from "@tabler/icons-react";
import { apVendorSiteAccountService } from "../../api/apVendor/apVendorMasterMockService";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";
import { ApVendorSiteAccount } from "../../model/ApVendorMasterModel";

export default function DeleteApVendorSiteAccount() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [account, setAccount] = useState<ApVendorSiteAccount | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkDelete = async () => {
      if (!id) return;
      try {
        const res = await apVendorSiteAccountService.getById(Number(id));
        if (res.success && res.data) {
          setAccount(res.data);
        } else {
          NotificationExtension.Fails(res.message || "Không tìm thấy tài khoản hạch toán.");
          navigate("/ApVendorSiteAccount/ApVendorSiteAccountList");
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
      const res = await apVendorSiteAccountService.delete(Number(id));
      if (res.success) {
        NotificationExtension.Success("Xóa tài khoản hạch toán chi nhánh thành công!");
        navigate("/ApVendorSiteAccount/ApVendorSiteAccountList");
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
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/ApVendorSiteAccount/ApVendorSiteAccountList")}>
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="lg">
        <Group mb="md">
          <IconAlertTriangle size={28} color="orange" />
          <Title order={3} c="orange">Xác nhận xóa Cấu hình Hạch toán Chi nhánh</Title>
        </Group>

        <Text mb="md">
          Mã cấu hình: <b>{account.siteAccountId}</b> | Chi nhánh liên kết: <b>{account.vendorSiteCode}</b> (Nhà cung cấp: {account.vendorName})
        </Text>
        <Text size="sm" mb="md" c="dimmed">
          Tài khoản Nợ phải trả: {account.liabilityCcid} | Tài khoản tạm ứng: {account.prepaymentCcid}
        </Text>

        <Box>
          <Text size="sm" mb="lg">
            Bạn có chắc chắn muốn xóa vĩnh viễn cấu hình hạch toán chi nhánh này? Hành động này không thể hoàn tác.
          </Text>
          <Group>
            <Button color="red" leftSection={<IconTrash size={16} />} onClick={handleDelete}>
              Xác nhận xóa vĩnh viễn
            </Button>
            <Button variant="outline" color="gray" onClick={() => navigate("/ApVendorSiteAccount/ApVendorSiteAccountList")}>
              Hủy bỏ
            </Button>
          </Group>
        </Box>
      </Card>
    </Box>
  );
}

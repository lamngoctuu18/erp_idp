import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Card, Title, Text, Button, List, Alert, Group, Stack, Center, Loader } from "@mantine/core";
import { IconAlertTriangle, IconArrowLeft, IconTrash } from "@tabler/icons-react";
import { apVendorSiteMasterService, apVendorSiteAccountService } from "../../api/apVendor/apVendorMasterMockService";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";
import { ApVendorSite, ApVendorSiteAccount } from "../../model/ApVendorMasterModel";

export default function DeleteApVendorSite() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [site, setSite] = useState<ApVendorSite | null>(null);
  const [loading, setLoading] = useState(true);
  const [blockingAccounts, setBlockingAccounts] = useState<ApVendorSiteAccount[]>([]);

  useEffect(() => {
    const checkDelete = async () => {
      if (!id) return;
      try {
        const siteRes = await apVendorSiteMasterService.getById(Number(id));
        if (siteRes.success && siteRes.data) {
          setSite(siteRes.data);

          // Kiểm tra xem có tài khoản nào sử dụng chi nhánh này không
          const accountRes = await apVendorSiteAccountService.getList({ vendorSiteId: Number(id), take: 100 });
          if (accountRes.success && accountRes.data) {
            setBlockingAccounts(accountRes.data.items);
          }
        } else {
          NotificationExtension.Fails(siteRes.message || "Không tìm thấy chi nhánh.");
          navigate("/ApVendorSite/ApVendorSiteList");
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
      const res = await apVendorSiteMasterService.delete(Number(id));
      if (res.success) {
        NotificationExtension.Success("Xóa chi nhánh thành công!");
        navigate("/ApVendorSite/ApVendorSiteList");
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

  if (!site) return null;

  const canDelete = blockingAccounts.length === 0;

  return (
    <Box>
      <Group justify="space-between" align="center" mb="lg">
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/ApVendorSite/ApVendorSiteList")}>
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="lg">
        <Group mb="md">
          <IconAlertTriangle size={28} color={canDelete ? "orange" : "red"} />
          <Title order={3} c={canDelete ? "orange" : "red"}>
            {canDelete ? "Xác nhận xóa Chi nhánh Nhà cung cấp" : "Không thể xóa Chi nhánh này"}
          </Title>
        </Group>

        <Text mb="md">
          Mã chi nhánh: <b>{site.vendorSiteCode}</b> | Thuộc nhà cung cấp: <b>{site.vendorName}</b>
        </Text>

        {!canDelete ? (
          <Stack gap="md">
            <Alert color="red" icon={<IconAlertTriangle size={16} />} title="Có tài khoản hạch toán chi nhánh liên kết:">
              <Text size="sm" mb="xs">
                Không thể xóa chi nhánh này khi vẫn tồn tại các cấu hình Tài khoản hạch toán kế toán dưới đây.
              </Text>
              <List size="sm" withPadding>
                {blockingAccounts.map((acc) => (
                  <List.Item key={acc.siteAccountId}>
                    Tài khoản hạch toán ID: <b>{acc.siteAccountId}</b> (Pháp nhân: {acc.legalEntityId || "N/A"})
                  </List.Item>
                ))}
              </List>
            </Alert>

            <Alert color="blue" title="Hướng dẫn xử lý:">
              <Text size="sm">
                Vui lòng xóa các Tài khoản hạch toán chi nhánh liên quan trước khi thực hiện xóa Chi nhánh nhà cung cấp này.
              </Text>
            </Alert>
          </Stack>
        ) : (
          <Box>
            <Text size="sm" mb="lg">
              Chi nhánh nhà cung cấp này hiện không gán cho cấu hình tài khoản hạch toán kế toán nào. Bạn có chắc chắn muốn xóa vĩnh viễn? Hành động này không thể hoàn tác.
            </Text>
            <Group>
              <Button color="red" leftSection={<IconTrash size={16} />} onClick={handleDelete}>
                Xác nhận xóa vĩnh viễn
              </Button>
              <Button variant="outline" color="gray" onClick={() => navigate("/ApVendorSite/ApVendorSiteList")}>
                Hủy bỏ
              </Button>
            </Group>
          </Box>
        )}
      </Card>
    </Box>
  );
}

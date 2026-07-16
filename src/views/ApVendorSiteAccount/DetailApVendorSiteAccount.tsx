import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Card, Title, Text, Group, Button, Grid, Divider, Center, Loader } from "@mantine/core";
import { IconArrowLeft, IconEdit, IconTrash } from "@tabler/icons-react";
import { apVendorSiteAccountService } from "../../api/apVendor/apVendorMasterMockService";
import { ApVendorSiteAccount } from "../../model/ApVendorMasterModel";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import { StatusBadge } from "../../_base/component/Core/StatusBadge";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

export default function DetailApVendorSiteAccount() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<ApVendorSiteAccount | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const res = await apVendorSiteAccountService.getById(Number(id));
        if (res.success && res.data) {
          setData(res.data);
        } else {
          NotificationExtension.Fails(res.message || "Không tìm thấy thông tin tài khoản hạch toán.");
          navigate("/ApVendorSiteAccount/ApVendorSiteAccountList");
        }
      } catch {
        NotificationExtension.Fails("Lỗi khi tải thông tin tài khoản hạch toán.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading) {
    return (
      <Center style={{ height: "300px" }}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (!data) return null;

  return (
    <Box>
      <Group justify="space-between" align="center" mb="lg">
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/ApVendorSiteAccount/ApVendorSiteAccountList")}>
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="xl">
        <Group justify="space-between" align="center" mb="xs">
          <Title order={3}>Cấu hình Tài khoản Hạch toán Chi nhánh</Title>
          <Group>
            <Button
              leftSection={<IconEdit size={16} />}
              color="yellow"
              variant="light"
              onClick={() => navigate(`/ApVendorSiteAccount/Edit/${data.siteAccountId}`)}
            >
              Chỉnh sửa
            </Button>
            <Button
              leftSection={<IconTrash size={16} />}
              color="red"
              variant="light"
              onClick={() => navigate(`/ApVendorSiteAccount/Delete/${data.siteAccountId}`)}
            >
              Xóa cấu hình
            </Button>
          </Group>
        </Group>
        <Divider mb="xl" />

        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Mã cấu hình (ID)</Text>
            <Text fw={600} size="md">{data.siteAccountId}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Chi nhánh nhà cung cấp liên kết</Text>
            <Text fw={600} size="md" style={{ color: "#228be6", cursor: "pointer" }} onClick={() => navigate(`/ApVendorSite/Detail/${data.vendorSiteId}`)}>{data.vendorSiteCode} ({data.vendorName})</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Mã sổ cái (Ledger ID)</Text>
            <Text fw={600} size="md">{data.ledgerId || "-"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Mã pháp nhân (Legal Entity ID)</Text>
            <Text fw={600} size="md">{data.legalEntityId || "-"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Tài khoản kế toán Nợ phải trả (Liability CCID)</Text>
            <Text fw={700} size="md">{data.liabilityCcid || "-"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Tài khoản kế toán Tạm ứng (Prepayment CCID)</Text>
            <Text fw={600} size="md">{data.prepaymentCcid || "-"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Tài khoản kế toán Thương phiếu phải trả (Bills Payable CCID)</Text>
            <Text fw={600} size="md">{data.billsPayableCcid || "-"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Mã bộ phân bổ chi phí mặc định (Distribution Set ID)</Text>
            <Text fw={600} size="md">{data.distributionSetId || "-"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Trạng thái hoạt động</Text>
            <Box mt="xs">
              <StatusBadge statusType="masterdata" value={data.status === "ACTIVE"} />
            </Box>
          </Grid.Col>
        </Grid>
      </Card>
    </Box>
  );
}

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Card, Title, Text, Group, Button, Grid, Divider, Center, Loader, Table } from "@mantine/core";
import { IconArrowLeft, IconEdit, IconTrash } from "@tabler/icons-react";
import { apVendorSiteMasterService, apVendorSiteAccountService } from "../../api/apVendor/apVendorMasterMockService";
import { ApVendorSite, ApVendorSiteAccount } from "../../model/ApVendorMasterModel";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import { StatusBadge } from "../../_base/component/Core/StatusBadge";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

export default function DetailApVendorSite() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<ApVendorSite | null>(null);
  const [accounts, setAccounts] = useState<ApVendorSiteAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const res = await apVendorSiteMasterService.getById(Number(id));
        if (res.success && res.data) {
          setData(res.data);

          // Tải các tài khoản hạch toán liên kết
          const accRes = await apVendorSiteAccountService.getList({ vendorSiteId: Number(id), take: 100 });
          if (accRes.success && accRes.data) {
            setAccounts(accRes.data.items);
          }
        } else {
          NotificationExtension.Fails(res.message || "Không tìm thấy thông tin chi nhánh.");
          navigate("/ApVendorSite/ApVendorSiteList");
        }
      } catch {
        NotificationExtension.Fails("Lỗi khi tải thông tin chi nhánh.");
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
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/ApVendorSite/ApVendorSiteList")}>
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="xl" mb="lg">
        <Group justify="space-between" align="center" mb="xs">
          <Title order={3}>Chi nhánh: {data.vendorSiteCode}</Title>
          <Group>
            <Button
              leftSection={<IconEdit size={16} />}
              color="yellow"
              variant="light"
              onClick={() => navigate(`/ApVendorSite/Edit/${data.vendorSiteId}`)}
            >
              Chỉnh sửa
            </Button>
            <Button
              leftSection={<IconTrash size={16} />}
              color="red"
              variant="light"
              onClick={() => navigate(`/ApVendorSite/Delete/${data.vendorSiteId}`)}
            >
              Xóa chi nhánh
            </Button>
          </Group>
        </Group>
        <Divider mb="xl" />

        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Mã chi nhánh (ID)</Text>
            <Text fw={600} size="md">{data.vendorSiteId}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Nhà cung cấp chủ quản</Text>
            <Text fw={600} size="md" style={{ color: "#228be6" }}>{data.vendorName || "N/A"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Mã chi nhánh (Site Code)</Text>
            <Text fw={600} size="md">{data.vendorSiteCode}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Số điện thoại liên hệ</Text>
            <Text fw={600} size="md">{data.phone || "-"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Địa chỉ Email chi nhánh</Text>
            <Text fw={600} size="md">{data.email || "-"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Trạng thái kích hoạt</Text>
            <Box mt="xs">
              <StatusBadge statusType="masterdata" value={data.enabledFlag === "Y"} />
            </Box>
          </Grid.Col>

          <Grid.Col span={12}>
            <Text size="sm" c="dimmed">Địa chỉ chi nhánh</Text>
            <Text fw={600} size="md">{data.addressLine1 || "-"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Tên ngân hàng thụ hưởng</Text>
            <Text fw={600} size="md">{data.bankName || "-"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Số tài khoản ngân hàng</Text>
            <Text fw={700} size="md">{data.bankAccountNum || "-"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Mã điều khoản thanh toán mặc định</Text>
            <Text fw={600} size="md">{data.defaultTermsId || "-"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Mã tài khoản kế toán công nợ</Text>
            <Text fw={600} size="md">{data.defaultPayablesCcid || "-"}</Text>
          </Grid.Col>
        </Grid>
      </Card>

      {/* Tài khoản hạch toán chi nhánh */}
      <Card withBorder shadow="sm" radius="md" padding="xl">
        <Title order={4} mb="md">Tài khoản hạch toán kế toán chi nhánh liên kết ({accounts.length})</Title>
        <Divider mb="md" />

        <Table striped highlightOnHover withTableBorder withColumnBorders style={{ fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f8f9fa" }}>
              <th style={{ width: 100, padding: 8 }}>Mã TK hạch toán</th>
              <th style={{ width: 150, padding: 8 }}>Mã pháp nhân (Entity ID)</th>
              <th style={{ padding: 8 }}>Tài khoản Nợ phải trả (Liability Ccid)</th>
              <th style={{ padding: 8 }}>Tài khoản Tạm ứng (Prepayment Ccid)</th>
              <th style={{ padding: 8 }}>Tài khoản Thương phiếu (Bills Payable)</th>
              <th style={{ width: 120, padding: 8 }}>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {accounts.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: 12, color: "#868e96" }}>Chưa có tài khoản hạch toán kế toán nào liên kết với chi nhánh này.</td>
              </tr>
            ) : (
              accounts.map((a) => (
                <tr key={a.siteAccountId}>
                  <td style={{ padding: 8 }}>{a.siteAccountId}</td>
                  <td style={{ padding: 8 }}>{a.legalEntityId || "-"}</td>
                  <td style={{ padding: 8, fontWeight: 600 }}>{a.liabilityCcid || "-"}</td>
                  <td style={{ padding: 8 }}>{a.prepaymentCcid || "-"}</td>
                  <td style={{ padding: 8 }}>{a.billsPayableCcid || "-"}</td>
                  <td style={{ padding: 8 }}>
                    <StatusBadge statusType="masterdata" value={a.status === "ACTIVE"} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card>
    </Box>
  );
}

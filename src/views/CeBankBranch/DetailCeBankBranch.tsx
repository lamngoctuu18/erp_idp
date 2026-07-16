import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Card, Title, Text, Group, Button, Grid, Divider, Center, Loader, Table } from "@mantine/core";
import { IconArrowLeft, IconEdit, IconTrash } from "@tabler/icons-react";
import { ceBankBranchService, ceBankAccountService } from "../../api/sharedConfig/ceBankMockService";
import { CeBankBranch, CeBankAccount } from "../../model/CeBankModel";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import { StatusBadge } from "../../_base/component/Core/StatusBadge";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

export default function DetailCeBankBranch() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<CeBankBranch | null>(null);
  const [accounts, setAccounts] = useState<CeBankAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const res = await ceBankBranchService.getById(Number(id));
        if (res.success && res.data) {
          setData(res.data);

          // Lấy danh sách tài khoản liên kết trực tiếp
          const accRes = await ceBankAccountService.getList({ branchId: Number(id), take: 100 });
          if (accRes.success && accRes.data) {
            setAccounts(accRes.data.items);
          }
        } else {
          NotificationExtension.Fails(res.message || "Không tìm thấy thông tin chi nhánh.");
          navigate("/CeBankBranch/CeBankBranchList");
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
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/CeBankBranch/CeBankBranchList")}>
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="xl" mb="lg">
        <Group justify="space-between" align="center" mb="xs">
          <Title order={3}>Chi nhánh: {data.branchName}</Title>
          <Group>
            <Button
              leftSection={<IconEdit size={16} />}
              color="yellow"
              variant="light"
              onClick={() => navigate(`/CeBankBranch/Edit/${data.branchId}`)}
            >
              Chỉnh sửa
            </Button>
            <Button
              leftSection={<IconTrash size={16} />}
              color="red"
              variant="light"
              onClick={() => navigate(`/CeBankBranch/Delete/${data.branchId}`)}
            >
              Xóa chi nhánh
            </Button>
          </Group>
        </Group>
        <Divider mb="xl" />

        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Mã chi nhánh (ID)</Text>
            <Text fw={600} size="md">{data.branchId}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Thuộc Ngân hàng chính</Text>
            <Text fw={600} size="md" style={{ color: "#228be6", cursor: "pointer" }} onClick={() => navigate(`/CeBank/Detail/${data.bankId}`)}>{data.bankName || "N/A"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Mã chi nhánh (Branch Number)</Text>
            <Text fw={600} size="md">{data.branchNumber || "-"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Tên giao dịch chi nhánh (Alternate Name)</Text>
            <Text fw={600} size="md">{data.alternateBranchName || "-"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Loại chi nhánh</Text>
            <Text fw={600} size="md">{data.branchType || "-"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Tỉnh / Thành phố</Text>
            <Text fw={600} size="md">{data.city || "-"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Địa chỉ chi nhánh</Text>
            <Text fw={600} size="md">{data.addressLine1 || "-"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Trạng thái hoạt động</Text>
            <Box mt="xs">
              <StatusBadge statusType="masterdata" value={data.status === "ACTIVE"} />
            </Box>
          </Grid.Col>

          <Grid.Col span={12}>
            <Text size="sm" c="dimmed">Mô tả / Diễn giải chi tiết</Text>
            <Text fw={600} size="md">{data.description || "-"}</Text>
          </Grid.Col>
        </Grid>
      </Card>

      {/* Danh sách tài khoản ngân hàng sử dụng chi nhánh này */}
      <Card withBorder shadow="sm" radius="md" padding="xl">
        <Title order={4} mb="md">Danh sách tài khoản ngân hàng liên kết ({accounts.length})</Title>
        <Divider mb="md" />

        <Table striped highlightOnHover withTableBorder withColumnBorders style={{ fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f8f9fa" }}>
              <th style={{ width: 120, padding: 8 }}>Mã tài khoản</th>
              <th style={{ width: 180, padding: 8 }}>Số tài khoản</th>
              <th style={{ padding: 8 }}>Tên tài khoản</th>
              <th style={{ width: 120, padding: 8 }}>Loại tiền tệ</th>
              <th style={{ width: 150, padding: 8 }}>Loại tài khoản</th>
              <th style={{ width: 120, padding: 8 }}>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {accounts.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: 12, color: "#868e96" }}>Chưa có tài khoản ngân hàng nào gán vào chi nhánh này.</td>
              </tr>
            ) : (
              accounts.map((a) => (
                <tr key={a.bankAccountId}>
                  <td style={{ padding: 8 }}>{a.bankAccountId}</td>
                  <td style={{ padding: 8, fontWeight: 700 }}>{a.accountNumber}</td>
                  <td style={{ padding: 8, fontWeight: 600, color: "#228be6", cursor: "pointer" }} onClick={() => navigate(`/CeBankAccount/Detail/${a.bankAccountId}`)}>{a.accountName}</td>
                  <td style={{ padding: 8 }}>{a.currencyCode}</td>
                  <td style={{ padding: 8 }}>{a.accountType || "-"}</td>
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

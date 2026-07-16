import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Card, Title, Text, Group, Button, Grid, Divider, Center, Loader, Table } from "@mantine/core";
import { IconArrowLeft, IconEdit, IconTrash } from "@tabler/icons-react";
import { ceBankService, ceBankBranchService } from "../../api/sharedConfig/ceBankMockService";
import { CeBank, CeBankBranch } from "../../model/CeBankModel";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import { StatusBadge } from "../../_base/component/Core/StatusBadge";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

export default function DetailCeBank() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<CeBank | null>(null);
  const [branches, setBranches] = useState<CeBankBranch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const res = await ceBankService.getById(Number(id));
        if (res.success && res.data) {
          setData(res.data);

          // Lấy chi nhánh trực thuộc ngân hàng này
          const branchRes = await ceBankBranchService.getList({ bankId: Number(id), take: 100 });
          if (branchRes.success && branchRes.data) {
            setBranches(branchRes.data.items);
          }
        } else {
          NotificationExtension.Fails(res.message || "Không tìm thấy thông tin ngân hàng.");
          navigate("/CeBank/CeBankList");
        }
      } catch {
        NotificationExtension.Fails("Lỗi khi tải thông tin ngân hàng.");
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
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/CeBank/CeBankList")}>
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="xl" mb="lg">
        <Group justify="space-between" align="center" mb="xs">
          <Title order={3}>Ngân hàng: {data.bankName}</Title>
          <Group>
            <Button
              leftSection={<IconEdit size={16} />}
              color="yellow"
              variant="light"
              onClick={() => navigate(`/CeBank/Edit/${data.bankId}`)}
            >
              Chỉnh sửa
            </Button>
            <Button
              leftSection={<IconTrash size={16} />}
              color="red"
              variant="light"
              onClick={() => navigate(`/CeBank/Delete/${data.bankId}`)}
            >
              Xóa ngân hàng
            </Button>
          </Group>
        </Group>
        <Divider mb="xl" />

        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Mã số ngân hàng (ID)</Text>
            <Text fw={600} size="md">{data.bankId}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Mã ngân hàng (Bank Number)</Text>
            <Text fw={600} size="md">{data.bankNumber || "-"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Tên giao dịch (Alternate Name)</Text>
            <Text fw={600} size="md">{data.alternateBankName || "-"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Tên viết tắt (Short Name)</Text>
            <Text fw={600} size="md">{data.shortBankName || "-"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Quốc gia</Text>
            <Text fw={600} size="md">{data.countryCode}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Mã số thuế ngân hàng</Text>
            <Text fw={600} size="md">{data.taxRegistrationNumber || "-"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Trạng thái hoạt động</Text>
            <Box mt="xs">
              <StatusBadge statusType="masterdata" value={data.status === "ACTIVE"} />
            </Box>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Ngày ngưng hoạt động (Inactive Date)</Text>
            <Text fw={600} size="md">{data.inactiveDate || "-"}</Text>
          </Grid.Col>

          <Grid.Col span={12}>
            <Text size="sm" c="dimmed">Mô tả / Diễn giải</Text>
            <Text fw={600} size="md">{data.description || "-"}</Text>
          </Grid.Col>
        </Grid>
      </Card>

      {/* Danh sách chi nhánh trực thuộc */}
      <Card withBorder shadow="sm" radius="md" padding="xl">
        <Title order={4} mb="md">Danh sách chi nhánh ngân hàng trực thuộc ({branches.length})</Title>
        <Divider mb="md" />

        <Table striped highlightOnHover withTableBorder withColumnBorders style={{ fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f8f9fa" }}>
              <th style={{ width: 100, padding: 8 }}>Mã chi nhánh</th>
              <th style={{ width: 120, padding: 8 }}>Mã CN (Branch Num)</th>
              <th style={{ padding: 8 }}>Tên chi nhánh</th>
              <th style={{ width: 150, padding: 8 }}>Loại chi nhánh</th>
              <th style={{ width: 150, padding: 8 }}>Tỉnh / Thành phố</th>
              <th style={{ width: 120, padding: 8 }}>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {branches.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: 12, color: "#868e96" }}>Chưa có chi nhánh nào trực thuộc ngân hàng này.</td>
              </tr>
            ) : (
              branches.map((b) => (
                <tr key={b.branchId}>
                  <td style={{ padding: 8 }}>{b.branchId}</td>
                  <td style={{ padding: 8 }}>{b.branchNumber || "-"}</td>
                  <td style={{ padding: 8, fontWeight: 600, color: "#228be6", cursor: "pointer" }} onClick={() => navigate(`/CeBankBranch/Detail/${b.branchId}`)}>{b.branchName}</td>
                  <td style={{ padding: 8 }}>{b.branchType || "-"}</td>
                  <td style={{ padding: 8 }}>{b.city || "-"}</td>
                  <td style={{ padding: 8 }}>
                    <StatusBadge statusType="masterdata" value={b.status === "ACTIVE"} />
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

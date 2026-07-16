import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Card, Title, Text, Group, Button, Grid, Divider, Center, Loader, Badge } from "@mantine/core";
import { IconArrowLeft, IconEdit, IconTrash } from "@tabler/icons-react";
import { apVendorMergeHistoryService } from "../../api/apVendor/apVendorMasterMockService";
import { ApVendorMergeHistory } from "../../model/ApVendorMasterModel";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

export default function DetailApVendorMergeHistory() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<ApVendorMergeHistory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const res = await apVendorMergeHistoryService.getById(Number(id));
        if (res.success && res.data) {
          setData(res.data);
        } else {
          NotificationExtension.Fails(res.message || "Không tìm thấy lịch sử gộp.");
          navigate("/ApVendorMergeHistory/ApVendorMergeHistoryList");
        }
      } catch {
        NotificationExtension.Fails("Lỗi khi tải thông tin lịch sử gộp.");
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
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/ApVendorMergeHistory/ApVendorMergeHistoryList")}>
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="xl">
        <Group justify="space-between" align="center" mb="xs">
          <Title order={3}>Giao dịch gộp nhà cung cấp: #{data.mergeId}</Title>
          <Group>
            <Button
              leftSection={<IconEdit size={16} />}
              color="yellow"
              variant="light"
              onClick={() => navigate(`/ApVendorMergeHistory/Edit/${data.mergeId}`)}
            >
              Chỉnh sửa
            </Button>
            <Button
              leftSection={<IconTrash size={16} />}
              color="red"
              variant="light"
              onClick={() => navigate(`/ApVendorMergeHistory/Delete/${data.mergeId}`)}
            >
              Xóa lịch sử gộp
            </Button>
          </Group>
        </Group>
        <Divider mb="xl" />

        <Grid gutter="xl">
          {/* Cột trái: Từ nguồn */}
          <Grid.Col span={{ base: 12, md: 6 }} style={{ borderRight: "1px solid #dee2e6" }}>
            <Title order={4} mb="md" c="red">Thông tin Nguồn (From)</Title>
            <Grid gutter="md">
              <Grid.Col span={12}>
                <Text size="sm" c="dimmed">Mã nhà cung cấp nguồn (ID)</Text>
                <Text fw={600} size="md">{data.fromVendorId}</Text>
              </Grid.Col>
              <Grid.Col span={12}>
                <Text size="sm" c="dimmed">Tên nhà cung cấp nguồn</Text>
                <Text fw={600} size="md" style={{ color: "#e03131" }}>{data.fromVendorName || "N/A"}</Text>
              </Grid.Col>
              <Grid.Col span={12}>
                <Text size="sm" c="dimmed">Mã chi nhánh nguồn</Text>
                <Text fw={600} size="md">{data.fromVendorSiteCode || "Tất cả chi nhánh"}</Text>
              </Grid.Col>
            </Grid>
          </Grid.Col>

          {/* Cột phải: Đến đích */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Title order={4} mb="md" c="green">Thông tin Đích (To)</Title>
            <Grid gutter="md">
              <Grid.Col span={12}>
                <Text size="sm" c="dimmed">Mã nhà cung cấp đích (ID)</Text>
                <Text fw={600} size="md">{data.toVendorId}</Text>
              </Grid.Col>
              <Grid.Col span={12}>
                <Text size="sm" c="dimmed">Tên nhà cung cấp đích</Text>
                <Text fw={600} size="md" style={{ color: "#2b8a3e" }}>{data.toVendorName || "N/A"}</Text>
              </Grid.Col>
              <Grid.Col span={12}>
                <Text size="sm" c="dimmed">Mã chi nhánh đích</Text>
                <Text fw={600} size="md">{data.toVendorSiteCode || "Tất cả chi nhánh"}</Text>
              </Grid.Col>
            </Grid>
          </Grid.Col>

          <Grid.Col span={12}>
            <Divider />
          </Grid.Col>

          {/* Chi tiết giao dịch gộp */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Text size="sm" c="dimmed">Phạm vi chuyển giao hóa đơn (Invoice Scope)</Text>
            <Box mt="xs">
              <Badge color={data.invoiceScope === "ALL" ? "blue" : "orange"} variant="light">
                {data.invoiceScope === "ALL" ? "Tất cả hóa đơn" : "Hóa đơn chưa thanh toán"}
              </Badge>
            </Box>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Text size="sm" c="dimmed">Đơn mua hàng có gộp kèm (PO Merge)</Text>
            <Box mt="xs">
              <Badge color={data.poMergeFlag === "Y" ? "green" : "gray"} variant="light">
                {data.poMergeFlag === "Y" ? "Có gộp PO" : "Không gộp PO"}
              </Badge>
            </Box>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Text size="sm" c="dimmed">Ngày thực hiện giao dịch gộp</Text>
            <Text fw={600} size="md" mt="xs">
              {data.mergeDate ? new Date(data.mergeDate).toLocaleString("vi-VN") : "-"}
            </Text>
          </Grid.Col>
        </Grid>
      </Card>
    </Box>
  );
}

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Card, Title, Text, Group, Button, Grid, Divider, Center, Loader, Badge } from "@mantine/core";
import { IconArrowLeft, IconEdit, IconTrash } from "@tabler/icons-react";
import { apPaymentBatchService } from "../../api/apVendor/apPaymentMockService";
import { ApPaymentBatch } from "../../model/ApPaymentModel";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

export default function DetailApPaymentBatch() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<ApPaymentBatch | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const res = await apPaymentBatchService.getById(Number(id));
        if (res.success && res.data) {
          setData(res.data);
        } else {
          NotificationExtension.Fails(res.message || "Không tìm thấy lô thanh toán.");
          navigate("/ApPaymentBatch/ApPaymentBatchList");
        }
      } catch {
        NotificationExtension.Fails("Lỗi khi tải thông tin lô thanh toán.");
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
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/ApPaymentBatch/ApPaymentBatchList")}>
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="xl">
        <Group justify="space-between" align="center" mb="xs">
          <Title order={3}>Chi tiết lô thanh toán: {data.batchName}</Title>
          <Group>
            <Button
              leftSection={<IconEdit size={16} />}
              color="yellow"
              variant="light"
              onClick={() => navigate(`/ApPaymentBatch/Edit/${data.batchId}`)}
            >
              Chỉnh sửa
            </Button>
            <Button
              leftSection={<IconTrash size={16} />}
              color="red"
              variant="light"
              onClick={() => navigate(`/ApPaymentBatch/Delete/${data.batchId}`)}
            >
              Xóa lô thanh toán
            </Button>
          </Group>
        </Group>
        <Divider mb="xl" />

        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Mã lô thanh toán (ID)</Text>
            <Text fw={600} size="md">{data.batchId}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Tên lô thanh toán</Text>
            <Text fw={600} size="md">{data.batchName}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Tài khoản ngân hàng chi trả (ID)</Text>
            <Text fw={600} size="md" style={{ color: "#228be6" }}>{data.bankAccountId || "N/A"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Phương thức chi tiền</Text>
            <Text fw={600} size="md">
              {data.paymentMethod === "WIRE" ? "Ủy nhiệm chi (WIRE)" : data.paymentMethod === "CHECK" ? "Séc (CHECK)" : "Tiền mặt (CASH)"}
            </Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Ngày dự kiến thanh toán</Text>
            <Text fw={600} size="md">
              {data.paymentDate ? new Date(data.paymentDate).toLocaleDateString("vi-VN") : "-"}
            </Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Tổng tiền dự kiến chi</Text>
            <Text fw={700} size="md" style={{ color: "#2b8a3e" }}>
              {data.totalAmount?.toLocaleString("vi-VN")} VND
            </Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Trạng thái lô chi</Text>
            <Box mt="xs">
              <Badge color={data.status === "APPROVED" ? "green" : "orange"}>
                {data.status}
              </Badge>
            </Box>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Người tạo lô</Text>
            <Text fw={600} size="md">ID: {data.createdBy}</Text>
          </Grid.Col>
        </Grid>
      </Card>
    </Box>
  );
}

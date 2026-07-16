import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Card, Title, Text, Group, Button, Grid, Divider, Center, Loader, Badge } from "@mantine/core";
import { IconArrowLeft, IconEdit, IconTrash } from "@tabler/icons-react";
import { apPaymentScheduleService } from "../../api/apVendor/apPaymentMockService";
import { ApPaymentSchedule } from "../../model/ApPaymentModel";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

export default function DetailApPaymentSchedule() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<ApPaymentSchedule | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const res = await apPaymentScheduleService.getById(Number(id));
        if (res.success && res.data) {
          setData(res.data);
        } else {
          NotificationExtension.Fails(res.message || "Không tìm thấy lịch thanh toán.");
          navigate("/ApPaymentSchedule/ApPaymentScheduleList");
        }
      } catch {
        NotificationExtension.Fails("Lỗi khi tải thông tin lịch thanh toán.");
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
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/ApPaymentSchedule/ApPaymentScheduleList")}>
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="xl">
        <Group justify="space-between" align="center" mb="xs">
          <Title order={3}>Lịch trả nợ cho Hóa đơn: #INV-{data.invoiceId}</Title>
          <Group>
            <Button
              leftSection={<IconEdit size={16} />}
              color="yellow"
              variant="light"
              onClick={() => navigate(`/ApPaymentSchedule/Edit/${data.id}`)}
            >
              Chỉnh sửa
            </Button>
            <Button
              leftSection={<IconTrash size={16} />}
              color="red"
              variant="light"
              onClick={() => navigate(`/ApPaymentSchedule/Delete/${data.id}`)}
            >
              Xóa lịch trả nợ
            </Button>
          </Group>
        </Group>
        <Divider mb="xl" />

        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Mã lịch trả nợ (ID)</Text>
            <Text fw={600} size="md">{data.id}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Mã hóa đơn liên kết (Invoice ID)</Text>
            <Text fw={700} size="md" style={{ color: "#228be6" }}>INV-{data.invoiceId}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Hạn thanh toán công nợ</Text>
            <Text fw={600} size="md">
              {data.dueDate ? new Date(data.dueDate).toLocaleDateString("vi-VN") : "-"}
            </Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Mã đơn vị hoạt động (Org ID)</Text>
            <Text fw={600} size="md">{data.orgId}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Tổng nợ gốc dự kiến chi</Text>
            <Text fw={700} size="md" style={{ color: "#2b8a3e" }}>
              {data.grossAmount?.toLocaleString("vi-VN")} đ
            </Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Dư nợ còn lại chưa thanh toán</Text>
            <Text fw={700} size="md" style={{ color: "red" }}>
              {data.amountRemaining?.toLocaleString("vi-VN")} đ
            </Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Trạng thái chặn chi tiền (Hold Flag)</Text>
            <Box mt="xs">
              <Badge color={data.holdFlag === "Y" ? "red" : "gray"}>
                {data.holdFlag === "Y" ? "ĐANG CHẶN CHI" : "MỞ KHÓA CHI"}
              </Badge>
            </Box>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Tình trạng thanh toán công nợ</Text>
            <Box mt="xs">
              <Badge color={data.paymentStatus === "PAID" ? "green" : data.paymentStatus === "PARTIALLY_PAID" ? "yellow" : "red"}>
                {data.paymentStatus}
              </Badge>
            </Box>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Ngày gia hạn thanh toán hưởng chiết khấu</Text>
            <Text fw={600} size="md">
              {data.discountDate ? new Date(data.discountDate).toLocaleDateString("vi-VN") : "-"}
            </Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Số tiền chiết khấu dự kiến</Text>
            <Text fw={600} size="md">
              {data.discountAmount ? `${data.discountAmount.toLocaleString("vi-VN")} đ` : "-"}
            </Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Phương thức thanh toán dự kiến</Text>
            <Text fw={600} size="md">{data.paymentMethod || "-"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Mã giao dịch chi trả hiện tại (Payment Number)</Text>
            <Text fw={600} size="md">{data.paymentNum || "-"}</Text>
          </Grid.Col>
        </Grid>
      </Card>
    </Box>
  );
}

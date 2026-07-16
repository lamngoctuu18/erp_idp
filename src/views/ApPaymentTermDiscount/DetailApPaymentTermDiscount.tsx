import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Card, Title, Text, Group, Button, Grid, Divider, Center, Loader } from "@mantine/core";
import { IconArrowLeft, IconEdit, IconTrash } from "@tabler/icons-react";
import { apPaymentTermDiscountService } from "../../api/apVendor/apPaymentMockService";
import { ApPaymentTermDiscount } from "../../model/ApPaymentModel";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

export default function DetailApPaymentTermDiscount() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<ApPaymentTermDiscount | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const res = await apPaymentTermDiscountService.getById(Number(id));
        if (res.success && res.data) {
          setData(res.data);
        } else {
          NotificationExtension.Fails(res.message || "Không tìm thấy chiết khấu.");
          navigate("/ApPaymentTermDiscount/ApPaymentTermDiscountList");
        }
      } catch {
        NotificationExtension.Fails("Lỗi khi tải thông tin chiết khấu.");
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
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/ApPaymentTermDiscount/ApPaymentTermDiscountList")}>
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="xl">
        <Group justify="space-between" align="center" mb="xs">
          <Title order={3}>Chi tiết chiết khấu thanh toán sớm: #{data.discountId}</Title>
          <Group>
            <Button
              leftSection={<IconEdit size={16} />}
              color="yellow"
              variant="light"
              onClick={() => navigate(`/ApPaymentTermDiscount/Edit/${data.discountId}`)}
            >
              Chỉnh sửa
            </Button>
            <Button
              leftSection={<IconTrash size={16} />}
              color="red"
              variant="light"
              onClick={() => navigate(`/ApPaymentTermDiscount/Delete/${data.discountId}`)}
            >
              Xóa chiết khấu
            </Button>
          </Group>
        </Group>
        <Divider mb="xl" />

        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Mã cấu hình chiết khấu (ID)</Text>
            <Text fw={600} size="md">{data.discountId}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Thuộc điều khoản thanh toán</Text>
            <Text fw={600} size="md" style={{ color: "#228be6", cursor: "pointer" }} onClick={() => navigate(`/ApPaymentTerm/Detail/${data.paymentTermId}`)}>{data.termName || "N/A"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Cấp độ bậc chiết khấu (Level)</Text>
            <Text fw={600} size="md">Cấp {data.discountLevel}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Tỷ lệ phần trăm chiết khấu (%)</Text>
            <Text fw={700} size="md" style={{ color: "#2b8a3e" }}>{data.discountPercent || 0}%</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Số ngày thanh toán sớm yêu cầu</Text>
            <Text fw={600} size="md">Trong vòng {data.days || 0} ngày</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Ngày chốt cố định trong tháng (Day Of Month)</Text>
            <Text fw={600} size="md">{data.dayOfMonth || "-"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Số tháng được đẩy trước (Months Ahead)</Text>
            <Text fw={600} size="md">{data.monthsAhead || "-"}</Text>
          </Grid.Col>
        </Grid>
      </Card>
    </Box>
  );
}

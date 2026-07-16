import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Card, Title, Text, Group, Button, Grid, Divider, Center, Loader } from "@mantine/core";
import { IconArrowLeft, IconEdit, IconTrash } from "@tabler/icons-react";
import { apPaymentTermLineService } from "../../api/apVendor/apPaymentMockService";
import { ApPaymentTermLine } from "../../model/ApPaymentModel";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

export default function DetailApPaymentTermLine() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<ApPaymentTermLine | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const res = await apPaymentTermLineService.getById(Number(id));
        if (res.success && res.data) {
          setData(res.data);
        } else {
          NotificationExtension.Fails(res.message || "Không tìm thấy dòng điều khoản.");
          navigate("/ApPaymentTermLine/ApPaymentTermLineList");
        }
      } catch {
        NotificationExtension.Fails("Lỗi khi tải thông tin dòng điều khoản.");
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
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/ApPaymentTermLine/ApPaymentTermLineList")}>
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="xl">
        <Group justify="space-between" align="center" mb="xs">
          <Title order={3}>Dòng điều khoản chi tiết: #{data.termLineId}</Title>
          <Group>
            <Button
              leftSection={<IconEdit size={16} />}
              color="yellow"
              variant="light"
              onClick={() => navigate(`/ApPaymentTermLine/Edit/${data.termLineId}`)}
            >
              Chỉnh sửa
            </Button>
            <Button
              leftSection={<IconTrash size={16} />}
              color="red"
              variant="light"
              onClick={() => navigate(`/ApPaymentTermLine/Delete/${data.termLineId}`)}
            >
              Xóa dòng điều khoản
            </Button>
          </Group>
        </Group>
        <Divider mb="xl" />

        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Mã dòng chi tiết (ID)</Text>
            <Text fw={600} size="md">{data.termLineId}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Thuộc điều khoản thanh toán</Text>
            <Text fw={600} size="md" style={{ color: "#228be6", cursor: "pointer" }} onClick={() => navigate(`/ApPaymentTerm/Detail/${data.paymentTermId}`)}>{data.termName || "N/A"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Thứ tự số dòng (Line Num)</Text>
            <Text fw={600} size="md">{data.lineNum}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Tỷ lệ thanh toán đến hạn (%)</Text>
            <Text fw={700} size="md" style={{ color: "#2b8a3e" }}>{data.duePercent || 0}%</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Số tiền thanh toán cố định</Text>
            <Text fw={600} size="md">{data.dueAmount ? `${data.dueAmount.toLocaleString()}đ` : "-"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Số ngày quá hạn gia hạn nợ</Text>
            <Text fw={600} size="md">{data.days || 0} ngày</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Ngày chốt cố định trong tháng (Day Of Month)</Text>
            <Text fw={600} size="md">{data.dayOfMonth || "-"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Số tháng cộng thêm (Months Ahead)</Text>
            <Text fw={600} size="md">{data.monthAhead || "-"}</Text>
          </Grid.Col>
        </Grid>
      </Card>
    </Box>
  );
}

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Card, Title, Text, Group, Button, Grid, Divider, Center, Loader, Badge } from "@mantine/core";
import { IconArrowLeft, IconEdit, IconTrash } from "@tabler/icons-react";
import { apHoldDefinitionService } from "../../api/apVendor/apInvoiceMasterMockService";
import { ApHoldDefinition } from "../../model/ApInvoiceMasterModel";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

export default function DetailApHoldDefinition() {
  const { id } = useParams<{ id: string }>(); // holds the holdCode string
  const navigate = useNavigate();
  const [data, setData] = useState<ApHoldDefinition | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const res = await apHoldDefinitionService.getById(id);
        if (res.success && res.data) {
          setData(res.data);
        } else {
          NotificationExtension.Fails(res.message || "Không tìm thấy lý do khóa giữ.");
          navigate("/ApHoldDefinition/ApHoldDefinitionList");
        }
      } catch {
        NotificationExtension.Fails("Lỗi khi tải thông tin lý do khóa giữ.");
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
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/ApHoldDefinition/ApHoldDefinitionList")}>
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="xl">
        <Group justify="space-between" align="center" mb="xs">
          <Title order={3}>Chi tiết mã lỗi khóa giữ: {data.holdCode}</Title>
          <Group>
            <Button
              leftSection={<IconEdit size={16} />}
              color="yellow"
              variant="light"
              onClick={() => navigate(`/ApHoldDefinition/Edit/${data.holdCode}`)}
            >
              Chỉnh sửa cấu hình
            </Button>
            <Button
              leftSection={<IconTrash size={16} />}
              color="red"
              variant="light"
              onClick={() => navigate(`/ApHoldDefinition/Delete/${data.holdCode}`)}
            >
              Xóa lý do khóa giữ
            </Button>
          </Group>
        </Group>
        <Divider mb="xl" />

        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Mã lỗi khóa giữ (Hold Code)</Text>
            <Text fw={700} size="md" style={{ color: "#e8590c" }}>{data.holdCode}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Tên lý do khóa giữ</Text>
            <Text fw={600} size="md">{data.holdName}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Text size="sm" c="dimmed">Loại khóa chặn (System Flag)</Text>
            <Box mt="xs">
              <Badge color={data.systemFlag === "Y" ? "blue" : "gray"}>
                {data.systemFlag === "Y" ? "HỆ THỐNG ÁP TỰ ĐỘNG" : "KẾ TOÁN ÁP THỦ CÔNG"}
              </Badge>
            </Box>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Text size="sm" c="dimmed">Quyền giải tỏa thủ công</Text>
            <Box mt="xs">
              <Badge color={data.manualReleaseAllowedFlag === "Y" ? "green" : "red"}>
                {data.manualReleaseAllowedFlag === "Y" ? "ĐƯỢC GIẢI TỎA THỦ CÔNG" : "CHỈ HỆ THỐNG MỞ KHÓA"}
              </Badge>
            </Box>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Text size="sm" c="dimmed">Trạng thái danh mục</Text>
            <Box mt="xs">
              <Badge color={data.activeFlag === "Y" ? "green" : "gray"}>
                {data.activeFlag === "Y" ? "ĐANG SỬ DỤNG (ACTIVE)" : "ĐÃ TẮT HIỆU LỰC"}
              </Badge>
            </Box>
          </Grid.Col>

          <Grid.Col span={12}>
            <Text size="sm" c="dimmed">Mô tả / Hướng dẫn xử lý khi lỗi xuất hiện</Text>
            <Text fw={600} size="md">{data.holdReason || "-"}</Text>
          </Grid.Col>
        </Grid>
      </Card>
    </Box>
  );
}

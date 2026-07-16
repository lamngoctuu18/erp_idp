import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Card, Title, Text, Group, Button, Grid, Divider, Center, Loader } from "@mantine/core";
import { IconArrowLeft, IconEdit, IconTrash } from "@tabler/icons-react";
import { hrOperatingUnitService } from "../../api/sharedConfig/sharedConfigMockService";
import { HrOperatingUnit } from "../../model/SharedConfigModel";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import { StatusBadge } from "../../_base/component/Core/StatusBadge";
import { formatDateTime } from "../../common/FormatDate/FormatDate";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

export default function DetailHrOperatingUnit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<HrOperatingUnit | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const res = await hrOperatingUnitService.getById(Number(id));
        if (res.success && res.data) {
          setData(res.data);
        } else {
          NotificationExtension.Fails(res.message || "Không tìm thấy đơn vị hoạt động.");
          navigate("/HrOperatingUnit/HrOperatingUnitList");
        }
      } catch {
        NotificationExtension.Fails("Lỗi khi tải thông tin chi tiết đơn vị.");
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
        <Button
          variant="subtle"
          leftSection={<IconArrowLeft size={16} />}
          onClick={() => navigate("/HrOperatingUnit/HrOperatingUnitList")}
        >
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="xl">
        <Group justify="space-between" align="center" mb="xs">
          <Title order={3}>Chi tiết Đơn vị hoạt động: {data.name}</Title>
          <Group>
            <Button
              leftSection={<IconEdit size={16} />}
              color="yellow"
              variant="light"
              onClick={() => navigate(`/HrOperatingUnit/Edit/${data.orgId}`)}
            >
              Chỉnh sửa
            </Button>
            <Button
              leftSection={<IconTrash size={16} />}
              color="red"
              variant="light"
              onClick={() => navigate(`/HrOperatingUnit/Delete/${data.orgId}`)}
            >
              Xóa đơn vị
            </Button>
          </Group>
        </Group>
        <Divider mb="xl" />

        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Mã đơn vị (Org ID)</Text>
            <Text fw={600} size="md">{data.orgId}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Thuộc Sổ cái chính (Set of Books)</Text>
            <Text fw={600} size="md" style={{ color: "#228be6", cursor: "pointer" }} onClick={() => navigate(`/GlSetOfBook/Detail/${data.setOfBooksId}`)}>{data.setOfBooksName || "N/A"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Mã số thuế (Tax Code)</Text>
            <Text fw={600} size="md">{data.taxCode || "-"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Địa chỉ trụ sở</Text>
            <Text fw={600} size="md">{data.address || "-"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Trạng thái hoạt động</Text>
            <Box mt="xs">
              <StatusBadge statusType="masterdata" value={data.enabledFlag === "Y"} />
            </Box>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Ngày khởi tạo (Creation Date)</Text>
            <Text fw={600} size="md">{formatDateTime(data.creationDate, "DD/MM/YYYY HH:mm")}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Người tạo (Created By ID)</Text>
            <Text fw={600} size="md">{data.createdBy}</Text>
          </Grid.Col>
        </Grid>
      </Card>
    </Box>
  );
}

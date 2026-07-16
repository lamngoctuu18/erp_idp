import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Card, Title, Text, Group, Button, Grid, Divider, Center, Loader } from "@mantine/core";
import { IconArrowLeft, IconEdit, IconTrash } from "@tabler/icons-react";
import { glSetOfBookService } from "../../api/sharedConfig/sharedConfigMockService";
import { GlSetOfBook } from "../../model/SharedConfigModel";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import { StatusBadge } from "../../_base/component/Core/StatusBadge";
import { formatDateTime } from "../../common/FormatDate/FormatDate";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

export default function DetailGlSetOfBook() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<GlSetOfBook | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const res = await glSetOfBookService.getById(Number(id));
        if (res.success && res.data) {
          setData(res.data);
        } else {
          NotificationExtension.Fails(res.message || "Không tìm thấy thông tin sổ cái.");
          navigate("/GlSetOfBook/GlSetOfBookList");
        }
      } catch {
        NotificationExtension.Fails("Lỗi khi tải thông tin chi tiết Sổ cái.");
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
          onClick={() => navigate("/GlSetOfBook/GlSetOfBookList")}
        >
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="xl">
        <Group justify="space-between" align="center" mb="xs">
          <Title order={3}>Chi tiết Sổ cái chính: {data.name}</Title>
          <Group>
            <Button
              leftSection={<IconEdit size={16} />}
              color="yellow"
              variant="light"
              onClick={() => navigate(`/GlSetOfBook/Edit/${data.setOfBooksId}`)}
            >
              Chỉnh sửa
            </Button>
            <Button
              leftSection={<IconTrash size={16} />}
              color="red"
              variant="light"
              onClick={() => navigate(`/GlSetOfBook/Delete/${data.setOfBooksId}`)}
            >
              Xóa Sổ cái
            </Button>
          </Group>
        </Group>
        <Divider mb="xl" />

        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Mã bộ sổ cái (ID)</Text>
            <Text fw={600} size="md">{data.setOfBooksId}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Tên viết tắt (Short Name)</Text>
            <Text fw={600} size="md">{data.shortName || "-"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Tiền tệ ghi sổ chính (Primary Currency)</Text>
            <Text fw={600} size="md">{data.currencyCode}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Hệ thống tài khoản (COA ID)</Text>
            <Text fw={600} size="md">{data.chartOfAccountsId || "-"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Chu kỳ kế toán (Period Set Name)</Text>
            <Text fw={600} size="md">{data.periodSetName || "-"}</Text>
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

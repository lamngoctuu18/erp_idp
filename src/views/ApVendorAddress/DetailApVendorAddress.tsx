import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Card, Title, Text, Group, Button, Grid, Divider, Center, Loader, Badge } from "@mantine/core";
import { IconArrowLeft, IconEdit, IconTrash } from "@tabler/icons-react";
import { apVendorAddressService } from "../../api/apVendor/apVendorMasterMockService";
import { ApVendorAddress } from "../../model/ApVendorMasterModel";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import { StatusBadge } from "../../_base/component/Core/StatusBadge";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

export default function DetailApVendorAddress() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<ApVendorAddress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const res = await apVendorAddressService.getById(Number(id));
        if (res.success && res.data) {
          setData(res.data);
        } else {
          NotificationExtension.Fails(res.message || "Không tìm thấy thông tin địa chỉ.");
          navigate("/ApVendorAddress/ApVendorAddressList");
        }
      } catch {
        NotificationExtension.Fails("Lỗi khi tải thông tin địa chỉ.");
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
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/ApVendorAddress/ApVendorAddressList")}>
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="xl">
        <Group justify="space-between" align="center" mb="xs">
          <Title order={3}>Chi tiết địa chỉ nhà cung cấp</Title>
          <Group>
            <Button
              leftSection={<IconEdit size={16} />}
              color="yellow"
              variant="light"
              onClick={() => navigate(`/ApVendorAddress/Edit/${data.addressId}`)}
            >
              Chỉnh sửa
            </Button>
            <Button
              leftSection={<IconTrash size={16} />}
              color="red"
              variant="light"
              onClick={() => navigate(`/ApVendorAddress/Delete/${data.addressId}`)}
            >
              Xóa địa chỉ
            </Button>
          </Group>
        </Group>
        <Divider mb="xl" />

        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Mã địa chỉ (ID)</Text>
            <Text fw={600} size="md">{data.addressId}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Nhà cung cấp chủ quản</Text>
            <Text fw={600} size="md" style={{ color: "#228be6" }}>{data.vendorName || "N/A"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Loại địa chỉ</Text>
            <Box mt="xs">
              <Badge color={data.addressType === "PRIMARY" ? "violet" : "blue"} variant="light">
                {data.addressType || "N/A"}
              </Badge>
            </Box>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Đặt làm địa chỉ chính (Primary)</Text>
            <Box mt="xs">
              <Badge color={data.isPrimary === "Y" ? "green" : "gray"} variant="light">
                {data.isPrimary === "Y" ? "Đúng" : "Không"}
              </Badge>
            </Box>
          </Grid.Col>

          <Grid.Col span={12}>
            <Text size="sm" c="dimmed">Địa chỉ dòng 1</Text>
            <Text fw={600} size="md">{data.addressLine1 || "-"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Địa chỉ dòng 2</Text>
            <Text fw={600} size="md">{data.addressLine2 || "-"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Địa chỉ dòng 3</Text>
            <Text fw={600} size="md">{data.addressLine3 || "-"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Text size="sm" c="dimmed">Thành phố</Text>
            <Text fw={600} size="md">{data.city || "-"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Text size="sm" c="dimmed">Quận / Huyện / Bang</Text>
            <Text fw={600} size="md">{data.state || "-"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Text size="sm" c="dimmed">Mã bưu điện (Postal Code)</Text>
            <Text fw={600} size="md">{data.postalCode || "-"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Text size="sm" c="dimmed">Quốc gia</Text>
            <Text fw={600} size="md">{data.country || "-"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Text size="sm" c="dimmed">Số điện thoại liên hệ</Text>
            <Text fw={600} size="md">{data.phone || "-"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Text size="sm" c="dimmed">Số Fax</Text>
            <Text fw={600} size="md">{data.fax || "-"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Địa chỉ Email</Text>
            <Text fw={600} size="md">{data.email || "-"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Trạng thái kích hoạt</Text>
            <Box mt="xs">
              <StatusBadge statusType="masterdata" value={data.enabledFlag === "Y"} />
            </Box>
          </Grid.Col>
        </Grid>
      </Card>
    </Box>
  );
}

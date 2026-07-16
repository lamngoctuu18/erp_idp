import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Card, Title, Text, Button, Group, Center, Loader } from "@mantine/core";
import { IconAlertTriangle, IconArrowLeft, IconTrash } from "@tabler/icons-react";
import { apVendorAddressService } from "../../api/apVendor/apVendorMasterMockService";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";
import { ApVendorAddress } from "../../model/ApVendorMasterModel";

export default function DeleteApVendorAddress() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [address, setAddress] = useState<ApVendorAddress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkDelete = async () => {
      if (!id) return;
      try {
        const res = await apVendorAddressService.getById(Number(id));
        if (res.success && res.data) {
          setAddress(res.data);
        } else {
          NotificationExtension.Fails(res.message || "Không tìm thấy địa chỉ.");
          navigate("/ApVendorAddress/ApVendorAddressList");
        }
      } catch {
        NotificationExtension.Fails("Lỗi kiểm tra thông tin địa chỉ.");
      } finally {
        setLoading(false);
      }
    };

    checkDelete();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!id) return;
    try {
      const res = await apVendorAddressService.delete(Number(id));
      if (res.success) {
        NotificationExtension.Success("Xóa địa chỉ thành công!");
        navigate("/ApVendorAddress/ApVendorAddressList");
      } else {
        NotificationExtension.Fails(res.message || "Lỗi khi xóa.");
      }
    } catch {
      NotificationExtension.Fails("Lỗi khi kết nối Mock API.");
    }
  };

  if (loading) {
    return (
      <Center style={{ height: "300px" }}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (!address) return null;

  return (
    <Box>
      <Group justify="space-between" align="center" mb="lg">
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/ApVendorAddress/ApVendorAddressList")}>
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="lg">
        <Group mb="md">
          <IconAlertTriangle size={28} color="orange" />
          <Title order={3} c="orange">Xác nhận xóa Địa chỉ Nhà cung cấp</Title>
        </Group>

        <Text mb="md">
          Mã địa chỉ: <b>{address.addressId}</b> | Thuộc nhà cung cấp: <b>{address.vendorName}</b>
        </Text>
        <Text size="sm" mb="md" c="dimmed">
          Chi tiết địa chỉ: {address.addressLine1} {address.addressLine2 ? `, ${address.addressLine2}` : ""}, {address.city || "-"}, {address.country || "-"}
        </Text>

        <Box>
          <Text size="sm" mb="lg">
            Bạn có chắc chắn muốn xóa vĩnh viễn địa chỉ này khỏi nhà cung cấp? Hành động này không thể hoàn tác.
          </Text>
          <Group>
            <Button color="red" leftSection={<IconTrash size={16} />} onClick={handleDelete}>
              Xác nhận xóa vĩnh viễn
            </Button>
            <Button variant="outline" color="gray" onClick={() => navigate("/ApVendorAddress/ApVendorAddressList")}>
              Hủy bỏ
            </Button>
          </Group>
        </Box>
      </Card>
    </Box>
  );
}

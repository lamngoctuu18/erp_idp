import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Card, Title, Text, Button, Group, Center, Loader, Alert } from "@mantine/core";
import { IconAlertTriangle, IconArrowLeft, IconTrash } from "@tabler/icons-react";
import { apHoldDefinitionService, apInvoiceMasterService } from "../../api/apVendor/apInvoiceMasterMockService";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";
import { ApHoldDefinition } from "../../model/ApInvoiceMasterModel";

export default function DeleteApHoldDefinition() {
  const { id } = useParams<{ id: string }>(); // id holds the holdCode string
  const navigate = useNavigate();

  const [holdDef, setHoldDef] = useState<ApHoldDefinition | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUsed, setIsUsed] = useState(false);

  useEffect(() => {
    const checkDelete = async () => {
      if (!id) return;
      try {
        const res = await apHoldDefinitionService.getById(id);
        if (res.success && res.data) {
          setHoldDef(res.data);

          // Check if used in any active holds
          const holdsRes = await apHoldDefinitionService.delete(id); // Using the service's delete checker
          if (!holdsRes.success) {
            setIsUsed(true);
          }
        } else {
          NotificationExtension.Fails(res.message || "Không tìm thấy lý do khóa giữ.");
          navigate("/ApHoldDefinition/ApHoldDefinitionList");
        }
      } catch {
        NotificationExtension.Fails("Lỗi kiểm tra thông tin lý do khóa giữ.");
      } finally {
        setLoading(false);
      }
    };

    checkDelete();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!id) return;
    try {
      // Direct call since we verified in checking
      const res = await apHoldDefinitionService.delete(id);
      if (res.success) {
        NotificationExtension.Success("Xóa lý do khóa giữ thành công!");
        navigate("/ApHoldDefinition/ApHoldDefinitionList");
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

  if (!holdDef) return null;

  return (
    <Box>
      <Group justify="space-between" align="center" mb="lg">
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/ApHoldDefinition/ApHoldDefinitionList")}>
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="lg">
        <Group mb="md">
          <IconAlertTriangle size={28} color={isUsed ? "red" : "orange"} />
          <Title order={3} c={isUsed ? "red" : "orange"}>
            {isUsed ? "Không thể xóa Lý do khóa giữ này" : "Xác nhận xóa Lý do khóa giữ"}
          </Title>
        </Group>

        <Text mb="md">
          Mã lỗi: <b>{holdDef.holdCode}</b> | Tên lý do: <b>{holdDef.holdName}</b>
        </Text>

        {isUsed ? (
          <Box>
            <Alert color="red" icon={<IconAlertTriangle size={16} />} title="Đang được áp dụng cho hóa đơn:">
              <Text size="sm">
                Mã lỗi này hiện đang được áp dụng chặn thanh toán cho hóa đơn hoạt động trong hệ thống. Vui lòng giải tỏa (Release) tất cả hóa đơn liên quan trước khi xóa danh mục này.
              </Text>
            </Alert>
          </Box>
        ) : (
          <Box>
            <Text size="sm" mb="lg">
              Bạn có chắc chắn muốn xóa vĩnh viễn lý do khóa giữ này khỏi danh mục hệ thống? Hành động này không thể hoàn tác.
            </Text>
            <Group>
              <Button color="red" leftSection={<IconTrash size={16} />} onClick={handleDelete}>
                Xác nhận xóa vĩnh viễn
              </Button>
              <Button variant="outline" color="gray" onClick={() => navigate("/ApHoldDefinition/ApHoldDefinitionList")}>
                Hủy bỏ
              </Button>
            </Group>
          </Box>
        )}
      </Card>
    </Box>
  );
}

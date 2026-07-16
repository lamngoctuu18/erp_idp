import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Card, Title, Text, Button, List, Alert, Group, Stack, Center, Loader } from "@mantine/core";
import { IconAlertTriangle, IconArrowLeft, IconTrash } from "@tabler/icons-react";
import { glSetOfBookService, hrOperatingUnitService } from "../../api/sharedConfig/sharedConfigMockService";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";
import { GlSetOfBook, HrOperatingUnit } from "../../model/SharedConfigModel";

export default function DeleteGlSetOfBook() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [ledger, setLedger] = useState<GlSetOfBook | null>(null);
  const [loading, setLoading] = useState(true);
  const [blockingUnits, setBlockingUnits] = useState<HrOperatingUnit[]>([]);

  useEffect(() => {
    const checkDelete = async () => {
      if (!id) return;
      try {
        const ledgerRes = await glSetOfBookService.getById(Number(id));
        if (ledgerRes.success && ledgerRes.data) {
          setLedger(ledgerRes.data);

          // Lấy danh sách Operating Unit đang liên kết tới bộ sổ này
          const ouRes = await hrOperatingUnitService.getList({
            setOfBooksId: Number(id),
            take: 100
          });
          if (ouRes.success && ouRes.data) {
            setBlockingUnits(ouRes.data.items);
          }
        } else {
          NotificationExtension.Fails(ledgerRes.message || "Không tìm thấy Sổ cái.");
          navigate("/GlSetOfBook/GlSetOfBookList");
        }
      } catch {
        NotificationExtension.Fails("Lỗi kiểm tra điều kiện xóa Sổ cái.");
      } finally {
        setLoading(false);
      }
    };

    checkDelete();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!id) return;
    try {
      const res = await glSetOfBookService.delete(Number(id));
      if (res.success) {
        NotificationExtension.Success("Xóa Sổ cái chính thành công!");
        navigate("/GlSetOfBook/GlSetOfBookList");
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

  if (!ledger) return null;

  const canDelete = blockingUnits.length === 0;

  return (
    <Box>
      <Group justify="space-between" align="center" mb="lg">
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/GlSetOfBook/GlSetOfBookList")}>
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="lg">
        <Group mb="md">
          <IconAlertTriangle size={28} color={canDelete ? "orange" : "red"} />
          <Title order={3} c={canDelete ? "orange" : "red"}>
            {canDelete ? "Xác nhận xóa Sổ cái chính" : "Không thể xóa Sổ cái này"}
          </Title>
        </Group>

        <Text mb="md">
          Mã Sổ cái: <b>{ledger.setOfBooksId}</b> | Tên Sổ cái: <b>{ledger.name}</b> ({ledger.shortName || "-"})
        </Text>

        {!canDelete ? (
          <Stack gap="md">
            <Alert color="red" icon={<IconAlertTriangle size={16} />} title="Nguyên nhân chặn xóa:">
              <Text size="sm" mb="xs">
                Sổ cái này hiện đang liên kết với các Đơn vị hoạt động (Operating Units) bên dưới.
                Theo quy chuẩn ERP, bạn không thể xóa Sổ cái chính khi vẫn còn Đơn vị hoạt động phụ thuộc.
              </Text>
              <List size="sm" withPadding>
                {blockingUnits.map((ou) => (
                  <List.Item key={ou.orgId}>
                    Đơn vị hoạt động: <b>{ou.name}</b> (Mã số thuế: {ou.taxCode || "N/A"})
                  </List.Item>
                ))}
              </List>
            </Alert>

            <Alert color="blue" title="Hướng dẫn xử lý:">
              <Text size="sm">
                Vui lòng truy cập trang quản lý <b>Đơn vị hoạt động</b> để thay đổi liên kết Sổ cái chính của các đơn vị trên, hoặc thực hiện xóa các Đơn vị hoạt động này trước khi xóa Sổ cái chính.
              </Text>
            </Alert>
          </Stack>
        ) : (
          <Box>
            <Text size="sm" mb="lg">
              Sổ cái chính này hiện chưa có Đơn vị hoạt động nào liên kết. Bạn có chắc chắn muốn xóa vĩnh viễn? Hành động này không thể hoàn tác.
            </Text>
            <Group>
              <Button color="red" leftSection={<IconTrash size={16} />} onClick={handleDelete}>
                Xác nhận xóa vĩnh viễn
              </Button>
              <Button variant="outline" color="gray" onClick={() => navigate("/GlSetOfBook/GlSetOfBookList")}>
                Hủy bỏ
              </Button>
            </Group>
          </Box>
        )}
      </Card>
    </Box>
  );
}

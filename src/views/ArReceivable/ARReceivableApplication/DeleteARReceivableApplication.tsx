import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Card, Title, Text, Button, Flex, Stack } from "@mantine/core";
import { IconArrowLeft, IconTrash } from "@tabler/icons-react";
import { ARMockStorage } from "../mock/arMockStorage";
import { arCashService } from "../services/arCashService";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";

export default function DeleteARReceivableApplication() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [app, setApp] = useState<any>(null);

  useEffect(() => {
    const list = ARMockStorage.getReceivableApplications();
    const item = list.find(x => x.applicationId === Number(id));
    setApp(item);
  }, [id]);

  const handleDelete = async () => {
    if (app) {
      const res = await arCashService.unapplyReceipt(app.applicationId);
      if (res.success) {
        NotificationExtension.Success("Đã hủy phân bổ thành công!");
        navigate("/cong-no-phai-thu/apply-cong-no");
      } else {
        NotificationExtension.Fails(res.message);
      }
    }
  };

  if (!app) return <Text>Đang tải...</Text>;

  return (
    <Box>
      <Flex justify="space-between" align="center" mb="lg">
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/cong-no-phai-thu/apply-cong-no")}>
          Quay lại
        </Button>
      </Flex>

      <Card withBorder shadow="sm" color="red">
        <Stack gap="md">
          <Title order={4} c="red">Xác nhận hủy phân bổ APP-{app.applicationId}</Title>
          <Text size="sm">Bạn có chắc chắn muốn hủy phân bổ số tiền <b>{app.amountApplied?.toLocaleString()} VND</b> này không?</Text>
          <Button color="red" leftSection={<IconTrash size={16} />} onClick={handleDelete}>
            Xác nhận hủy
          </Button>
        </Stack>
      </Card>
    </Box>
  );
}

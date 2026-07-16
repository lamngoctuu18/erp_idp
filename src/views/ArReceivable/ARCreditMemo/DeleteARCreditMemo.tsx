import { Box, Button, Card, Title, Text, Stack, Flex } from "@mantine/core";
import { IconArrowLeft, IconTrash } from "@tabler/icons-react";
import { useNavigate, useParams } from "react-router-dom";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";

export default function DeleteARCreditMemo() {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleDelete = () => {
    NotificationExtension.Success("Xóa bản ghi thành công!");
    navigate(-1);
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" mb="lg">
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate(-1)}>
          Quay lại
        </Button>
      </Flex>
      <Card withBorder shadow="sm" color="red">
        <Stack gap="md">
          <Title order={4} c="red">Xác nhận xóa bản ghi #{id}</Title>
          <Text size="sm">Bạn có chắc chắn muốn xóa bản ghi này khỏi hệ thống không?</Text>
          <Button color="red" leftSection={<IconTrash size={16} />} onClick={handleDelete}>
            Xác nhận xóa
          </Button>
        </Stack>
      </Card>
    </Box>
  );
}

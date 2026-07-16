import { Box, Button, Card, Flex, Grid, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconArrowLeft, IconDeviceFloppy } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";

export default function CreateARAccounting() {
  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      orgId: 101,
      code: "NEW_CODE",
      name: "Tạo mới",
      amount: 1000000,
      description: ""
    }
  });

  const handleSubmit = (values: typeof form.values) => {
    NotificationExtension.Success("Đã thêm mới bản ghi thành công!");
    navigate(-1);
  };

  return (
    <Box component="form" onSubmit={form.onSubmit(handleSubmit)}>
      <Flex justify="space-between" align="center" mb="lg">
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate(-1)}>
          Quay lại
        </Button>
        <Button color="indigo" leftSection={<IconDeviceFloppy size={16} />} type="submit">
          Lưu bản ghi
        </Button>
      </Flex>
      <Card withBorder>
        <Title order={5} mb="sm" c="indigo">Thêm mới ARAccounting</Title>
        <Grid>
          <Grid.Col span={6}><TextInput label="Mã" {...form.getInputProps("code")} /></Grid.Col>
          <Grid.Col span={6}><TextInput label="Tên" {...form.getInputProps("name")} /></Grid.Col>
          <Grid.Col span={12}><TextInput label="Mô tả" {...form.getInputProps("description")} /></Grid.Col>
        </Grid>
      </Card>
    </Box>
  );
}

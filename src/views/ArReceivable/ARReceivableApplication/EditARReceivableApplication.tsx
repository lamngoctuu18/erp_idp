import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Card, Title, Text, Button, Flex, NumberInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconArrowLeft, IconDeviceFloppy } from "@tabler/icons-react";
import { ARMockStorage } from "../mock/arMockStorage";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";

export default function EditARReceivableApplication() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [app, setApp] = useState<any>(null);

  const form = useForm({
    initialValues: {
      amountApplied: 0
    },
    validate: {
      amountApplied: (v: number) => (v <= 0 ? "Số tiền phải lớn hơn 0" : null)
    }
  });

  useEffect(() => {
    const list = ARMockStorage.getReceivableApplications();
    const item = list.find(x => x.applicationId === Number(id));
    if (item) {
      setApp(item);
      form.setValues({ amountApplied: item.amountApplied });
    }
  }, [id]);

  const handleSubmit = (values: typeof form.values) => {
    const list = ARMockStorage.getReceivableApplications();
    const idx = list.findIndex(x => x.applicationId === Number(id));
    if (idx >= 0) {
      list[idx].amountApplied = values.amountApplied;
      localStorage.setItem("ar_receivable_applications", JSON.stringify(list));
      NotificationExtension.Success("Cập nhật phân bổ thành công!");
      navigate("/cong-no-phai-thu/apply-cong-no");
    }
  };

  if (!app) return <Text>Đang tải...</Text>;

  return (
    <Box component="form" onSubmit={form.onSubmit(handleSubmit)}>
      <Flex justify="space-between" align="center" mb="lg">
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/cong-no-phai-thu/apply-cong-no")}>
          Quay lại
        </Button>
        <Button color="indigo" leftSection={<IconDeviceFloppy size={16} />} type="submit">
          Lưu thay đổi
        </Button>
      </Flex>

      <Card withBorder shadow="sm">
        <Title order={5} mb="md" c="indigo">Chỉnh sửa phân bổ công nợ #APP-{app.applicationId}</Title>
        <NumberInput label="Số tiền phân bổ" {...form.getInputProps("amountApplied")} />
      </Card>
    </Box>
  );
}

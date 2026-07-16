import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";
import { Box, Card, Title, TextInput, Select, Group, Button, Grid, Divider } from "@mantine/core";
import { IconArrowLeft, IconDeviceFloppy } from "@tabler/icons-react";
import { hrOperatingUnitService, glSetOfBookService } from "../../api/sharedConfig/sharedConfigMockService";
import { GlSetOfBook } from "../../model/SharedConfigModel";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

export default function CreateHrOperatingUnit() {
  const navigate = useNavigate();
  const [ledgers, setLedgers] = useState<GlSetOfBook[]>([]);

  const form = useForm({
    initialValues: {
      name: "",
      setOfBooksId: "",
      taxCode: "",
      address: "",
      enabledFlag: "Y",
    },
    validate: {
      name: (val: any) => (val ? null : "Tên đơn vị hoạt động bắt buộc nhập"),
      setOfBooksId: (val: any) => (val ? null : "Vui lòng chọn Sổ cái chính liên kết"),
    },
  });

  useEffect(() => {
    const loadLedgers = async () => {
      try {
        const list = await glSetOfBookService.getAll();
        setLedgers(list);
        if (list.length > 0) {
          form.setFieldValue("setOfBooksId", String(list[0].setOfBooksId));
        }
      } catch {
        NotificationExtension.Fails("Không thể tải danh mục Sổ cái chính.");
      }
    };
    loadLedgers();
  }, []);

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const res = await hrOperatingUnitService.create({
        name: values.name,
        setOfBooksId: Number(values.setOfBooksId),
        taxCode: values.taxCode || null,
        address: values.address || null,
        enabledFlag: values.enabledFlag,
      });

      if (res.success) {
        NotificationExtension.Success("Khai báo Đơn vị hoạt động mới thành công!");
        navigate("/HrOperatingUnit/HrOperatingUnitList");
      } else {
        NotificationExtension.Fails(res.message || "Lỗi khi lưu.");
      }
    } catch {
      NotificationExtension.Fails("Không thể kết nối đến Mock API Service.");
    }
  };

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
        <Title order={3} mb="xs">Thêm mới Đơn vị hoạt động (Operating Unit Entry)</Title>
        <Divider mb="xl" />

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                required
                label="Tên đơn vị hoạt động"
                placeholder="Ví dụ: Văn phòng đại diện Đà Nẵng"
                {...form.getInputProps("name")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                required
                label="Sổ cái chính liên kết (Ledger)"
                placeholder="Chọn sổ cái kế toán"
                data={ledgers.map((l) => ({ value: String(l.setOfBooksId), label: l.name }))}
                {...form.getInputProps("setOfBooksId")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Mã số thuế (Tax Code)"
                placeholder="Ví dụ: 0102030405"
                {...form.getInputProps("taxCode")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                required
                label="Trạng thái hoạt động"
                data={[
                  { value: "Y", label: "Hoạt động (Y)" },
                  { value: "N", label: "Khóa hoạt động (N)" },
                ]}
                {...form.getInputProps("enabledFlag")}
              />
            </Grid.Col>

            <Grid.Col span={12}>
              <TextInput
                label="Địa chỉ trụ sở"
                placeholder="Số nhà, Tên đường, Quận/Huyện, Tỉnh/Thành phố..."
                {...form.getInputProps("address")}
              />
            </Grid.Col>
          </Grid>

          <Group justify="flex-end" mt="xl" pt="md" style={{ borderTop: "1px solid #dee2e6" }}>
            <Button variant="outline" color="gray" onClick={() => navigate("/HrOperatingUnit/HrOperatingUnitList")}>
              Hủy bỏ
            </Button>
            <Button type="submit" color="blue" leftSection={<IconDeviceFloppy size={18} />}>
              Lưu đơn vị
            </Button>
          </Group>
        </form>
      </Card>
    </Box>
  );
}

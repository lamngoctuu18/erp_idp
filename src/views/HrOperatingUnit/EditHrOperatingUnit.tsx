import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "@mantine/form";
import { Box, Card, Title, TextInput, Select, Group, Button, Grid, Divider, Text, Center, Loader } from "@mantine/core";
import { IconArrowLeft, IconDeviceFloppy } from "@tabler/icons-react";
import { hrOperatingUnitService, glSetOfBookService } from "../../api/sharedConfig/sharedConfigMockService";
import { GlSetOfBook } from "../../model/SharedConfigModel";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

export default function EditHrOperatingUnit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
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
      } catch {
        console.error("Không tải được danh sách sổ cái.");
      }
    };
    loadLedgers();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const res = await hrOperatingUnitService.getById(Number(id));
        if (res.success && res.data) {
          form.setValues({
            name: res.data.name,
            setOfBooksId: String(res.data.setOfBooksId),
            taxCode: res.data.taxCode || "",
            address: res.data.address || "",
            enabledFlag: res.data.enabledFlag,
          });
        } else {
          NotificationExtension.Fails(res.message || "Không tải được dữ liệu.");
          navigate("/HrOperatingUnit/HrOperatingUnitList");
        }
      } catch {
        NotificationExtension.Fails("Lỗi khi tải thông tin đơn vị hoạt động.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleSubmit = async (values: typeof form.values) => {
    if (!id) return;
    try {
      const res = await hrOperatingUnitService.update(Number(id), {
        name: values.name,
        setOfBooksId: Number(values.setOfBooksId),
        taxCode: values.taxCode || null,
        address: values.address || null,
        enabledFlag: values.enabledFlag,
      });

      if (res.success) {
        NotificationExtension.Success("Cập nhật đơn vị hoạt động thành công!");
        navigate("/HrOperatingUnit/HrOperatingUnitList");
      } else {
        NotificationExtension.Fails(res.message || "Lỗi khi lưu.");
      }
    } catch {
      NotificationExtension.Fails("Không thể lưu thay đổi.");
    }
  };

  if (loading) {
    return (
      <Center style={{ height: "300px" }}>
        <Loader size="lg" />
      </Center>
    );
  }

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
        <Title order={3} mb="xs">Cập nhật thông tin Đơn vị hoạt động</Title>
        <Text size="sm" c="dimmed" mb="lg">Mã số đơn vị (Org ID): <b>{id}</b></Text>
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
              Cập nhật đơn vị
            </Button>
          </Group>
        </form>
      </Card>
    </Box>
  );
}

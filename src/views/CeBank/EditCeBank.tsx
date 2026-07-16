import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "@mantine/form";
import { Box, Card, Title, TextInput, Select, Group, Button, Grid, Divider, Text, Center, Loader } from "@mantine/core";
import { IconArrowLeft, IconDeviceFloppy } from "@tabler/icons-react";
import { ceBankService } from "../../api/sharedConfig/ceBankMockService";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

export default function EditCeBank() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const form = useForm({
    initialValues: {
      bankName: "",
      countryCode: "VN",
      alternateBankName: "",
      shortBankName: "",
      bankNumber: "",
      taxRegistrationNumber: "",
      description: "",
      status: "ACTIVE",
    },
    validate: {
      bankName: (val: any) => (val ? null : "Tên ngân hàng bắt buộc nhập"),
      countryCode: (val: any) => (val ? null : "Quốc gia bắt buộc chọn"),
    },
  });

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const res = await ceBankService.getById(Number(id));
        if (res.success && res.data) {
          form.setValues({
            bankName: res.data.bankName,
            countryCode: res.data.countryCode,
            alternateBankName: res.data.alternateBankName || "",
            shortBankName: res.data.shortBankName || "",
            bankNumber: res.data.bankNumber || "",
            taxRegistrationNumber: res.data.taxRegistrationNumber || "",
            description: res.data.description || "",
            status: res.data.status,
          });
        } else {
          NotificationExtension.Fails(res.message || "Không tải được dữ liệu.");
          navigate("/CeBank/CeBankList");
        }
      } catch {
        NotificationExtension.Fails("Lỗi khi tải thông tin ngân hàng.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleSubmit = async (values: typeof form.values) => {
    if (!id) return;
    try {
      const res = await ceBankService.update(Number(id), {
        bankName: values.bankName,
        countryCode: values.countryCode,
        alternateBankName: values.alternateBankName || undefined,
        shortBankName: values.shortBankName || undefined,
        bankNumber: values.bankNumber || undefined,
        taxRegistrationNumber: values.taxRegistrationNumber || undefined,
        description: values.description || undefined,
        status: values.status,
      });

      if (res.success) {
        NotificationExtension.Success("Cập nhật thông tin ngân hàng thành công!");
        navigate("/CeBank/CeBankList");
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
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/CeBank/CeBankList")}>
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="xl">
        <Title order={3} mb="xs">Cập nhật thông tin Ngân hàng</Title>
        <Text size="sm" c="dimmed" mb="lg">Mã số ngân hàng (ID): <b>{id}</b></Text>
        <Divider mb="xl" />

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                required
                label="Tên ngân hàng"
                placeholder="Ví dụ: Ngân hàng TMCP Ngoại thương Việt Nam"
                {...form.getInputProps("bankName")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Tên giao dịch / Tên gọi khác (Alternate Name)"
                placeholder="Ví dụ: Vietcombank"
                {...form.getInputProps("alternateBankName")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                label="Tên viết tắt (Short Name)"
                placeholder="Ví dụ: VCB"
                {...form.getInputProps("shortBankName")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                label="Mã ngân hàng (Bank Number)"
                placeholder="Ví dụ: 001"
                {...form.getInputProps("bankNumber")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select
                required
                label="Quốc gia"
                data={[
                  { value: "VN", label: "Việt Nam (VN)" },
                  { value: "SG", label: "Singapore (SG)" },
                  { value: "US", label: "Hoa Kỳ (US)" },
                ]}
                {...form.getInputProps("countryCode")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Mã số thuế ngân hàng (Tax Registration)"
                placeholder="Nhập mã số thuế..."
                {...form.getInputProps("taxRegistrationNumber")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                required
                label="Trạng thái hoạt động"
                data={[
                  { value: "ACTIVE", label: "Hoạt động (ACTIVE)" },
                  { value: "INACTIVE", label: "Ngừng hoạt động (INACTIVE)" },
                ]}
                {...form.getInputProps("status")}
              />
            </Grid.Col>

            <Grid.Col span={12}>
              <TextInput
                label="Mô tả / Diễn giải"
                placeholder="Ghi chú thêm về vai trò ngân hàng này..."
                {...form.getInputProps("description")}
              />
            </Grid.Col>
          </Grid>

          <Group justify="flex-end" mt="xl" pt="md" style={{ borderTop: "1px solid #dee2e6" }}>
            <Button variant="outline" color="gray" onClick={() => navigate("/CeBank/CeBankList")}>
              Hủy bỏ
            </Button>
            <Button type="submit" color="blue" leftSection={<IconDeviceFloppy size={18} />}>
              Cập nhật ngân hàng
            </Button>
          </Group>
        </form>
      </Card>
    </Box>
  );
}

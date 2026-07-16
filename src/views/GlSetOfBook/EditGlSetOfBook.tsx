import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "@mantine/form";
import { Box, Card, Title, TextInput, Select, Group, Button, Grid, Divider, NumberInput, Text, Center, Loader } from "@mantine/core";
import { IconArrowLeft, IconDeviceFloppy } from "@tabler/icons-react";
import { glSetOfBookService } from "../../api/sharedConfig/sharedConfigMockService";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

export default function EditGlSetOfBook() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const form = useForm({
    initialValues: {
      name: "",
      shortName: "",
      currencyCode: "VND",
      chartOfAccountsId: 101,
      periodSetName: "Kỳ Tháng",
      enabledFlag: "Y",
    },
    validate: {
      name: (val: any) => (val ? null : "Tên bộ sổ bắt buộc nhập"),
      currencyCode: (val: any) => (val ? null : "Vui lòng chọn tiền tệ chính"),
    },
  });

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const res = await glSetOfBookService.getById(Number(id));
        if (res.success && res.data) {
          form.setValues({
            name: res.data.name,
            shortName: res.data.shortName || "",
            currencyCode: res.data.currencyCode,
            chartOfAccountsId: res.data.chartOfAccountsId || 101,
            periodSetName: res.data.periodSetName || "Kỳ Tháng",
            enabledFlag: res.data.enabledFlag,
          });
        } else {
          NotificationExtension.Fails(res.message || "Không tải được dữ liệu.");
          navigate("/GlSetOfBook/GlSetOfBookList");
        }
      } catch {
        NotificationExtension.Fails("Lỗi khi tải thông tin bộ sổ.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleSubmit = async (values: typeof form.values) => {
    if (!id) return;
    try {
      const res = await glSetOfBookService.update(Number(id), {
        name: values.name,
        shortName: values.shortName || null,
        currencyCode: values.currencyCode,
        chartOfAccountsId: values.chartOfAccountsId || null,
        periodSetName: values.periodSetName || null,
        enabledFlag: values.enabledFlag,
      });

      if (res.success) {
        NotificationExtension.Success("Cập nhật thông tin Sổ cái thành công!");
        navigate("/GlSetOfBook/GlSetOfBookList");
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
          onClick={() => navigate("/GlSetOfBook/GlSetOfBookList")}
        >
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="xl">
        <Title order={3} mb="xs">Cập nhật thông tin Sổ cái chính</Title>
        <Text size="sm" c="dimmed" mb="lg">Mã số bộ sổ cái: <b>{id}</b></Text>
        <Divider mb="xl" />

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                required
                label="Tên sổ cái chính (Ledger Name)"
                placeholder="Ví dụ: Sổ cái Tổng công ty IDP"
                {...form.getInputProps("name")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Tên viết tắt (Short Name)"
                placeholder="Ví dụ: IDP_MAIN"
                {...form.getInputProps("shortName")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select
                required
                label="Tiền tệ chính (Primary Currency)"
                data={[
                  { value: "VND", label: "VND - Việt Nam Đồng" },
                  { value: "USD", label: "USD - Đô la Mỹ" },
                  { value: "EUR", label: "EUR - Đồng Euro" },
                ]}
                {...form.getInputProps("currencyCode")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <NumberInput
                label="Mã cơ cấu tài khoản (COA ID)"
                placeholder="Ví dụ: 101"
                {...form.getInputProps("chartOfAccountsId")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select
                label="Kỳ kế toán (Period Set Name)"
                data={[
                  { value: "Kỳ Tháng", label: "Kỳ Tháng (Monthly)" },
                  { value: "Kỳ Quý", label: "Kỳ Quý (Quarterly)" },
                  { value: "Kỳ Năm", label: "Kỳ Năm (Yearly)" },
                ]}
                {...form.getInputProps("periodSetName")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select
                required
                label="Trạng thái giao dịch"
                data={[
                  { value: "Y", label: "Hoạt động (Y)" },
                  { value: "N", label: "Khóa hoạt động (N)" },
                ]}
                {...form.getInputProps("enabledFlag")}
              />
            </Grid.Col>
          </Grid>

          <Group justify="flex-end" mt="xl" pt="md" style={{ borderTop: "1px solid #dee2e6" }}>
            <Button variant="outline" color="gray" onClick={() => navigate("/GlSetOfBook/GlSetOfBookList")}>
              Hủy bỏ
            </Button>
            <Button type="submit" color="blue" leftSection={<IconDeviceFloppy size={18} />}>
              Cập nhật sổ cái
            </Button>
          </Group>
        </form>
      </Card>
    </Box>
  );
}

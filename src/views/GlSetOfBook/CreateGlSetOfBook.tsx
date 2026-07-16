import { useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";
import { Box, Card, Title, TextInput, Select, Group, Button, Grid, Divider, NumberInput } from "@mantine/core";
import { IconArrowLeft, IconDeviceFloppy } from "@tabler/icons-react";
import { glSetOfBookService } from "../../api/sharedConfig/sharedConfigMockService";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

export default function CreateGlSetOfBook() {
  const navigate = useNavigate();

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

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const res = await glSetOfBookService.create({
        name: values.name,
        shortName: values.shortName || null,
        currencyCode: values.currencyCode,
        chartOfAccountsId: values.chartOfAccountsId || null,
        periodSetName: values.periodSetName || null,
        enabledFlag: values.enabledFlag,
      });

      if (res.success) {
        NotificationExtension.Success("Khai báo Sổ cái chính mới thành công!");
        navigate("/GlSetOfBook/GlSetOfBookList");
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
          onClick={() => navigate("/GlSetOfBook/GlSetOfBookList")}
        >
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="xl">
        <Title order={3} mb="xs">Thêm mới Sổ cái chính (General Ledger Book Entry)</Title>
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
              Lưu sổ cái
            </Button>
          </Group>
        </form>
      </Card>
    </Box>
  );
}

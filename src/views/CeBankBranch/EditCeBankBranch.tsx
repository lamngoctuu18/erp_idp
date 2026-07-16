import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "@mantine/form";
import { Box, Card, Title, TextInput, Select, Group, Button, Grid, Divider, Text, Center, Loader } from "@mantine/core";
import { IconArrowLeft, IconDeviceFloppy } from "@tabler/icons-react";
import { ceBankBranchService, ceBankService } from "../../api/sharedConfig/ceBankMockService";
import { CeBank } from "../../model/CeBankModel";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

export default function EditCeBankBranch() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [banks, setBanks] = useState<CeBank[]>([]);

  const form = useForm({
    initialValues: {
      branchName: "",
      bankId: "",
      alternateBranchName: "",
      branchNumber: "",
      branchType: "BRANCH",
      addressLine1: "",
      city: "",
      description: "",
      status: "ACTIVE",
    },
    validate: {
      branchName: (val: any) => (val ? null : "Tên chi nhánh bắt buộc nhập"),
      bankId: (val: any) => (val ? null : "Vui lòng chọn Ngân hàng chính liên kết"),
    },
  });

  useEffect(() => {
    const loadBanks = async () => {
      try {
        const list = await ceBankService.getAll();
        setBanks(list);
      } catch {
        console.error("Không tải được danh sách ngân hàng.");
      }
    };
    loadBanks();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const res = await ceBankBranchService.getById(Number(id));
        if (res.success && res.data) {
          form.setValues({
            branchName: res.data.branchName,
            bankId: String(res.data.bankId),
            alternateBranchName: res.data.alternateBranchName || "",
            branchNumber: res.data.branchNumber || "",
            branchType: res.data.branchType || "BRANCH",
            addressLine1: res.data.addressLine1 || "",
            city: res.data.city || "",
            description: res.data.description || "",
            status: res.data.status,
          });
        } else {
          NotificationExtension.Fails(res.message || "Không tải được dữ liệu.");
          navigate("/CeBankBranch/CeBankBranchList");
        }
      } catch {
        NotificationExtension.Fails("Lỗi khi tải thông tin chi nhánh.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleSubmit = async (values: typeof form.values) => {
    if (!id) return;
    try {
      const res = await ceBankBranchService.update(Number(id), {
        branchName: values.branchName,
        bankId: Number(values.bankId),
        alternateBranchName: values.alternateBranchName || undefined,
        branchNumber: values.branchNumber || undefined,
        branchType: values.branchType || undefined,
        addressLine1: values.addressLine1 || undefined,
        city: values.city || undefined,
        description: values.description || undefined,
        status: values.status,
      });

      if (res.success) {
        NotificationExtension.Success("Cập nhật thông tin chi nhánh thành công!");
        navigate("/CeBankBranch/CeBankBranchList");
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
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/CeBankBranch/CeBankBranchList")}>
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="xl">
        <Title order={3} mb="xs">Cập nhật thông tin Chi nhánh Ngân hàng</Title>
        <Text size="sm" c="dimmed" mb="lg">Mã số chi nhánh (ID): <b>{id}</b></Text>
        <Divider mb="xl" />

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                required
                label="Tên chi nhánh ngân hàng"
                placeholder="Ví dụ: Chi nhánh Sở giao dịch"
                {...form.getInputProps("branchName")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                required
                label="Ngân hàng chính liên kết"
                placeholder="Chọn ngân hàng mẹ"
                data={banks.map((b) => ({ value: String(b.bankId), label: b.bankName }))}
                {...form.getInputProps("bankId")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                label="Tên giao dịch chi nhánh (Alternate Name)"
                placeholder="Ví dụ: SGD Vietcombank"
                {...form.getInputProps("alternateBranchName")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                label="Mã chi nhánh (Branch Number)"
                placeholder="Ví dụ: VCB001"
                {...form.getInputProps("branchNumber")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select
                label="Loại chi nhánh"
                data={[
                  { value: "MAIN", label: "Sở Giao Dịch chính (MAIN)" },
                  { value: "BRANCH", label: "Chi nhánh thông thường (BRANCH)" },
                  { value: "OFFICE", label: "Văn phòng giao dịch (OFFICE)" },
                ]}
                {...form.getInputProps("branchType")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Thành phố / Tỉnh"
                placeholder="Ví dụ: Hà Nội"
                {...form.getInputProps("city")}
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
                label="Địa chỉ chi nhánh"
                placeholder="Số nhà, Tên đường, Phường/Xã..."
                {...form.getInputProps("addressLine1")}
              />
            </Grid.Col>

            <Grid.Col span={12}>
              <TextInput
                label="Mô tả / Diễn giải"
                placeholder="Ghi chú thêm..."
                {...form.getInputProps("description")}
              />
            </Grid.Col>
          </Grid>

          <Group justify="flex-end" mt="xl" pt="md" style={{ borderTop: "1px solid #dee2e6" }}>
            <Button variant="outline" color="gray" onClick={() => navigate("/CeBankBranch/CeBankBranchList")}>
              Hủy bỏ
            </Button>
            <Button type="submit" color="blue" leftSection={<IconDeviceFloppy size={18} />}>
              Cập nhật chi nhánh
            </Button>
          </Group>
        </form>
      </Card>
    </Box>
  );
}

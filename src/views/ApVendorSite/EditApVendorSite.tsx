import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "@mantine/form";
import { Box, Card, Title, TextInput, Select, Group, Button, Grid, Divider, Text, Center, Loader, NumberInput } from "@mantine/core";
import { IconArrowLeft, IconDeviceFloppy } from "@tabler/icons-react";
import { apVendorSiteMasterService, apVendorMasterService } from "../../api/apVendor/apVendorMasterMockService";
import { ApVendor } from "../../model/ApVendorMasterModel";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

export default function EditApVendorSite() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [vendors, setVendors] = useState<ApVendor[]>([]);

  const form = useForm({
    initialValues: {
      vendorId: "",
      vendorSiteCode: "",
      addressLine1: "",
      phone: "",
      email: "",
      bankAccountNum: "",
      bankName: "",
      defaultTermsId: 1,
      defaultPayablesCcid: 33101,
      enabledFlag: "Y"
    },
    validate: {
      vendorId: (val: any) => (val ? null : "Vui lòng chọn Nhà cung cấp"),
      vendorSiteCode: (val: any) => (val ? null : "Mã chi nhánh bắt buộc nhập")
    }
  });

  useEffect(() => {
    const loadVendors = async () => {
      try {
        const list = await apVendorMasterService.getAll();
        setVendors(list);
      } catch {
        console.error("Không tải được danh sách nhà cung cấp.");
      }
    };
    loadVendors();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const res = await apVendorSiteMasterService.getById(Number(id));
        if (res.success && res.data) {
          form.setValues({
            vendorId: String(res.data.vendorId),
            vendorSiteCode: res.data.vendorSiteCode,
            addressLine1: res.data.addressLine1 || "",
            phone: res.data.phone || "",
            email: res.data.email || "",
            bankAccountNum: res.data.bankAccountNum || "",
            bankName: res.data.bankName || "",
            defaultTermsId: res.data.defaultTermsId || 1,
            defaultPayablesCcid: res.data.defaultPayablesCcid || 33101,
            enabledFlag: res.data.enabledFlag || "Y"
          });
        } else {
          NotificationExtension.Fails(res.message || "Không tải được dữ liệu.");
          navigate("/ApVendorSite/ApVendorSiteList");
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
      const res = await apVendorSiteMasterService.update(Number(id), {
        vendorId: Number(values.vendorId),
        vendorSiteCode: values.vendorSiteCode,
        addressLine1: values.addressLine1 || null,
        phone: values.phone || null,
        email: values.email || null,
        bankAccountNum: values.bankAccountNum || null,
        bankName: values.bankName || null,
        defaultTermsId: values.defaultTermsId ? Number(values.defaultTermsId) : null,
        defaultPayablesCcid: values.defaultPayablesCcid ? Number(values.defaultPayablesCcid) : null,
        enabledFlag: values.enabledFlag
      });

      if (res.success) {
        NotificationExtension.Success("Cập nhật chi nhánh nhà cung cấp thành công!");
        navigate("/ApVendorSite/ApVendorSiteList");
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
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/ApVendorSite/ApVendorSiteList")}>
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="xl">
        <Title order={3} mb="xs">Cập nhật Chi nhánh Giao dịch Nhà cung cấp</Title>
        <Text size="sm" c="dimmed" mb="lg">Mã số chi nhánh (ID): <b>{id}</b></Text>
        <Divider mb="xl" />

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                required
                label="Nhà cung cấp chủ quản"
                placeholder="Chọn nhà cung cấp"
                data={vendors.map((v) => ({ value: String(v.vendorId), label: v.vendorName }))}
                {...form.getInputProps("vendorId")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                required
                label="Mã chi nhánh (Vendor Site Code)"
                placeholder="Ví dụ: VNM-HCM-OFFICE"
                {...form.getInputProps("vendorSiteCode")}
              />
            </Grid.Col>

            <Grid.Col span={12}>
              <TextInput
                label="Địa chỉ chi nhánh"
                placeholder="Số nhà, Tên đường, Phường/Xã..."
                {...form.getInputProps("addressLine1")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Số điện thoại chi nhánh"
                placeholder="Nhập số điện thoại..."
                {...form.getInputProps("phone")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Địa chỉ Email"
                placeholder="sales@vendor-branch.com"
                {...form.getInputProps("email")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Số tài khoản ngân hàng thụ hưởng"
                placeholder="Nhập số tài khoản..."
                {...form.getInputProps("bankAccountNum")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Tên ngân hàng thụ hưởng"
                placeholder="Ví dụ: Vietcombank"
                {...form.getInputProps("bankName")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <NumberInput
                label="Mã điều khoản thanh toán mặc định (Default Terms ID)"
                placeholder="Ví dụ: 1"
                {...form.getInputProps("defaultTermsId")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <NumberInput
                label="Mã tài khoản kế toán công nợ (Default Ccid)"
                placeholder="Ví dụ: 33101"
                {...form.getInputProps("defaultPayablesCcid")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select
                required
                label="Trạng thái kích hoạt"
                data={[
                  { value: "Y", label: "Hoạt động (Y)" },
                  { value: "N", label: "Tắt hoạt động (N)" }
                ]}
                {...form.getInputProps("enabledFlag")}
              />
            </Grid.Col>
          </Grid>

          <Group justify="flex-end" mt="xl" pt="md" style={{ borderTop: "1px solid #dee2e6" }}>
            <Button variant="outline" color="gray" onClick={() => navigate("/ApVendorSite/ApVendorSiteList")}>
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

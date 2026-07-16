import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";
import { Box, Card, Title, TextInput, Select, Group, Button, Grid, Divider, NumberInput } from "@mantine/core";
import { IconArrowLeft, IconDeviceFloppy } from "@tabler/icons-react";
import { apVendorSiteMasterService, apVendorMasterService } from "../../api/apVendor/apVendorMasterMockService";
import { ApVendor } from "../../model/ApVendorMasterModel";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

export default function CreateApVendorSite() {
  const navigate = useNavigate();
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
        if (list.length > 0) {
          form.setFieldValue("vendorId", String(list[0].vendorId));
        }
      } catch {
        NotificationExtension.Fails("Không thể tải danh sách Nhà cung cấp.");
      }
    };
    loadVendors();
  }, []);

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const res = await apVendorSiteMasterService.create({
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
        NotificationExtension.Success("Khai báo chi nhánh mới thành công!");
        navigate("/ApVendorSite/ApVendorSiteList");
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
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/ApVendorSite/ApVendorSiteList")}>
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="xl">
        <Title order={3} mb="xs">Thêm mới Chi nhánh Giao dịch Nhà cung cấp (Vendor Site Entry)</Title>
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
              Lưu chi nhánh
            </Button>
          </Group>
        </form>
      </Card>
    </Box>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";
import { Box, Card, Title, TextInput, Select, Group, Button, Grid, Divider } from "@mantine/core";
import { IconArrowLeft, IconDeviceFloppy } from "@tabler/icons-react";
import { apVendorAddressService, apVendorMasterService } from "../../api/apVendor/apVendorMasterMockService";
import { ApVendor } from "../../model/ApVendorMasterModel";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

export default function CreateApVendorAddress() {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState<ApVendor[]>([]);

  const form = useForm({
    initialValues: {
      vendorId: "",
      addressType: "PRIMARY",
      addressLine1: "",
      addressLine2: "",
      addressLine3: "",
      city: "",
      state: "",
      postalCode: "",
      country: "VN",
      phone: "",
      fax: "",
      email: "",
      isPrimary: "Y",
      enabledFlag: "Y"
    },
    validate: {
      vendorId: (val: any) => (val ? null : "Vui lòng chọn Nhà cung cấp"),
      addressLine1: (val: any) => (val ? null : "Địa chỉ dòng 1 bắt buộc nhập")
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
      const res = await apVendorAddressService.create({
        vendorId: Number(values.vendorId),
        addressType: values.addressType || null,
        addressLine1: values.addressLine1 || null,
        addressLine2: values.addressLine2 || null,
        addressLine3: values.addressLine3 || null,
        city: values.city || null,
        state: values.state || null,
        postalCode: values.postalCode || null,
        country: values.country || null,
        phone: values.phone || null,
        fax: values.fax || null,
        email: values.email || null,
        isPrimary: values.isPrimary,
        enabledFlag: values.enabledFlag
      });

      if (res.success) {
        NotificationExtension.Success("Thêm mới địa chỉ nhà cung cấp thành công!");
        navigate("/ApVendorAddress/ApVendorAddressList");
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
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/ApVendorAddress/ApVendorAddressList")}>
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="xl">
        <Title order={3} mb="xs">Thêm mới Địa chỉ Nhà cung cấp (Vendor Address Entry)</Title>
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
              <Select
                label="Loại địa chỉ"
                data={[
                  { value: "PRIMARY", label: "Địa chỉ chính (PRIMARY)" },
                  { value: "BILLING", label: "Địa chỉ thanh toán (BILLING)" },
                  { value: "SHIPPING", label: "Địa chỉ giao hàng (SHIPPING)" }
                ]}
                {...form.getInputProps("addressType")}
              />
            </Grid.Col>

            <Grid.Col span={12}>
              <TextInput
                required
                label="Địa chỉ dòng 1"
                placeholder="Ví dụ: 10 Tân Trào, Tân Phú"
                {...form.getInputProps("addressLine1")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Địa chỉ dòng 2 (Tòa nhà / Tầng...)"
                placeholder="Ví dụ: Tòa nhà Vinamilk"
                {...form.getInputProps("addressLine2")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Địa chỉ dòng 3 (Khu công nghiệp / Ghi chú địa lý...)"
                placeholder="..."
                {...form.getInputProps("addressLine3")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                label="Thành phố / Tỉnh"
                placeholder="Ví dụ: Hồ Chí Minh"
                {...form.getInputProps("city")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                label="Quận / Huyện / Bang (State)"
                placeholder="Ví dụ: Quận 7"
                {...form.getInputProps("state")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                label="Mã bưu điện (Postal Code)"
                placeholder="Ví dụ: 700000"
                {...form.getInputProps("postalCode")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                label="Quốc gia"
                placeholder="Ví dụ: VN"
                {...form.getInputProps("country")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                label="Số điện thoại"
                placeholder="Nhập số điện thoại..."
                {...form.getInputProps("phone")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                label="Số Fax"
                placeholder="Nhập số Fax..."
                {...form.getInputProps("fax")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                label="Địa chỉ Email"
                placeholder="example@vendor.com"
                {...form.getInputProps("email")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select
                required
                label="Đặt làm địa chỉ chính (Primary)"
                data={[
                  { value: "Y", label: "Có (Y)" },
                  { value: "N", label: "Không (N)" }
                ]}
                {...form.getInputProps("isPrimary")}
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
            <Button variant="outline" color="gray" onClick={() => navigate("/ApVendorAddress/ApVendorAddressList")}>
              Hủy bỏ
            </Button>
            <Button type="submit" color="blue" leftSection={<IconDeviceFloppy size={18} />}>
              Lưu địa chỉ
            </Button>
          </Group>
        </form>
      </Card>
    </Box>
  );
}

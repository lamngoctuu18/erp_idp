import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";
import { Box, Card, Title, TextInput, Select, Group, Button, Grid, Divider } from "@mantine/core";
import { IconArrowLeft, IconDeviceFloppy } from "@tabler/icons-react";
import { apVendorMergeHistoryService, apVendorMasterService, apVendorSiteMasterService } from "../../api/apVendor/apVendorMasterMockService";
import { ApVendor, ApVendorSite } from "../../model/ApVendorMasterModel";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

export default function CreateApVendorMergeHistory() {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState<ApVendor[]>([]);
  const [allSites, setAllSites] = useState<ApVendorSite[]>([]);

  const form = useForm({
    initialValues: {
      fromVendorId: "",
      fromVendorSiteId: "",
      toVendorId: "",
      toVendorSiteId: "",
      invoiceScope: "ALL",
      poMergeFlag: "Y",
      mergeDate: new Date().toISOString().substring(0, 10)
    },
    validate: {
      fromVendorId: (val: any) => (val ? null : "Vui lòng chọn Nhà cung cấp nguồn"),
      toVendorId: (val: any, values: any) => {
        if (!val) return "Vui lòng chọn Nhà cung cấp đích";
        if (val === values.fromVendorId) return "Nhà cung cấp đích không được trùng với nguồn";
        return null;
      }
    }
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const vList = await apVendorMasterService.getAll();
        setVendors(vList);
        const sList = await apVendorSiteMasterService.getAll();
        setAllSites(sList);

        if (vList.length > 1) {
          form.setFieldValue("fromVendorId", String(vList[0].vendorId));
          form.setFieldValue("toVendorId", String(vList[1].vendorId));
        }
      } catch {
        NotificationExtension.Fails("Không thể tải danh sách Nhà cung cấp/Chi nhánh.");
      }
    };
    loadData();
  }, []);

  const fromSites = useMemo(() => {
    const vId = form.values.fromVendorId;
    if (!vId) return [];
    return allSites.filter((x) => x.vendorId === Number(vId));
  }, [allSites, form.values.fromVendorId]);

  const toSites = useMemo(() => {
    const vId = form.values.toVendorId;
    if (!vId) return [];
    return allSites.filter((x) => x.vendorId === Number(vId));
  }, [allSites, form.values.toVendorId]);

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const res = await apVendorMergeHistoryService.create({
        fromVendorId: Number(values.fromVendorId),
        fromVendorSiteId: values.fromVendorSiteId ? Number(values.fromVendorSiteId) : null,
        toVendorId: Number(values.toVendorId),
        toVendorSiteId: values.toVendorSiteId ? Number(values.toVendorSiteId) : null,
        invoiceScope: values.invoiceScope || null,
        poMergeFlag: values.poMergeFlag || null,
        mergeDate: values.mergeDate || null
      });

      if (res.success) {
        NotificationExtension.Success("Ghi nhận lịch sử gộp nhà cung cấp thành công!");
        navigate("/ApVendorMergeHistory/ApVendorMergeHistoryList");
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
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/ApVendorMergeHistory/ApVendorMergeHistoryList")}>
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="xl">
        <Title order={3} mb="xs">Ghi nhận Giao dịch gộp Nhà cung cấp (Vendor Merge Process)</Title>
        <Divider mb="xl" />

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Grid gutter="md">
            {/* Cột trái: Từ Nhà cung cấp nguồn */}
            <Grid.Col span={{ base: 12, md: 6 }} style={{ borderRight: "1px solid #dee2e6" }}>
              <Title order={4} mb="sm" c="red">Từ Nhà cung cấp nguồn (From Vendor)</Title>
              <Select
                required
                label="Nhà cung cấp nguồn"
                placeholder="Chọn nhà cung cấp nguồn"
                data={vendors.map((v) => ({ value: String(v.vendorId), label: v.vendorName }))}
                {...form.getInputProps("fromVendorId")}
              />
              <Select
                mt="md"
                label="Chi nhánh nguồn (Tùy chọn)"
                placeholder="Tất cả chi nhánh"
                clearable
                data={fromSites.map((s) => ({ value: String(s.vendorSiteId), label: s.vendorSiteCode }))}
                {...form.getInputProps("fromVendorSiteId")}
              />
            </Grid.Col>

            {/* Cột phải: Đến Nhà cung cấp đích */}
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Title order={4} mb="sm" c="green">Đến Nhà cung cấp đích (To Vendor)</Title>
              <Select
                required
                label="Nhà cung cấp đích"
                placeholder="Chọn nhà cung cấp đích"
                data={vendors.map((v) => ({ value: String(v.vendorId), label: v.vendorName }))}
                {...form.getInputProps("toVendorId")}
              />
              <Select
                mt="md"
                label="Chi nhánh đích (Tùy chọn)"
                placeholder="Tất cả chi nhánh"
                clearable
                data={toSites.map((s) => ({ value: String(s.vendorSiteId), label: s.vendorSiteCode }))}
                {...form.getInputProps("toVendorSiteId")}
              />
            </Grid.Col>

            <Grid.Col span={12}>
              <Divider my="md" />
            </Grid.Col>

            {/* Cấu hình gộp */}
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select
                required
                label="Phạm vi chuyển hóa đơn (Invoice Scope)"
                data={[
                  { value: "ALL", label: "Tất cả các hóa đơn (ALL)" },
                  { value: "UNPAID", label: "Chỉ hóa đơn chưa thanh toán (UNPAID)" }
                ]}
                {...form.getInputProps("invoiceScope")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select
                required
                label="Gộp cả đơn mua hàng (PO Merge)"
                data={[
                  { value: "Y", label: "Có (Y)" },
                  { value: "N", label: "Không (N)" }
                ]}
                {...form.getInputProps("poMergeFlag")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                type="date"
                required
                label="Ngày thực hiện gộp"
                {...form.getInputProps("mergeDate")}
              />
            </Grid.Col>
          </Grid>

          <Group justify="flex-end" mt="xl" pt="md" style={{ borderTop: "1px solid #dee2e6" }}>
            <Button variant="outline" color="gray" onClick={() => navigate("/ApVendorMergeHistory/ApVendorMergeHistoryList")}>
              Hủy bỏ
            </Button>
            <Button type="submit" color="blue" leftSection={<IconDeviceFloppy size={18} />}>
              Thực hiện gộp & Lưu lịch sử
            </Button>
          </Group>
        </form>
      </Card>
    </Box>
  );
}

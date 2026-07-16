import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "@mantine/form";
import { Box, Card, Title, TextInput, Select, Group, Button, Grid, Divider, Text, Center, Loader } from "@mantine/core";
import { IconArrowLeft, IconDeviceFloppy } from "@tabler/icons-react";
import { apVendorMergeHistoryService, apVendorMasterService, apVendorSiteMasterService } from "../../api/apVendor/apVendorMasterMockService";
import { ApVendor, ApVendorSite } from "../../model/ApVendorMasterModel";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

export default function EditApVendorMergeHistory() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
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
      mergeDate: ""
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
      } catch {
        console.error("Không tải được danh mục nhà cung cấp/chi nhánh.");
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const res = await apVendorMergeHistoryService.getById(Number(id));
        if (res.success && res.data) {
          form.setValues({
            fromVendorId: String(res.data.fromVendorId),
            fromVendorSiteId: res.data.fromVendorSiteId ? String(res.data.fromVendorSiteId) : "",
            toVendorId: String(res.data.toVendorId),
            toVendorSiteId: res.data.toVendorSiteId ? String(res.data.toVendorSiteId) : "",
            invoiceScope: res.data.invoiceScope || "ALL",
            poMergeFlag: res.data.poMergeFlag || "Y",
            mergeDate: res.data.mergeDate ? res.data.mergeDate.substring(0, 10) : ""
          });
        } else {
          NotificationExtension.Fails(res.message || "Không tải được dữ liệu.");
          navigate("/ApVendorMergeHistory/ApVendorMergeHistoryList");
        }
      } catch {
        NotificationExtension.Fails("Lỗi khi tải thông tin lịch sử gộp.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

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
    if (!id) return;
    try {
      const res = await apVendorMergeHistoryService.update(Number(id), {
        fromVendorId: Number(values.fromVendorId),
        fromVendorSiteId: values.fromVendorSiteId ? Number(values.fromVendorSiteId) : null,
        toVendorId: Number(values.toVendorId),
        toVendorSiteId: values.toVendorSiteId ? Number(values.toVendorSiteId) : null,
        invoiceScope: values.invoiceScope || null,
        poMergeFlag: values.poMergeFlag || null,
        mergeDate: values.mergeDate || null
      });

      if (res.success) {
        NotificationExtension.Success("Cập nhật lịch sử gộp nhà cung cấp thành công!");
        navigate("/ApVendorMergeHistory/ApVendorMergeHistoryList");
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
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/ApVendorMergeHistory/ApVendorMergeHistoryList")}>
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="xl">
        <Title order={3} mb="xs">Cập nhật Giao dịch gộp Nhà cung cấp</Title>
        <Text size="sm" c="dimmed" mb="lg">Mã số giao dịch gộp (ID): <b>{id}</b></Text>
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
              Cập nhật lịch sử gộp
            </Button>
          </Group>
        </form>
      </Card>
    </Box>
  );
}

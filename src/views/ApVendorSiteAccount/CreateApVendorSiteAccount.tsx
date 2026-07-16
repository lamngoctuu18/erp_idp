import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";
import { Box, Card, Title, TextInput, Select, Group, Button, Grid, Divider, NumberInput } from "@mantine/core";
import { IconArrowLeft, IconDeviceFloppy } from "@tabler/icons-react";
import { apVendorSiteAccountService, apVendorSiteMasterService } from "../../api/apVendor/apVendorMasterMockService";
import { ApVendorSite } from "../../model/ApVendorMasterModel";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

export default function CreateApVendorSiteAccount() {
  const navigate = useNavigate();
  const [sites, setSites] = useState<ApVendorSite[]>([]);

  const form = useForm({
    initialValues: {
      vendorSiteId: "",
      ledgerId: 1,
      legalEntityId: 10,
      liabilityCcid: 331101,
      prepaymentCcid: 141101,
      billsPayableCcid: 331301,
      distributionSetId: 1,
      status: "ACTIVE"
    },
    validate: {
      vendorSiteId: (val: any) => (val ? null : "Vui lòng chọn Chi nhánh liên kết")
    }
  });

  useEffect(() => {
    const loadSites = async () => {
      try {
        const list = await apVendorSiteMasterService.getAll();
        setSites(list);
        if (list.length > 0) {
          form.setFieldValue("vendorSiteId", String(list[0].vendorSiteId));
        }
      } catch {
        NotificationExtension.Fails("Không thể tải danh sách Chi nhánh.");
      }
    };
    loadSites();
  }, []);

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const res = await apVendorSiteAccountService.create({
        vendorSiteId: Number(values.vendorSiteId),
        ledgerId: values.ledgerId ? Number(values.ledgerId) : null,
        legalEntityId: values.legalEntityId ? Number(values.legalEntityId) : null,
        liabilityCcid: values.liabilityCcid ? Number(values.liabilityCcid) : null,
        prepaymentCcid: values.prepaymentCcid ? Number(values.prepaymentCcid) : null,
        billsPayableCcid: values.billsPayableCcid ? Number(values.billsPayableCcid) : null,
        distributionSetId: values.distributionSetId ? Number(values.distributionSetId) : null,
        status: values.status || null
      });

      if (res.success) {
        NotificationExtension.Success("Thêm tài khoản hạch toán chi nhánh thành công!");
        navigate("/ApVendorSiteAccount/ApVendorSiteAccountList");
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
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/ApVendorSiteAccount/ApVendorSiteAccountList")}>
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="xl">
        <Title order={3} mb="xs">Thêm mới Tài khoản Hạch toán Chi nhánh Nhà cung cấp (Site Account Entry)</Title>
        <Divider mb="xl" />

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Grid gutter="md">
            <Grid.Col span={12}>
              <Select
                required
                label="Chi nhánh nhà cung cấp liên kết"
                placeholder="Chọn chi nhánh"
                data={sites.map((s) => ({ value: String(s.vendorSiteId), label: `${s.vendorSiteCode} (${s.vendorName})` }))}
                {...form.getInputProps("vendorSiteId")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label="Mã sổ cái (Ledger ID)"
                placeholder="Ví dụ: 1"
                {...form.getInputProps("ledgerId")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label="Mã pháp nhân chủ quản (Legal Entity ID)"
                placeholder="Ví dụ: 10"
                {...form.getInputProps("legalEntityId")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label="Mã tài khoản Kế toán công nợ phải trả (Liability CCID)"
                placeholder="Ví dụ: 331101"
                {...form.getInputProps("liabilityCcid")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label="Mã tài khoản Kế toán tạm ứng trước (Prepayment CCID)"
                placeholder="Ví dụ: 141101"
                {...form.getInputProps("prepaymentCcid")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label="Mã tài khoản Kế toán thương phiếu phải trả (Bills Payable CCID)"
                placeholder="Ví dụ: 331301"
                {...form.getInputProps("billsPayableCcid")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label="Mã bộ phân bổ chi phí mặc định (Distribution Set ID)"
                placeholder="Ví dụ: 1"
                {...form.getInputProps("distributionSetId")}
              />
            </Grid.Col>

            <Grid.Col span={12}>
              <Select
                required
                label="Trạng thái hiệu lực hạch toán"
                data={[
                  { value: "ACTIVE", label: "Đang hoạt động (ACTIVE)" },
                  { value: "INACTIVE", label: "Ngừng hoạt động (INACTIVE)" }
                ]}
                {...form.getInputProps("status")}
              />
            </Grid.Col>
          </Grid>

          <Group justify="flex-end" mt="xl" pt="md" style={{ borderTop: "1px solid #dee2e6" }}>
            <Button variant="outline" color="gray" onClick={() => navigate("/ApVendorSiteAccount/ApVendorSiteAccountList")}>
              Hủy bỏ
            </Button>
            <Button type="submit" color="blue" leftSection={<IconDeviceFloppy size={18} />}>
              Lưu tài khoản
            </Button>
          </Group>
        </form>
      </Card>
    </Box>
  );
}

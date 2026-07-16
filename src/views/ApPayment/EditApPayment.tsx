import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "@mantine/form";
import { Box, Card, Title, TextInput, Select, Group, Button, Grid, Divider, NumberInput, Text, Center, Loader } from "@mantine/core";
import { IconArrowLeft, IconDeviceFloppy } from "@tabler/icons-react";
import { apPaymentService } from "../../api/apVendor/apPaymentMockService";
import { apVendorMasterService, apVendorSiteMasterService } from "../../api/apVendor/apVendorMasterMockService";
import { ApVendor, ApVendorSite } from "../../model/ApVendorMasterModel";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

export default function EditApPayment() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [vendors, setVendors] = useState<ApVendor[]>([]);
  const [sites, setSites] = useState<ApVendorSite[]>([]);

  const form = useForm({
    initialValues: {
      orgId: 10,
      vendorId: "",
      vendorSiteId: "",
      bankAccountId: 1001,
      bankAccountNum: "",
      bankAccountName: "",
      bankAccountType: "CHECKING",
      bankFt: "",
      currencyCode: "VND",
      paymentTypeFlag: "Q",
      paymentMethodLookupCode: "WIRE",
      statusLookupCode: "NEGOTIABLE",
      description: "",
      exchangeRate: 1,
      amount: 0,
      baseAmount: 0,
      ccidCr: 112101,
      ccidDr: 33101,
      paymentType: "SUPPLIER",
      rateType: "",
      rateDate: "",
      clearStatus: "CLEARED",
      voidStatus: "",
      voidDate: "",
      voidGlDate: ""
    },
    validate: {
      vendorId: (val: any) => (val ? null : "Vui lòng chọn Nhà cung cấp"),
      vendorSiteId: (val: any) => (val ? null : "Vui lòng chọn Chi nhánh nhà cung cấp")
    }
  });

  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const vList = await apVendorMasterService.getAll();
        setVendors(vList);
        const sList = await apVendorSiteMasterService.getAll();
        setSites(sList);
      } catch {
        console.error("Không tải được danh mục nhà cung cấp/chi nhánh.");
      }
    };
    loadMetadata();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const res = await apPaymentService.getById(Number(id));
        if (res.success && res.data) {
          form.setValues({
            orgId: res.data.orgId,
            vendorId: String(res.data.vendorId),
            vendorSiteId: String(res.data.vendorSiteId),
            bankAccountId: res.data.bankAccountId || 1001,
            bankAccountNum: res.data.bankAccountNum ? String(res.data.bankAccountNum) : "",
            bankAccountName: res.data.bankAccountName || "",
            bankAccountType: res.data.bankAccountType || "CHECKING",
            bankFt: res.data.bankFt || "",
            currencyCode: res.data.currencyCode,
            paymentTypeFlag: res.data.paymentTypeFlag || "Q",
            paymentMethodLookupCode: res.data.paymentMethodLookupCode,
            statusLookupCode: res.data.statusLookupCode,
            description: res.data.description || "",
            exchangeRate: res.data.exchangeRate || 1,
            amount: res.data.amount || 0,
            baseAmount: res.data.baseAmount || 0,
            ccidCr: res.data.ccidCr || 112101,
            ccidDr: res.data.ccidDr || 33101,
            paymentType: res.data.paymentType || "SUPPLIER",
            rateType: res.data.rateType || "",
            rateDate: res.data.rateDate || "",
            clearStatus: res.data.clearStatus || "CLEARED",
            voidStatus: res.data.voidStatus || "",
            voidDate: res.data.voidDate || "",
            voidGlDate: res.data.voidGlDate || ""
          });
        } else {
          NotificationExtension.Fails(res.message || "Không tải được dữ liệu.");
          navigate("/ApPayment/ApPaymentList");
        }
      } catch {
        NotificationExtension.Fails("Lỗi khi tải thông tin phiếu chi.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const filteredSites = useMemo(() => {
    const vId = form.values.vendorId;
    if (!vId) return [];
    return sites.filter((x) => x.vendorId === Number(vId));
  }, [sites, form.values.vendorId]);

  const handleSubmit = async (values: typeof form.values) => {
    if (!id) return;
    try {
      const selectedVendor = vendors.find((x) => x.vendorId === Number(values.vendorId));
      const selectedSite = sites.find((x) => x.vendorSiteId === Number(values.vendorSiteId));

      const res = await apPaymentService.update(Number(id), {
        orgId: Number(values.orgId),
        vendorId: Number(values.vendorId),
        vendorName: selectedVendor ? selectedVendor.vendorName : "N/A",
        vendorSiteId: Number(values.vendorSiteId),
        vendorSiteCode: selectedSite ? selectedSite.vendorSiteCode : "N/A",
        bankAccountId: values.bankAccountId ? Number(values.bankAccountId) : null,
        bankAccountNum: values.bankAccountNum ? Number(values.bankAccountNum) : null,
        bankAccountName: values.bankAccountName || null,
        bankAccountType: values.bankAccountType || null,
        bankFt: values.bankFt || null,
        currencyCode: values.currencyCode,
        paymentTypeFlag: values.paymentTypeFlag || null,
        paymentMethodLookupCode: values.paymentMethodLookupCode,
        statusLookupCode: values.statusLookupCode,
        description: values.description || null,
        exchangeRate: values.exchangeRate ? Number(values.exchangeRate) : null,
        amount: values.amount ? Number(values.amount) : null,
        baseAmount: values.baseAmount ? Number(values.baseAmount) : null,
        ccidCr: values.ccidCr ? Number(values.ccidCr) : null,
        ccidDr: values.ccidDr ? Number(values.ccidDr) : null,
        paymentType: values.paymentType || null,
        rateType: values.rateType || null,
        rateDate: values.rateDate || null,
        clearStatus: values.clearStatus || null,
        voidStatus: values.voidStatus || null,
        voidDate: values.voidDate || null,
        voidGlDate: values.voidGlDate || null
      });

      if (res.success) {
        NotificationExtension.Success("Cập nhật phiếu chi thành công!");
        navigate("/ApPayment/ApPaymentList");
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
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/ApPayment/ApPaymentList")}>
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="xl">
        <Title order={3} mb="xs">Cập nhật Phiếu Chi / Thanh toán</Title>
        <Text size="sm" c="dimmed" mb="lg">Mã phiếu chi (ID): <b>{id}</b></Text>
        <Divider mb="xl" />

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                required
                label="Nhà cung cấp nhận thanh toán"
                placeholder="Chọn nhà cung cấp"
                data={vendors.map((v) => ({ value: String(v.vendorId), label: v.vendorName }))}
                {...form.getInputProps("vendorId")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                required
                label="Chi nhánh nhận thanh toán"
                placeholder="Chọn chi nhánh"
                disabled={!form.values.vendorId}
                data={filteredSites.map((s) => ({ value: String(s.vendorSiteId), label: s.vendorSiteCode }))}
                {...form.getInputProps("vendorSiteId")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <NumberInput
                required
                label="Mã đơn vị hoạt động (Org ID)"
                placeholder="Ví dụ: 10"
                {...form.getInputProps("orgId")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                label="Số tài khoản ngân hàng thụ hưởng"
                placeholder="Ví dụ: 19020492839201"
                {...form.getInputProps("bankAccountNum")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                label="Tên tài khoản ngân hàng chi trả"
                placeholder="Ví dụ: TECHCOMBANK IDP VND"
                {...form.getInputProps("bankAccountName")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                label="Mã giao dịch ngân hàng (FT No.)"
                placeholder="Ví dụ: FT26071501"
                {...form.getInputProps("bankFt")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select
                required
                label="Phương thức thanh toán"
                data={[
                  { value: "WIRE", label: "Ủy nhiệm chi (WIRE)" },
                  { value: "CHECK", label: "Séc ngân hàng (CHECK)" },
                  { value: "CASH", label: "Tiền mặt (CASH)" }
                ]}
                {...form.getInputProps("paymentMethodLookupCode")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select
                required
                label="Trạng thái phiếu chi"
                data={[
                  { value: "NEGOTIABLE", label: "Có thể giao dịch (NEGOTIABLE)" },
                  { value: "CLEARED", label: "Đã trích nợ (CLEARED)" }
                ]}
                {...form.getInputProps("statusLookupCode")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select
                required
                label="Loại tiền tệ"
                data={[
                  { value: "VND", label: "VND" },
                  { value: "USD", label: "USD" }
                ]}
                {...form.getInputProps("currencyCode")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <NumberInput
                required
                label="Tỷ giá (Exchange Rate)"
                decimalScale={4}
                {...form.getInputProps("exchangeRate")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <NumberInput
                required
                label="Số tiền thanh toán"
                thousandSeparator=","
                {...form.getInputProps("amount")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <NumberInput
                required
                label="Số tiền quy đổi (Base Amount)"
                thousandSeparator=","
                {...form.getInputProps("baseAmount")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <NumberInput
                label="Tài khoản kế toán Bên Có (Cr CCID)"
                placeholder="Ví dụ: 112101"
                {...form.getInputProps("ccidCr")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <NumberInput
                label="Tài khoản kế toán Bên Nợ (Dr CCID)"
                placeholder="Ví dụ: 33101"
                {...form.getInputProps("ccidDr")}
              />
            </Grid.Col>

            <Grid.Col span={12}>
              <TextInput
                label="Nội dung / Mô tả thanh toán"
                placeholder="Ghi rõ lý do chi tiền..."
                {...form.getInputProps("description")}
              />
            </Grid.Col>
          </Grid>

          <Group justify="flex-end" mt="xl" pt="md" style={{ borderTop: "1px solid #dee2e6" }}>
            <Button variant="outline" color="gray" onClick={() => navigate("/ApPayment/ApPaymentList")}>
              Hủy bỏ
            </Button>
            <Button type="submit" color="blue" leftSection={<IconDeviceFloppy size={18} />}>
              Cập nhật phiếu chi
            </Button>
          </Group>
        </form>
      </Card>
    </Box>
  );
}

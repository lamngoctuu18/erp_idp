import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";
import { Box, Card, Title, TextInput, Select, Group, Button, Grid, Divider, NumberInput } from "@mantine/core";
import { IconArrowLeft, IconDeviceFloppy } from "@tabler/icons-react";
import { ceBankAccountService, ceBankService, ceBankBranchService } from "../../api/sharedConfig/ceBankMockService";
import { CeBank, CeBankBranch } from "../../model/CeBankModel";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

export default function CreateCeBankAccount() {
  const navigate = useNavigate();
  const [banks, setBanks] = useState<CeBank[]>([]);
  const [branches, setBranches] = useState<CeBankBranch[]>([]);

  const form = useForm({
    initialValues: {
      accountName: "",
      accountNumber: "",
      bankId: "",
      branchId: "",
      legalEntityId: 10,
      currencyCode: "VND",
      alternateAccountName: "",
      multiCurrencyAllowedFlag: "N",
      accountType: "CHECKING",
      startDate: new Date().toISOString().substring(0, 10),
      endDate: "",
      status: "ACTIVE",
    },
    validate: {
      accountName: (val: any) => (val ? null : "Tên tài khoản bắt buộc nhập"),
      accountNumber: (val: any) => (val ? null : "Số tài khoản bắt buộc nhập"),
      bankId: (val: any) => (val ? null : "Vui lòng chọn Ngân hàng liên kết"),
      legalEntityId: (val: any) => (val ? null : "Vui lòng nhập ID Pháp nhân"),
    },
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const bList = await ceBankService.getAll();
        setBanks(bList);
        const brList = await ceBankBranchService.getAll();
        setBranches(brList);

        if (bList.length > 0) {
          form.setFieldValue("bankId", String(bList[0].bankId));
        }
      } catch {
        NotificationExtension.Fails("Không thể tải danh sách Ngân hàng/Chi nhánh.");
      }
    };
    loadData();
  }, []);

  const filteredBranches = useMemo(() => {
    const bId = form.values.bankId;
    if (!bId) return [];
    const list = branches.filter((x) => x.bankId === Number(bId));
    
    // Auto-select first branch if available and no branch is selected yet
    return list;
  }, [branches, form.values.bankId]);

  useEffect(() => {
    if (filteredBranches.length > 0) {
      form.setFieldValue("branchId", String(filteredBranches[0].branchId));
    } else {
      form.setFieldValue("branchId", "");
    }
  }, [filteredBranches]);

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const res = await ceBankAccountService.create({
        accountName: values.accountName,
        accountNumber: values.accountNumber,
        bankId: Number(values.bankId),
        branchId: values.branchId ? Number(values.branchId) : undefined,
        legalEntityId: Number(values.legalEntityId),
        currencyCode: values.currencyCode,
        alternateAccountName: values.alternateAccountName || undefined,
        multiCurrencyAllowedFlag: values.multiCurrencyAllowedFlag || undefined,
        accountType: values.accountType || undefined,
        startDate: values.startDate || undefined,
        endDate: values.endDate || undefined,
        status: values.status,
      });

      if (res.success) {
        NotificationExtension.Success("Khai báo Tài khoản ngân hàng mới thành công!");
        navigate("/CeBankAccount/CeBankAccountList");
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
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/CeBankAccount/CeBankAccountList")}>
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="xl">
        <Title order={3} mb="xs">Thêm mới Tài khoản Ngân hàng (Bank Account Entry)</Title>
        <Divider mb="xl" />

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                required
                label="Tên tài khoản ngân hàng"
                placeholder="Ví dụ: Công ty Cổ phần IDP - VND"
                {...form.getInputProps("accountName")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                required
                label="Số tài khoản"
                placeholder="Ví dụ: 0011001234567"
                {...form.getInputProps("accountNumber")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                required
                label="Ngân hàng liên kết"
                placeholder="Chọn ngân hàng"
                data={banks.map((b) => ({ value: String(b.bankId), label: b.bankName }))}
                {...form.getInputProps("bankId")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                label="Chi nhánh liên kết"
                placeholder="Chọn chi nhánh"
                disabled={!form.values.bankId}
                data={filteredBranches.map((br) => ({ value: String(br.branchId), label: br.branchName }))}
                {...form.getInputProps("branchId")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <NumberInput
                required
                label="ID Pháp nhân (Legal Entity ID)"
                placeholder="Ví dụ: 10"
                {...form.getInputProps("legalEntityId")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select
                required
                label="Loại tiền tệ"
                data={[
                  { value: "VND", label: "VND - Việt Nam Đồng" },
                  { value: "USD", label: "USD - Đô la Mỹ" },
                  { value: "EUR", label: "EUR - Đồng Euro" },
                ]}
                {...form.getInputProps("currencyCode")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select
                label="Cho phép đa tiền tệ"
                data={[
                  { value: "Y", label: "Có (Y)" },
                  { value: "N", label: "Không (N)" },
                ]}
                {...form.getInputProps("multiCurrencyAllowedFlag")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                label="Tên gọi khác (Alternate Name)"
                placeholder="Ví dụ: IDP VND main account"
                {...form.getInputProps("alternateAccountName")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select
                label="Loại tài khoản"
                data={[
                  { value: "CHECKING", label: "Tài khoản thanh toán (CHECKING)" },
                  { value: "SAVINGS", label: "Tài khoản tiết kiệm (SAVINGS)" },
                  { value: "OTHER", label: "Tài khoản chuyên dụng khác (OTHER)" },
                ]}
                {...form.getInputProps("accountType")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select
                required
                label="Trạng thái"
                data={[
                  { value: "ACTIVE", label: "Hoạt động (ACTIVE)" },
                  { value: "INACTIVE", label: "Ngừng hoạt động (INACTIVE)" },
                ]}
                {...form.getInputProps("status")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                type="date"
                label="Ngày bắt đầu sử dụng"
                {...form.getInputProps("startDate")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                type="date"
                label="Ngày kết thúc sử dụng"
                {...form.getInputProps("endDate")}
              />
            </Grid.Col>
          </Grid>

          <Group justify="flex-end" mt="xl" pt="md" style={{ borderTop: "1px solid #dee2e6" }}>
            <Button variant="outline" color="gray" onClick={() => navigate("/CeBankAccount/CeBankAccountList")}>
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

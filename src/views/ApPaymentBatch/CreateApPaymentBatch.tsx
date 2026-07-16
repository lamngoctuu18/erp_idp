import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";
import { Box, Card, Title, TextInput, Select, Group, Button, Grid, Divider, NumberInput } from "@mantine/core";
import { IconArrowLeft, IconDeviceFloppy } from "@tabler/icons-react";
import { apPaymentBatchService } from "../../api/apVendor/apPaymentMockService";
import { ceBankAccountService } from "../../api/sharedConfig/ceBankMockService";
import { CeBankAccount } from "../../model/CeBankModel";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

export default function CreateApPaymentBatch() {
  const navigate = useNavigate();
  const [bankAccounts, setBankAccounts] = useState<CeBankAccount[]>([]);

  const form = useForm({
    initialValues: {
      batchName: "",
      paymentMethod: "WIRE",
      bankAccountId: "",
      paymentDate: new Date().toISOString().substring(0, 10),
      totalAmount: 100000000,
      status: "PENDING"
    },
    validate: {
      batchName: (val: any) => (val ? null : "Tên lô thanh toán bắt buộc nhập"),
      bankAccountId: (val: any) => (val ? null : "Vui lòng chọn Tài khoản ngân hàng chi trả")
    }
  });

  useEffect(() => {
    const loadBankAccounts = async () => {
      try {
        const res = await ceBankAccountService.getList({ take: 100 });
        if (res.success && res.data) {
          setBankAccounts(res.data.items);
          if (res.data.items.length > 0) {
            form.setFieldValue("bankAccountId", String(res.data.items[0].bankAccountId));
          }
        }
      } catch {
        NotificationExtension.Fails("Không thể tải danh sách tài khoản ngân hàng chi trả.");
      }
    };
    loadBankAccounts();
  }, []);

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const res = await apPaymentBatchService.create({
        batchName: values.batchName,
        paymentMethod: values.paymentMethod,
        bankAccountId: Number(values.bankAccountId),
        paymentDate: values.paymentDate || null,
        totalAmount: values.totalAmount ? Number(values.totalAmount) : null,
        status: values.status || null,
        createdBy: 1
      });

      if (res.success) {
        NotificationExtension.Success("Thêm mới lô thanh toán thành công!");
        navigate("/ApPaymentBatch/ApPaymentBatchList");
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
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/ApPaymentBatch/ApPaymentBatchList")}>
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="xl">
        <Title order={3} mb="xs">Thêm mới Lô thanh toán hàng loạt (AP Payment Batch Entry)</Title>
        <Divider mb="xl" />

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                required
                label="Tên lô thanh toán"
                placeholder="Ví dụ: Lô chi lương tháng 7/2026"
                {...form.getInputProps("batchName")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                required
                label="Tài khoản ngân hàng chi trả"
                placeholder="Chọn tài khoản ngân hàng nguồn"
                data={bankAccounts.map((b) => ({ value: String(b.bankAccountId), label: `${b.accountNumber} - ${b.accountName}` }))}
                {...form.getInputProps("bankAccountId")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                required
                label="Phương thức chi tiền"
                data={[
                  { value: "WIRE", label: "Ủy nhiệm chi hàng loạt (WIRE)" },
                  { value: "CHECK", label: "Séc ngân hàng (CHECK)" },
                  { value: "CASH", label: "Tiền mặt (CASH)" }
                ]}
                {...form.getInputProps("paymentMethod")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                type="date"
                required
                label="Ngày dự kiến thanh toán"
                {...form.getInputProps("paymentDate")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                required
                label="Tổng tiền lô chi"
                thousandSeparator=","
                {...form.getInputProps("totalAmount")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                required
                label="Trạng thái lô chi"
                data={[
                  { value: "PENDING", label: "Chờ phê duyệt (PENDING)" },
                  { value: "APPROVED", label: "Đã phê duyệt (APPROVED)" }
                ]}
                {...form.getInputProps("status")}
              />
            </Grid.Col>
          </Grid>

          <Group justify="flex-end" mt="xl" pt="md" style={{ borderTop: "1px solid #dee2e6" }}>
            <Button variant="outline" color="gray" onClick={() => navigate("/ApPaymentBatch/ApPaymentBatchList")}>
              Hủy bỏ
            </Button>
            <Button type="submit" color="blue" leftSection={<IconDeviceFloppy size={18} />}>
              Lưu lô thanh toán
            </Button>
          </Group>
        </form>
      </Card>
    </Box>
  );
}

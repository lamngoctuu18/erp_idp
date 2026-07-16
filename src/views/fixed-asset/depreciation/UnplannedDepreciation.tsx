import { useState } from "react";
import {
  Box,
  Button,
  Card,
  Grid,
  Group,
  NumberInput,
  Select,
  Tabs,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCalculator, IconAlertCircle } from "@tabler/icons-react";
import { FaNotice, FaPageHeader } from "../_components/FaCommon";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import { FA_BOOKS } from "../../../api/fixed-asset/api";

const UnplannedDepreciation = () => {
  const [activeTab, setActiveTab] = useState<string | null>("unplanned");

  const unplannedForm = useForm({
    initialValues: {
      assetNumber: "TS000184",
      book: "IDP_CORP",
      amount: 50000000,
      expenseAccount: "62740010",
      reason: "Thiết bị giảm hiệu năng đột ngột do lỗi vận hành",
    },
    validate: {
      assetNumber: (v: string) => (!v ? "Vui lòng chọn tài sản" : null),
      amount: (v: number) => (v <= 0 ? "Số tiền khấu hao phải lớn hơn 0" : null),
      expenseAccount: (v: string) => (!v ? "Vui lòng nhập tài khoản chi phí" : null),
    },
  });

  const overrideForm = useForm({
    initialValues: {
      assetNumber: "TS000183",
      book: "IDP_CORP",
      amount: 15000000,
      reason: "Ghi đè để đồng bộ giá trị với đối chiếu kiểm toán nội bộ",
    },
    validate: {
      assetNumber: (v: string) => (!v ? "Vui lòng chọn tài sản" : null),
      amount: (v: number) => (v < 0 ? "Số tiền ghi đè không được âm" : null),
    },
  });

  const handleUnplannedSubmit = () => {
    if (unplannedForm.validate().hasErrors) return;
    NotificationExtension.Success(
      `Đã ghi nhận khấu hao ngoài kế hoạch ${unplannedForm.values.amount.toLocaleString()} VND cho tài sản ${unplannedForm.values.assetNumber}.`
    );
    unplannedForm.reset();
  };

  const handleOverrideSubmit = () => {
    if (overrideForm.validate().hasErrors) return;
    NotificationExtension.Success(
      `Đã đăng ký ghi đè khấu hao kỳ này thành ${overrideForm.values.amount.toLocaleString()} VND cho tài sản ${overrideForm.values.assetNumber}.`
    );
    overrideForm.reset();
  };

  return (
    <Box>
      <FaPageHeader />

      <Title order={3} mb={8}>
        Khấu hao ngoài kế hoạch & Ghi đè (Unplanned & Override)
      </Title>

      <FaNotice type="info">
        <b>Khấu hao ngoài kế hoạch (Unplanned):</b> Ghi nhận thêm chi phí khấu hao một lần trong kỳ hiện tại. Giá trị còn lại (NBV) của tài sản sẽ giảm tương ứng.<br />
        <b>Ghi đè khấu hao (Override):</b> Thay đổi trực tiếp số tiền khấu hao tính toán bởi hệ thống trong kỳ mở thành một con số ấn định cụ thể.
      </FaNotice>

      <Tabs value={activeTab} onChange={setActiveTab} variant="outline" mt="md">
        <Tabs.List>
          <Tabs.Tab value="unplanned" leftSection={<IconCalculator size={14} />}>
            Khấu hao ngoài kế hoạch (Unplanned Depreciation)
          </Tabs.Tab>
          <Tabs.Tab value="override" leftSection={<IconAlertCircle size={14} />}>
            Ghi đè khấu hao (Depreciation Override)
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="unplanned" pt="md">
          <Card withBorder p="lg" radius="md">
            <Title order={5} mb="md">Chi tiết giao dịch khấu hao ngoài kế hoạch</Title>
            <form onSubmit={(e) => { e.preventDefault(); handleUnplannedSubmit(); }}>
              <Grid>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <TextInput
                    label="Mã tài sản (Asset Number)"
                    withAsterisk
                    placeholder="TSxxxxxx"
                    {...unplannedForm.getInputProps("assetNumber")}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <Select
                    label="Sổ sách (Book)"
                    withAsterisk
                    data={FA_BOOKS}
                    {...unplannedForm.getInputProps("book")}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <NumberInput
                    label="Số tiền khấu hao"
                    withAsterisk
                    thousandSeparator="."
                    decimalSeparator=","
                    {...unplannedForm.getInputProps("amount")}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <TextInput
                    label="Tài khoản chi phí khấu hao"
                    withAsterisk
                    placeholder="VD: 62740000"
                    {...unplannedForm.getInputProps("expenseAccount")}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 8 }}>
                  <TextInput
                    label="Lý do / Mô tả chi tiết"
                    placeholder="Nhập lý do hạch toán..."
                    {...unplannedForm.getInputProps("reason")}
                  />
                </Grid.Col>
              </Grid>
              <Group mt="xl" justify="flex-end">
                <Button type="submit" color="blue" leftSection={<IconCalculator size={16} />}>
                  Lưu giao dịch khấu hao
                </Button>
              </Group>
            </form>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="override" pt="md">
          <Card withBorder p="lg" radius="md">
            <Title order={5} mb="md">Đăng ký ghi đè số tiền khấu hao trong kỳ</Title>
            <form onSubmit={(e) => { e.preventDefault(); handleOverrideSubmit(); }}>
              <Grid>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <TextInput
                    label="Mã tài sản (Asset Number)"
                    withAsterisk
                    placeholder="TSxxxxxx"
                    {...overrideForm.getInputProps("assetNumber")}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <Select
                    label="Sổ sách (Book)"
                    withAsterisk
                    data={FA_BOOKS}
                    {...overrideForm.getInputProps("book")}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <NumberInput
                    label="Số tiền khấu hao ấn định"
                    withAsterisk
                    thousandSeparator="."
                    decimalSeparator=","
                    {...overrideForm.getInputProps("amount")}
                  />
                </Grid.Col>
                <Grid.Col span={12}>
                  <TextInput
                    label="Lý do ghi đè chi tiết"
                    placeholder="Mô tả lý do điều chỉnh..."
                    {...overrideForm.getInputProps("reason")}
                  />
                </Grid.Col>
              </Grid>
              <Group mt="xl" justify="flex-end">
                <Button type="submit" color="teal" leftSection={<IconAlertCircle size={16} />}>
                  Lưu ghi đè khấu hao
                </Button>
              </Group>
            </form>
          </Card>
        </Tabs.Panel>
      </Tabs>
    </Box>
  );
};

export default UnplannedDepreciation;

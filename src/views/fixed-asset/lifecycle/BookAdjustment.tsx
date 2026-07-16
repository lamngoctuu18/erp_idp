import { Grid, Select, TextInput, NumberInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { FaTxnForm, money } from "../_components/FaCommon";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import { FA_BOOKS, FA_METHOD_OPTIONS, FA_PRORATE_CONVENTIONS } from "../../../api/fixed-asset/api";

const BookAdjustment = () => {
  const form = useForm({
    initialValues: {
      assetNumber: "TS000184",
      book: "IDP_CORP",
      currentCost: 680000000,
      salvageValue: 0,
      depreciate: "Yes",
      method: "STL",
      lifeYears: 5,
      lifeMonths: 0,
      dateInService: new Date("2024-01-01"),
      prorateConvention: "DAILY",
    },
  });

  const v = form.values;
  const recoverable = Math.max(0, v.currentCost - v.salvageValue);

  const complete = () => {
    if (v.currentCost < v.salvageValue) {
      NotificationExtension.Fails("Cost phải lớn hơn hoặc bằng Salvage Value.");
      return;
    }
    NotificationExtension.Success("Đã lưu điều chỉnh Book. Nếu đã chạy khấu hao kỳ mở, hệ thống tự rollback trước khi lưu.");
  };

  return (
    <FaTxnForm
      title="Điều chỉnh thông tin Book"
      notice="Cost ≥ Salvage Value; Recoverable Cost = Cost − Salvage Value. Thay đổi phương pháp/thời gian sau khi chạy khấu hao cần rollback kỳ mở (R12 tự động rollback tài sản trong kỳ chưa đóng)."
      onComplete={complete}
      onSaveDraft={() => NotificationExtension.Success("Đã lưu nháp.")}
    >
      <Grid.Col span={{ base: 12, md: 4 }}>
        <TextInput label="Asset Number" withAsterisk {...form.getInputProps("assetNumber")} />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 4 }}>
        <Select label="Book" withAsterisk data={FA_BOOKS} {...form.getInputProps("book")} />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 4 }}>
        <NumberInput label="Current Cost" withAsterisk thousandSeparator="." decimalSeparator="," {...form.getInputProps("currentCost")} />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 4 }}>
        <NumberInput label="Salvage Value" thousandSeparator="." decimalSeparator="," {...form.getInputProps("salvageValue")} />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 4 }}>
        <TextInput label="Recoverable Cost" value={money(recoverable)} readOnly styles={{ input: { background: "#f1f5f9" } }} />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 4 }}>
        <Select label="Depreciate" data={["Yes", "No"]} {...form.getInputProps("depreciate")} />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 4 }}>
        <Select label="Method" data={FA_METHOD_OPTIONS} {...form.getInputProps("method")} />
      </Grid.Col>
      <Grid.Col span={{ base: 6, md: 2 }}>
        <NumberInput label="Life Years" min={0} {...form.getInputProps("lifeYears")} />
      </Grid.Col>
      <Grid.Col span={{ base: 6, md: 2 }}>
        <NumberInput label="Months" min={0} max={11} {...form.getInputProps("lifeMonths")} />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 4 }}>
        <DateInput label="Date in Service" valueFormat="DD/MM/YYYY" {...form.getInputProps("dateInService")} />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 4 }}>
        <Select label="Prorate Convention" data={FA_PRORATE_CONVENTIONS} {...form.getInputProps("prorateConvention")} />
      </Grid.Col>
    </FaTxnForm>
  );
};

export default BookAdjustment;

import { Grid, Select, TextInput, Textarea } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { FaTxnForm } from "../_components/FaCommon";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import { FA_BOOKS } from "../../../api/fixed-asset/api";

const GroupTransfer = () => {
  const form = useForm({
    initialValues: {
      memberAsset: "TS000184",
      book: "IDP_CORP",
      currentGroup: "GRP00008",
      newGroup: "GRP00009",
      transferDate: new Date(),
      comments: "Tái cơ cấu nhóm tài sản",
    },
  });

  const complete = () => {
    if (form.values.currentGroup === form.values.newGroup) {
      NotificationExtension.Fails("Group mới phải khác Group hiện tại.");
      return;
    }
    NotificationExtension.Success("Đã điều chuyển Member sang Group mới.");
  };

  return (
    <FaTxnForm
      title="Điều chuyển giữa các Group"
      notice="Group cũ, Group mới và Member phải cùng Corporate Book; Date in Service của Member không được sau Group mới. Group không nhận Expense Adjustment."
      onComplete={complete}
      onDiscard={() => form.reset()}
    >
      <Grid.Col span={{ base: 12, md: 4 }}>
        <TextInput label="Member Asset" withAsterisk {...form.getInputProps("memberAsset")} />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 4 }}>
        <Select label="Corporate Book" withAsterisk data={FA_BOOKS} {...form.getInputProps("book")} />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 4 }}>
        <DateInput label="Ngày điều chuyển" withAsterisk valueFormat="DD/MM/YYYY" {...form.getInputProps("transferDate")} />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <TextInput label="Group hiện tại" readOnly styles={{ input: { background: "#f1f5f9" } }} {...form.getInputProps("currentGroup")} />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <TextInput label="Group mới" withAsterisk {...form.getInputProps("newGroup")} />
      </Grid.Col>
      <Grid.Col span={12}>
        <Textarea label="Comments" autosize minRows={2} {...form.getInputProps("comments")} />
      </Grid.Col>
    </FaTxnForm>
  );
};

export default GroupTransfer;

import { useNavigate } from "react-router-dom";
import { Grid, TextInput, Textarea } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { FaTxnForm } from "../_components/FaCommon";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";

const ParentAssetForm = () => {
  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      memberAsset: "TS000184",
      parentAsset: "TS000102",
      effectiveDate: new Date(),
      comments: "Gán theo cụm dây chuyền sản xuất",
    },
  });

  const complete = () => {
    if (!form.values.memberAsset || !form.values.parentAsset) {
      NotificationExtension.Fails("Cần nhập cả Member Asset và Parent Asset.");
      return;
    }
    if (form.values.memberAsset === form.values.parentAsset) {
      NotificationExtension.Fails("Parent không được trùng chính Member Asset.");
      return;
    }
    NotificationExtension.Success("Đã gán quan hệ Parent/Member.");
    navigate("/fixed-asset/asset/list");
  };

  return (
    <FaTxnForm
      title="Nhập mới tài sản Parent / Member"
      notice="Parent phải đang Active, cùng Book và không được là chính Member hoặc hậu duệ của Member (tránh vòng lặp cha–con)."
      onComplete={complete}
      onSaveDraft={() => NotificationExtension.Success("Đã lưu nháp.")}
      onDiscard={() => navigate("/fixed-asset/asset/list")}
    >
      <Grid.Col span={{ base: 12, md: 4 }}>
        <TextInput label="Member Asset" withAsterisk {...form.getInputProps("memberAsset")} />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 4 }}>
        <TextInput label="Parent Asset" withAsterisk {...form.getInputProps("parentAsset")} />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 4 }}>
        <DateInput label="Ngày hiệu lực" withAsterisk valueFormat="DD/MM/YYYY" {...form.getInputProps("effectiveDate")} />
      </Grid.Col>
      <Grid.Col span={12}>
        <Textarea label="Ghi chú" autosize minRows={2} {...form.getInputProps("comments")} />
      </Grid.Col>
    </FaTxnForm>
  );
};

export default ParentAssetForm;

import { useNavigate } from "react-router-dom";
import { Grid, Select, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { FaTxnForm } from "../_components/FaCommon";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import { FA_BOOKS, FA_METHOD_OPTIONS } from "../../../api/fixed-asset/api";

const GroupAssetForm = () => {
  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      role: "Group Asset",
      assetNumber: "GRP00009",
      book: "IDP_CORP",
      dateInService: new Date(),
      method: "STL",
    },
  });

  const complete = () => {
    if (!form.values.assetNumber) {
      NotificationExtension.Fails("Cần nhập Asset / Group Number.");
      return;
    }
    NotificationExtension.Success("Đã thiết lập tài sản Group.");
    navigate("/fixed-asset/asset/list");
  };

  return (
    <FaTxnForm
      title="Thiết lập tài sản Group"
      notice="Group Asset và Member phải cùng Corporate Book. Khấu hao tính ở cấp Group; nguyên giá Group = tổng nguyên giá các Member và không cho sửa trực tiếp."
      onComplete={complete}
      onSaveDraft={() => NotificationExtension.Success("Đã lưu nháp.")}
      onDiscard={() => navigate("/fixed-asset/asset/list")}
    >
      <Grid.Col span={{ base: 12, md: 4 }}>
        <Select label="Vai trò" withAsterisk data={["Group Asset", "Member Asset"]} {...form.getInputProps("role")} />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 4 }}>
        <TextInput label="Asset / Group Number" withAsterisk {...form.getInputProps("assetNumber")} />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 4 }}>
        <Select label="Corporate Book" withAsterisk data={FA_BOOKS} {...form.getInputProps("book")} />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <DateInput label="Date in Service" withAsterisk valueFormat="DD/MM/YYYY" {...form.getInputProps("dateInService")} />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Select label="Depreciation Method" data={FA_METHOD_OPTIONS} {...form.getInputProps("method")} />
      </Grid.Col>
    </FaTxnForm>
  );
};

export default GroupAssetForm;

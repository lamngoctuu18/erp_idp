import { useState } from "react";
import { Button, Grid, Select, Textarea, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { FaTxnForm } from "../_components/FaCommon";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import { FA_BOOKS, FA_CATEGORIES } from "../../../api/fixed-asset/api";

const CategoryReclass = () => {
  const [previewed, setPreviewed] = useState(false);
  const form = useForm({
    initialValues: {
      book: "IDP_CORP",
      fromAsset: "TS000170",
      toAsset: "TS000190",
      currentCategory: "102",
      newCategory: "104",
      reclassDate: new Date(),
      comments: "Điều chỉnh theo biên bản kiểm kê",
    },
  });

  const complete = () => {
    if (!previewed) {
      NotificationExtension.Fails("Phải Preview tác động tài khoản trước khi Run.");
      return;
    }
    if (form.values.currentCategory === form.values.newCategory) {
      NotificationExtension.Fails("New Category phải khác Category hiện tại.");
      return;
    }
    NotificationExtension.Success("Đã Run Reclassification.");
  };

  return (
    <FaTxnForm
      title="Thay đổi Category (Reclassification)"
      notice="Phải Preview thay đổi tài khoản trước khi Run. Không cho xóa giao dịch đã Run. Hỗ trợ một hoặc nhiều tài sản (theo dải Asset Number)."
      completeLabel="Run"
      onComplete={complete}
      onDiscard={() => form.reset()}
    >
      <Grid.Col span={{ base: 12, md: 4 }}>
        <Select label="Book" withAsterisk data={FA_BOOKS} {...form.getInputProps("book")} />
      </Grid.Col>
      <Grid.Col span={{ base: 6, md: 4 }}>
        <TextInput label="Từ Asset Number" {...form.getInputProps("fromAsset")} />
      </Grid.Col>
      <Grid.Col span={{ base: 6, md: 4 }}>
        <TextInput label="Đến Asset Number" {...form.getInputProps("toAsset")} />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 4 }}>
        <Select label="Category hiện tại" data={FA_CATEGORIES} {...form.getInputProps("currentCategory")} />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 4 }}>
        <Select label="New Category" withAsterisk data={FA_CATEGORIES} {...form.getInputProps("newCategory")} />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 4 }}>
        <DateInput label="Reclass Date" withAsterisk valueFormat="DD/MM/YYYY" {...form.getInputProps("reclassDate")} />
      </Grid.Col>
      <Grid.Col span={12}>
        <Textarea label="Comments" autosize minRows={2} {...form.getInputProps("comments")} />
      </Grid.Col>
      <Grid.Col span={12}>
        <Button
          variant="light"
          color="teal"
          onClick={() => {
            setPreviewed(true);
            NotificationExtension.Success("Đã tạo báo cáo Preview tác động tài khoản.");
          }}
        >
          Preview tác động tài khoản
        </Button>
      </Grid.Col>
    </FaTxnForm>
  );
};

export default CategoryReclass;

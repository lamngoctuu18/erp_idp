import {
  Box,
  Button,
  Flex,
  Grid,
  LoadingOverlay,
  TextInput,
  Select,
  Fieldset,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconArrowBack, IconCheck } from "@tabler/icons-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import _breadcrumb from "../../_base/component/_layout/_breadcrumb";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import { apVendorService } from "../../api/apVendor/apMockService";

const CreateApVendor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    mode: "controlled",
    validateInputOnChange: true,
    validate: {
      vendorName: (v: any) => (!!v ? null : "Tên nhà cung cấp bắt buộc nhập"),
      segment1: (v: any) => (!!v ? null : "Mã nhà cung cấp bắt buộc nhập"),
    },
    initialValues: {
      vendorName: "",
      segment1: "",
      taxRegistrationNum: "",
      enabledFlag: "Y",
    },
  });

  const handleCreate = async () => {
    if (form.validate().hasErrors) {
      NotificationExtension.Warn("Vui lòng kiểm tra lại thông tin nhập liệu.");
      return;
    }

    try {
      setLoading(true);
      const values = form.getValues();
      await apVendorService.save({
        segment1: values.segment1,
        vendorName: values.vendorName,
        taxRegistrationNum: values.taxRegistrationNum || null,
        vendorType: "ORGANIZATION",
        dunsNumber: null,
        employeeNumber: null,
        enabledFlag: values.enabledFlag as any,
      });

      NotificationExtension.Success("Tạo mới nhà cung cấp thành công.");
      navigate("/ApVendor/ApVendorList");
    } catch (err: any) {
      console.error(err);
      NotificationExtension.Fails(err?.message || "Có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" mx="auto" style={{ position: "relative" }}>
      <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />

      <Flex justify={"space-between"} align={"center"}>
        <_breadcrumb></_breadcrumb>
        <Flex w={"100%"} justify={"flex-end"} gap={10}>
          <Button
            type="button"
            color="red"
            variant="outline"
            leftSection={<IconArrowBack size={18} />}
            onClick={() => navigate("/ApVendor/ApVendorList")}
          >
            Quay lại
          </Button>
          <Button
            color="teal"
            variant="outline"
            leftSection={<IconCheck size={18} />}
            onClick={handleCreate}
          >
            Lưu
          </Button>
        </Flex>
      </Flex>

      <Grid mt={10}>
        <Grid.Col span={{ base: 12, md: 8 }} offset={{ base: 0, md: 2 }}>
          <Fieldset legend="Thông tin Nhà cung cấp / Đối tác (Vendor)">
            <Grid>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="Tên nhà cung cấp"
                  placeholder="Ví dụ: Công ty Intel Việt Nam"
                  required
                  withAsterisk
                  {...form.getInputProps("vendorName")}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="Mã nhà cung cấp (Code)"
                  placeholder="Ví dụ: V0001"
                  required
                  withAsterisk
                  {...form.getInputProps("segment1")}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="Mã số thuế đăng ký"
                  placeholder="Nhập mã số thuế nhà cung cấp"
                  {...form.getInputProps("taxRegistrationNum")}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Select
                  label="Trạng thái giao dịch"
                  required
                  withAsterisk
                  data={[
                    { value: "Y", label: "Đang giao dịch (Y)" },
                    { value: "N", label: "Tạm khóa (N)" },
                  ]}
                  {...form.getInputProps("enabledFlag")}
                />
              </Grid.Col>
            </Grid>
          </Fieldset>
        </Grid.Col>
      </Grid>
    </Box>
  );
};

export default CreateApVendor;

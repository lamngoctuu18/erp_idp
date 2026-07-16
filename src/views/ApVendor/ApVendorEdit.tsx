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
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import _breadcrumb from "../../_base/component/_layout/_breadcrumb";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import { apVendorService } from "../../api/apVendor/apMockService";

const EditApVendor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: paramId } = useParams();
  const id = paramId || location.state?.id;
  const [loading, setLoading] = useState(true);

  const form = useForm({
    mode: "controlled",
    validateInputOnChange: true,
    validate: {
      vendorName: (v: any) => (!!v ? null : "Tên nhà cung cấp bắt buộc nhập"),
      segment1: (v: any) => (!!v ? null : "Mã nhà cung cấp bắt buộc nhập"),
    },
    initialValues: {
      vendorId: 0,
      vendorName: "",
      segment1: "",
      taxRegistrationNum: "",
      enabledFlag: "Y",
    },
  });

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) {
        NotificationExtension.Fails("Không tìm thấy ID nhà cung cấp.");
        navigate("/ApVendor/ApVendorList");
        return;
      }
      try {
        const data = await apVendorService.getById(Number(id));
        if (data) {
          form.setValues({
            vendorId: data.vendorId,
            vendorName: data.vendorName || "",
            segment1: data.segment1 || "",
            taxRegistrationNum: data.taxRegistrationNum || "",
            enabledFlag: data.enabledFlag || "Y",
          });
        } else {
          NotificationExtension.Warn("Không lấy được dữ liệu chi tiết.");
        }
      } catch (err: any) {
        console.error(err);
        NotificationExtension.Fails("Lỗi kết nối Mock Service.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const handleUpdate = async () => {
    if (form.validate().hasErrors) {
      NotificationExtension.Warn("Vui lòng kiểm tra lại thông tin.");
      return;
    }

    try {
      setLoading(true);
      const values = form.getValues();
      await apVendorService.save({
        vendorId: values.vendorId,
        segment1: values.segment1,
        vendorName: values.vendorName,
        taxRegistrationNum: values.taxRegistrationNum || null,
        vendorType: "ORGANIZATION",
        dunsNumber: null,
        employeeNumber: null,
        enabledFlag: values.enabledFlag as any,
      });

      NotificationExtension.Success("Cập nhật nhà cung cấp thành công.");
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
            onClick={handleUpdate}
          >
            Cập nhật
          </Button>
        </Flex>
      </Flex>

      <Grid mt={10}>
        <Grid.Col span={{ base: 12, md: 8 }} offset={{ base: 0, md: 2 }}>
          <Fieldset legend={`Chỉnh sửa Nhà cung cấp (ID: ${form.values.vendorId})`}>
            <Grid>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="Tên nhà cung cấp"
                  required
                  withAsterisk
                  {...form.getInputProps("vendorName")}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="Mã nhà cung cấp (Code)"
                  required
                  withAsterisk
                  {...form.getInputProps("segment1")}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="Mã số thuế đăng ký"
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

export default EditApVendor;

import { Box, Button, Card, Flex, Grid, Group, NumberInput, Select, Switch, TextInput, Textarea, Tabs, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { IconArrowLeft, IconDeviceFloppy, IconInfoCircle, IconSettings, IconShoppingCart, IconReportMoney } from "@tabler/icons-react";
import BreadCrumb from "../../../_base/component/_layout/_breadcrumb";
import { createInventoryItem } from "../../../api/inventory/api";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";

const InventoryItemCreate = () => {
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      itemNumber: "",
      description: "",
      longDescription: "",
      primaryUomCode: "M3",
      primaryUnitOfMeasure: "Mét khối",
      unitLength: undefined as number | undefined,
      unitWidth: undefined as number | undefined,
      unitHeight: undefined as number | undefined,
      categoryName: "Gỗ Công Nghiệp",
      enabledFlag: true,
      
      // Mở rộng thuộc tính chuẩn Enterprise
      itemType: "RAW_MATERIAL",
      secondaryUomCode: "",
      locatorControlCode: "1", // 1: None, 2: Predefined, 3: Dynamic
      lotControlCode: "1", // 1: No, 2: Yes
      serialControlCode: "1", // 1: No, 2: Yes
      purchasableFlag: true,
      customerOrderEnabledFlag: false,
      listPrice: undefined as number | undefined,
      receiptRoutingId: "1", // 1: Direct, 2: Standard, 3: Inspection
      costingEnabledFlag: true,
      costingMethod: "AVERAGE",
      valuationAccount: "152000",
      cogsAccount: "632000",
      salesAccount: "511100"
    },
    validate: {
      itemNumber: (value: any) => (value ? null : "Mã vật tư bắt buộc nhập"),
      description: (value: any) => (value ? null : "Tên vật tư bắt buộc nhập"),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const res = await createInventoryItem({
        ...values,
        enabledFlag: values.enabledFlag ? "Y" : "N",
        purchasableFlag: values.purchasableFlag ? "Y" : "N",
        customerOrderEnabledFlag: values.customerOrderEnabledFlag ? "Y" : "N",
        costingEnabledFlag: values.costingEnabledFlag ? "Y" : "N",
        locatorControlCode: Number(values.locatorControlCode),
        lotControlCode: Number(values.lotControlCode),
        serialControlCode: Number(values.serialControlCode),
        receiptRoutingId: Number(values.receiptRoutingId),
      });
      if (res?.success) {
        NotificationExtension.Success("Khai báo vật tư mới thành công!");
        navigate("/inventory/item/list");
      } else {
        NotificationExtension.Fails((res as any)?.message || "Không thể lưu vật tư");
      }
    } catch {
      NotificationExtension.Fails("Đã xảy ra lỗi khi lưu");
    }
  };

  const handleUomChange = (val: string | null) => {
    if (!val) return;
    form.setFieldValue("primaryUomCode", val);
    const uomName = val === "M3" ? "Mét khối" : val === "Tam" ? "Tấm" : "Kilôgam";
    form.setFieldValue("primaryUnitOfMeasure", uomName);
  };

  return (
    <Box>
      <Flex
        justify="space-between"
        align="center"
        style={{ border: "1px solid #dee2e6", padding: "5px 10px", backgroundColor: "#f8f9fa", borderRadius: "4px" }}
        mb={16}
      >
        <BreadCrumb />
        <Group>
          <Button
            variant="outline"
            color="gray"
            leftSection={<IconArrowLeft size={14} />}
            onClick={() => navigate("/inventory/item/list")}
          >
            Quay lại
          </Button>
          <Button
            style={{ backgroundColor: "#1971c2" }}
            leftSection={<IconDeviceFloppy size={14} />}
            onClick={() => form.onSubmit(handleSubmit)()}
          >
            Lưu thông tin
          </Button>
        </Group>
      </Flex>

      <Card withBorder shadow="sm" radius="md" p="lg">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Tabs defaultValue="general">
            <Tabs.List mb="lg">
              <Tabs.Tab value="general" leftSection={<IconInfoCircle size={16} />}>
                Thông tin chung
              </Tabs.Tab>
              <Tabs.Tab value="inventory" leftSection={<IconSettings size={16} />}>
                Kiểm soát tồn kho
              </Tabs.Tab>
              <Tabs.Tab value="purchasing_sales" leftSection={<IconShoppingCart size={16} />}>
                Mua hàng & Bán hàng
              </Tabs.Tab>
              <Tabs.Tab value="costing" leftSection={<IconReportMoney size={16} />}>
                Giá thành & Kế toán
              </Tabs.Tab>
            </Tabs.List>

            {/* TAB 1: THÔNG TIN CHUNG */}
            <Tabs.Panel value="general">
              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Mã vật tư (Item Number)"
                    placeholder="Ví dụ: ITEM-MDF"
                    withAsterisk
                    styles={{ label: { whiteSpace: "nowrap" } }}
                    {...form.getInputProps("itemNumber")}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Tên vật tư (Description)"
                    placeholder="Ví dụ: Ván MDF 18mm"
                    withAsterisk
                    styles={{ label: { whiteSpace: "nowrap" } }}
                    {...form.getInputProps("description")}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="Phân loại vật tư (Item Type)"
                    styles={{ label: { whiteSpace: "nowrap" } }}
                    data={[
                      { value: "RAW_MATERIAL", label: "Nguyên vật liệu (Raw Material)" },
                      { value: "FINISHED_GOOD", label: "Thành phẩm (Finished Good)" },
                      { value: "SEMI_FINISHED", label: "Bán thành phẩm (Semi-Finished)" },
                      { value: "EXPENSE", label: "Chi phí (Expense)" }
                    ]}
                    {...form.getInputProps("itemType")}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="Nhóm vật tư (Category Set)"
                    placeholder="Chọn nhóm"
                    styles={{ label: { whiteSpace: "nowrap" } }}
                    data={[
                      { value: "Gỗ Công Nghiệp", label: "Gỗ Công Nghiệp" },
                      { value: "Hóa Chất", label: "Hóa Chất" },
                      { value: "Phụ Kiện", label: "Phụ Kiện" },
                    ]}
                    {...form.getInputProps("categoryName")}
                  />
                </Grid.Col>

                <Grid.Col span={12}>
                  <Textarea
                    label="Mô tả kỹ thuật chi tiết"
                    placeholder="Mô tả chi tiết bổ sung..."
                    minRows={3}
                    styles={{ label: { whiteSpace: "nowrap" } }}
                    {...form.getInputProps("longDescription")}
                  />
                </Grid.Col>

                <Grid.Col span={12}>
                  <Box style={{ borderTop: "1px solid #e9ecef", paddingTop: "15px", marginTop: "10px" }}>
                    <Title order={5} mb="sm" c="blue">Thông số kích thước cấu hình</Title>
                    <Grid>
                      <Grid.Col span={{ base: 12, md: 4 }}>
                        <NumberInput
                          label="Chiều dài (m)"
                          placeholder="0.0"
                          decimalScale={3}
                          styles={{ label: { whiteSpace: "nowrap" } }}
                          {...form.getInputProps("unitLength")}
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, md: 4 }}>
                        <NumberInput
                          label="Chiều rộng (m)"
                          placeholder="0.0"
                          decimalScale={3}
                          styles={{ label: { whiteSpace: "nowrap" } }}
                          {...form.getInputProps("unitWidth")}
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, md: 4 }}>
                        <NumberInput
                          label="Chiều cao (m)"
                          placeholder="0.0"
                          decimalScale={3}
                          styles={{ label: { whiteSpace: "nowrap" } }}
                          {...form.getInputProps("unitHeight")}
                        />
                      </Grid.Col>
                    </Grid>
                  </Box>
                </Grid.Col>

                <Grid.Col span={12} mt="sm">
                  <Switch
                    label="Cho phép kích hoạt hoạt động (Enabled Flag)"
                    checked={form.values.enabledFlag}
                    onChange={(event) => form.setFieldValue("enabledFlag", event.currentTarget.checked)}
                  />
                </Grid.Col>
              </Grid>
            </Tabs.Panel>

            {/* TAB 2: KIỂM SOÁT TỒN KHO */}
            <Tabs.Panel value="inventory">
              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="Đơn vị tính chính (Primary UOM)"
                    placeholder="Chọn UOM"
                    styles={{ label: { whiteSpace: "nowrap" } }}
                    data={[
                      { value: "M3", label: "Mét khối (M3)" },
                      { value: "Tam", label: "Tấm" },
                      { value: "KG", label: "Kilôgam (KG)" },
                    ]}
                    value={form.values.primaryUomCode}
                    onChange={handleUomChange}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="Đơn vị tính quy đổi phụ (Secondary UOM)"
                    placeholder="Không có"
                    styles={{ label: { whiteSpace: "nowrap" } }}
                    data={[
                      { value: "", label: "Không quy đổi" },
                      { value: "Tam", label: "Tấm" },
                      { value: "KG", label: "Kilôgam (KG)" }
                    ]}
                    {...form.getInputProps("secondaryUomCode")}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 4 }}>
                  <Select
                    label="Kiểm soát vị trí (Locator Control)"
                    styles={{ label: { whiteSpace: "nowrap" } }}
                    data={[
                      { value: "1", label: "Không kiểm soát (None)" },
                      { value: "2", label: "Vị trí định sẵn (Predefined)" },
                      { value: "3", label: "Vị trí động (Dynamic)" }
                    ]}
                    {...form.getInputProps("locatorControlCode")}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <Select
                    label="Kiểm soát theo Lô (Lot Control)"
                    styles={{ label: { whiteSpace: "nowrap" } }}
                    data={[
                      { value: "1", label: "Không quản lý lô (No)" },
                      { value: "2", label: "Có quản lý theo lô (Yes)" }
                    ]}
                    {...form.getInputProps("lotControlCode")}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <Select
                    label="Kiểm soát Serial (Serial Control)"
                    styles={{ label: { whiteSpace: "nowrap" } }}
                    data={[
                      { value: "1", label: "Không quản lý Serial (No)" },
                      { value: "2", label: "Có quản lý theo số Serial (Yes)" }
                    ]}
                    {...form.getInputProps("serialControlCode")}
                  />
                </Grid.Col>
              </Grid>
            </Tabs.Panel>

            {/* TAB 3: MUA HÀNG & BÁN HÀNG */}
            <Tabs.Panel value="purchasing_sales">
              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <NumberInput
                    label="Đơn giá mua danh mục (List Price)"
                    placeholder="Ví dụ: 1000000"
                    decimalScale={0}
                    thousandSeparator=","
                    suffix=" đ"
                    styles={{ label: { whiteSpace: "nowrap" } }}
                    {...form.getInputProps("listPrice")}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="Quy trình nhận hàng (Receipt Routing)"
                    styles={{ label: { whiteSpace: "nowrap" } }}
                    data={[
                      { value: "1", label: "Nhận trực tiếp vào kho (Direct Deliver)" },
                      { value: "2", label: "Nhận tiêu chuẩn qua cầu cảng (Standard Receipt)" },
                      { value: "3", label: "Yêu cầu kiểm định chất lượng (Inspection Required)" }
                    ]}
                    {...form.getInputProps("receiptRoutingId")}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }} mt="md">
                  <Switch
                    label="Cho phép Mua ngoài (Purchasable)"
                    checked={form.values.purchasableFlag}
                    onChange={(event) => form.setFieldValue("purchasableFlag", event.currentTarget.checked)}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }} mt="md">
                  <Switch
                    label="Cho phép bán hàng (Customer Order Enabled)"
                    checked={form.values.customerOrderEnabledFlag}
                    onChange={(event) => form.setFieldValue("customerOrderEnabledFlag", event.currentTarget.checked)}
                  />
                </Grid.Col>
              </Grid>
            </Tabs.Panel>

            {/* TAB 4: GIÁ THÀNH & KẾ TOÁN */}
            <Tabs.Panel value="costing">
              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="Phương pháp tính giá thành (Costing Method)"
                    styles={{ label: { whiteSpace: "nowrap" } }}
                    data={[
                      { value: "AVERAGE", label: "Bình quân di động (Average Cost)" },
                      { value: "STANDARD", label: "Giá tiêu chuẩn (Standard Cost)" },
                      { value: "FIFO", label: "Nhập trước Xuất trước (FIFO)" }
                    ]}
                    {...form.getInputProps("costingMethod")}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }} mt="lg">
                  <Switch
                    label="Kích hoạt tính giá thành tự động (Costing Enabled)"
                    checked={form.values.costingEnabledFlag}
                    onChange={(event) => form.setFieldValue("costingEnabledFlag", event.currentTarget.checked)}
                  />
                </Grid.Col>

                <Grid.Col span={12} mt="sm">
                  <Title order={5} mb="sm" c="blue">Tài khoản kế toán mặc định (Default Accounts)</Title>
                  <Grid>
                    <Grid.Col span={{ base: 12, md: 4 }}>
                      <TextInput
                        label="Tài khoản kho (Valuation)"
                        placeholder="Ví dụ: 152000"
                        styles={{ label: { whiteSpace: "nowrap" } }}
                        {...form.getInputProps("valuationAccount")}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 4 }}>
                      <TextInput
                        label="Tài khoản giá vốn (COGS)"
                        placeholder="Ví dụ: 632000"
                        styles={{ label: { whiteSpace: "nowrap" } }}
                        {...form.getInputProps("cogsAccount")}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 4 }}>
                      <TextInput
                        label="Tài khoản doanh thu (Revenue)"
                        placeholder="Ví dụ: 511100"
                        styles={{ label: { whiteSpace: "nowrap" } }}
                        {...form.getInputProps("salesAccount")}
                      />
                    </Grid.Col>
                  </Grid>
                </Grid.Col>
              </Grid>
            </Tabs.Panel>
          </Tabs>
        </form>
      </Card>
    </Box>
  );
};

export default InventoryItemCreate;

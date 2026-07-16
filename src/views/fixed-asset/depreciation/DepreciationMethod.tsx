import { useEffect, useState } from "react";
import {
  ActionIcon,
  Box,
  Button,
  Card,
  Checkbox,
  Grid,
  Group,
  NumberInput,
  Select,
  Table,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconDeviceFloppy, IconPlus, IconTrash } from "@tabler/icons-react";
import { FaNotice, FaPageHeader } from "../_components/FaCommon";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import { getDepreciationMethods, createDepreciationMethod, deleteDepreciationMethod } from "../../../api/fixed-asset/api";
import { FaDepreciationMethod } from "../../../model/FixedAssetModel";

const DepreciationMethod = () => {
  const [methods, setMethods] = useState<FaDepreciationMethod[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      method: "",
      description: "",
      methodType: "Calculated" as FaDepreciationMethod["methodType"],
      calculationBasis: "Cost" as FaDepreciationMethod["calculationBasis"],
      lifeYears: 5,
      lifeMonths: 0,
      proratePeriodsPerYear: 12,
      depreciateInYearRetired: true,
      excludeSalvageValue: false,
    },
    validate: {
      method: (v: string) => (!v ? "Vui lòng nhập tên phương pháp" : null),
      description: (v: string) => (!v ? "Vui lòng nhập mô tả" : null),
    },
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getDepreciationMethods();
      if (res?.success) {
        setMethods(res.data || []);
      }
    } catch {
      NotificationExtension.Fails("Không thể tải danh sách phương pháp khấu hao.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async () => {
    if (form.validate().hasErrors) return;
    const res = await createDepreciationMethod(form.values);
    if (res?.success) {
      NotificationExtension.Success(`Đã tạo phương pháp khấu hao ${form.values.method}`);
      form.reset();
      loadData();
    } else {
      NotificationExtension.Fails(res?.message || "Tạo thất bại!");
    }
  };

  const handleDelete = async (id: number, name: string) => {
    const res = await deleteDepreciationMethod(id);
    if (res?.success) {
      NotificationExtension.Success(`Đã xóa phương pháp ${name}`);
      loadData();
    } else {
      NotificationExtension.Fails(res?.message || "Xóa thất bại!");
    }
  };

  return (
    <Box>
      <FaPageHeader />

      <Title order={3} mb={8}>
        Khai báo phương pháp khấu hao (Depreciation Methods)
      </Title>
      <FaNotice type="info">
        Phương pháp khấu hao định nghĩa cách thức hệ thống tính khấu hao (Đường thẳng, Số dư giảm dần...). Sau khi phương pháp đã được gán cho bất kỳ tài sản hoặc nhóm tài sản nào, hệ thống sẽ khóa không cho phép sửa đổi hoặc xóa để bảo toàn dữ liệu lịch sử.
      </FaNotice>

      <Grid mt="md">
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card withBorder p="md" radius="md">
            <Title order={5} mb="sm">Danh sách phương pháp cấu hình</Title>
            <Table striped highlightOnHover withTableBorder>
              <Table.Thead style={{ background: "#f8fafc" }}>
                <Table.Tr>
                  <Table.Th>Mã Method</Table.Th>
                  <Table.Th>Diễn giải</Table.Th>
                  <Table.Th>Kiểu</Table.Th>
                  <Table.Th>Cơ sở tính</Table.Th>
                  <Table.Th style={{ width: 100 }}>Thời gian</Table.Th>
                  <Table.Th style={{ width: 80, textAlign: "center" }}>Sử dụng</Table.Th>
                  <Table.Th style={{ width: 60 }} />
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {methods.map((m) => (
                  <Table.Tr key={m.methodId}>
                    <Table.Td style={{ fontWeight: 600 }}>{m.method}</Table.Td>
                    <Table.Td>{m.description}</Table.Td>
                    <Table.Td>{m.methodType}</Table.Td>
                    <Table.Td>{m.calculationBasis}</Table.Td>
                    <Table.Td>
                      {m.lifeYears > 0 ? `${m.lifeYears} năm` : ""} {m.lifeMonths > 0 ? `${m.lifeMonths} th` : ""}
                      {m.lifeYears === 0 && m.lifeMonths === 0 ? "—" : ""}
                    </Table.Td>
                    <Table.Td style={{ textAlign: "center" }}>
                      {m.inUse ? (
                        <Text size="xs" c="green" fw={700}>Đã dùng</Text>
                      ) : (
                        <Text size="xs" c="dimmed">Chưa dùng</Text>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <Tooltip label={m.inUse ? "Không thể xóa phương pháp đang sử dụng" : "Xóa"}>
                        <ActionIcon
                          variant="light"
                          color="red"
                          disabled={m.inUse}
                          onClick={() => handleDelete(m.methodId, m.method)}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder p="md" radius="md">
            <Title order={5} mb="sm">Thêm phương pháp mới</Title>
            <form onSubmit={(e) => { e.preventDefault(); handleCreate(); }}>
              <TextInput label="Mã Method" placeholder="VD: STL_15Y" withAsterisk {...form.getInputProps("method")} mb="xs" />
              <TextInput label="Diễn giải" placeholder="VD: Đường thẳng 15 năm" withAsterisk {...form.getInputProps("description")} mb="xs" />

              <Select
                label="Kiểu khấu hao"
                data={["Calculated", "Table", "Production", "Flat", "Formula"]}
                {...form.getInputProps("methodType")}
                mb="xs"
              />

              <Select
                label="Cơ sở tính khấu hao"
                data={["Cost", "NBV"]}
                {...form.getInputProps("calculationBasis")}
                mb="xs"
              />

              <Grid mb="xs">
                <Grid.Col span={6}>
                  <NumberInput label="Số năm sd" min={0} {...form.getInputProps("lifeYears")} />
                </Grid.Col>
                <Grid.Col span={6}>
                  <NumberInput label="Số tháng sd" min={0} max={11} {...form.getInputProps("lifeMonths")} />
                </Grid.Col>
              </Grid>

              <NumberInput
                label="Kỳ tính khấu hao/năm"
                min={1}
                max={365}
                {...form.getInputProps("proratePeriodsPerYear")}
                mb="xs"
              />

              <Checkbox
                label="Tính KH trong năm thanh lý"
                mt="md"
                {...form.getInputProps("depreciateInYearRetired", { type: "checkbox" })}
              />

              <Checkbox
                label="Không trừ giá trị thanh lý ước tính"
                mt="sm"
                {...form.getInputProps("excludeSalvageValue", { type: "checkbox" })}
              />

              <Button fullWidth mt="xl" color="blue" leftSection={<IconPlus size={16} />} type="submit">
                Thêm Method
              </Button>
            </form>
          </Card>
        </Grid.Col>
      </Grid>
    </Box>
  );
};

export default DepreciationMethod;

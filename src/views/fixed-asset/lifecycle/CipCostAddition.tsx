import { useState } from "react";
import {
  ActionIcon,
  Box,
  Button,
  Card,
  Flex,
  Grid,
  NumberInput,
  Table,
  TextInput,
  Title,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconDeviceFloppy, IconPlus, IconTrash } from "@tabler/icons-react";
import { FaNotice, FaPageHeader, money } from "../_components/FaCommon";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";

interface SourceLine {
  source: string;
  document: string;
  description: string;
  amount: number;
}

const CipCostAddition = () => {
  const [cipAsset] = useState("CIP00032");
  const [addDate, setAddDate] = useState<Date | null>(new Date());
  const [lines, setLines] = useState<SourceLine[]>([
    { source: "AP", document: "AP-26070091", description: "Thiết bị kho lạnh đợt 3", amount: 420000000 },
  ]);

  const baseCost = 2860000000;
  const totalSource = lines.reduce((s, l) => s + (Number(l.amount) || 0), 0);

  const addLine = () => setLines((p) => [...p, { source: "AP", document: "", description: "", amount: 0 }]);
  const removeLine = (i: number) => setLines((p) => (p.length === 1 ? p : p.filter((_, idx) => idx !== i)));
  const change = (i: number, key: keyof SourceLine, val: any) =>
    setLines((p) => p.map((l, idx) => (idx === i ? { ...l, [key]: val } : l)));

  const save = () => {
    if (lines.some((l) => Number(l.amount) <= 0)) {
      NotificationExtension.Fails("Mỗi Source Line phải có số tiền > 0.");
      return;
    }
    NotificationExtension.Success(`Đã bổ sung nguyên giá CIP. Current Cost mới: ${money(baseCost + totalSource)}.`);
  };

  return (
    <Box>
      <FaPageHeader
        actions={
          <Button color="blue" leftSection={<IconDeviceFloppy size={14} />} onClick={save}>
            Lưu thay đổi
          </Button>
        }
      />
      <Title order={3} mb={8}>
        Bổ sung nguyên giá CIP
      </Title>
      <FaNotice>Chỉ áp dụng cho tài sản loại CIP; mỗi source line &gt; 0; tổng source lines cộng vào Current Cost.</FaNotice>

      <Card withBorder shadow="sm" radius="md" p="lg" mb={16}>
        <Grid>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <TextInput label="CIP Asset" value={cipAsset} readOnly styles={{ input: { background: "#f1f5f9" } }} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <TextInput label="Current Cost hiện tại" value={money(baseCost)} readOnly styles={{ input: { background: "#f1f5f9" } }} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <DateInput label="Ngày bổ sung" withAsterisk valueFormat="DD/MM/YYYY" value={addDate} onChange={setAddDate} />
          </Grid.Col>
        </Grid>
      </Card>

      <Card withBorder shadow="sm" radius="md" p="lg">
        <Flex justify="space-between" align="center" mb="md">
          <Title order={5}>Source Lines — cộng thêm {money(totalSource)}</Title>
          <Button size="xs" color="teal" leftSection={<IconPlus size={12} />} onClick={addLine}>
            Thêm dòng
          </Button>
        </Flex>
        <Table withTableBorder withColumnBorders highlightOnHover>
          <Table.Thead style={{ background: "#f8f9fa" }}>
            <Table.Tr>
              <Table.Th style={{ width: 120 }}>Nguồn</Table.Th>
              <Table.Th style={{ width: 180 }}>Chứng từ</Table.Th>
              <Table.Th>Diễn giải</Table.Th>
              <Table.Th style={{ width: 200 }}>Số tiền</Table.Th>
              <Table.Th style={{ width: 50 }} />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {lines.map((l, i) => (
              <Table.Tr key={i}>
                <Table.Td>
                  <TextInput value={l.source} onChange={(e) => change(i, "source", e.currentTarget.value)} />
                </Table.Td>
                <Table.Td>
                  <TextInput value={l.document} placeholder="AP-..." onChange={(e) => change(i, "document", e.currentTarget.value)} />
                </Table.Td>
                <Table.Td>
                  <TextInput value={l.description} onChange={(e) => change(i, "description", e.currentTarget.value)} />
                </Table.Td>
                <Table.Td>
                  <NumberInput thousandSeparator="." decimalSeparator="," value={l.amount} onChange={(val) => change(i, "amount", Number(val) || 0)} />
                </Table.Td>
                <Table.Td align="center">
                  <ActionIcon color="red" variant="light" disabled={lines.length === 1} onClick={() => removeLine(i)}>
                    <IconTrash size={16} />
                  </ActionIcon>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>
    </Box>
  );
};

export default CipCostAddition;

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ActionIcon,
  Box,
  Button,
  Card,
  Checkbox,
  Flex,
  Grid,
  NumberInput,
  Select,
  Table,
  TextInput,
  Title,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IconArrowLeft, IconDeviceFloppy, IconPlus, IconTrash } from "@tabler/icons-react";
import { FaNotice, FaPageHeader, FaSteps, money } from "../_components/FaCommon";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import {
  createAsset,
  FA_BOOKS,
  FA_CATEGORIES,
  FA_METHOD_OPTIONS,
  FA_PRORATE_CONVENTIONS,
  FA_TXN_TYPES,
} from "../../../api/fixed-asset/api";
import { AssetType } from "../../../model/FixedAssetModel";

interface AssignmentLine {
  units: number;
  employeeName: string;
  employeeNumber: string;
  location: string;
  expenseAccount: string;
}

type Mode = "addition" | "opening" | "quick";

const titles: Record<Mode, string> = {
  addition: "Nhập mới tài sản — Addition",
  opening: "Nhập tài sản đã có khấu hao lũy kế",
  quick: "QuickAddition — Ghi tăng nhanh",
};

const AssetAddition = ({ mode = "addition" }: { mode?: Mode }) => {
  const navigate = useNavigate();
  const quick = mode === "quick";
  const opening = mode === "opening";

  const form = useForm({
    initialValues: {
      tagNumber: "",
      serialNumber: "",
      description: "",
      categoryCode: "102",
      txnType: "01",
      assetType: "CAPITALIZED" as AssetType,
      assetKey: "",
      units: 1,
      manufacturer: "",
      model: "",
      ownership: "Owned",
      bought: "New",
      book: "IDP_CORP",
      currentCost: 0,
      salvageValue: 0,
      ytdDepreciation: 0,
      accumulatedDepreciation: 0,
      depreciate: "Yes",
      method: "STL",
      lifeYears: 5,
      lifeMonths: 0,
      dateInService: new Date(),
      prorateConvention: "DAILY",
    },
  });

  const [lines, setLines] = useState<AssignmentLine[]>([
    { units: 1, employeeName: "Nguyễn Minh", employeeNumber: "NV00182", location: "HCM.NM.SANXUAT", expenseAccount: "62740010" },
  ]);

  const v = form.values;
  const isCip = v.assetType === "CIP";
  const recoverableCost = Math.max(0, v.currentCost - v.salvageValue);
  const netBookValue = Math.max(0, v.currentCost - (opening ? v.accumulatedDepreciation : 0));
  const categoryPreview = useMemo(
    () => `Tự sinh khi lưu (${v.categoryCode}-xxxxxx)`,
    [v.categoryCode]
  );

  const addLine = () =>
    setLines((p) => [...p, { units: 1, employeeName: "", employeeNumber: "", location: "", expenseAccount: "" }]);
  const removeLine = (i: number) => setLines((p) => (p.length === 1 ? p : p.filter((_, idx) => idx !== i)));
  const changeLine = (i: number, key: keyof AssignmentLine, val: any) =>
    setLines((p) => p.map((l, idx) => (idx === i ? { ...l, [key]: val } : l)));

  const totalAssigned = lines.reduce((s, l) => s + (Number(l.units) || 0), 0);

  const handleSubmit = async (saveDraft = false) => {
    if (!v.description) {
      NotificationExtension.Fails("Vui lòng nhập Tên tài sản (Description).");
      return;
    }
    if (isCip && v.depreciate === "Yes") {
      NotificationExtension.Fails("Tài sản CIP không được bật Depreciate.");
      return;
    }
    if (!saveDraft && totalAssigned !== v.units) {
      NotificationExtension.Fails(`Tổng Units Assignment (${totalAssigned}) phải bằng Total Units (${v.units}).`);
      return;
    }
    if (opening && v.accumulatedDepreciation > recoverableCost) {
      NotificationExtension.Fails("Accumulated Depreciation không được vượt Recoverable Cost.");
      return;
    }

    const cat = FA_CATEGORIES.find((c) => c.value === v.categoryCode);
    const res = await createAsset({
      tagNumber: v.tagNumber,
      serialNumber: v.serialNumber,
      description: v.description,
      categoryCode: v.categoryCode,
      category: cat?.label || v.categoryCode,
      assetKey: v.assetKey,
      assetType: v.assetType,
      units: v.units,
      manufacturer: v.manufacturer,
      model: v.model,
      ownership: v.ownership as "Owned" | "Leased",
      bought: v.bought as "New" | "Used",
      book: v.book,
      currentCost: v.currentCost,
      salvageValue: v.salvageValue,
      ytdDepreciation: opening ? v.ytdDepreciation : 0,
      accumulatedDepreciation: opening ? v.accumulatedDepreciation : 0,
      depreciate: v.depreciate === "Yes",
      method: v.method,
      lifeYears: v.lifeYears,
      lifeMonths: v.lifeMonths,
      dateInService: v.dateInService.toISOString().slice(0, 10),
      prorateConvention: v.prorateConvention,
    });

    if (res?.success) {
      NotificationExtension.Success(saveDraft ? "Đã lưu nháp tài sản." : `Tài sản ${res.data.assetNumber} đã được ghi tăng.`);
      if (!saveDraft) navigate("/fixed-asset/asset/list");
    }
  };

  return (
    <Box>
      <FaPageHeader
        actions={
          <>
            <Button variant="outline" color="gray" leftSection={<IconArrowLeft size={14} />} onClick={() => navigate("/fixed-asset/asset/list")}>
              Danh sách
            </Button>
            <Button variant="light" onClick={() => handleSubmit(true)}>
              Lưu nháp
            </Button>
            <Button color="blue" leftSection={<IconDeviceFloppy size={14} />} onClick={() => handleSubmit(false)}>
              Hoàn tất
            </Button>
          </>
        }
      />

      <Title order={3} mb={4}>
        {titles[mode]}
      </Title>

      {!quick && <FaSteps labels={["Thông tin tài sản", "Book & Khấu hao", "Assignment"]} active={0} />}

      {/* Card 1: Identification */}
      <Card withBorder shadow="sm" radius="md" p="lg" mb={16}>
        <Title order={5} mb="md">
          Thông tin nhận diện
        </Title>
        <Grid>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <TextInput label="Asset Number" value={categoryPreview} readOnly styles={{ input: { background: "#f1f5f9" } }} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <TextInput label="Tag Number" placeholder="IDP-HCM-0185" {...form.getInputProps("tagNumber")} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <TextInput label="Serial Number" placeholder="SN-2026-09182" {...form.getInputProps("serialNumber")} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <TextInput label="Description (Tên TSCĐ)" withAsterisk placeholder="Máy nén khí Ingersoll Rand" {...form.getInputProps("description")} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Select label="Category" withAsterisk data={FA_CATEGORIES} {...form.getInputProps("categoryCode")} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Select label="Loại giao dịch" data={FA_TXN_TYPES} {...form.getInputProps("txnType")} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Select
              label="Asset Type"
              withAsterisk
              data={[
                { value: "CAPITALIZED", label: "Capitalized" },
                { value: "CIP", label: "CIP - Construction in process" },
                { value: "GROUP", label: "Group" },
              ]}
              {...form.getInputProps("assetType")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <TextInput label="Asset Key" placeholder="102.0600" {...form.getInputProps("assetKey")} />
          </Grid.Col>
          <Grid.Col span={{ base: 6, md: 3 }}>
            <NumberInput label="Units" withAsterisk min={1} {...form.getInputProps("units")} />
          </Grid.Col>
          <Grid.Col span={{ base: 6, md: 3 }}>
            <TextInput label="Manufacturer" placeholder="Ingersoll Rand" {...form.getInputProps("manufacturer")} />
          </Grid.Col>
          <Grid.Col span={{ base: 6, md: 3 }}>
            <TextInput label="Model" placeholder="RSe 30n" {...form.getInputProps("model")} />
          </Grid.Col>
          <Grid.Col span={{ base: 6, md: 3 }}>
            <Group2>
              <Select label="Ownership" data={["Owned", "Leased"]} {...form.getInputProps("ownership")} w="50%" />
              <Select label="Bought" data={["New", "Used"]} {...form.getInputProps("bought")} w="50%" />
            </Group2>
          </Grid.Col>
        </Grid>
      </Card>

      {/* Card 2: Book & Depreciation */}
      <Card withBorder shadow="sm" radius="md" p="lg" mb={16}>
        <Title order={5} mb="md">
          Book & Khấu hao
        </Title>
        <Grid>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Select label="Book" withAsterisk data={FA_BOOKS} {...form.getInputProps("book")} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <NumberInput label="Current Cost" withAsterisk thousandSeparator="." decimalSeparator="," {...form.getInputProps("currentCost")} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <TextInput label="Original Cost" value={money(v.currentCost)} readOnly styles={{ input: { background: "#f1f5f9" } }} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <NumberInput label="Salvage Value" thousandSeparator="." decimalSeparator="," {...form.getInputProps("salvageValue")} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <TextInput label="Recoverable Cost" value={money(recoverableCost)} readOnly styles={{ input: { background: "#f1f5f9" } }} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <TextInput label="Net Book Value" value={money(netBookValue)} readOnly styles={{ input: { background: "#f1f5f9" } }} />
          </Grid.Col>
          {opening && (
            <>
              <Grid.Col span={{ base: 12, md: 3 }}>
                <NumberInput label="YTD Depreciation" withAsterisk thousandSeparator="." decimalSeparator="," {...form.getInputProps("ytdDepreciation")} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 3 }}>
                <NumberInput label="Accumulated Depreciation" withAsterisk thousandSeparator="." decimalSeparator="," {...form.getInputProps("accumulatedDepreciation")} />
              </Grid.Col>
            </>
          )}
          <Grid.Col span={{ base: 6, md: 3 }}>
            <Select label="Depreciate" data={["Yes", "No"]} disabled={isCip} value={isCip ? "No" : v.depreciate} onChange={(val) => form.setFieldValue("depreciate", val || "No")} />
          </Grid.Col>
          <Grid.Col span={{ base: 6, md: 3 }}>
            <Select label="Method" data={FA_METHOD_OPTIONS} disabled={isCip} {...form.getInputProps("method")} />
          </Grid.Col>
          <Grid.Col span={{ base: 6, md: 3 }}>
            <NumberInput label="Life Years" min={0} disabled={isCip} {...form.getInputProps("lifeYears")} />
          </Grid.Col>
          <Grid.Col span={{ base: 6, md: 3 }}>
            <NumberInput label="Months" min={0} max={11} disabled={isCip} {...form.getInputProps("lifeMonths")} />
          </Grid.Col>
          <Grid.Col span={{ base: 6, md: 3 }}>
            <DateInput label="Date in Service" withAsterisk valueFormat="DD/MM/YYYY" {...form.getInputProps("dateInService")} />
          </Grid.Col>
          <Grid.Col span={{ base: 6, md: 3 }}>
            <Select label="Prorate Convention" data={FA_PRORATE_CONVENTIONS} {...form.getInputProps("prorateConvention")} />
          </Grid.Col>
        </Grid>
        {isCip && <FaNotice>Tài sản loại CIP đang dở dang: hệ thống tự tắt Depreciate cho tới khi thực hiện Capitalize.</FaNotice>}
      </Card>

      {/* Card 3: Assignment */}
      <Card withBorder shadow="sm" radius="md" p="lg">
        <Flex justify="space-between" align="center" mb="md">
          <Title order={5}>
            Assignment — Tổng phân bổ {totalAssigned}/{v.units} units
          </Title>
          {!quick && (
            <Button size="xs" color="teal" leftSection={<IconPlus size={12} />} onClick={addLine}>
              Thêm phân bổ
            </Button>
          )}
        </Flex>
        <Table withTableBorder withColumnBorders highlightOnHover>
          <Table.Thead style={{ background: "#f8f9fa" }}>
            <Table.Tr>
              <Table.Th style={{ width: 100 }}>Units</Table.Th>
              <Table.Th>Nhân viên</Table.Th>
              <Table.Th style={{ width: 130 }}>Mã NV</Table.Th>
              <Table.Th>Location</Table.Th>
              <Table.Th>Expense Account</Table.Th>
              <Table.Th style={{ width: 50 }} />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {lines.map((l, i) => (
              <Table.Tr key={i}>
                <Table.Td>
                  <NumberInput min={1} value={l.units} onChange={(val) => changeLine(i, "units", Number(val) || 1)} />
                </Table.Td>
                <Table.Td>
                  <TextInput placeholder="Tên nhân viên" value={l.employeeName} onChange={(e) => changeLine(i, "employeeName", e.currentTarget.value)} />
                </Table.Td>
                <Table.Td>
                  <TextInput placeholder="NV00182" value={l.employeeNumber} onChange={(e) => changeLine(i, "employeeNumber", e.currentTarget.value)} />
                </Table.Td>
                <Table.Td>
                  <TextInput placeholder="HCM.NM.SANXUAT" value={l.location} onChange={(e) => changeLine(i, "location", e.currentTarget.value)} />
                </Table.Td>
                <Table.Td>
                  <TextInput placeholder="62740010" value={l.expenseAccount} onChange={(e) => changeLine(i, "expenseAccount", e.currentTarget.value)} />
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

// Bọc 2 select cạnh nhau (Ownership / Bought)
function Group2({ children }: { children: React.ReactNode }) {
  return <Flex gap="xs">{children}</Flex>;
}

export default AssetAddition;

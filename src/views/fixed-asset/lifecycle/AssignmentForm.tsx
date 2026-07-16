import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Grid,
  NumberInput,
  Table,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconArrowLeft, IconDeviceFloppy, IconPlus, IconTrash } from "@tabler/icons-react";
import { FaNotice, FaPageHeader } from "../_components/FaCommon";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";

/**
 * Assignment — Điều chuyển bộ phận / người sử dụng tài sản (§1.8).
 *
 * Quy tắc: điều chuyển nội bộ trong CÙNG 1 Book. Dòng nguồn nhập Unit Change
 * âm, dòng đích nhập dương; TỔNG Unit Change phải bằng 0 (bảo toàn số lượng).
 * Không cho sửa/xóa assignment đã hạch toán.
 */
interface TransferLine {
  unitChange: number;
  employeeName: string;
  location: string;
  expenseAccount: string;
}

const AssignmentForm = () => {
  const navigate = useNavigate();

  const [assetNumber, setAssetNumber] = useState("TS000184");
  const [transferDate, setTransferDate] = useState<Date | null>(new Date());
  const [comments, setComments] = useState("Điều chuyển nội bộ nhà máy");

  const [lines, setLines] = useState<TransferLine[]>([
    { unitChange: -1, employeeName: "Nguyễn Minh", location: "HCM.NM.SANXUAT", expenseAccount: "62740010" },
    { unitChange: 1, employeeName: "Trần Hùng", location: "HCM.NM.BAOTRI", expenseAccount: "62770010" },
  ]);

  const totalUnitChange = lines.reduce((s, l) => s + (Number(l.unitChange) || 0), 0);
  const balanced = totalUnitChange === 0;

  const addLine = () =>
    setLines((p) => [...p, { unitChange: 1, employeeName: "", location: "", expenseAccount: "" }]);
  const removeLine = (i: number) => setLines((p) => (p.length <= 2 ? p : p.filter((_, idx) => idx !== i)));
  const change = (i: number, key: keyof TransferLine, val: any) =>
    setLines((p) => p.map((l, idx) => (idx === i ? { ...l, [key]: val } : l)));

  const complete = () => {
    if (!assetNumber) {
      NotificationExtension.Fails("Vui lòng nhập Asset Number.");
      return;
    }
    if (!balanced) {
      NotificationExtension.Fails(`Tổng Unit Change phải bằng 0 (hiện tại: ${totalUnitChange}).`);
      return;
    }
    if (lines.some((l) => l.unitChange !== 0 && (!l.employeeName || !l.location || !l.expenseAccount))) {
      NotificationExtension.Fails("Mỗi dòng điều chuyển cần đủ Nhân viên, Location và Expense Account.");
      return;
    }
    NotificationExtension.Success("Assignment cân bằng và đã hoàn tất điều chuyển.");
    navigate("/fixed-asset/asset/list");
  };

  return (
    <Box>
      <FaPageHeader
        actions={
          <>
            <Button variant="outline" color="gray" leftSection={<IconArrowLeft size={14} />} onClick={() => navigate("/fixed-asset/asset/list")}>
              Danh sách
            </Button>
            <Button variant="light" color="red" onClick={() => navigate("/fixed-asset/asset/list")}>
              Xóa nháp
            </Button>
            <Button color="blue" leftSection={<IconDeviceFloppy size={14} />} onClick={complete}>
              Hoàn tất
            </Button>
          </>
        }
      />

      <Title order={3} mb={8}>
        Assignment — Điều chuyển bộ phận / người dùng
      </Title>
      <FaNotice type="info">
        Tổng Unit Change phải bằng <b>0</b>: dòng nguồn nhập số âm, dòng đích nhập số dương. Chỉ điều chuyển nội bộ trong
        cùng một Book; không sửa/xóa assignment đã hạch toán.
      </FaNotice>

      <Card withBorder shadow="sm" radius="md" p="lg" mb={16}>
        <Grid>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <TextInput label="Asset Number" withAsterisk value={assetNumber} onChange={(e) => setAssetNumber(e.currentTarget.value)} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <DateInput label="Transfer Date" withAsterisk valueFormat="DD/MM/YYYY" value={transferDate} onChange={setTransferDate} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Textarea label="Comments" autosize minRows={1} value={comments} onChange={(e) => setComments(e.currentTarget.value)} />
          </Grid.Col>
        </Grid>
      </Card>

      <Card withBorder shadow="sm" radius="md" p="lg">
        <Flex justify="space-between" align="center" mb="md">
          <Title order={5}>
            Chi tiết điều chuyển —{" "}
            <Badge color={balanced ? "teal" : "red"} variant="light">
              Tổng Unit Change = {totalUnitChange}
            </Badge>
          </Title>
          <Button size="xs" color="teal" leftSection={<IconPlus size={12} />} onClick={addLine}>
            Thêm dòng đích
          </Button>
        </Flex>

        <Table withTableBorder withColumnBorders highlightOnHover>
          <Table.Thead style={{ background: "#f8f9fa" }}>
            <Table.Tr>
              <Table.Th style={{ width: 110 }}>Loại</Table.Th>
              <Table.Th style={{ width: 130 }}>Unit Change</Table.Th>
              <Table.Th>Nhân viên</Table.Th>
              <Table.Th>Location</Table.Th>
              <Table.Th>Expense Account</Table.Th>
              <Table.Th style={{ width: 50 }} />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {lines.map((l, i) => {
              const kind = l.unitChange < 0 ? { c: "red", t: "Nguồn" } : l.unitChange > 0 ? { c: "green", t: "Đích" } : { c: "gray", t: "—" };
              return (
                <Table.Tr key={i}>
                  <Table.Td>
                    <Badge color={kind.c} variant="light">
                      {kind.t}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <NumberInput value={l.unitChange} onChange={(val) => change(i, "unitChange", Number(val) || 0)} />
                  </Table.Td>
                  <Table.Td>
                    <TextInput placeholder="Tên nhân viên" value={l.employeeName} onChange={(e) => change(i, "employeeName", e.currentTarget.value)} />
                  </Table.Td>
                  <Table.Td>
                    <TextInput placeholder="HCM.NM.SANXUAT" value={l.location} onChange={(e) => change(i, "location", e.currentTarget.value)} />
                  </Table.Td>
                  <Table.Td>
                    <TextInput placeholder="62740010" value={l.expenseAccount} onChange={(e) => change(i, "expenseAccount", e.currentTarget.value)} />
                  </Table.Td>
                  <Table.Td align="center">
                    <ActionIcon color="red" variant="light" disabled={lines.length <= 2} onClick={() => removeLine(i)}>
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </Card>
    </Box>
  );
};

export default AssignmentForm;

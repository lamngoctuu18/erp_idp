import { Box, Button, Card, Flex, Grid, Group, NumberInput, Select, TextInput, Text, Table, ActionIcon, Title, Badge } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconArrowLeft, IconDeviceFloppy, IconPlus, IconTrash } from "@tabler/icons-react";
import BreadCrumb from "../../../_base/component/_layout/_breadcrumb";
import { getInventoryItemList, getSubinventories, createMoveOrder, getOnhandList } from "../../../api/inventory/api";
import { InventoryItemModel, SubinventoryModel, OnhandModel } from "../../../model/InventoryModel";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";

interface ReqLine {
  inventoryItemId: number;
  quantity: number;
  fromSub: string;
  toSub: string;
  lineDescription?: string;
}

const MoveOrderCreate = () => {
  const navigate = useNavigate();

  const [desc, setDesc] = useState("");
  const [dateReq, setDateReq] = useState<Date | null>(null);
  
  const [itemsList, setItemsList] = useState<InventoryItemModel[]>([]);
  const [subinvsList, setSubinvsList] = useState<SubinventoryModel[]>([]);
  const [onhandList, setOnhandList] = useState<OnhandModel[]>([]);

  const [lines, setLines] = useState<ReqLine[]>([
    {
      inventoryItemId: 0,
      quantity: 1,
      fromSub: "01",
      toSub: "X01",
      lineDescription: ""
    }
  ]);

  const loadData = async () => {
    try {
      const itemsRes = await getInventoryItemList({ skip: 0, take: 100 });
      if (itemsRes?.success) setItemsList(itemsRes.data?.lists || []);

      const subRes = await getSubinventories();
      if (subRes?.success) setSubinvsList(subRes.data || []);

      const onhandRes = await getOnhandList();
      if (onhandRes?.success && onhandRes.data) {
        setOnhandList(onhandRes.data);
      }
      
      // Set default date required (today + 3 days)
      const future = new Date();
      future.setDate(future.getDate() + 3);
      setDateReq(future);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddLine = () => {
    setLines((prev) => [
      ...prev,
      {
        inventoryItemId: 0,
        quantity: 1,
        fromSub: "01",
        toSub: "X01",
        lineDescription: ""
      }
    ]);
  };

  const handleRemoveLine = (index: number) => {
    if (lines.length === 1) return;
    setLines((prev) => prev.filter((_, i) => i !== index));
  };

  const handleLineChange = (index: number, key: keyof ReqLine, val: any) => {
    const newLines = [...lines];
    newLines[index] = { ...newLines[index], [key]: val } as ReqLine;
    setLines(newLines);
  };

  // Helper lookup available quantity
  const getAvailableQty = (itemId: number, fromSub: string) => {
    if (!itemId) return 0;
    const matches = onhandList.filter(o => o.inventoryItemId === itemId && o.subinventoryCode === fromSub);
    return matches.reduce((sum, o) => sum + o.transactionQuantity, 0);
  };

  const handleSave = async () => {
    if (!desc) {
      NotificationExtension.Fails("Vui lòng điền diễn giải lý do yêu cầu!");
      return;
    }
    if (!dateReq) {
      NotificationExtension.Fails("Vui lòng chọn ngày cần hàng!");
      return;
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line.inventoryItemId) {
        NotificationExtension.Fails(`Dòng ${i + 1}: Vui lòng chọn Vật tư.`);
        return;
      }
      if (!line.fromSub || !line.toSub) {
        NotificationExtension.Fails(`Dòng ${i + 1}: Vui lòng chọn Kho xuất và Kho nhận.`);
        return;
      }
      if (line.fromSub === line.toSub) {
        NotificationExtension.Fails(`Dòng ${i + 1}: Kho xuất và Kho nhận yêu cầu phải khác nhau.`);
        return;
      }
      if (line.quantity <= 0) {
        NotificationExtension.Fails(`Dòng ${i + 1}: Số lượng yêu cầu phải lớn hơn 0.`);
        return;
      }

      // Kiểm định tồn kho trước khi gửi yêu cầu cấp phát
      const available = getAvailableQty(line.inventoryItemId, line.fromSub);
      if (line.quantity > available) {
        NotificationExtension.Fails(
          `Dòng ${i + 1}: Số lượng yêu cầu (${line.quantity}) vượt quá tồn kho khả dụng hiện tại (${available})!`
        );
        return;
      }
    }

    try {
      const res = await createMoveOrder({
        description: desc,
        dateRequired: dateReq.toISOString().split("T")[0],
        items: lines
      });

      if (res?.success) {
        NotificationExtension.Success("Gửi yêu cầu Move Order thành công (Chờ phê duyệt)!");
        navigate("/inventory/move-order/list");
      }
    } catch {
      NotificationExtension.Fails("Lỗi khi tạo yêu cầu.");
    }
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
            onClick={() => navigate("/inventory/move-order/list")}
          >
            Hủy bỏ
          </Button>
          <Button
            style={{ backgroundColor: "#1971c2" }}
            leftSection={<IconDeviceFloppy size={14} />}
            onClick={handleSave}
          >
            Gửi yêu cầu
          </Button>
        </Group>
      </Flex>

      <Card withBorder shadow="sm" radius="md" p="lg" mb={16}>
        <Title order={4} mb="md" c="blue">Thông tin Yêu cầu (Move Order Header)</Title>
        <Grid mb="md">
          {/* Hàng 1 */}
          <Grid.Col span={{ base: 12, md: 3 }}>
            <TextInput
              label="Số yêu cầu"
              styles={{ label: { whiteSpace: "nowrap" } }}
              value="MO-202607-0002"
              disabled
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <TextInput
              label="Người yêu cầu"
              styles={{ label: { whiteSpace: "nowrap" } }}
              value="Nguyễn Văn Hùng"
              disabled
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Select
              label="Phòng ban / Cost Center"
              styles={{ label: { whiteSpace: "nowrap" } }}
              data={[
                { value: "PROD", label: "PROD - Phòng Sản xuất" },
                { value: "MAINT", label: "MAINT - Tổ Bảo trì kỹ thuật" },
                { value: "QA", label: "QA - Kiểm soát chất lượng" },
                { value: "LOG", label: "LOG - Phòng Cung ứng vật tư" }
              ]}
              defaultValue="PROD"
              withAsterisk
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Select
              label="Loại Move Order"
              styles={{ label: { whiteSpace: "nowrap" } }}
              data={[
                { value: "REQUISITION", label: "Cấp phát cho sản xuất/dự án" },
                { value: "TRANSFER", label: "Yêu cầu di chuyển kho nội bộ" }
              ]}
              defaultValue="REQUISITION"
              withAsterisk
            />
          </Grid.Col>

          {/* Hàng 2 */}
          <Grid.Col span={{ base: 12, md: 3 }}>
            <DateInput
              label="Ngày cần hàng"
              styles={{ label: { whiteSpace: "nowrap" } }}
              placeholder="Chọn ngày cần hàng"
              value={dateReq}
              onChange={setDateReq}
              valueFormat="DD/MM/YYYY"
              withAsterisk
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 9 }}>
            <TextInput
              label="Diễn giải lý do cấp phát"
              styles={{ label: { whiteSpace: "nowrap" } }}
              placeholder="Ví dụ: Xuất gỗ MDF làm tủ hồ sơ văn phòng thiết kế"
              value={desc}
              onChange={(e) => setDesc(e.currentTarget.value)}
              withAsterisk
            />
          </Grid.Col>
        </Grid>
      </Card>

      <Card withBorder shadow="sm" radius="md" p="lg">
        <Flex justify="space-between" align="center" mb="md">
          <Title order={4} c="blue">Danh sách Vật tư Yêu cầu (Move Order Lines)</Title>
          <Button
            size="xs"
            color="teal"
            leftSection={<IconPlus size={12} />}
            onClick={handleAddLine}
          >
            Thêm dòng yêu cầu
          </Button>
        </Flex>

        <Box style={{ overflowX: "auto" }}>
          <Table withTableBorder withColumnBorders highlightOnHover style={{ minWidth: "1250px", tableLayout: "fixed" }}>
            <Table.Thead style={{ backgroundColor: "#f8f9fa" }}>
              <Table.Tr>
                <Table.Th style={{ width: "280px" }}>Chọn vật tư</Table.Th>
                <Table.Th style={{ width: "100px" }}>Đơn vị (UOM)</Table.Th>
                <Table.Th style={{ width: "140px" }}>Tồn kho khả dụng</Table.Th>
                <Table.Th style={{ width: "170px" }}>Kho nguồn đề xuất</Table.Th>
                <Table.Th style={{ width: "170px" }}>Kho đích nhận</Table.Th>
                <Table.Th style={{ width: "140px" }}>Số lượng yêu cầu</Table.Th>
                <Table.Th>Lý do chi tiết dòng (Line Notes)</Table.Th>
                <Table.Th style={{ width: "50px" }}></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {lines.map((line, index) => {
                const selectedItem = itemsList.find(i => i.inventoryItemId === line.inventoryItemId);
                const uomCode = selectedItem?.primaryUomCode || "-";
                const available = getAvailableQty(line.inventoryItemId, line.fromSub);

                return (
                  <Table.Tr key={index}>
                    {/* Chọn vật tư */}
                    <Table.Td>
                      <Select
                        placeholder="Chọn vật tư"
                        data={itemsList.map((i) => ({
                          value: i.inventoryItemId.toString(),
                          label: `${i.itemNumber} - ${i.description}`
                        }))}
                        value={line.inventoryItemId ? line.inventoryItemId.toString() : null}
                        onChange={(val) => handleLineChange(index, "inventoryItemId", Number(val))}
                      />
                    </Table.Td>
                    {/* UOM */}
                    <Table.Td align="center">
                      <Text style={{ fontWeight: 600 }} size="sm">{uomCode}</Text>
                    </Table.Td>
                    {/* Tồn kho khả dụng */}
                    <Table.Td align="right">
                      <Text 
                        style={{ fontFamily: "monospace", fontWeight: 700 }}
                        c={available > 0 ? "teal" : "red"}
                        size="sm"
                      >
                        {available} {uomCode !== "-" ? uomCode : ""}
                      </Text>
                    </Table.Td>
                    {/* Kho nguồn */}
                    <Table.Td>
                      <Select
                        placeholder="Chọn kho"
                        data={subinvsList.map((s) => ({
                          value: s.secondaryInventoryName,
                          label: `${s.secondaryInventoryName} - ${s.description}`
                        }))}
                        value={line.fromSub}
                        onChange={(val) => handleLineChange(index, "fromSub", val)}
                      />
                    </Table.Td>
                    {/* Kho đích */}
                    <Table.Td>
                      <Select
                        placeholder="Chọn kho nhận"
                        data={subinvsList.map((s) => ({
                          value: s.secondaryInventoryName,
                          label: `${s.secondaryInventoryName} - ${s.description}`
                        }))}
                        value={line.toSub}
                        onChange={(val) => handleLineChange(index, "toSub", val)}
                      />
                    </Table.Td>
                    {/* Số lượng */}
                    <Table.Td>
                      <NumberInput
                        min={1}
                        value={line.quantity}
                        onChange={(val) => handleLineChange(index, "quantity", Number(val) || 1)}
                        disabled={!line.inventoryItemId}
                      />
                    </Table.Td>
                    {/* Chi tiết dòng */}
                    <Table.Td>
                      <TextInput
                        placeholder="Ghi chú thêm..."
                        value={line.lineDescription || ""}
                        onChange={(e) => handleLineChange(index, "lineDescription", e.currentTarget.value)}
                        disabled={!line.inventoryItemId}
                      />
                    </Table.Td>
                    {/* Xóa dòng */}
                    <Table.Td align="center">
                      <ActionIcon
                        color="red"
                        variant="light"
                        onClick={() => handleRemoveLine(index)}
                        disabled={lines.length === 1}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </Box>
      </Card>
    </Box>
  );
};

export default MoveOrderCreate;

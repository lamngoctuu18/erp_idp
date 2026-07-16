import { Box, Button, Card, Flex, Grid, Group, NumberInput, Select, TextInput, Text, Table, ActionIcon, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DateInput } from "@mantine/dates";
import { IconArrowLeft, IconDeviceFloppy, IconPlus, IconTrash } from "@tabler/icons-react";
import BreadCrumb from "../../../_base/component/_layout/_breadcrumb";
import { getInventoryItemList, getSubinventories, getLocatorsBySubinventory, createTransferTransaction, getOnhandList } from "../../../api/inventory/api";
import { InventoryItemModel, SubinventoryModel, LocatorModel, OnhandModel } from "../../../model/InventoryModel";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";

interface TransferLine {
  inventoryItemId: number;
  fromLocatorId?: number;
  fromLocatorCode?: string;
  toLocatorId?: number;
  toLocatorCode?: string;
  lotNumber?: string;
  quantity: number;
  // UI helpers
  fromLocatorsList: LocatorModel[];
  toLocatorsList: LocatorModel[];
  isLotControlled: boolean;
  onhandQty: number;
}

const TransferTransactionCreate = () => {
  const navigate = useNavigate();

  const [transferType, setTransferType] = useState<"SUBINVENTORY" | "ORGANIZATION">("SUBINVENTORY");
  const [fromSubCode, setFromSubCode] = useState<string>("");
  const [toSubCode, setToSubCode] = useState<string>("");
  
  // Inter-Org fields
  const [toOrgId, setToOrgId] = useState<string | null>("126");
  const [shipmentNum, setShipmentNum] = useState("");
  const [waybill, setWaybill] = useState("");
  const [freightCode, setFreightCode] = useState("");
  const [txDate, setTxDate] = useState<Date | null>(new Date());
  const [preparedBy] = useState("Nguyễn Văn Hùng");
  const [headerDesc, setHeaderDesc] = useState("");

  const [itemsList, setItemsList] = useState<InventoryItemModel[]>([]);
  const [subinvsList, setSubinvsList] = useState<SubinventoryModel[]>([]);
  const [onhandData, setOnhandData] = useState<OnhandModel[]>([]);

  const [lines, setLines] = useState<TransferLine[]>([
    {
      inventoryItemId: 0,
      quantity: 1,
      fromLocatorsList: [],
      toLocatorsList: [],
      isLotControlled: false,
      onhandQty: 0
    }
  ]);

  const loadInitialData = async () => {
    try {
      const itemsRes = await getInventoryItemList({ skip: 0, take: 100 });
      if (itemsRes?.success) setItemsList(itemsRes.data?.lists || []);

      const subRes = await getSubinventories();
      if (subRes?.success) setSubinvsList(subRes.data || []);

      const onhandRes = await getOnhandList();
      if (onhandRes?.success) setOnhandData(onhandRes.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Khi thay đổi kho xuất/kho nhập chính
  const handleFromSubChange = async (val: string) => {
    setFromSubCode(val);
    const sub = subinvsList.find((s) => s.secondaryInventoryName === val);
    
    // Tải locator cho tất cả các dòng
    let locs: LocatorModel[] = [];
    if (sub && sub.locatorControlCode !== 1) {
      const locRes = await getLocatorsBySubinventory(val);
      if (locRes?.success) locs = locRes.data || [];
    }

    setLines((prev) =>
      prev.map((l) => {
        const matchedOnhand = onhandData.filter((o) => o.inventoryItemId === l.inventoryItemId && o.subinventoryCode === val);
        const totalOnhand = matchedOnhand.reduce((sum, c) => sum + c.transactionQuantity, 0);
        return {
          ...l,
          fromSubinventoryCode: val,
          fromLocatorsList: locs,
          fromLocatorId: undefined,
          fromLocatorCode: undefined,
          onhandQty: totalOnhand
        };
      })
    );
  };

  const handleToSubChange = async (val: string) => {
    setToSubCode(val);
    const sub = subinvsList.find((s) => s.secondaryInventoryName === val);
    
    let locs: LocatorModel[] = [];
    if (sub && sub.locatorControlCode !== 1) {
      const locRes = await getLocatorsBySubinventory(val);
      if (locRes?.success) locs = locRes.data || [];
    }

    setLines((prev) =>
      prev.map((l) => ({
        ...l,
        toLocatorsList: locs,
        toLocatorId: undefined,
        toLocatorCode: undefined
      }))
    );
  };

  const handleAddLine = () => {
    setLines((prev) => [
      ...prev,
      {
        inventoryItemId: 0,
        quantity: 1,
        fromLocatorsList: [],
        toLocatorsList: [],
        isLotControlled: false,
        onhandQty: 0
      }
    ]);
  };

  const handleRemoveLine = (index: number) => {
    if (lines.length === 1) return;
    setLines((prev) => prev.filter((_, i) => i !== index));
  };

  const handleLineChange = async (index: number, key: keyof TransferLine, val: any) => {
    const newLines = [...lines];
    newLines[index] = { ...newLines[index], [key]: val } as TransferLine;

    if (key === "inventoryItemId") {
      const itemId = Number(val);
      const selectedItem = itemsList.find((i) => i.inventoryItemId === itemId);
      
      newLines[index].isLotControlled = selectedItem?.itemNumber === "ITEM-KEO" || false;
      newLines[index].fromLocatorId = undefined;
      newLines[index].fromLocatorCode = undefined;
      newLines[index].toLocatorId = undefined;
      newLines[index].toLocatorCode = undefined;
      newLines[index].lotNumber = "";

      // Load onhand
      const matchedOnhand = onhandData.filter((o) => o.inventoryItemId === itemId && o.subinventoryCode === fromSubCode);
      const totalOnhand = matchedOnhand.reduce((sum, c) => sum + c.transactionQuantity, 0);
      newLines[index].onhandQty = totalOnhand;
    }

    setLines(newLines);
  };

  const handleSave = async () => {
    if (!fromSubCode || !toSubCode) {
      NotificationExtension.Fails("Vui lòng chọn Kho xuất và Kho nhập!");
      return;
    }
    if (fromSubCode === toSubCode && transferType === "SUBINVENTORY") {
      NotificationExtension.Fails("Kho xuất và Kho nhập phải khác nhau!");
      return;
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line.inventoryItemId) {
        NotificationExtension.Fails(`Dòng ${i + 1}: Vui lòng chọn Vật tư.`);
        return;
      }
      if (line.fromLocatorsList.length > 0 && !line.fromLocatorId) {
        NotificationExtension.Fails(`Dòng ${i + 1}: Kho xuất yêu cầu chọn Vị trí nguồn.`);
        return;
      }
      if (line.toLocatorsList.length > 0 && !line.toLocatorId) {
        NotificationExtension.Fails(`Dòng ${i + 1}: Kho nhập yêu cầu chọn Vị trí đích.`);
        return;
      }
      if (line.quantity <= 0) {
        NotificationExtension.Fails(`Dòng ${i + 1}: Số lượng chuyển phải lớn hơn 0.`);
        return;
      }
      if (line.quantity > line.onhandQty) {
        NotificationExtension.Fails(`Dòng ${i + 1}: Số lượng chuyển vượt quá tồn kho thực tế (${line.onhandQty}).`);
        return;
      }
    }

    try {
      const formattedItems = lines.map((l) => {
        const fromLoc = l.fromLocatorsList.find((loc) => loc.inventoryLocatorId === Number(l.fromLocatorId))?.locatorCode;
        const toLoc = l.toLocatorsList.find((loc) => loc.inventoryLocatorId === Number(l.toLocatorId))?.locatorCode;
        return {
          inventoryItemId: l.inventoryItemId,
          fromLocatorId: l.fromLocatorId ? Number(l.fromLocatorId) : undefined,
          fromLocatorCode: fromLoc,
          toLocatorId: l.toLocatorId ? Number(l.toLocatorId) : undefined,
          toLocatorCode: toLoc,
          lotNumber: l.lotNumber,
          quantity: l.quantity
        };
      });

      const res = await createTransferTransaction({
        transferType,
        fromSubCode,
        toSubCode,
        toOrgId: transferType === "ORGANIZATION" ? Number(toOrgId) : undefined,
        toOrgCode: transferType === "ORGANIZATION" ? (toOrgId === "126" ? "MFG" : "PUR") : undefined,
        items: formattedItems,
        shipmentNumber: shipmentNum || undefined,
        waybill: waybill || undefined,
        freightCode: freightCode || undefined,
        transactionDate: txDate ? txDate.toISOString() : undefined,
        description: headerDesc || undefined
      });

      if (res?.success) {
        NotificationExtension.Success("Thực hiện chuyển kho thành công!");
        navigate("/inventory/transaction/transfer");
      }
    } catch {
      NotificationExtension.Fails("Lỗi khi thực hiện giao dịch chuyển kho.");
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
            onClick={() => navigate("/inventory/transaction/transfer")}
          >
            Hủy bỏ
          </Button>
          <Button
            style={{ backgroundColor: "#1971c2" }}
            leftSection={<IconDeviceFloppy size={14} />}
            onClick={handleSave}
          >
            Hoàn tất chuyển kho
          </Button>
        </Group>
      </Flex>

      <Card withBorder shadow="sm" radius="md" p="lg" mb={16}>
        <Title order={4} mb="md" c="blue">Thông tin chung Phiếu chuyển kho</Title>
        <Grid mb="md">
          {/* Hàng 1 */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Select
              label="Hình thức chuyển"
              styles={{ label: { whiteSpace: "nowrap" } }}
              data={[
                { value: "SUBINVENTORY", label: "Chuyển kho nội bộ (Subinv Transfer)" },
                { value: "ORGANIZATION", label: "Chuyển kho liên đơn vị (Inter-Org)" }
              ]}
              value={transferType}
              onChange={(val) => setTransferType(val as any)}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Select
              label="Kho nguồn"
              styles={{ label: { whiteSpace: "nowrap" } }}
              placeholder="Chọn kho xuất"
              data={subinvsList.map((s) => ({
                value: s.secondaryInventoryName,
                label: `${s.secondaryInventoryName} - ${s.description}`
              }))}
              value={fromSubCode}
              onChange={(val) => handleFromSubChange(val || "")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Select
              label="Kho nhận"
              styles={{ label: { whiteSpace: "nowrap" } }}
              placeholder="Chọn kho nhập"
              data={subinvsList.map((s) => ({
                value: s.secondaryInventoryName,
                label: `${s.secondaryInventoryName} - ${s.description}`
              }))}
              value={toSubCode}
              onChange={(val) => handleToSubChange(val || "")}
            />
          </Grid.Col>

          {/* Hàng 2 */}
          <Grid.Col span={{ base: 12, md: 3 }}>
            <DateInput
              label="Ngày chuyển"
              styles={{ label: { whiteSpace: "nowrap" } }}
              placeholder="Chọn ngày chuyển"
              value={txDate}
              onChange={setTxDate}
              valueFormat="DD/MM/YYYY"
              withAsterisk
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <TextInput
              label="Người lập phiếu"
              styles={{ label: { whiteSpace: "nowrap" } }}
              value={preparedBy}
              disabled
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Diễn giải chung"
              styles={{ label: { whiteSpace: "nowrap" } }}
              placeholder="Nhập lý do chuyển kho..."
              value={headerDesc}
              onChange={(e) => setHeaderDesc(e.currentTarget.value)}
            />
          </Grid.Col>
        </Grid>

        {transferType === "ORGANIZATION" && (
          <Box style={{ borderTop: "1px solid #e9ecef", paddingTop: "15px", marginTop: "15px" }}>
            <Title order={5} mb="sm" c="blue">Thông tin vận chuyển & Tổ chức nhận</Title>
            <Grid>
              <Grid.Col span={{ base: 12, md: 3 }}>
                <Select
                  label="Tổ chức nhận"
                  styles={{ label: { whiteSpace: "nowrap" } }}
                  data={[
                    { value: "126", label: "Org Sản xuất (MFG - 126)" },
                    { value: "125", label: "Org Mua hàng (PUR - 125)" }
                  ]}
                  value={toOrgId}
                  onChange={setToOrgId}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 3 }}>
                <TextInput
                  label="Mã Shipment"
                  styles={{ label: { whiteSpace: "nowrap" } }}
                  placeholder="Ví dụ: SHIP-1002"
                  value={shipmentNum}
                  onChange={(e) => setShipmentNum(e.currentTarget.value)}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 3 }}>
                <TextInput
                  label="Vận đơn (Waybill)"
                  styles={{ label: { whiteSpace: "nowrap" } }}
                  placeholder="Ví dụ: WB-8902-3"
                  value={waybill}
                  onChange={(e) => setWaybill(e.currentTarget.value)}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 3 }}>
                <TextInput
                  label="Nhà vận chuyển"
                  styles={{ label: { whiteSpace: "nowrap" } }}
                  placeholder="Ví dụ: ViettelPost"
                  value={freightCode}
                  onChange={(e) => setFreightCode(e.currentTarget.value)}
                />
              </Grid.Col>
            </Grid>
          </Box>
        )}
      </Card>

      <Card withBorder shadow="sm" radius="md" p="lg">
        <Flex justify="space-between" align="center" mb="md">
          <Title order={4}>Chi tiết Vật tư Chuyển kho</Title>
          <Button
            size="xs"
            variant="outline"
            color="blue"
            leftSection={<IconPlus size={12} />}
            onClick={handleAddLine}
          >
            Thêm dòng vật tư
          </Button>
        </Flex>

        <Box style={{ overflowX: "auto" }}>
          <Table withTableBorder withColumnBorders highlightOnHover style={{ minWidth: "1050px", tableLayout: "fixed" }}>
            <Table.Thead style={{ backgroundColor: "#f8f9fa" }}>
              <Table.Tr>
                <Table.Th style={{ width: "240px" }}>Chọn vật tư</Table.Th>
                <Table.Th style={{ width: "160px" }}>Vị trí nguồn (Locator)</Table.Th>
                <Table.Th style={{ width: "160px" }}>Vị trí nhận (Locator)</Table.Th>
                <Table.Th style={{ width: "130px" }}>Số lô</Table.Th>
                <Table.Th style={{ width: "120px" }}>Tồn tại kho</Table.Th>
                <Table.Th style={{ width: "140px" }}>Số lượng chuyển</Table.Th>
                <Table.Th style={{ width: "60px" }}></Table.Th>
              </Table.Tr>
            </Table.Thead>
          <Table.Tbody>
            {lines.map((line, index) => {
              const selectedItem = itemsList.find((i) => i.inventoryItemId === line.inventoryItemId);
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
                  {/* Vị trí nguồn */}
                  <Table.Td>
                    <Select
                      placeholder="Chọn vị trí nguồn"
                      data={line.fromLocatorsList.map((l) => ({
                        value: l.inventoryLocatorId.toString(),
                        label: l.locatorCode
                      }))}
                      value={line.fromLocatorId ? line.fromLocatorId.toString() : null}
                      onChange={(val) => {
                        handleLineChange(index, "fromLocatorId", val ? Number(val) : undefined);
                        const code = line.fromLocatorsList.find((loc) => loc.inventoryLocatorId === Number(val))?.locatorCode;
                        handleLineChange(index, "fromLocatorCode", code);
                      }}
                      disabled={!fromSubCode || line.fromLocatorsList.length === 0}
                    />
                  </Table.Td>
                  {/* Vị trí nhận */}
                  <Table.Td>
                    <Select
                      placeholder="Chọn vị trí nhận"
                      data={line.toLocatorsList.map((l) => ({
                        value: l.inventoryLocatorId.toString(),
                        label: l.locatorCode
                      }))}
                      value={line.toLocatorId ? line.toLocatorId.toString() : null}
                      onChange={(val) => {
                        handleLineChange(index, "toLocatorId", val ? Number(val) : undefined);
                        const code = line.toLocatorsList.find((loc) => loc.inventoryLocatorId === Number(val))?.locatorCode;
                        handleLineChange(index, "toLocatorCode", code);
                      }}
                      disabled={!toSubCode || line.toLocatorsList.length === 0}
                    />
                  </Table.Td>
                  {/* Số lô */}
                  <Table.Td>
                    <TextInput
                      placeholder="Nhập lô"
                      value={line.lotNumber || ""}
                      onChange={(e) => handleLineChange(index, "lotNumber", e.currentTarget.value)}
                      disabled={!line.isLotControlled}
                    />
                  </Table.Td>
                  {/* Tồn kho */}
                  <Table.Td>
                    <Text size="sm" style={{ fontWeight: 600, fontFamily: "monospace" }}>
                      {line.onhandQty.toLocaleString()} {selectedItem?.primaryUomCode === "M3" ? "Tấm" : selectedItem?.primaryUomCode}
                    </Text>
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

export default TransferTransactionCreate;

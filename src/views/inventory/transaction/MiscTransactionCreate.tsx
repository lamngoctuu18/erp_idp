import { Box, Button, Card, Flex, Grid, Group, NumberInput, Select, TextInput, Text, Table, ActionIcon, Title, Alert } from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DateInput } from "@mantine/dates";
import { IconArrowLeft, IconDeviceFloppy, IconPlus, IconTrash, IconInfoCircle } from "@tabler/icons-react";
import BreadCrumb from "../../../_base/component/_layout/_breadcrumb";
import { getInventoryItemList, getSubinventories, getLocatorsBySubinventory, getAccountAliases, createMiscTransaction, getOnhandList } from "../../../api/inventory/api";
import { InventoryItemModel, SubinventoryModel, LocatorModel, AccountAliasModel, OnhandModel } from "../../../model/InventoryModel";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";

interface TxLine {
  inventoryItemId: number;
  subinventoryCode: string;
  locatorId?: number;
  locatorCode?: string;
  lotNumber?: string;
  quantity: number;
  cost: number;
  reason?: string;
  // UI helpers
  locatorsList: LocatorModel[];
  isLotControlled: boolean;
  onhandQty: number;
}

const MiscTransactionCreate = () => {
  const navigate = useNavigate();

  const [txType, setTxType] = useState<"RECEIPT" | "ISSUE">("RECEIPT");
  const [aliasId, setAliasId] = useState<string | null>(null);
  const [docNum, setDocNum] = useState("");
  const [receivedBy, setReceivedBy] = useState("");
  const [orgId, setOrgId] = useState<string | null>("125");
  const [txDate, setTxDate] = useState<Date | null>(new Date());
  const [preparedBy] = useState("Nguyễn Văn Hùng");
  const [headerDesc, setHeaderDesc] = useState("");
  
  const [itemsList, setItemsList] = useState<InventoryItemModel[]>([]);
  const [subinvsList, setSubinvsList] = useState<SubinventoryModel[]>([]);
  const [aliases, setAliases] = useState<AccountAliasModel[]>([]);
  const [onhandData, setOnhandData] = useState<OnhandModel[]>([]);

  const [lines, setLines] = useState<TxLine[]>([
    {
      inventoryItemId: 0,
      subinventoryCode: "",
      quantity: 1,
      cost: 0,
      locatorsList: [],
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

      const aliasRes = await getAccountAliases();
      if (aliasRes?.success) {
        setAliases(aliasRes.data || []);
        if (aliasRes.data && aliasRes.data.length > 0) {
          setAliasId(aliasRes.data[0].dispositionId.toString());
        }
      }

      const onhandRes = await getOnhandList();
      if (onhandRes?.success) setOnhandData(onhandRes.data || []);
    } catch (e) {
      console.error("Lỗi khi tải dữ liệu cấu hình", e);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleAddLine = () => {
    setLines((prev) => [
      ...prev,
      {
        inventoryItemId: 0,
        subinventoryCode: "",
        quantity: 1,
        cost: 0,
        locatorsList: [],
        isLotControlled: false,
        onhandQty: 0
      }
    ]);
  };

  const handleRemoveLine = (index: number) => {
    if (lines.length === 1) return;
    setLines((prev) => prev.filter((_, i) => i !== index));
  };

  const handleLineChange = async (index: number, key: keyof TxLine, val: any) => {
    const newLines = [...lines];
    newLines[index] = { ...newLines[index], [key]: val } as TxLine;

    // Logic: Khi đổi Item
    if (key === "inventoryItemId") {
      const itemId = Number(val);
      const selectedItem = itemsList.find((i) => i.inventoryItemId === itemId);
      
      newLines[index].isLotControlled = selectedItem?.itemNumber === "ITEM-KEO" || false; // Demo logic lô
      newLines[index].cost = selectedItem?.itemNumber === "ITEM-MDF" ? 1000000 : 150000;
      
      // Reset subinventory, locator, lot
      newLines[index].subinventoryCode = "";
      newLines[index].locatorId = undefined;
      newLines[index].locatorCode = undefined;
      newLines[index].lotNumber = "";
      newLines[index].onhandQty = 0;
      newLines[index].locatorsList = [];
    }

    // Logic: Khi đổi Subinventory
    if (key === "subinventoryCode") {
      const subCode = val as string;
      const sub = subinvsList.find((s) => s.secondaryInventoryName === subCode);
      
      if (sub && sub.locatorControlCode !== 1) {
        // Tải vị trí locator
        const locRes = await getLocatorsBySubinventory(subCode);
        if (locRes?.success) {
          newLines[index].locatorsList = locRes.data || [];
        }
      } else {
        newLines[index].locatorsList = [];
        newLines[index].locatorId = undefined;
        newLines[index].locatorCode = undefined;
      }
      
      // Update Onhand Qty
      const itemId = newLines[index].inventoryItemId;
      const matchedOnhand = onhandData.filter((o) => o.inventoryItemId === itemId && o.subinventoryCode === subCode);
      const totalOnhand = matchedOnhand.reduce((sum, current) => sum + current.transactionQuantity, 0);
      newLines[index].onhandQty = totalOnhand;
    }

    // Logic: Khi đổi Locator hoặc Lot
    if (key === "locatorId" || key === "lotNumber") {
      const itemId = newLines[index].inventoryItemId;
      const subCode = newLines[index].subinventoryCode;
      const locId = key === "locatorId" ? val : newLines[index].locatorId;
      const lot = key === "lotNumber" ? val : newLines[index].lotNumber;

      const matchedOnhand = onhandData.find(
        (o) =>
          o.inventoryItemId === itemId &&
          o.subinventoryCode === subCode &&
          (!locId || o.locatorId === Number(locId)) &&
          (!lot || o.lotNumber === lot)
      );
      newLines[index].onhandQty = matchedOnhand ? matchedOnhand.transactionQuantity : 0;
    }

    setLines(newLines);
  };

  const handleSave = async () => {
    // Validate
    if (!aliasId) {
      NotificationExtension.Fails("Vui lòng chọn tài khoản đối ứng (Account Alias)");
      return;
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line.inventoryItemId || !line.subinventoryCode) {
        NotificationExtension.Fails(`Dòng ${i + 1}: Vui lòng chọn Vật tư và Kho con.`);
        return;
      }
      if (line.locatorsList.length > 0 && !line.locatorId) {
        NotificationExtension.Fails(`Dòng ${i + 1}: Kho yêu cầu chọn Vị trí (Locator).`);
        return;
      }
      if (line.isLotControlled && !line.lotNumber) {
        NotificationExtension.Fails(`Dòng ${i + 1}: Vật tư yêu cầu nhập Số lô (Lot Number).`);
        return;
      }
      if (line.quantity <= 0) {
        NotificationExtension.Fails(`Dòng ${i + 1}: Số lượng giao dịch phải lớn hơn 0.`);
        return;
      }

      // Check xuất âm kho (nếu là ISSUE)
      if (txType === "ISSUE") {
        if (line.quantity > line.onhandQty) {
          // Hiện cảnh báo nhưng Org Mua hàng (PUR) cho phép âm kho theoNegative_Inv_Receipt_Code = 1
          // Ta sẽ hiện thông báo thành công kèm cảnh báo âm kho
          NotificationExtension.Warn(`Dòng ${i + 1}: Số lượng xuất vượt quá tồn kho thực tế. Hệ thống sẽ ghi nhận xuất âm kho.`);
        }
      }
    }

    try {
      const formattedItems = lines.map((l) => {
        const selectedLoc = l.locatorsList.find((loc) => loc.inventoryLocatorId === Number(l.locatorId));
        return {
          inventoryItemId: l.inventoryItemId,
          subinventoryCode: l.subinventoryCode,
          locatorId: l.locatorId ? Number(l.locatorId) : undefined,
          locatorCode: selectedLoc?.locatorCode,
          lotNumber: l.lotNumber,
          quantity: l.quantity,
          cost: l.cost,
          reason: l.reason || ""
        };
      });

      const res = await createMiscTransaction({
        transactionType: txType,
        aliasId: Number(aliasId),
        items: formattedItems,
        documentNumber: docNum || `MISC-${Date.now().toString().slice(-6)}`,
        receivedBy: receivedBy || undefined,
        orgId: Number(orgId),
        transactionDate: txDate ? txDate.toISOString() : undefined,
        description: headerDesc || undefined
      });

      if (res?.success) {
        NotificationExtension.Success("Thực hiện giao dịch Nhập/Xuất Misc thành công!");
        navigate("/inventory/transaction/misc");
      }
    } catch {
      NotificationExtension.Fails("Lỗi khi thực hiện giao dịch.");
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
            onClick={() => navigate("/inventory/transaction/misc")}
          >
            Hủy bỏ
          </Button>
          <Button
            style={{ backgroundColor: "#1971c2" }}
            leftSection={<IconDeviceFloppy size={14} />}
            onClick={handleSave}
          >
            Hoàn tất giao dịch
          </Button>
        </Group>
      </Flex>

      <Card withBorder shadow="sm" radius="md" p="lg" mb={16}>
        <Title order={4} mb="md" c="blue">Thông tin chung Phiếu</Title>
        <Grid mb="md">
          {/* Hàng 1 */}
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Select
              label="Đơn vị"
              styles={{ label: { whiteSpace: "nowrap" } }}
              data={[
                { value: "125", label: "Org Mua hàng (PUR - 125)" },
                { value: "126", label: "Org Sản xuất (MFG - 126)" }
              ]}
              value={orgId}
              onChange={setOrgId}
              withAsterisk
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Select
              label="Loại giao dịch"
              styles={{ label: { whiteSpace: "nowrap" } }}
              data={[
                { value: "RECEIPT", label: "Nhập kho trực tiếp (Misc Receipt)" },
                { value: "ISSUE", label: "Xuất kho trực tiếp (Misc Issue)" }
              ]}
              value={txType}
              onChange={(val) => setTxType(val as any)}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Select
              label="Tài khoản đối ứng"
              styles={{ label: { whiteSpace: "nowrap" } }}
              placeholder="Chọn Account Alias"
              data={aliases.map((a) => ({
                value: a.dispositionId.toString(),
                label: a.description
              }))}
              value={aliasId}
              onChange={setAliasId}
              withAsterisk
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <TextInput
              label="Số chứng từ"
              styles={{ label: { whiteSpace: "nowrap" } }}
              placeholder="Ví dụ: MISC-2026-001 (Tự sinh)"
              value={docNum}
              onChange={(e) => setDocNum(e.currentTarget.value)}
            />
          </Grid.Col>

          {/* Hàng 2 */}
          <Grid.Col span={{ base: 12, md: 3 }}>
            <DateInput
              label="Ngày giao dịch"
              styles={{ label: { whiteSpace: "nowrap" } }}
              placeholder="Chọn ngày giao dịch"
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
          <Grid.Col span={{ base: 12, md: 3 }}>
            <TextInput
              label="Người giao/nhận"
              styles={{ label: { whiteSpace: "nowrap" } }}
              placeholder="Ví dụ: Nguyễn Văn A"
              value={receivedBy}
              onChange={(e) => setReceivedBy(e.currentTarget.value)}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <TextInput
              label="Diễn giải chung"
              styles={{ label: { whiteSpace: "nowrap" } }}
              placeholder="Nhập lý do xuất/nhập chung..."
              value={headerDesc}
              onChange={(e) => setHeaderDesc(e.currentTarget.value)}
            />
          </Grid.Col>
        </Grid>
      </Card>

      <Card withBorder shadow="sm" radius="md" p="lg">
        <Flex justify="space-between" align="center" mb="md">
          <Title order={4}>Chi tiết Vật tư Giao dịch</Title>
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
          <Table withTableBorder withColumnBorders highlightOnHover style={{ minWidth: "1250px", tableLayout: "fixed" }}>
            <Table.Thead style={{ backgroundColor: "#f8f9fa" }}>
              <Table.Tr>
                <Table.Th style={{ width: "240px" }}>Chọn vật tư</Table.Th>
                <Table.Th style={{ width: "135px" }}>Kho con</Table.Th>
                <Table.Th style={{ width: "155px" }}>Vị trí (Locator)</Table.Th>
                <Table.Th style={{ width: "120px" }}>Số lô</Table.Th>
                <Table.Th style={{ width: "110px" }}>Tồn kho</Table.Th>
                <Table.Th style={{ width: "100px" }}>Số lượng</Table.Th>
                <Table.Th style={{ width: "150px" }}>Đơn giá GD</Table.Th>
                <Table.Th style={{ width: "220px" }}>Lý do</Table.Th>
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
                  {/* Kho con */}
                  <Table.Td>
                    <Select
                      placeholder="Chọn kho"
                      data={subinvsList.map((s) => ({
                        value: s.secondaryInventoryName,
                        label: s.secondaryInventoryName
                      }))}
                      value={line.subinventoryCode}
                      onChange={(val) => handleLineChange(index, "subinventoryCode", val)}
                      disabled={!line.inventoryItemId}
                    />
                  </Table.Td>
                  {/* Vị trí */}
                  <Table.Td>
                    <Select
                      placeholder="Chọn vị trí"
                      data={line.locatorsList.map((l) => ({
                        value: l.inventoryLocatorId.toString(),
                        label: l.locatorCode
                      }))}
                      value={line.locatorId ? line.locatorId.toString() : null}
                      onChange={(val) => {
                        handleLineChange(index, "locatorId", val ? Number(val) : undefined);
                        const code = line.locatorsList.find((loc) => loc.inventoryLocatorId === Number(val))?.locatorCode;
                        handleLineChange(index, "locatorCode", code);
                      }}
                      disabled={!line.subinventoryCode || line.locatorsList.length === 0}
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
                  {/* Đơn giá */}
                  <Table.Td>
                    <NumberInput
                      min={0}
                      thousandSeparator=","
                      suffix=" đ"
                      value={line.cost}
                      onChange={(val) => handleLineChange(index, "cost", Number(val) || 0)}
                      disabled={!line.inventoryItemId}
                    />
                  </Table.Td>
                  {/* Lý do */}
                  <Table.Td>
                    <TextInput
                      placeholder="Ghi chú chi tiết"
                      value={line.reason || ""}
                      onChange={(e) => handleLineChange(index, "reason", e.currentTarget.value)}
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

export default MiscTransactionCreate;

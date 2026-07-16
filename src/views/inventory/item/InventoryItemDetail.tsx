import { Box, Button, Card, Flex, Grid, Group, Table, Tabs, Text, Badge, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IconArrowLeft, IconBox, IconScale, IconCoins, IconSettings } from "@tabler/icons-react";
import BreadCrumb from "../../../_base/component/_layout/_breadcrumb";
import { getInventoryItemDetail } from "../../../api/inventory/api";
import { InventoryItemModel } from "../../../model/InventoryModel";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";

const InventoryItemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<InventoryItemModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      try {
        const res = await getInventoryItemDetail(Number(id));
        if (res?.success && res.data) {
          setItem(res.data);
        } else {
          NotificationExtension.Fails("Không thể tìm thấy vật tư.");
        }
      } catch {
        NotificationExtension.Fails("Đã xảy ra lỗi khi tải chi tiết.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (isLoading) {
    return <Box p="xl"><Text>Đang tải chi tiết vật tư...</Text></Box>;
  }

  if (!item) {
    return (
      <Box p="xl">
        <Text c="red" mb="md">Không tìm thấy thông tin vật tư!</Text>
        <Button onClick={() => navigate("/inventory/item/list")}>Quay lại</Button>
      </Box>
    );
  }

  return (
    <Box>
      <Flex
        justify="space-between"
        align="center"
        style={{ border: "1px solid #dee2e6", padding: "5px 10px", backgroundColor: "#f8f9fa", borderRadius: "4px" }}
        mb={16}
      >
        <BreadCrumb />
        <Button
          variant="outline"
          color="gray"
          leftSection={<IconArrowLeft size={14} />}
          onClick={() => navigate("/inventory/item/list")}
        >
          Quay lại danh sách
        </Button>
      </Flex>

      <Card withBorder shadow="sm" radius="md" p="lg" mb={16}>
        <Flex justify="space-between" align="center" mb={15}>
          <Box>
            <Text size="xs" c="dimmed">Mã vật tư: {item.itemNumber}</Text>
            <Text size="xl" style={{ fontWeight: 700 }}>{item.description}</Text>
          </Box>
          <Badge color={item.enabledFlag === "Y" ? "green" : "red"}>
            {item.enabledFlag === "Y" ? "Đang hoạt động" : "Ngừng hoạt động"}
          </Badge>
        </Flex>

        <Tabs defaultValue="info">
          <Tabs.List>
            <Tabs.Tab value="info" leftSection={<IconBox size={14} />}>Thông tin chung</Tabs.Tab>
            <Tabs.Tab value="uom" leftSection={<IconScale size={14} />}>Quy đổi đơn vị (UOM)</Tabs.Tab>
            <Tabs.Tab value="cost" leftSection={<IconCoins size={14} />}>Chi tiết giá gốc (Costing)</Tabs.Tab>
            <Tabs.Tab value="controls" leftSection={<IconSettings size={14} />}>Thiết lập & Kiểm soát</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="info" pt="lg">
            <Grid>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Text style={{ fontWeight: 600 }}>Tổ chức sở hữu:</Text>
                <Text c="dimmed">{item.organizationCode} (ID: {item.organizationId})</Text>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Text style={{ fontWeight: 600 }}>Nhóm phân loại (Category):</Text>
                <Text c="dimmed">{item.categoryName || "Gỗ Công Nghiệp"}</Text>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Text style={{ fontWeight: 600 }}>Đơn vị tính lưu kho chính:</Text>
                <Text c="dimmed">{item.primaryUnitOfMeasure} ({item.primaryUomCode})</Text>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Text style={{ fontWeight: 600 }}>Ngày khai báo:</Text>
                <Text c="dimmed">{new Date(item.createdDate || "").toLocaleDateString("vi-VN")}</Text>
              </Grid.Col>
              <Grid.Col span={12}>
                <Text style={{ fontWeight: 600 }}>Mô tả kỹ thuật:</Text>
                <Text c="dimmed">{item.longDescription || "Không có mô tả chi tiết."}</Text>
              </Grid.Col>
              
              {item.unitLength && (
                <Grid.Col span={12}>
                  <Card withBorder style={{ backgroundColor: "#f8f9fa" }}>
                    <Text style={{ fontWeight: 600 }} size="sm" mb={10}>Kích thước chuẩn vật tư:</Text>
                    <Grid>
                      <Grid.Col span={4}>
                        <Text size="xs" c="dimmed">Chiều dài (Length)</Text>
                        <Text style={{ fontWeight: 600 }}>{item.unitLength} m</Text>
                      </Grid.Col>
                      <Grid.Col span={4}>
                        <Text size="xs" c="dimmed">Chiều rộng (Width)</Text>
                        <Text style={{ fontWeight: 600 }}>{item.unitWidth} m</Text>
                      </Grid.Col>
                      <Grid.Col span={4}>
                        <Text size="xs" c="dimmed">Chiều cao (Height)</Text>
                        <Text style={{ fontWeight: 600 }}>{item.unitHeight} m</Text>
                      </Grid.Col>
                    </Grid>
                  </Card>
                </Grid.Col>
              )}
            </Grid>
          </Tabs.Panel>

          <Tabs.Panel value="uom" pt="lg">
            <Text mb="md" size="sm" c="dimmed">
              Định nghĩa quy đổi giữa các đơn vị tính khác nhau của vật tư này (Lưu tại `MTL_UOM_CONVERSIONS` và `MTL_UOM_CLASS_CONVERSIONS`).
            </Text>
            
            <Table withTableBorder withColumnBorders highlightOnHover>
              <Table.Thead style={{ backgroundColor: "#f1f3f5" }}>
                <Table.Tr>
                  <Table.Th>Đơn vị nguồn (From UOM)</Table.Th>
                  <Table.Th>Đơn vị đích (To UOM)</Table.Th>
                  <Table.Th>Tỷ lệ quy đổi (Rate)</Table.Th>
                  <Table.Th>Diễn giải nghiệp vụ</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {item.primaryUomCode === "M3" ? (
                  <Table.Tr>
                    <Table.Td style={{ fontWeight: 600 }}>M3 (Mét khối)</Table.Td>
                    <Table.Td style={{ fontWeight: 600 }}>Tam (Tấm)</Table.Td>
                    <Table.Td>10.0</Table.Td>
                    <Table.Td>Quy đổi trong Class Volume: 1 $M^3$ gỗ MDF chứa 10 tấm ván chuẩn (dày 18mm).</Table.Td>
                  </Table.Tr>
                ) : (
                  <Table.Tr>
                    <Table.Td style={{ fontWeight: 600 }}>{item.primaryUomCode}</Table.Td>
                    <Table.Td style={{ fontWeight: 600 }}>{item.primaryUomCode}</Table.Td>
                    <Table.Td>1.0</Table.Td>
                    <Table.Td>Quy đổi đơn vị tính cơ bản (Base UOM).</Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </Tabs.Panel>

          <Tabs.Panel value="cost" pt="lg">
            <Text mb="md" size="sm" c="dimmed">
              Thông tin cấu thành giá gốc tiêu chuẩn của vật tư dùng trong engine tính giá (Lưu tại `CST_ITEM_COSTS` và `CST_ITEM_COST_DETAILS`).
            </Text>

            <Grid>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card withBorder shadow="xs" p="md">
                  <Text size="xs" c="dimmed">Giá Nguyên Vật Liệu (Material Cost)</Text>
                  <Text style={{ fontWeight: 700, fontSize: "20px" }} c="blue">
                    {item.primaryUomCode === "M3" ? "1,000,000" : "150,000"} VND
                  </Text>
                  <Text size="xs" c="dimmed" mt={5}>Tính trên mỗi đơn vị {item.primaryUomCode}</Text>
                </Card>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card withBorder shadow="xs" p="md">
                  <Text size="xs" c="dimmed">Giá Nguồn Lực (Resource Cost)</Text>
                  <Text style={{ fontWeight: 700, fontSize: "20px" }} c="teal">0 VND</Text>
                  <Text size="xs" c="dimmed" mt={5}>Chi phí nhân công, máy móc sản xuất</Text>
                </Card>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card withBorder shadow="xs" p="md">
                  <Text size="xs" c="dimmed">Tổng giá trị vật tư (Item Cost)</Text>
                  <Text style={{ fontWeight: 700, fontSize: "20px" }} c="orange">
                    {item.primaryUomCode === "M3" ? "1,000,000" : "150,000"} VND
                  </Text>
                  <Text size="xs" c="dimmed" mt={5}>Tổng hợp chi phí cấu thành giá gốc</Text>
                </Card>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>

          <Tabs.Panel value="controls" pt="lg">
            <Grid>
              {/* Phân hệ Tồn kho */}
              <Grid.Col span={12}>
                <Title order={5} mb="sm" c="blue">Thiết lập lưu trữ & kiểm soát kho</Title>
                <Grid>
                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <Text style={{ fontWeight: 600 }}>Loại vật tư (Item Type):</Text>
                    <Text c="dimmed">
                      {item.itemType === "RAW_MATERIAL" ? "Nguyên vật liệu (Raw Material)" : 
                       item.itemType === "FINISHED_GOOD" ? "Thành phẩm (Finished Good)" : 
                       item.itemType === "SEMI_FINISHED" ? "Bán thành phẩm (Semi-Finished)" : "Chi phí (Expense)"}
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <Text style={{ fontWeight: 600 }}>Quản lý đơn vị phụ (Secondary UOM):</Text>
                    <Text c="dimmed">{item.secondaryUomCode ? `Có quy đổi (${item.secondaryUomCode})` : "Không có đơn vị phụ"}</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <Text style={{ fontWeight: 600 }}>Kiểm soát vị trí (Locator Control):</Text>
                    <Text c="dimmed">
                      {item.locatorControlCode === 2 ? "Vị trí định sẵn (Predefined)" : 
                       item.locatorControlCode === 3 ? "Vị trí động (Dynamic)" : "Không kiểm soát vị trí (None)"}
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }} mt="sm">
                    <Text style={{ fontWeight: 600 }}>Kiểm soát theo Lô (Lot Control):</Text>
                    <Badge color={item.lotControlCode === 2 ? "orange" : "gray"} variant="light">
                      {item.lotControlCode === 2 ? "Quản lý theo Lô (Yes)" : "Không quản lý lô (No)"}
                    </Badge>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }} mt="sm">
                    <Text style={{ fontWeight: 600 }}>Kiểm soát số Serial (Serial Control):</Text>
                    <Badge color={item.serialControlCode === 2 ? "indigo" : "gray"} variant="light">
                      {item.serialControlCode === 2 ? "Có số Serial riêng lẻ (Yes)" : "Không quản lý Serial (No)"}
                    </Badge>
                  </Grid.Col>
                </Grid>
              </Grid.Col>

              {/* Phân hệ Giao dịch Mua/Bán */}
              <Grid.Col span={12} style={{ borderTop: "1px solid #e9ecef", paddingTop: "15px", marginTop: "10px" }}>
                <Title order={5} mb="sm" c="blue">Chính sách mua hàng & bán hàng</Title>
                <Grid>
                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <Text style={{ fontWeight: 600 }}>Cho phép Mua ngoài (Purchasable):</Text>
                    <Text c={item.purchasableFlag === "Y" ? "green" : "red"} style={{ fontWeight: 600 }}>
                      {item.purchasableFlag === "Y" ? "CÓ" : "KHÔNG"}
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <Text style={{ fontWeight: 600 }}>Cho phép Bán hàng (Orderable):</Text>
                    <Text c={item.customerOrderEnabledFlag === "Y" ? "green" : "red"} style={{ fontWeight: 600 }}>
                      {item.customerOrderEnabledFlag === "Y" ? "CÓ" : "KHÔNG"}
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <Text style={{ fontWeight: 600 }}>Quy trình nhận hàng (Receipt Routing):</Text>
                    <Text c="dimmed">
                      {item.receiptRoutingId === 1 ? "Nhập kho trực tiếp (Direct Deliver)" : 
                       item.receiptRoutingId === 2 ? "Nhận tiêu chuẩn qua bãi nhận (Standard)" : "Cần kiểm định chất lượng (Inspection Required)"}
                    </Text>
                  </Grid.Col>
                </Grid>
              </Grid.Col>

              {/* Phân hệ Giá thành & Kế toán */}
              <Grid.Col span={12} style={{ borderTop: "1px solid #e9ecef", paddingTop: "15px", marginTop: "10px" }}>
                <Title order={5} mb="sm" c="blue">Tài chính & Tài khoản mặc định</Title>
                <Grid>
                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <Text style={{ fontWeight: 600 }}>Tính giá thành tự động:</Text>
                    <Text c={item.costingEnabledFlag === "Y" ? "green" : "red"} style={{ fontWeight: 600 }}>
                      {item.costingEnabledFlag === "Y" ? "CÓ" : "KHÔNG"}
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 8 }}>
                    <Text style={{ fontWeight: 600 }}>Phương pháp tính giá:</Text>
                    <Text c="dimmed" style={{ fontFamily: "monospace" }}>
                      {item.costingMethod === "STANDARD" ? "Giá tiêu chuẩn (Standard Costing)" : 
                       item.costingMethod === "FIFO" ? "Nhập trước xuất trước (FIFO)" : "Bình quân di động (Average Costing)"}
                    </Text>
                  </Grid.Col>
                  
                  {/* Tài khoản kế toán */}
                  <Grid.Col span={{ base: 12, md: 4 }} mt="sm">
                    <Card withBorder style={{ backgroundColor: "#f8fafc" }} p="xs">
                      <Text size="xs" c="dimmed">Tài khoản kho (Valuation)</Text>
                      <Text style={{ fontFamily: "monospace", fontWeight: 700 }}>{item.valuationAccount || "152000"}</Text>
                    </Card>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 4 }} mt="sm">
                    <Card withBorder style={{ backgroundColor: "#f8fafc" }} p="xs">
                      <Text size="xs" c="dimmed">Tài khoản giá vốn (COGS)</Text>
                      <Text style={{ fontFamily: "monospace", fontWeight: 700 }}>{item.cogsAccount || "632000"}</Text>
                    </Card>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 4 }} mt="sm">
                    <Card withBorder style={{ backgroundColor: "#f8fafc" }} p="xs">
                      <Text size="xs" c="dimmed">Tài khoản doanh thu (Revenue)</Text>
                      <Text style={{ fontFamily: "monospace", fontWeight: 700 }}>{item.salesAccount || "511100"}</Text>
                    </Card>
                  </Grid.Col>
                </Grid>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>
        </Tabs>
      </Card>
    </Box>
  );
};

export default InventoryItemDetail;

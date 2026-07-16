import { Box, Button, Card, Flex, Grid, Group, Table, Text, Badge, TextInput, Select, NumberInput, Modal, Alert, Tabs, SimpleGrid, ThemeIcon, Tooltip, RingProgress } from "@mantine/core";
import { useEffect, useState } from "react";
import { IconPlus, IconAlertCircle, IconBuildingWarehouse, IconMapPin, IconSettings, IconDatabase, IconActivity, IconSearch, IconGridPattern, IconListDetails, IconPhone, IconUser } from "@tabler/icons-react";
import BreadCrumb from "../../../_base/component/_layout/_breadcrumb";
import { getSubinventories, getLocatorsBySubinventory, createSubinventory, createLocator } from "../../../api/inventory/api";
import { SubinventoryModel, LocatorModel } from "../../../model/InventoryModel";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";

const SubinventorySetup = () => {
  const [subinvs, setSubinvs] = useState<SubinventoryModel[]>([]);
  const [selectedSub, setSelectedSub] = useState<SubinventoryModel | null>(null);
  const [locators, setLocators] = useState<LocatorModel[]>([]);
  const [locatorSearch, setLocatorSearch] = useState("");
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [isLocModalOpen, setIsLocModalOpen] = useState(false);

  // Form states subinventory
  const [subName, setSubName] = useState("");
  const [subDesc, setSubDesc] = useState("");
  const [subControl, setSubControl] = useState("2"); // Pre-defined
  const [subAsset, setSubAsset] = useState("1"); // Asset
  const [subTracked, setSubTracked] = useState("1"); // Yes
  const [subAddress, setSubAddress] = useState("");
  const [subContact, setSubContact] = useState("");
  const [subPhone, setSubPhone] = useState("");
  const [subCapacity, setSubCapacity] = useState<number | string>(500);

  // Form states locator
  const [locCode, setLocCode] = useState("");
  const [locDesc, setLocDesc] = useState("");

  const fetchSubinvs = async () => {
    try {
      const res = await getSubinventories();
      if (res?.success && res.data) {
        setSubinvs(res.data);
        if (res.data.length > 0 && !selectedSub) {
          setSelectedSub(res.data[0]);
        }
      }
    } catch {
      NotificationExtension.Fails("Lỗi khi tải danh sách kho.");
    }
  };

  const fetchLocators = async (subCode: string) => {
    try {
      const res = await getLocatorsBySubinventory(subCode);
      if (res?.success && res.data) {
        setLocators(res.data);
      }
    } catch {
      NotificationExtension.Fails("Lỗi khi tải vị trí kho.");
    }
  };

  useEffect(() => {
    fetchSubinvs();
  }, []);

  useEffect(() => {
    if (selectedSub) {
      fetchLocators(selectedSub.secondaryInventoryName);
      setLocatorSearch("");
    } else {
      setLocators([]);
    }
  }, [selectedSub]);

  const handleAddSubinventory = async () => {
    if (!subName || !subDesc) {
      NotificationExtension.Fails("Vui lòng điền mã và tên kho!");
      return;
    }
    try {
      const res = await createSubinventory({
        secondaryInventoryName: subName,
        description: subDesc,
        locatorControlCode: Number(subControl),
        assetInventory: Number(subAsset),
        trackedQuantity: Number(subTracked),
        organizationId: 125,
        address: subAddress,
        contactPerson: subContact,
        phone: subPhone,
        capacityVolume: Number(subCapacity) || undefined
      });
      if (res?.success) {
        NotificationExtension.Success("Thêm kho con thành công!");
        setIsSubModalOpen(false);
        setSubName("");
        setSubDesc("");
        setSubAddress("");
        setSubContact("");
        setSubPhone("");
        setSubCapacity(500);
        fetchSubinvs();
      }
    } catch {
      NotificationExtension.Fails("Lỗi khi thêm kho con.");
    }
  };

  const handleAddLocator = async () => {
    if (!selectedSub) return;
    if (!locCode || !locDesc) {
      NotificationExtension.Fails("Vui lòng nhập mã và mô tả vị trí!");
      return;
    }
    try {
      const res = await createLocator({
        subinventoryCode: selectedSub.secondaryInventoryName,
        locatorCode: locCode,
        description: locDesc
      });
      if (res?.success) {
        NotificationExtension.Success("Thêm vị trí mới thành công!");
        setIsLocModalOpen(false);
        setLocCode("");
        setLocDesc("");
        fetchLocators(selectedSub.secondaryInventoryName);
      }
    } catch {
      NotificationExtension.Fails("Lỗi khi thêm vị trí kho.");
    }
  };

  // Lọc Locator theo từ khóa tìm kiếm
  const filteredLocators = locators.filter(l => 
    l.locatorCode.toLowerCase().includes(locatorSearch.toLowerCase()) ||
    l.description.toLowerCase().includes(locatorSearch.toLowerCase())
  );

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
          style={{ backgroundColor: "#1971c2" }}
          leftSection={<IconPlus size={14} />}
          onClick={() => setIsSubModalOpen(true)}
        >
          Khai báo Kho con mới
        </Button>
      </Flex>

      <Grid gutter="md">
        {/* Cột trái: Danh sách Kho con dạng Cards */}
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Card withBorder shadow="sm" radius="md" p="md" style={{ height: "100%", minHeight: "650px" }}>
            <Text style={{ fontWeight: 800 }} mb="md" size="lg" c="blue">
              Hệ thống Kho con ({subinvs.length})
            </Text>
            
            <SimpleGrid cols={1} spacing="sm">
              {subinvs.map((s) => {
                const isActive = selectedSub?.secondaryInventoryName === s.secondaryInventoryName;
                return (
                  <Card
                    key={s.secondaryInventoryName}
                    withBorder
                    shadow={isActive ? "md" : "xs"}
                    p="sm"
                    style={{
                      cursor: "pointer",
                      borderColor: isActive ? "#1971c2" : undefined,
                      borderWidth: isActive ? "2px" : "1px",
                      backgroundColor: isActive ? "#e7f5ff" : "#fff",
                      transition: "transform 150ms ease, box-shadow 150ms ease",
                    }}
                    onClick={() => setSelectedSub(s)}
                  >
                    <Flex justify="space-between" align="start">
                      <Group gap="sm">
                        <ThemeIcon color={isActive ? "blue" : "gray"} variant="light" size="xl">
                          <IconBuildingWarehouse size={22} />
                        </ThemeIcon>
                        <Box>
                          <Text style={{ fontWeight: 800 }} size="md" c={isActive ? "blue" : "dark"}>
                            {s.secondaryInventoryName}
                          </Text>
                          <Text size="sm" c="dimmed" style={{ fontWeight: 500 }}>
                            {s.description}
                          </Text>
                        </Box>
                      </Group>
                      <Badge color="blue" variant="light">
                        {s.assetInventory === 1 ? "TÀI SẢN" : "CHI PHÍ"}
                      </Badge>
                    </Flex>

                    <Flex justify="space-between" align="center" mt="md" style={{ borderTop: "1px solid #f1f3f5", paddingTop: "8px" }}>
                      <Text size="xs" c="dimmed">
                        {s.locatorControlCode === 1 ? "Không kiểm soát vị trí" : "Có sơ đồ vị trí"}
                      </Text>
                      {s.locatorControlCode !== 1 && (
                        <Badge size="xs" color="blue" variant="light">
                          Định sẵn (Pre-defined)
                        </Badge>
                      )}
                    </Flex>
                  </Card>
                );
              })}
            </SimpleGrid>
          </Card>
        </Grid.Col>

        {/* Cột phải: Bảng điều khiển chi tiết (Tabs) */}
        <Grid.Col span={{ base: 12, md: 7 }}>
          <Card withBorder shadow="sm" radius="md" p="md" style={{ height: "100%", minHeight: "650px" }}>
            {selectedSub ? (
              <Box>
                {/* Header chi tiết kho */}
                <Flex justify="space-between" align="center" mb="lg" style={{ borderBottom: "1px solid #e9ecef", paddingBottom: "12px" }}>
                  <Box>
                    <Text size="xs" c="dimmed" style={{ fontWeight: 600 }}>Chi tiết phân hệ kho</Text>
                    <Text style={{ fontWeight: 800 }} size="xl" c="blue">
                      Kho: {selectedSub.secondaryInventoryName} - {selectedSub.description}
                    </Text>
                  </Box>
                  {selectedSub.locatorControlCode !== 1 && (
                    <Button
                      size="sm"
                      variant="outline"
                      color="blue"
                      leftSection={<IconPlus size={14} />}
                      onClick={() => setIsLocModalOpen(true)}
                    >
                      Khai báo Vị trí (Locator)
                    </Button>
                  )}
                </Flex>

                <Tabs defaultValue="visual">
                  <Tabs.List mb="md">
                    <Tabs.Tab value="visual" leftSection={<IconGridPattern size={16} />}>Sơ đồ Vị trí trực quan</Tabs.Tab>
                    <Tabs.Tab value="list" leftSection={<IconListDetails size={16} />}>Danh sách Bảng ({locators.length})</Tabs.Tab>
                    <Tabs.Tab value="config" leftSection={<IconSettings size={16} />}>Thống kê & Cấu hình</Tabs.Tab>
                  </Tabs.List>

                  {/* Tab 1: Sơ đồ vị trí trực quan */}
                  <Tabs.Panel value="visual">
                    {selectedSub.locatorControlCode === 1 ? (
                      <Alert icon={<IconAlertCircle size={16} />} title="Thông báo định tuyến vị trí" color="yellow" radius="md">
                        Kho con `{selectedSub.secondaryInventoryName}` được cấu hình **Không kiểm soát vị trí**. Tất cả các giao dịch nhập xuất sẽ được ghi nhận trực tiếp vào kho mà không cần chia kệ.
                      </Alert>
                    ) : (
                      <Box>
                        <Text size="sm" c="dimmed" mb="md" style={{ fontStyle: "italic" }}>
                          Sơ đồ các vùng kệ/ô tủ chứa hàng của kho `{selectedSub.secondaryInventoryName}`. Di chuột qua ô để xem chi tiết.
                        </Text>
                        {locators.length > 0 ? (
                          <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="md">
                            {locators.map((l) => (
                              <Tooltip key={l.inventoryLocatorId} label={l.description} position="top" withArrow>
                                <Card
                                  withBorder
                                  shadow="xs"
                                  p="sm"
                                  radius="md"
                                  style={{
                                    borderLeft: "3px solid #1971c2",
                                    transition: "transform 150ms ease",
                                    cursor: "pointer"
                                  }}
                                  className="locator-card"
                                >
                                  <Group justify="space-between" mb="xs">
                                    <ThemeIcon variant="light" color="blue" size="sm">
                                      <IconMapPin size={12} />
                                    </ThemeIcon>
                                    <Badge size="xs" color="blue" variant="light">Đang trống</Badge>
                                  </Group>
                                  <Text style={{ fontWeight: 700 }} size="sm" c="blue">{l.locatorCode}</Text>
                                  <Text size="xs" c="dimmed" truncate>{l.description}</Text>
                                </Card>
                              </Tooltip>
                            ))}
                          </SimpleGrid>
                        ) : (
                          <Box py="xl" style={{ textAlign: "center" }}>
                            <Text c="dimmed" size="sm">Kho chưa được thiết lập bất kỳ vị trí (Locator) nào.</Text>
                            <Button size="xs" variant="outline" color="blue" mt="sm" onClick={() => setIsLocModalOpen(true)}>Thêm vị trí đầu tiên</Button>
                          </Box>
                        )}
                      </Box>
                    )}
                  </Tabs.Panel>

                  {/* Tab 2: Danh sách dạng Bảng (Có tìm kiếm) */}
                  <Tabs.Panel value="list">
                    {selectedSub.locatorControlCode === 1 ? (
                      <Alert icon={<IconAlertCircle size={16} />} title="Không áp dụng vị trí" color="yellow">
                        Kho con này không kiểm soát vị trí.
                      </Alert>
                    ) : (
                      <Box>
                        <TextInput
                          placeholder="Tìm kiếm vị trí (Mã hoặc vùng kệ)..."
                          leftSection={<IconSearch size={16} />}
                          value={locatorSearch}
                          onChange={(e) => setLocatorSearch(e.currentTarget.value)}
                          mb="md"
                        />
                        <Table withTableBorder highlightOnHover>
                          <Table.Thead style={{ backgroundColor: "#f8f9fa" }}>
                            <Table.Tr>
                              <Table.Th>Mã vị trí (Locator Code)</Table.Th>
                              <Table.Th>Diễn giải/Vùng kho</Table.Th>
                              <Table.Th style={{ width: "100px" }}>Trạng thái</Table.Th>
                            </Table.Tr>
                          </Table.Thead>
                          <Table.Tbody>
                            {filteredLocators.length > 0 ? (
                              filteredLocators.map((l) => (
                                <Table.Tr key={l.inventoryLocatorId}>
                                  <Table.Td style={{ fontWeight: 600, color: "#1971c2" }}>{l.locatorCode}</Table.Td>
                                  <Table.Td>{l.description}</Table.Td>
                                  <Table.Td><Badge color="blue" variant="light">Đang trống</Badge></Table.Td>
                                </Table.Tr>
                              ))
                            ) : (
                              <Table.Tr>
                                <Table.Td colSpan={3} align="center">
                                  <Text c="dimmed" size="xs">Không tìm thấy vị trí nào khớp với từ khóa.</Text>
                                </Table.Td>
                              </Table.Tr>
                            )}
                          </Table.Tbody>
                        </Table>
                      </Box>
                    )}
                  </Tabs.Panel>

                  {/* Tab 3: Cấu hình nâng cao & Thống kê */}
                  <Tabs.Panel value="config">
                    <Grid>
                      <Grid.Col span={6}>
                        <Card withBorder p="md" radius="md">
                          <Group justify="space-between">
                            <Box>
                              <Text size="xs" c="dimmed" style={{ fontWeight: 600 }}>Tình trạng Kho chứa</Text>
                              <Text style={{ fontWeight: 800 }} size="xl" mt="xs">Sức chứa ước tính</Text>
                              <Text size="xs" c="dimmed" mt={5}>Dựa trên sơ đồ vị trí hoạt động</Text>
                            </Box>
                            <RingProgress
                              size={80}
                              roundCaps
                              thickness={8}
                              sections={[{ value: selectedSub.secondaryInventoryName === "01" ? 65 : 40, color: "blue" }]}
                              label={
                                <Text ta="center" size="xs" style={{ fontWeight: 700 }}>
                                  {selectedSub.secondaryInventoryName === "01" ? "65%" : "40%"}
                                </Text>
                              }
                            />
                          </Group>
                        </Card>
                      </Grid.Col>

                      <Grid.Col span={6}>
                        <Card withBorder p="md" radius="md" style={{ height: "100%" }}>
                          <Group gap="sm">
                            <ThemeIcon color="blue" size="md"><IconDatabase size={16} /></ThemeIcon>
                            <Box>
                              <Text size="xs" c="dimmed">Tính chất tồn trữ</Text>
                              <Text style={{ fontWeight: 700 }} size="sm">
                                {selectedSub.assetInventory === 1 ? "Kho Tính Giá Trị Tài Sản (Asset)" : "Kho Chi Phí (Expense)"}
                              </Text>
                            </Box>
                          </Group>
                          <Group gap="sm" mt="md">
                            <ThemeIcon color="blue" size="md"><IconActivity size={16} /></ThemeIcon>
                            <Box>
                              <Text size="xs" c="dimmed">Kiểm soát số lượng</Text>
                              <Text style={{ fontWeight: 700 }} size="sm">
                                {selectedSub.trackedQuantity === 1 ? "Có theo dõi lượng tồn kho thực tế" : "Không theo dõi"}
                              </Text>
                            </Box>
                          </Group>
                        </Card>
                      </Grid.Col>

                      <Grid.Col span={12} mt="sm">
                        <Card withBorder p="md" radius="md">
                          <Text style={{ fontWeight: 700 }} size="sm" mb="xs" c="blue">
                            Thông tin hành chính & Địa điểm vật lý
                          </Text>
                          <Grid>
                            <Grid.Col span={6}>
                              <Text size="xs" c="dimmed">Địa chỉ vật lý kho con</Text>
                              <Text size="sm" style={{ fontWeight: 600 }} mt={4}>{selectedSub.address || "Chưa thiết lập"}</Text>
                            </Grid.Col>
                            <Grid.Col span={3}>
                              <Text size="xs" c="dimmed">Thủ kho phụ trách</Text>
                              <Text size="sm" style={{ fontWeight: 600 }} mt={4}>{selectedSub.contactPerson || "Chưa thiết lập"}</Text>
                            </Grid.Col>
                            <Grid.Col span={3}>
                              <Text size="xs" c="dimmed">Số điện thoại liên hệ</Text>
                              <Text size="sm" style={{ fontWeight: 600 }} mt={4}>{selectedSub.phone || "Chưa thiết lập"}</Text>
                            </Grid.Col>
                          </Grid>
                        </Card>
                      </Grid.Col>

                      <Grid.Col span={12} mt="sm">
                        <Card withBorder p="md" radius="md">
                          <Text style={{ fontWeight: 700 }} size="sm" mb="xs" c="blue">
                            Tham chiếu Tài khoản định khoản mặc định
                          </Text>
                          <Table withTableBorder>
                            <Table.Tbody>
                              <Table.Tr>
                                <Table.Td style={{ fontWeight: 600, width: "200px" }}>Tài khoản Kho nguyên vật liệu (COA):</Table.Td>
                                <Table.Td style={{ fontFamily: "monospace", color: "#1971c2" }}>152000 - Nguyên vật liệu chính</Table.Td>
                              </Table.Tr>
                              <Table.Tr>
                                <Table.Td style={{ fontWeight: 600 }}>Tài khoản Chênh lệch giá mua:</Table.Td>
                                <Table.Td style={{ fontFamily: "monospace", color: "#1971c2" }}>632000 - Giá vốn hàng bán</Table.Td>
                              </Table.Tr>
                              <Table.Tr>
                                <Table.Td style={{ fontWeight: 600 }}>Tài khoản Nhận/Xuất trung gian:</Table.Td>
                                <Table.Td style={{ fontFamily: "monospace", color: "#1971c2" }}>151000 - Hàng mua đang đi đường</Table.Td>
                              </Table.Tr>
                            </Table.Tbody>
                          </Table>
                        </Card>
                      </Grid.Col>
                    </Grid>
                  </Tabs.Panel>
                </Tabs>
              </Box>
            ) : (
              <Flex justify="center" align="center" style={{ height: "100%" }}>
                <Text c="dimmed">Vui lòng chọn một kho con ở cột bên trái để xem chi tiết.</Text>
              </Flex>
            )}
          </Card>
        </Grid.Col>
      </Grid>

      {/* Modal Thêm Kho Con */}
      <Modal opened={isSubModalOpen} onClose={() => setIsSubModalOpen(false)} title="Khai báo Kho Con mới (Subinventory)">
        <Grid>
          <Grid.Col span={12}>
            <TextInput
              label="Mã kho con"
              placeholder="Ví dụ: 03"
              value={subName}
              onChange={(e) => setSubName(e.currentTarget.value)}
              withAsterisk
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <TextInput
              label="Tên/Diễn giải kho"
              placeholder="Ví dụ: Kho thành phẩm phụ"
              value={subDesc}
              onChange={(e) => setSubDesc(e.currentTarget.value)}
              withAsterisk
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Select
              label="Kiểm soát Vị trí (Locator Control)"
              data={[
                { value: "1", label: "1 - Không kiểm soát" },
                { value: "2", label: "2 - Cấu hình định sẵn (Pre-defined)" }
              ]}
              value={subControl}
              onChange={(val) => setSubControl(val || "2")}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Select
              label="Tính chất kho"
              data={[
                { value: "1", label: "Kho tài sản (Asset)" },
                { value: "2", label: "Kho chi phí (Expense)" }
              ]}
              value={subAsset}
              onChange={(val) => setSubAsset(val || "1")}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Select
              label="Theo dõi tồn kho"
              data={[
                { value: "1", label: "Có (Quantity Tracked)" },
                { value: "2", label: "Không" }
              ]}
              value={subTracked}
              onChange={(val) => setSubTracked(val || "1")}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <TextInput
              label="Địa chỉ vật lý kho con"
              placeholder="Ví dụ: Lô B1-CN2, KCN Từ Liêm, Hà Nội"
              value={subAddress}
              onChange={(e) => setSubAddress(e.currentTarget.value)}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              label="Thủ kho phụ trách"
              placeholder="Ví dụ: Nguyễn Văn A"
              value={subContact}
              onChange={(e) => setSubContact(e.currentTarget.value)}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              label="Số điện thoại liên hệ"
              placeholder="Ví dụ: 0901 234 567"
              value={subPhone}
              onChange={(e) => setSubPhone(e.currentTarget.value)}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <NumberInput
              label="Dung tích chứa tối đa (m³)"
              placeholder="Ví dụ: 500"
              value={subCapacity}
              onChange={(val) => setSubCapacity(val)}
            />
          </Grid.Col>
          <Grid.Col span={12} mt="md">
            <Group justify="flex-end">
              <Button variant="outline" color="gray" onClick={() => setIsSubModalOpen(false)}>Hủy</Button>
              <Button onClick={handleAddSubinventory}>Lưu</Button>
            </Group>
          </Grid.Col>
        </Grid>
      </Modal>

      {/* Modal Thêm Locator */}
      <Modal opened={isLocModalOpen} onClose={() => setIsLocModalOpen(false)} title={`Khai báo Vị trí cho Kho ${selectedSub?.secondaryInventoryName}`}>
        <Grid>
          <Grid.Col span={12}>
            <TextInput
              label="Mã vị trí (Locator Code)"
              placeholder="Ví dụ: LOC-01-C"
              value={locCode}
              onChange={(e) => setLocCode(e.currentTarget.value)}
              withAsterisk
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <TextInput
              label="Mô tả khu vực"
              placeholder="Ví dụ: Hàng kệ số 3 dãy A"
              value={locDesc}
              onChange={(e) => setLocDesc(e.currentTarget.value)}
              withAsterisk
            />
          </Grid.Col>
          <Grid.Col span={12} mt="md">
            <Group justify="flex-end">
              <Button variant="outline" color="gray" onClick={() => setIsLocModalOpen(false)}>Hủy</Button>
              <Button onClick={handleAddLocator}>Thêm mới</Button>
            </Group>
          </Grid.Col>
        </Grid>
      </Modal>
    </Box>
  );
};

export default SubinventorySetup;

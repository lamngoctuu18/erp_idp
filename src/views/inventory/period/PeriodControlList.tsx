import { Box, Button, Card, Flex, Group, Table, Text, Badge, Title, Modal, Grid, TextInput, NumberInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { IconPlus, IconLock, IconLockOpen } from "@tabler/icons-react";
import BreadCrumb from "../../../_base/component/_layout/_breadcrumb";
import { getAccountingPeriods, openAccountingPeriod, closeAccountingPeriod } from "../../../api/inventory/api";
import { PeriodModel } from "../../../model/InventoryModel";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";

const PeriodControlList = () => {
  const [periods, setPeriods] = useState<PeriodModel[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [year, setYear] = useState<number>(2026);
  const [num, setNum] = useState<number>(8);
  const [name, setName] = useState("08-2026");

  const fetchPeriods = async () => {
    try {
      const res = await getAccountingPeriods();
      if (res?.success && res.data) {
        setPeriods(res.data);
      }
    } catch {
      NotificationExtension.Fails("Lỗi khi tải danh sách kỳ kế toán.");
    }
  };

  useEffect(() => {
    fetchPeriods();
  }, []);

  const handleOpenPeriod = async () => {
    try {
      const res = await openAccountingPeriod(year, num, name);
      if (res?.success) {
        NotificationExtension.Success(`Mở kỳ kế toán ${name} thành công!`);
        setIsModalOpen(false);
        fetchPeriods();
      }
    } catch {
      NotificationExtension.Fails("Lỗi khi mở kỳ kế toán.");
    }
  };

  const handleClosePeriod = async (periodId: number, periodName: string) => {
    try {
      const res = await closeAccountingPeriod(periodId);
      if (res?.success) {
        NotificationExtension.Success(`Đóng kỳ kế toán ${periodName} thành công!`);
        fetchPeriods();
      } else {
        NotificationExtension.Fails(res.message || `Lỗi khi đóng kỳ kế toán.`);
      }
    } catch {
      NotificationExtension.Fails("Lỗi hệ thống khi đóng kỳ.");
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
        <Button
          color="blue"
          leftSection={<IconPlus size={14} />}
          onClick={() => setIsModalOpen(true)}
        >
          Mở Kỳ kế toán mới
        </Button>
      </Flex>

      <Card withBorder shadow="sm" radius="md" p="lg">
        <Title order={4} mb="md">Kiểm soát Kỳ kế toán Phân hệ Kho (Org Mua hàng - 125)</Title>
        <Table withTableBorder highlightOnHover>
          <Table.Thead style={{ backgroundColor: "#f8f9fa" }}>
            <Table.Tr>
              <Table.Th>Mã kỳ (Period ID)</Table.Th>
              <Table.Th>Tên kỳ kế toán</Table.Th>
              <Table.Th>Năm</Table.Th>
              <Table.Th>Kỳ số</Table.Th>
              <Table.Th>Ngày bắt đầu</Table.Th>
              <Table.Th>Ngày kết thúc dự kiến</Table.Th>
              <Table.Th>Ngày đóng kỳ thực tế</Table.Th>
              <Table.Th>Trạng thái</Table.Th>
              <Table.Th style={{ width: "150px" }}>Thao tác</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {periods.map((p) => (
              <Table.Tr key={p.acctPeriodId}>
                <Table.Td style={{ fontWeight: 600 }}>{p.acctPeriodId}</Table.Td>
                <Table.Td>{p.periodName}</Table.Td>
                <Table.Td>{p.periodYear}</Table.Td>
                <Table.Td>{p.periodNum}</Table.Td>
                <Table.Td>{p.periodStartDate}</Table.Td>
                <Table.Td>{p.scheduleCloseDate}</Table.Td>
                <Table.Td>{p.periodCloseDate ? new Date(p.periodCloseDate).toLocaleDateString("vi-VN") : "-"}</Table.Td>
                <Table.Td>
                  <Badge color={p.openFlag === "Y" ? "green" : "red"} variant="filled">
                    {p.openFlag === "Y" ? "Đang Mở (Open)" : "Đã Đóng (Closed)"}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  {p.openFlag === "Y" ? (
                    <Button
                      size="xs"
                      color="red"
                      variant="outline"
                      leftSection={<IconLock size={12} />}
                      onClick={() => handleClosePeriod(p.acctPeriodId, p.periodName)}
                    >
                      Đóng kỳ
                    </Button>
                  ) : (
                    <Text size="xs" c="dimmed" style={{ fontStyle: "italic" }}>Đã khóa sổ</Text>
                  )}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>

      <Modal opened={isModalOpen} onClose={() => setIsModalOpen(false)} title="Mở Kỳ Kế toán mới">
        <Grid>
          <Grid.Col span={6}>
            <NumberInput
              label="Năm"
              value={year}
              onChange={(val) => setYear(Number(val) || 2026)}
              withAsterisk
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <NumberInput
              label="Kỳ thứ mấy trong năm"
              value={num}
              min={1}
              max={12}
              onChange={(val) => {
                const n = Number(val) || 1;
                setNum(n);
                setName(`${n < 10 ? "0" + n : n}-${year}`);
              }}
              withAsterisk
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <TextInput
              label="Tên kỳ kế toán"
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
              withAsterisk
            />
          </Grid.Col>
          <Grid.Col span={12} mt="md">
            <Group justify="flex-end">
              <Button variant="outline" color="gray" onClick={() => setIsModalOpen(false)}>Hủy</Button>
              <Button leftSection={<IconLockOpen size={14} />} onClick={handleOpenPeriod}>Mở Kỳ</Button>
            </Group>
          </Grid.Col>
        </Grid>
      </Modal>
    </Box>
  );
};

export default PeriodControlList;

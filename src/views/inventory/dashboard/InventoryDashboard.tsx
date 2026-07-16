import { ReactNode, useEffect, useMemo, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Grid,
  Group,
  Paper,
  SimpleGrid,
  Table,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconAlertTriangle,
  IconArrowsLeftRight,
  IconCalendar,
  IconDatabaseImport,
  IconReceipt,
  IconStack2,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import {
  getAccountingPeriods,
  getInventoryInterfaceBatches,
  getMoveOrders,
  getOnhandList,
  getTransactionHistory,
} from "../../../api/inventory/api";
import {
  InventoryInterfaceBatchModel,
  MaterialTransactionModel,
  MoveOrderHeaderModel,
  OnhandModel,
  PeriodModel,
} from "../../../model/InventoryModel";
import { formatDateTime } from "../../../common/FormatDate/FormatDate";

const money = (value: number) =>
  `${Math.round(value).toLocaleString("vi-VN")} đ`;

const StatCard = ({
  label,
  value,
  hint,
  color,
  icon,
}: {
  label: string;
  value: string;
  hint: string;
  color: string;
  icon: ReactNode;
}) => (
  <Paper className="inv-stat-card" p="md">
    <Group justify="space-between" align="flex-start">
      <Box>
        <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
          {label}
        </Text>
        <Text className="inv-number" fw={800} size="xl" mt={6}>
          {value}
        </Text>
        <Text c="dimmed" size="xs" mt={4}>
          {hint}
        </Text>
      </Box>
      <ThemeIcon variant="light" color={color} radius="sm" size={38}>
        {icon}
      </ThemeIcon>
    </Group>
  </Paper>
);

export default function InventoryDashboard() {
  const navigate = useNavigate();
  const [onhand, setOnhand] = useState<OnhandModel[]>([]);
  const [transactions, setTransactions] = useState<MaterialTransactionModel[]>([]);
  const [periods, setPeriods] = useState<PeriodModel[]>([]);
  const [moveOrders, setMoveOrders] = useState<MoveOrderHeaderModel[]>([]);
  const [interfaceBatches, setInterfaceBatches] = useState<InventoryInterfaceBatchModel[]>([]);

  useEffect(() => {
    const load = async () => {
      const [onhandRes, txRes, periodRes, moRes, interfaceRes] = await Promise.all([
        getOnhandList(),
        getTransactionHistory(),
        getAccountingPeriods(),
        getMoveOrders(),
        getInventoryInterfaceBatches("ALL"),
      ]);

      if (onhandRes.success) setOnhand((onhandRes.data || []) as OnhandModel[]);
      if (txRes.success) setTransactions((txRes.data || []) as MaterialTransactionModel[]);
      if (periodRes.success) setPeriods((periodRes.data || []) as PeriodModel[]);
      if (moRes.success) setMoveOrders((moRes.data || []) as MoveOrderHeaderModel[]);
      if (interfaceRes.success) setInterfaceBatches(interfaceRes.data || []);
    };

    load();
  }, []);

  const metrics = useMemo(() => {
    const totalValue = onhand.reduce((sum, row) => sum + (row.totalValue || 0), 0);
    const activePeriod = periods.find((period) => period.openFlag === "Y");
    const pendingMoveOrders = moveOrders.filter((order) => [2, 3].includes(order.headerStatus)).length;
    const interfaceErrors = interfaceBatches.reduce((sum, batch) => sum + batch.errorCount, 0);

    return {
      totalValue,
      activePeriod,
      pendingMoveOrders,
      interfaceErrors,
    };
  }, [interfaceBatches, moveOrders, onhand, periods]);

  const recentTransactions = transactions.slice(0, 6);
  const errorBatches = interfaceBatches.filter((batch) => batch.status === "ERROR");

  return (
    <Box>
      <Group justify="space-between" align="flex-start" mb="md">
        <Box>
          <Title order={3} c="dark.8">
            Tổng quan kho
          </Title>
          <Text c="dimmed" size="sm" mt={4}>
            Tồn kho, giao dịch, kỳ kế toán và interface đang cần xử lý.
          </Text>
        </Box>
        <Group gap="xs">
          <Button
            leftSection={<IconArrowsLeftRight size={16} />}
            onClick={() => navigate("/inventory/transactions")}
          >
            Giao dịch kho
          </Button>
          <Button
            variant="light"
            leftSection={<IconDatabaseImport size={16} />}
            onClick={() => navigate("/inventory/interfaces")}
          >
            Interface
          </Button>
        </Group>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md" mb="md">
        <StatCard
          label="Giá trị tồn"
          value={money(metrics.totalValue)}
          hint={`${onhand.length} dòng on-hand`}
          color="green"
          icon={<IconStack2 size={21} />}
        />
        <StatCard
          label="Kỳ đang mở"
          value={metrics.activePeriod?.periodName || "-"}
          hint={metrics.activePeriod ? "Sẵn sàng ghi nhận giao dịch" : "Chưa có kỳ mở"}
          color="blue"
          icon={<IconCalendar size={21} />}
        />
        <StatCard
          label="Move Order"
          value={metrics.pendingMoveOrders.toString()}
          hint="Chờ phê duyệt hoặc cấp phát"
          color="orange"
          icon={<IconReceipt size={21} />}
        />
        <StatCard
          label="Lỗi interface"
          value={metrics.interfaceErrors.toString()}
          hint={`${errorBatches.length} batch cần kiểm tra`}
          color={metrics.interfaceErrors > 0 ? "red" : "green"}
          icon={<IconAlertTriangle size={21} />}
        />
      </SimpleGrid>

      <Grid>
        <Grid.Col span={{ base: 12, lg: 7 }}>
          <Paper className="inv-panel" p="md">
            <Group justify="space-between" mb="sm">
              <Text fw={700}>Giao dịch gần đây</Text>
              <Button size="xs" variant="subtle" onClick={() => navigate("/inventory/transaction/history")}>
                Xem lịch sử
              </Button>
            </Group>
            <Table highlightOnHover withTableBorder>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Mã GD</Table.Th>
                  <Table.Th>Ngày</Table.Th>
                  <Table.Th>Vật tư</Table.Th>
                  <Table.Th>Loại</Table.Th>
                  <Table.Th style={{ textAlign: "right" }}>Số lượng</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {recentTransactions.map((transaction) => (
                  <Table.Tr key={transaction.transactionId}>
                    <Table.Td className="inv-number">{transaction.transactionId}</Table.Td>
                    <Table.Td>{formatDateTime(transaction.transactionDate, "DD/MM/YYYY")}</Table.Td>
                    <Table.Td>{transaction.itemNumber}</Table.Td>
                    <Table.Td>
                      <Badge color={transaction.transactionQuantity > 0 ? "green" : "red"} variant="light">
                        {transaction.transactionTypeName}
                      </Badge>
                    </Table.Td>
                    <Table.Td className="inv-number" style={{ textAlign: "right" }}>
                      {transaction.transactionQuantity.toLocaleString("vi-VN")} {transaction.transactionUom}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, lg: 5 }}>
          <Paper className="inv-panel" p="md">
            <Group justify="space-between" mb="sm">
              <Text fw={700}>Interface cần xử lý</Text>
              <Button size="xs" variant="subtle" onClick={() => navigate("/inventory/interfaces")}>
                Mở monitor
              </Button>
            </Group>
            {errorBatches.length === 0 ? (
              <Text c="dimmed" size="sm">
                Không có batch lỗi.
              </Text>
            ) : (
              errorBatches.map((batch) => (
                <Group key={batch.batchId} justify="space-between" className="inv-panel" p="xs" mb="xs">
                  <Box>
                    <Text fw={700} size="sm">
                      {batch.batchId}
                    </Text>
                    <Text c="dimmed" size="xs">
                      {batch.sourceCode}
                    </Text>
                  </Box>
                  <Badge color="red" variant="light">
                    {batch.errorCount} lỗi
                  </Badge>
                </Group>
              ))
            )}
          </Paper>
        </Grid.Col>
      </Grid>
    </Box>
  );
}

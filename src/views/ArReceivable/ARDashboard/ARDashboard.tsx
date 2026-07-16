import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Card, Text, Group, Stack, Table, Progress, Box, Title, Alert } from "@mantine/core";
import { IconAlertTriangle, IconCash, IconClock, IconFileInvoice, IconListDetails } from "@tabler/icons-react";
import { ARMockStorage } from "../mock/arMockStorage";
import { formatNumber } from "../../../common/FormatDate/FormatDate";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ChartTitle,
  Tooltip,
  Legend,
  ArcElement
);

export default function ARDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalAr: 0,
    currentAr: 0,
    overdueAr: 0,
    collectedMonth: 0,
    unappliedAmt: 0,
    unidentifiedAmt: 0,
    onAccountAmt: 0,
    openInvoices: 0,
    overdueInvoices: 0,
    unprocessedReceipts: 0,
    accountingErrors: 0,
    autoInvoiceErrors: 0,
    pendingAccountingEvents: 0,
    dueSoonInvoices: 0,
    aging: { current: 0, d1_30: 0, d31_60: 0, d61_90: 0, over90: 0 },
    topCustomers: [] as any[],
    recentDue: [] as any[]
  });

  useEffect(() => {
    const fetchStats = () => {
      const schedules = ARMockStorage.getPaymentSchedules();
      const receipts = ARMockStorage.getReceipts();
      const invoices = ARMockStorage.getInvoices();
      const events = ARMockStorage.getAccountingEvents();
      const autoInvoiceRequests = ARMockStorage.getAutoInvoiceRequests();

      let totalAr = 0;
      let currentAr = 0;
      let overdueAr = 0;
      let collectedMonth = 0;
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const dueSoonLimit = new Date(today);
      dueSoonLimit.setDate(dueSoonLimit.getDate() + 7);

      const aging = { current: 0, d1_30: 0, d31_60: 0, d61_90: 0, over90: 0 };
      const customerBalances: Record<number, { name: string; amount: number }> = {};

      schedules.forEach(s => {
        const remaining = s.amountDueRemaining || 0;
        totalAr += remaining;
        
        // Find customer name
        const custName = ARMockStorage.getInvoices().find(i => i.invoiceId === s.invoiceId)?.soldToCustomerId 
          ? (["PKM", "Minh Long", "Hacom", "Sơn Việt", "Thành Công", "Đại Phát", "An Bình", "Hoàng Gia", "Đông Á", "Việt Thành"][(ARMockStorage.getInvoices().find(i => i.invoiceId === s.invoiceId)!.soldToCustomerId! - 1) % 10])
          : "Khách hàng vãng lai";

        const custId = s.customerId || 0;
        if (!customerBalances[custId]) {
          customerBalances[custId] = { name: custName, amount: 0 };
        }
        customerBalances[custId].amount += remaining;

        if (remaining > 0) {
          const due = new Date(s.dueDate);
          const diffDays = Math.ceil((today.getTime() - due.getTime()) / (1000 * 3600 * 24));
          
          if (diffDays <= 0) {
            currentAr += remaining;
            aging.current += remaining;
          } else {
            overdueAr += remaining;
            if (diffDays <= 30) aging.d1_30 += remaining;
            else if (diffDays <= 60) aging.d31_60 += remaining;
            else if (diffDays <= 90) aging.d61_90 += remaining;
            else aging.over90 += remaining;
          }
        }
        collectedMonth += s.amountApplied || 0;
      });

      // Receipts
      let unappliedAmt = 0;
      let unidentifiedAmt = 0;
      let onAccountAmt = 0;
      let unprocessedReceipts = 0;

      receipts.forEach(r => {
        if (r.status === "UNAPPLIED") {
          unappliedAmt += r.unappliedAmount || 0;
          unprocessedReceipts++;
        } else if (r.status === "UNIDENTIFIED") {
          unidentifiedAmt += r.unidentifiedAmount || 0;
          unprocessedReceipts++;
        } else if (r.status === "ON_ACCOUNT") {
          onAccountAmt += r.onAccountAmount || 0;
        }
      });

      const openInvoices = invoices.filter(x => x.status === "OPEN" || x.status === "PARTIALLY_PAID").length;
      const overdueInvoices = schedules.filter(s => s.amountDueRemaining > 0 && new Date(s.dueDate) < today).length;
      const accountingErrors = events.filter(e => e.accountingStatus === "ERROR").length;
      const autoInvoiceErrors = autoInvoiceRequests.filter(
        request => request.status?.toUpperCase() === "ERROR"
      ).length;
      const pendingAccountingEvents = events.filter(
        event => event.accountingStatus?.toUpperCase() !== "FINAL"
      ).length;
      const dueSoonInvoices = schedules.filter(schedule => {
        if (schedule.amountDueRemaining <= 0) return false;
        const dueDate = new Date(schedule.dueDate);
        return dueDate >= today && dueDate <= dueSoonLimit;
      }).length;

      // Top customers
      const topCustomers = Object.values(customerBalances)
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);

      setStats({
        totalAr,
        currentAr,
        overdueAr,
        collectedMonth,
        unappliedAmt,
        unidentifiedAmt,
        onAccountAmt,
        openInvoices,
        overdueInvoices,
        unprocessedReceipts,
        accountingErrors,
        autoInvoiceErrors,
        pendingAccountingEvents,
        dueSoonInvoices,
        aging,
        topCustomers,
        recentDue: schedules.filter(s => s.amountDueRemaining > 0).slice(0, 5)
      });
    };

    fetchStats();
  }, []);

  const agingPercent = (val: number) => {
    if (stats.totalAr === 0) return 0;
    return (val / stats.totalAr) * 100;
  };

  const kpiCardStyle = {
    width: "100%",
    height: "100%",
    cursor: "pointer",
    textAlign: "left" as const,
    font: "inherit",
    color: "inherit"
  };

  return (
    <Stack gap="lg">
      {/* Quick Alert if accounting error */}
      {stats.accountingErrors > 0 && (
        <Alert icon={<IconAlertTriangle size={16} />} title="Hệ thống cảnh báo" color="red">
          Phát hiện {stats.accountingErrors} giao dịch bị lỗi định khoản chưa được xử lý. Vui lòng kiểm tra tab "Hạch toán".
        </Alert>
      )}

      {/* Row 1: KPI Cards */}
      <Grid>
        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <Card
            component="button"
            type="button"
            className="ar-stat-card"
            padding="md"
            style={kpiCardStyle}
            onClick={() => navigate("/cong-no-phai-thu/cong-no")}
            aria-label="Xem tổng công nợ phải thu"
          >
            <Group justify="space-between">
              <Text size="xs" c="dimmed" fw={700}>TỔNG CÔNG NỢ PHẢI THU</Text>
              <IconFileInvoice size={22} color="#4f46e5" />
            </Group>
            <Title order={3} mt="xs">{formatNumber(stats.totalAr)} VND</Title>
            <Group justify="space-between" mt="xs">
              <Text size="xs" c="dimmed">Chưa đến hạn:</Text>
              <Text size="xs" fw={700} c="indigo">{formatNumber(stats.currentAr)}</Text>
            </Group>
            <Group justify="space-between" mt={4}>
              <Text size="xs" c="dimmed">Hóa đơn sắp đến hạn:</Text>
              <Text size="xs" fw={700} c="indigo">{stats.dueSoonInvoices} HĐ</Text>
            </Group>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <Card
            component="button"
            type="button"
            className="ar-stat-card overdue"
            padding="md"
            style={kpiCardStyle}
            onClick={() => navigate("/cong-no-phai-thu/cong-no?status=OVERDUE")}
            aria-label="Xem danh sách công nợ quá hạn"
          >
            <Group justify="space-between">
              <Text size="xs" c="dimmed" fw={700}>CÔNG NỢ QUÁ HẠN</Text>
              <IconClock size={22} color="#ef4444" />
            </Group>
            <Title order={3} mt="xs" c="red">{formatNumber(stats.overdueAr)} VND</Title>
            <Group justify="space-between" mt="xs">
              <Text size="xs" c="dimmed">Số HĐ quá hạn:</Text>
              <Text size="xs" fw={700} c="red">{stats.overdueInvoices} HĐ</Text>
            </Group>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <Card
            component="button"
            type="button"
            className="ar-stat-card success"
            padding="md"
            style={kpiCardStyle}
            onClick={() => navigate("/cong-no-phai-thu/thu-tien")}
            aria-label="Xem các khoản thu tiền"
          >
            <Group justify="space-between">
              <Text size="xs" c="dimmed" fw={700}>ĐÃ THU TRONG THÁNG</Text>
              <IconCash size={22} color="#10b981" />
            </Group>
            <Title order={3} mt="xs" c="teal">{formatNumber(stats.collectedMonth)} VND</Title>
            <Group justify="space-between" mt="xs">
              <Text size="xs" c="dimmed">Hóa đơn đang mở:</Text>
              <Text size="xs" fw={700}>{stats.openInvoices} HĐ</Text>
            </Group>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <Card
            component="button"
            type="button"
            className="ar-stat-card warning"
            padding="md"
            style={kpiCardStyle}
            onClick={() => navigate("/cong-no-phai-thu/thu-tien?filter=unapplied")}
            aria-label="Xem phiếu thu chưa cấn trừ"
          >
            <Group justify="space-between">
              <Text size="xs" c="dimmed" fw={700}>TẠM THU CHƯA APPLY</Text>
              <IconListDetails size={22} color="#f59e0b" />
            </Group>
            <Title order={3} mt="xs" c="orange">{formatNumber(stats.unappliedAmt + stats.unidentifiedAmt)} VND</Title>
            <Group justify="space-between" mt="xs">
              <Text size="xs" c="dimmed">Chưa xác định KH:</Text>
              <Text size="xs" fw={700} c="orange">{formatNumber(stats.unidentifiedAmt)}</Text>
            </Group>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Operational alerts: keep integrations and accounting visible without making them sidebar modules. */}
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card
            component="button"
            type="button"
            className="ar-stat-card overdue"
            padding="md"
            style={kpiCardStyle}
            onClick={() => navigate("/cong-no-phai-thu/thiet-lap-tich-hop?tab=autoinvoice&filter=error")}
            aria-label="Xem lỗi AutoInvoice"
          >
            <Group justify="space-between">
              <Text size="xs" c="dimmed" fw={700}>LỖI AUTOINVOICE</Text>
              <IconAlertTriangle size={22} color="#ef4444" />
            </Group>
            <Title order={3} mt="xs" c="red">{stats.autoInvoiceErrors} yêu cầu</Title>
            <Text size="xs" c="dimmed" mt="xs">Mở danh sách lỗi để kiểm tra, sửa dữ liệu hoặc Retry</Text>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card
            component="button"
            type="button"
            className="ar-stat-card warning"
            padding="md"
            style={kpiCardStyle}
            onClick={() => navigate("/cong-no-phai-thu/ke-toan-bao-cao?tab=accounting-events&filter=pending")}
            aria-label="Xem sự kiện kế toán chưa xử lý"
          >
            <Group justify="space-between">
              <Text size="xs" c="dimmed" fw={700}>SỰ KIỆN KẾ TOÁN CHƯA XỬ LÝ</Text>
              <IconListDetails size={22} color="#f59e0b" />
            </Group>
            <Title order={3} mt="xs" c="orange">{stats.pendingAccountingEvents} sự kiện</Title>
            <Text size="xs" c="dimmed" mt="xs">
              Bao gồm Draft, Unaccounted và {stats.accountingErrors} sự kiện lỗi
            </Text>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Row 2: Aging & Top Customers */}
      <Grid>
        <Grid.Col span={{ base: 12, md: 7 }}>
          <Card shadow="xs" padding="md" radius="sm" withBorder>
            <Title order={4} mb="md">Phân tích tuổi nợ (Aging)</Title>
            <Stack gap="sm">
              <Box>
                <Group justify="space-between" mb="xs">
                  <Text size="sm">Chưa đến hạn</Text>
                  <Text size="sm" fw={700}>{formatNumber(stats.aging.current)} VND ({agingPercent(stats.aging.current).toFixed(1)}%)</Text>
                </Group>
                <Progress color="teal" value={agingPercent(stats.aging.current)} size="md" />
              </Box>

              <Box>
                <Group justify="space-between" mb="xs">
                  <Text size="sm">Từ 1 - 30 ngày</Text>
                  <Text size="sm" fw={700}>{formatNumber(stats.aging.d1_30)} VND ({agingPercent(stats.aging.d1_30).toFixed(1)}%)</Text>
                </Group>
                <Progress color="yellow" value={agingPercent(stats.aging.d1_30)} size="md" />
              </Box>

              <Box>
                <Group justify="space-between" mb="xs">
                  <Text size="sm">Từ 31 - 60 ngày</Text>
                  <Text size="sm" fw={700}>{formatNumber(stats.aging.d31_60)} VND ({agingPercent(stats.aging.d31_60).toFixed(1)}%)</Text>
                </Group>
                <Progress color="orange" value={agingPercent(stats.aging.d31_60)} size="md" />
              </Box>

              <Box>
                <Group justify="space-between" mb="xs">
                  <Text size="sm">Từ 61 - 90 ngày</Text>
                  <Text size="sm" fw={700}>{formatNumber(stats.aging.d61_90)} VND ({agingPercent(stats.aging.d61_90).toFixed(1)}%)</Text>
                </Group>
                <Progress color="red" value={agingPercent(stats.aging.d61_90)} size="md" />
              </Box>

              <Box>
                <Group justify="space-between" mb="xs">
                  <Text size="sm">Trên 90 ngày</Text>
                  <Text size="sm" fw={700}>{formatNumber(stats.aging.over90)} VND ({agingPercent(stats.aging.over90).toFixed(1)}%)</Text>
                </Group>
                <Progress color="dark" value={agingPercent(stats.aging.over90)} size="md" />
              </Box>
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 5 }}>
          <Card shadow="xs" padding="md" radius="sm" withBorder>
            <Title order={4} mb="md">Top khách hàng nợ nhiều nhất</Title>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Khách hàng</Table.Th>
                  <Table.Th style={{ textAlign: "right" }}>Nợ còn lại (VND)</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {stats.topCustomers.map((c, idx) => (
                  <Table.Tr key={idx}>
                    <Table.Td fw={500}>{c.name}</Table.Td>
                    <Table.Td style={{ textAlign: "right" }} fw={700} c="red">{formatNumber(c.amount)}</Table.Td>
                  </Table.Tr>
                ))}
                {stats.topCustomers.length === 0 && (
                  <Table.Tr>
                    <Table.Td colSpan={2} align="center">Không có công nợ hoạt động</Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Row 3: Visual Analytics Charts */}
      <Grid>
        <Grid.Col span={{ base: 12, md: 7 }}>
          <Card shadow="xs" padding="md" radius="sm" withBorder>
            <Title order={4} mb="md">Biểu đồ phân tích tuổi nợ (Aging Chart)</Title>
            <Box style={{ height: 260, position: "relative" }}>
              <Bar
                data={{
                  labels: ["Chưa đến hạn", "1-30 ngày", "31-60 ngày", "61-90 ngày", "Trên 90 ngày"],
                  datasets: [
                    {
                      label: "Giá trị công nợ (VND)",
                      data: [
                        stats.aging.current,
                        stats.aging.d1_30,
                        stats.aging.d31_60,
                        stats.aging.d61_90,
                        stats.aging.over90
                      ],
                      backgroundColor: ["#10b981", "#f59e0b", "#f97316", "#ef4444", "#475569"],
                      borderRadius: 6
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false }
                  }
                }}
              />
            </Box>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 5 }}>
          <Card shadow="xs" padding="md" radius="sm" withBorder>
            <Title order={4} mb="md">Tỷ lệ công nợ Top khách hàng</Title>
            <Box style={{ height: 260, position: "relative", display: "flex", justifyContent: "center" }}>
              <Pie
                data={{
                  labels: stats.topCustomers.map(c => c.name),
                  datasets: [
                    {
                      data: stats.topCustomers.map(c => c.amount),
                      backgroundColor: ["#4f46e5", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"]
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "right" as const,
                      labels: { boxWidth: 12, font: { size: 11 } }
                    }
                  }
                }}
              />
            </Box>
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}

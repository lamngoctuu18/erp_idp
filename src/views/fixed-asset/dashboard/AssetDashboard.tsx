import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Badge,
  Box,
  Button,
  Card,
  Grid,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconPlus, IconRefresh } from "@tabler/icons-react";
import { FaPageHeader, FaNotice, FaStatCard, money, moneyShort } from "../_components/FaCommon";
import { getDashboardStats } from "../../../api/fixed-asset/api";
import { FaDashboardStats } from "../../../model/FixedAssetModel";

// Import Chart.js components
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartTitle,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";

// Register Chart.js elements
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, ChartTitle);

const AssetDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<FaDashboardStats | null>(null);

  const load = async () => {
    const res = await getDashboardStats();
    if (res?.success) setStats(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  // Doughnut Chart Data (NBV Composition)
  const doughnutData = {
    labels: stats?.categoryData.map((c) => c.label) || [],
    datasets: [
      {
        data: stats?.categoryData.map((c) => c.nbv) || [],
        backgroundColor: [
          "#2563eb", // blue
          "#10b981", // green
          "#f59e0b", // yellow
          "#64748b", // gray
        ],
        borderWidth: 1,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          boxWidth: 12,
          font: {
            size: 11,
          },
        },
      },
    },
  };

  // Bar Chart Data (Cost vs Accumulated vs NBV)
  const barData = {
    labels: stats?.categoryData.map((c) => c.label) || [],
    datasets: [
      {
        label: "Nguyên giá (Cost)",
        data: stats?.categoryData.map((c) => c.cost) || [],
        backgroundColor: "rgba(37, 99, 235, 0.75)",
        borderColor: "#2563eb",
        borderWidth: 1,
      },
      {
        label: "Hao mòn lũy kế (Accumulated)",
        data: stats?.categoryData.map((c) => c.accumulated) || [],
        backgroundColor: "rgba(239, 68, 68, 0.75)",
        borderColor: "#ef4444",
        borderWidth: 1,
      },
      {
        label: "Giá trị còn lại (NBV)",
        data: stats?.categoryData.map((c) => c.nbv) || [],
        backgroundColor: "rgba(16, 185, 129, 0.75)",
        borderColor: "#10b981",
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          boxWidth: 12,
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value: any) => moneyShort(value),
        },
      },
    },
  };

  return (
    <Box>
      <FaPageHeader
        actions={
          <>
            <Button variant="outline" color="gray" leftSection={<IconRefresh size={14} />} onClick={load}>
              Làm mới
            </Button>
            <Button color="blue" leftSection={<IconPlus size={14} />} onClick={() => navigate("/fixed-asset/addition")}>
              Ghi tăng tài sản
            </Button>
          </>
        }
      />

      <Grid mb={16}>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <FaStatCard label="Tổng nguyên giá" value={moneyShort(stats?.totalCost || 0)} sub="Toàn bộ danh mục" />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <FaStatCard label="Giá trị còn lại (NBV)" value={moneyShort(stats?.totalNbv || 0)} color="#059669" sub="Net Book Value" />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <FaStatCard label="CIP chưa vốn hóa" value={moneyShort(stats?.cipUncapitalized || 0)} color="#d97706" sub="Construction in process" />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <FaStatCard label="Tài sản đang dùng" value={String(stats?.activeAssets ?? 0)} color="#0891b2" sub="Active assets" />
        </Grid.Col>
      </Grid>

      <Grid mb={16}>
        {/* Left: Task List */}
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Card withBorder shadow="sm" radius="md" p="lg" h={320}>
            <Title order={5} mb="md">
              Công việc kỳ {stats?.openPeriod || "JUL-26"}
            </Title>
            <Stack gap="sm">
              <Group>
                <Badge color="yellow" size="lg">
                  {stats?.massAdditionsPending ?? 0}
                </Badge>
                <Text size="sm">Mass Additions chờ Prepare</Text>
              </Group>
              <Group>
                <Badge color="red" size="lg">
                  {stats?.missingAssignment ?? 0}
                </Badge>
                <Text size="sm">Tài sản thiếu Assignment</Text>
              </Group>
              <Group>
                <Badge color="blue" size="lg">
                  {stats?.openPeriod || "JUL-26"}
                </Badge>
                <Text size="sm">Kỳ khấu hao đang mở</Text>
              </Group>
              <Group>
                <Badge color="orange" size="lg">
                  {stats?.unaccountedTransactions ?? 0}
                </Badge>
                <Text size="sm">Giao dịch chưa hạch toán</Text>
              </Group>
            </Stack>
          </Card>
        </Grid.Col>

        {/* Right: Doughnut Chart (NBV Composition) */}
        <Grid.Col span={{ base: 12, md: 7 }}>
          <Card withBorder shadow="sm" radius="md" p="lg" h={320}>
            <Title order={5} mb="sm">
              Cơ cấu giá trị còn lại (NBV)
            </Title>
            <Box style={{ position: "relative", height: 230 }}>
              {stats ? (
                <Doughnut data={doughnutData} options={doughnutOptions} />
              ) : (
                <Text size="sm" c="dimmed" style={{ textAlign: "center", paddingTop: 100 }}>
                  Đang tải số liệu biểu đồ...
                </Text>
              )}
            </Box>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Bottom: Bar Chart (Financial Comparison) */}
      <Card withBorder shadow="sm" radius="md" p="lg" mb={16}>
        <Title order={5} mb="md">
          Phân tích giá trị tài sản cố định theo nhóm (Cost vs Accumulated vs NBV)
        </Title>
        <Box style={{ position: "relative", height: 350 }}>
          {stats ? (
            <Bar data={barData} options={barOptions} />
          ) : (
            <Text size="sm" c="dimmed" style={{ textAlign: "center", paddingTop: 150 }}>
              Đang tải số liệu biểu đồ...
            </Text>
          )}
        </Box>
      </Card>
    </Box>
  );
};

export default AssetDashboard;

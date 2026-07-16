import {
  Badge,
  Box,
  Button,
  Grid,
  Group,
  Paper,
  SimpleGrid,
  Text,
  ThemeIcon,
} from "@mantine/core";
import {
  IconArrowsLeftRight,
  IconBook,
  IconBox,
  IconCalendar,
  IconClipboardList,
  IconDatabaseImport,
  IconFileDescription,
  IconHistory,
  IconReceipt,
  IconSettings,
  IconStack2,
} from "@tabler/icons-react";
import { ComponentType } from "react";
import { useNavigate } from "react-router-dom";
import InventoryWorkspaceShell from "./InventoryWorkspaceShell";

interface WorkspaceAction {
  title: string;
  meta: string;
  path: string;
  icon: ComponentType<{ size?: number; stroke?: number }>;
  color: string;
}

const WorkspaceActionCard = ({ action }: { action: WorkspaceAction }) => {
  const navigate = useNavigate();
  const Icon = action.icon;

  return (
    <Paper className="inv-action-card" p="md">
      <Group justify="space-between" align="flex-start" mb="md">
        <ThemeIcon variant="light" color={action.color} radius="sm" size={34}>
          <Icon size={20} stroke={1.8} />
        </ThemeIcon>
        <Badge variant="light" color="gray">
          INV
        </Badge>
      </Group>
      <Text fw={700} size="sm">
        {action.title}
      </Text>
      <Text c="dimmed" size="xs" mt={4} mb="md">
        {action.meta}
      </Text>
      <Button size="xs" variant="light" color={action.color} onClick={() => navigate(action.path)}>
        Mở màn hình
      </Button>
    </Paper>
  );
};

const ActionGrid = ({ actions }: { actions: WorkspaceAction[] }) => (
  <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
    {actions.map((action) => (
      <WorkspaceActionCard key={action.path} action={action} />
    ))}
  </SimpleGrid>
);

const WorkQueuePanel = ({
  title,
  items,
}: {
  title: string;
  items: Array<{ label: string; value: string; tone: string }>;
}) => (
  <Paper className="inv-panel" p="md">
    <Text fw={700} size="sm" mb="sm">
      {title}
    </Text>
    <Grid>
      {items.map((item) => (
        <Grid.Col key={item.label} span={{ base: 12, md: 4 }}>
          <Group justify="space-between" gap="xs">
            <Text size="sm">{item.label}</Text>
            <Badge color={item.tone} variant="light">
              {item.value}
            </Badge>
          </Group>
        </Grid.Col>
      ))}
    </Grid>
  </Paper>
);

export function InventoryMasterDataWorkspace() {
  return (
    <InventoryWorkspaceShell
      title="Thiết lập & danh mục kho"
      description="Organization, vật tư, UOM, kho con, locator và tài khoản đối ứng."
      defaultTab="master"
      tabs={[
        {
          value: "master",
          label: "Danh mục vật tư",
          content: (
            <Box>
              <ActionGrid
                actions={[
                  {
                    title: "Danh sách vật tư",
                    meta: "Item master, trạng thái, UOM chính, category",
                    path: "/inventory/item/list",
                    icon: IconClipboardList,
                    color: "blue",
                  },
                  {
                    title: "Khai báo vật tư",
                    meta: "Thông tin chung, kiểm soát kho, mua bán, costing",
                    path: "/inventory/item/create",
                    icon: IconBox,
                    color: "teal",
                  },
                  {
                    title: "Interface danh mục",
                    meta: "Item, category, revision, item subinventory",
                    path: "/inventory/interfaces?kind=ITEM",
                    icon: IconDatabaseImport,
                    color: "indigo",
                  },
                ]}
              />
            </Box>
          ),
        },
        {
          value: "setup",
          label: "Kho & locator",
          content: (
            <ActionGrid
              actions={[
                {
                  title: "Kho con và locator",
                  meta: "Subinventory, locator control, thủ kho, sức chứa",
                  path: "/inventory/subinventory/setup",
                  icon: IconSettings,
                  color: "grape",
                },
                {
                  title: "Tồn kho hiện tại",
                  meta: "Kiểm tra dữ liệu sau khi cấu hình locator",
                  path: "/inventory/onhand/list",
                  icon: IconStack2,
                  color: "green",
                },
                {
                  title: "Tài khoản đối ứng",
                  meta: "Account alias dùng cho giao dịch Misc",
                  path: "/inventory/costing/accounts",
                  icon: IconBook,
                  color: "orange",
                },
              ]}
            />
          ),
        },
      ]}
    />
  );
}

export function InventoryAvailabilityWorkspace() {
  return (
    <InventoryWorkspaceShell
      title="Tồn kho & khả dụng"
      description="On-hand, lot, locator, allocated và available to transact."
      defaultTab="onhand"
      tabs={[
        {
          value: "onhand",
          label: "On-hand detail",
          content: (
            <ActionGrid
              actions={[
                {
                  title: "Tồn kho thực tế",
                  meta: "Item, kho con, locator, lot, physical, ATT",
                  path: "/inventory/onhand/list",
                  icon: IconStack2,
                  color: "green",
                },
                {
                  title: "Lịch sử giao dịch",
                  meta: "Drill-down nguồn tăng giảm tồn kho",
                  path: "/inventory/transaction/history",
                  icon: IconHistory,
                  color: "blue",
                },
                {
                  title: "Nhập - Xuất - Tồn",
                  meta: "Số lượng và giá trị theo kỳ kế toán",
                  path: "/inventory/report/nxt",
                  icon: IconFileDescription,
                  color: "cyan",
                },
              ]}
            />
          ),
        },
        {
          value: "controls",
          label: "Cảnh báo vận hành",
          content: (
            <WorkQueuePanel
              title="Chỉ báo cần theo dõi"
              items={[
                { label: "Lot sắp hết hạn", value: "2", tone: "orange" },
                { label: "Tồn âm", value: "0", tone: "green" },
                { label: "Đã phân bổ", value: "5 dòng", tone: "blue" },
              ]}
            />
          ),
        },
      ]}
    />
  );
}

export function InventoryTransactionWorkspace() {
  return (
    <InventoryWorkspaceShell
      title="Giao dịch kho"
      description="Misc, chuyển kho, lịch sử, nguồn phát sinh và kiểm tra tác động tồn kho."
      defaultTab="transactions"
      tabs={[
        {
          value: "transactions",
          label: "Giao dịch trực tiếp",
          content: (
            <ActionGrid
              actions={[
                {
                  title: "Nhập/Xuất Misc",
                  meta: "Phiếu nhập xuất trực tiếp, account alias, lot/locator",
                  path: "/inventory/transaction/misc",
                  icon: IconArrowsLeftRight,
                  color: "blue",
                },
                {
                  title: "Chuyển kho",
                  meta: "Subinventory transfer và inter-org transfer",
                  path: "/inventory/transaction/transfer",
                  icon: IconReceipt,
                  color: "teal",
                },
                {
                  title: "Lịch sử giao dịch",
                  meta: "Material transactions, lot, costed flag, GL lines",
                  path: "/inventory/transaction/history",
                  icon: IconHistory,
                  color: "indigo",
                },
              ]}
            />
          ),
        },
        {
          value: "interfaces",
          label: "Interface giao dịch",
          content: (
            <ActionGrid
              actions={[
                {
                  title: "Material Transaction Interface",
                  meta: "MTL_TRANSACTIONS_INTERFACE và lot interface",
                  path: "/inventory/interfaces?kind=TRANSACTION",
                  icon: IconDatabaseImport,
                  color: "orange",
                },
                {
                  title: "Kỳ kế toán kho",
                  meta: "Kiểm tra kỳ mở trước khi tạo giao dịch",
                  path: "/inventory/period/control",
                  icon: IconCalendar,
                  color: "blue",
                },
                {
                  title: "Bút toán định khoản",
                  meta: "Transaction accounts phát sinh sau giao dịch",
                  path: "/inventory/costing/accounts",
                  icon: IconBook,
                  color: "grape",
                },
              ]}
            />
          ),
        },
      ]}
    />
  );
}

export function InventoryMoveOrderWorkspace() {
  return (
    <InventoryWorkspaceShell
      title="Move Order"
      description="Yêu cầu, phê duyệt, phân bổ và xác nhận thực xuất."
      defaultTab="queue"
      tabs={[
        {
          value: "queue",
          label: "Hàng chờ xử lý",
          content: (
            <ActionGrid
              actions={[
                {
                  title: "Danh sách Move Order",
                  meta: "Request, trạng thái, ngày cần hàng",
                  path: "/inventory/move-order/list",
                  icon: IconReceipt,
                  color: "blue",
                },
                {
                  title: "Tạo yêu cầu cấp phát",
                  meta: "Header, line, kho xuất, kho nhận, số lượng",
                  path: "/inventory/move-order/create",
                  icon: IconClipboardList,
                  color: "teal",
                },
                {
                  title: "Tồn kho khả dụng",
                  meta: "Kiểm tra ATT trước khi allocate",
                  path: "/inventory/onhand/list",
                  icon: IconStack2,
                  color: "green",
                },
              ]}
            />
          ),
        },
        {
          value: "status",
          label: "Trạng thái",
          content: (
            <WorkQueuePanel
              title="Pipeline Move Order"
              items={[
                { label: "Chờ phê duyệt", value: "1", tone: "yellow" },
                { label: "Chờ cấp phát", value: "1", tone: "blue" },
                { label: "Đã đóng", value: "0", tone: "green" },
              ]}
            />
          ),
        },
      ]}
    />
  );
}

export function InventoryCostingWorkspace() {
  return (
    <InventoryWorkspaceShell
      title="Costing & kỳ kế toán"
      description="Định khoản, costed flag, average cost, FIFO layer và đóng kỳ kho."
      defaultTab="accounting"
      tabs={[
        {
          value: "accounting",
          label: "Định khoản",
          content: (
            <ActionGrid
              actions={[
                {
                  title: "Bút toán giao dịch",
                  meta: "Debit/Credit theo material transaction",
                  path: "/inventory/costing/accounts",
                  icon: IconBook,
                  color: "grape",
                },
                {
                  title: "Kỳ kế toán kho",
                  meta: "Mở kỳ, đóng kỳ, kiểm tra giao dịch chưa costed",
                  path: "/inventory/period/control",
                  icon: IconCalendar,
                  color: "blue",
                },
                {
                  title: "Lịch sử giao dịch",
                  meta: "Costed flag, actual cost, transaction cost",
                  path: "/inventory/transaction/history",
                  icon: IconHistory,
                  color: "indigo",
                },
              ]}
            />
          ),
        },
        {
          value: "close",
          label: "Checklist đóng kỳ",
          content: (
            <WorkQueuePanel
              title="Điều kiện trước khi đóng kỳ"
              items={[
                { label: "Interface lỗi", value: "2 batch", tone: "red" },
                { label: "Chưa costed", value: "0", tone: "green" },
                { label: "Bút toán thiếu", value: "0", tone: "green" },
              ]}
            />
          ),
        },
      ]}
    />
  );
}

export function InventoryReportsWorkspace() {
  return (
    <InventoryWorkspaceShell
      title="Báo cáo kho"
      description="NXT, tồn kho, lịch sử giao dịch và truy vết bút toán liên quan."
      defaultTab="reports"
      tabs={[
        {
          value: "reports",
          label: "Báo cáo",
          content: (
            <ActionGrid
              actions={[
                {
                  title: "Nhập - Xuất - Tồn",
                  meta: "Tồn đầu, nhập, xuất, tồn cuối theo kỳ",
                  path: "/inventory/report/nxt",
                  icon: IconFileDescription,
                  color: "cyan",
                },
                {
                  title: "Tồn kho thực tế",
                  meta: "On-hand theo lot/locator và giá trị tồn",
                  path: "/inventory/onhand/list",
                  icon: IconStack2,
                  color: "green",
                },
                {
                  title: "Lịch sử giao dịch",
                  meta: "Nguồn phát sinh và bút toán liên quan",
                  path: "/inventory/transaction/history",
                  icon: IconHistory,
                  color: "blue",
                },
              ]}
            />
          ),
        },
      ]}
    />
  );
}

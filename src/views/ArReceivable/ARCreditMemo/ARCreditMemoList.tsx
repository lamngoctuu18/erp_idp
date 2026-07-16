import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MRT_ColumnDef, MRT_PaginationState } from "mantine-react-table";
import { ActionIcon, Box, Button, Flex, Grid, Text, TextInput, Select, Menu, Badge, Card } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconEye, IconPlus, IconSearch, IconDotsVertical, IconCheck } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import DataTable from "../../../_base/component/Core/DataTable";
import { formatDateTime } from "../../../common/FormatDate/FormatDate";
import { ARMockStorage } from "../mock/arMockStorage";
import { MOCK_CUSTOMERS } from "../mock/arMockData";
import { formatNumber } from "../../../common/FormatDate/FormatDate";
import { ExportButton } from "../../../_base/component/Core/ExportButton";

export default function ARCreditMemoList() {
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<any[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [height, setHeight] = useState(500);

  const [keySearch, setKeySearch] = useState("");
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const formSearch = useForm({
    initialValues: { keySearch: "" }
  });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsRefetching(true);
    try {
      const allCMs = ARMockStorage.getInvoices().filter(x => x.transactionTypeId === 2);
      const filtered = allCMs.filter(cm => {
        if (!keySearch) return true;
        return cm.invoiceNumber.toLowerCase().includes(keySearch.toLowerCase());
      });

      setData(filtered.slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize));
      setRowCount(filtered.length);
    } catch {
      NotificationExtension.Fails("Lỗi khi tải danh sách Credit Memos.");
    } finally {
      setIsLoading(false);
      setIsRefetching(false);
    }
  }, [pagination.pageIndex, pagination.pageSize, keySearch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "invoiceNumber",
        header: "Mã Credit Memo",
        Cell: ({ row }) => (
          <Text fw={700} c="blue" style={{ cursor: "pointer" }} onClick={() => navigate(`/cong-no-phai-thu/hoa-don/${row.original.invoiceId}`)}>
            {row.original.invoiceNumber}
          </Text>
        )
      },
      {
        accessorKey: "invoiceDate",
        header: "Ngày lập",
        Cell: ({ row }) => formatDateTime(row.original.invoiceDate, "DD/MM/YYYY")
      },
      {
        accessorKey: "soldToCustomerId",
        header: "Khách hàng",
        Cell: ({ row }) => {
          const name = MOCK_CUSTOMERS.find(c => c.id === row.original.soldToCustomerId)?.name || "N/A";
          return <Text size="sm">{name}</Text>;
        }
      },
      {
        accessorKey: "totalAmount",
        header: "Số tiền (VND)",
        size: 150,
        Cell: ({ row }) => (
          <Text ta="right" fw={700} c="red">
            {formatNumber(row.original.totalAmount)}
          </Text>
        )
      },
      {
        accessorKey: "copiedFromInvoiceId",
        header: "Hóa đơn liên quan",
        Cell: ({ row }) => (
          <Text fw={700}>
            INV-2026-{(row.original.copiedFromInvoiceId || 1).toString().padStart(4, "0")}
          </Text>
        )
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        Cell: ({ row }) => (
          <Badge color={row.original.status === "COMPLETE" ? "green" : "gray"}>
            {row.original.status}
          </Badge>
        )
      }
    ],
    [navigate]
  );

  return (
    <Box>
      <Flex
        ref={headerRef}
        justify="space-between"
        align="center"
        style={{ border: "1px solid #dee2e6", padding: "8px 12px", background: "#f8f9fa", borderRadius: 4 }}
        mb={16}
      >
        <Text size="sm" fw={700} c="dimmed">Danh sách Credit Memos (Giảm trừ nợ)</Text>
        <Flex gap="sm">
          <ExportButton onClick={async () => { NotificationExtension.Success("Xuất excel Credit Memos thành công!"); }} />
          <Button
            color="indigo"
            leftSection={<IconPlus size={16} />}
            onClick={() => navigate("/cong-no-phai-thu/hoa-don/tao-moi")}
          >
            Tạo Credit Memo
          </Button>
        </Flex>
      </Flex>

      <Grid mb={16} align="end">
        <Grid.Col span={{ base: 12, md: 4 }}>
          <TextInput
            label="Tìm kiếm"
            placeholder="Mã Credit Memo..."
            leftSection={<IconSearch size={16} />}
            {...formSearch.getInputProps("keySearch")}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Button
            color="indigo"
            onClick={() => {
              setKeySearch(formSearch.values.keySearch);
              setPagination(p => ({ ...p, pageIndex: 0 }));
            }}
          >
            Tìm kiếm
          </Button>
        </Grid.Col>
      </Grid>

      <DataTable
        columns={columns}
        data={data}
        rowCount={rowCount}
        pagination={pagination}
        onPaginationChange={setPagination}
        isLoading={isLoading}
        isRefetching={isRefetching}
        height={height}
        renderRowActions={(row) => (
          <Menu shadow="md" width={180}>
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray">
                <IconDotsVertical size={16} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconEye size={14} />}
                onClick={() => navigate(`/cong-no-phai-thu/hoa-don/${row.original.invoiceId}`)}
              >
                Chi tiết
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
      />
    </Box>
  );
}

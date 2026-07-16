import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MRT_ColumnDef, MRT_PaginationState } from "mantine-react-table";
import { ActionIcon, Alert, Box, Button, Flex, Grid, Text, TextInput, Select, Menu, Badge } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconEye, IconPlus, IconSearch, IconDotsVertical, IconArrowBack, IconInfoCircle } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { useNavigate, useSearchParams } from "react-router-dom";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import DataTable from "../../../_base/component/Core/DataTable";
import { formatDateTime } from "../../../common/FormatDate/FormatDate";
import { ARReceipt } from "../types/arTypes";
import { arCashService } from "../services/arCashService";
import { ExportButton } from "../../../_base/component/Core/ExportButton";
import { MOCK_CUSTOMERS } from "../mock/arMockData";
import { formatNumber } from "../../../common/FormatDate/FormatDate";

interface ARReceiptListProps {
  balanceView?: "all" | "unapplied" | "on-account";
}

export default function ARReceiptList({ balanceView = "all" }: ARReceiptListProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const customerFromContext = searchParams.get("customerId") || "";
  const effectiveBalanceView = balanceView === "all" && searchParams.get("filter") === "unapplied"
    ? "unapplied"
    : balanceView;
  const headerRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<ARReceipt[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const height = 500;

  const [keySearch, setKeySearch] = useState("");
  const [customerFilter, setCustomerFilter] = useState<string | null>(customerFromContext || null);
  
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const formSearch = useForm({
    initialValues: { keySearch: "", customerId: customerFromContext }
  });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsRefetching(true);
    try {
      const res = await arCashService.getList({
        skip: pagination.pageIndex * pagination.pageSize,
        take: pagination.pageSize,
        keySearch,
        customerId: customerFilter ? Number(customerFilter) : undefined,
        balanceView: effectiveBalanceView === "all" ? undefined : effectiveBalanceView,
      });
      if (res?.success && res.data) {
        setData(res.data.items);
        setRowCount(res.data.totalItems);
      } else {
        setData([]);
        setRowCount(0);
      }
    } catch {
      NotificationExtension.Fails("Lỗi khi tải danh sách phiếu thu.");
    } finally {
      setIsLoading(false);
      setIsRefetching(false);
    }
  }, [pagination.pageIndex, pagination.pageSize, keySearch, customerFilter, effectiveBalanceView]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleReverse = (id: number) => {
    modals.openConfirmModal({
      title: "Xác nhận trả lại (Reverse) phiếu thu",
      children: (
        <Text size="sm">Bạn có chắc chắn muốn trả lại/đảo ngược phiếu thu này? Số nợ của các hóa đơn liên đới sẽ được khôi phục.</Text>
      ),
      labels: { confirm: "Reverse", cancel: "Hủy" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        const res = await arCashService.reverseReceipt(id, "Khách hàng hủy thanh toán");
        if (res.success) {
          NotificationExtension.Success("Đã hoàn đảo phiếu thu!");
          fetchData();
        } else {
          NotificationExtension.Fails(res.message);
        }
      }
    });
  };

  const columns = useMemo<MRT_ColumnDef<ARReceipt>[]>(
    () => [
      {
        accessorKey: "receiptNumber",
        header: "Số phiếu thu",
        Cell: ({ row }) => (
          <Text
            fw={700}
            style={{ cursor: "pointer", color: "#228be6" }}
            onClick={() => navigate(`/cong-no-phai-thu/phieu-thu/${row.original.receiptId}`)}
          >
            {row.original.receiptNumber}
          </Text>
        ),
      },
      {
        accessorKey: "receiptDate",
        header: "Ngày thu",
        size: 110,
        Cell: ({ row }) => formatDateTime(row.original.receiptDate, "DD/MM/YYYY")
      },
      {
        accessorKey: "customerId",
        header: "Khách hàng",
        Cell: ({ row }) => {
          const name = MOCK_CUSTOMERS.find(c => c.id === row.original.customerId)?.name || "Chưa xác định KH";
          return <Text size="sm" truncate>{name}</Text>;
        }
      },
      {
        accessorKey: "totalAmount",
        header: "Số tiền thu (VND)",
        size: 150,
        Cell: ({ row }) => (
          <Text style={{ textAlign: "right" }} fw={700}>
            {formatNumber(row.original.totalAmount)}
          </Text>
        )
      },
      {
        accessorKey: "appliedAmount",
        header: "Đã Apply",
        size: 125,
        Cell: ({ row }) => <Text ta="right">{formatNumber(row.original.appliedAmount || 0)}</Text>
      },
      {
        accessorKey: "unappliedAmount",
        header: "Chưa Apply",
        size: 125,
        Cell: ({ row }) => <Text ta="right" c={(row.original.unappliedAmount || 0) > 0 ? "orange" : undefined} fw={600}>{formatNumber(row.original.unappliedAmount || 0)}</Text>
      },
      {
        accessorKey: "unidentifiedAmount",
        header: "Unidentified",
        size: 120,
        Cell: ({ row }) => <Text ta="right">{formatNumber(row.original.unidentifiedAmount || 0)}</Text>
      },
      {
        accessorKey: "onAccountAmount",
        header: "On-account",
        size: 120,
        Cell: ({ row }) => <Text ta="right">{formatNumber(row.original.onAccountAmount || 0)}</Text>
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        size: 130,
        Cell: ({ row }) => (
          <Badge color={row.original.status === "APPLIED" ? "green" : "gray"}>
            {row.original.status}
          </Badge>
        )
      }
    ],
    [navigate]
  );

  return (
    <Box>
      {searchParams.get("action") === "apply" && (
        <Alert icon={<IconInfoCircle size={18} />} color="indigo" variant="light" mb="md" title="Chọn phiếu thu để Apply">
          Danh sách đã được lọc theo khách hàng của hóa đơn. Mở thao tác <b>Apply công nợ</b> tại phiếu thu phù hợp để tiếp tục.
        </Alert>
      )}
      <Flex
        ref={headerRef}
        justify="space-between"
        align="center"
        style={{ border: "1px solid #dee2e6", padding: "8px 12px", background: "#f8f9fa", borderRadius: 4 }}
        mb={16}
      >
        <Text size="sm" fw={700} c="dimmed">
          {effectiveBalanceView === "unapplied"
            ? "Phiếu thu còn tiền chưa phân bổ"
            : effectiveBalanceView === "on-account"
              ? "Phiếu thu đang On-account"
              : "Danh sách phiếu thu"}
        </Text>
        <Flex gap="sm">
          <ExportButton onClick={async () => { NotificationExtension.Success("Xuất excel phiếu thu!"); }} />
          <Button
            color="indigo"
            leftSection={<IconPlus size={16} />}
            onClick={() => navigate("/cong-no-phai-thu/phieu-thu/tao-moi")}
          >
            Tạo phiếu thu
          </Button>
        </Flex>
      </Flex>

      <Grid mb={16} align="end">
        <Grid.Col span={{ base: 12, md: 4 }}>
          <TextInput
            label="Tìm kiếm"
            placeholder="Số phiếu thu..."
            leftSection={<IconSearch size={16} />}
            {...formSearch.getInputProps("keySearch")}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Select
            label="Khách hàng"
            placeholder="Chọn khách hàng"
            data={MOCK_CUSTOMERS.map(c => ({ value: String(c.id), label: c.name }))}
            clearable
            {...formSearch.getInputProps("customerId")}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Button
            color="indigo"
            onClick={() => {
              setKeySearch(formSearch.values.keySearch);
              setCustomerFilter(formSearch.values.customerId);
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
                onClick={() => navigate(`/cong-no-phai-thu/phieu-thu/${row.original.receiptId}`)}
              >
                Chi tiết
              </Menu.Item>
              <Menu.Item
                leftSection={<IconPlus size={14} />}
                color="blue"
                onClick={() => {
                  const invoiceId = searchParams.get("invoiceId");
                  navigate(`/cong-no-phai-thu/phieu-thu/${row.original.receiptId}?tab=applications&action=apply${invoiceId ? `&invoiceId=${invoiceId}` : ""}`);
                }}
              >
                Apply công nợ
              </Menu.Item>
              {row.original.status !== "REVERSED" && (
                <Menu.Item
                  leftSection={<IconArrowBack size={14} />}
                  color="red"
                  onClick={() => handleReverse(row.original.receiptId)}
                >
                  Reverse phiếu thu
                </Menu.Item>
              )}
            </Menu.Dropdown>
          </Menu>
        )}
      />
    </Box>
  );
}

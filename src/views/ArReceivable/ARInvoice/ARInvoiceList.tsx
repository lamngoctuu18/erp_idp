import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MRT_ColumnDef, MRT_PaginationState } from "mantine-react-table";
import { ActionIcon, Box, Button, Flex, Grid, Text, TextInput, Select, Menu, Badge } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconEdit, IconPlus, IconSearch, IconTrash, IconEye, IconDotsVertical, IconCheck, IconBan } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { useNavigate, useSearchParams } from "react-router-dom";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import DataTable from "../../../_base/component/Core/DataTable";
import { formatDateTime } from "../../../common/FormatDate/FormatDate";
import { ARInvoice } from "../types/arTypes";
import { arBillingService } from "../services/arBillingService";
import { StatusBadge } from "../../../_base/component/Core/StatusBadge";
import { ExportButton } from "../../../_base/component/Core/ExportButton";
import { MOCK_CUSTOMERS } from "../mock/arMockData";
import { formatNumber } from "../../../common/FormatDate/FormatDate";

export default function ARInvoiceList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const headerRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<ARInvoice[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [height, setHeight] = useState(500);

  const [keySearch, setKeySearch] = useState("");
  const initialStatus = searchParams.get("status") || "";
  const initialCustomer = searchParams.get("customerId") || "";
  const [statusFilter, setStatusFilter] = useState<string | null>(initialStatus || null);
  const [customerFilter, setCustomerFilter] = useState<string | null>(initialCustomer || null);
  
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const formSearch = useForm({
    initialValues: { keySearch: "", status: initialStatus, customerId: initialCustomer }
  });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsRefetching(true);
    try {
      const res = await arBillingService.getList({
        skip: pagination.pageIndex * pagination.pageSize,
        take: pagination.pageSize,
        keySearch,
        status: statusFilter || undefined,
        customerId: customerFilter ? Number(customerFilter) : undefined
      });
      if (res?.success && res.data) {
        setData(res.data.items);
        setRowCount(res.data.totalItems);
      } else {
        setData([]);
        setRowCount(0);
      }
    } catch {
      NotificationExtension.Fails("Lỗi khi tải danh sách hóa đơn.");
    } finally {
      setIsLoading(false);
      setIsRefetching(false);
    }
  }, [pagination.pageIndex, pagination.pageSize, keySearch, statusFilter, customerFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const handleResize = () => {
      if (headerRef.current) {
        setHeight(Math.max(400, window.innerHeight - headerRef.current.clientHeight - 260));
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleExportExcel = async () => {
    NotificationExtension.Success("Xuất Excel danh sách hóa đơn thành công!");
  };

  const handleComplete = async (id: number) => {
    const res = await arBillingService.completeInvoice(id);
    if (res.success) {
      NotificationExtension.Success("Đã hoàn tất hóa đơn!");
      fetchData();
    } else {
      NotificationExtension.Fails(res.message);
    }
  };

  const handleVoid = (id: number) => {
    modals.openConfirmModal({
      title: "Xác nhận vô hiệu hóa đơn",
      children: (
        <Text size="sm">Bạn có chắc chắn muốn hủy/vô hiệu hóa đơn này? Hành động này không thể hoàn tác.</Text>
      ),
      labels: { confirm: "Vô hiệu", cancel: "Hủy" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        const res = await arBillingService.voidInvoice(id, "Hủy theo yêu cầu người dùng");
        if (res.success) {
          NotificationExtension.Success("Đã vô hiệu hóa đơn!");
          fetchData();
        } else {
          NotificationExtension.Fails(res.message);
        }
      }
    });
  };

  const columns = useMemo<MRT_ColumnDef<ARInvoice>[]>(
    () => [
      {
        accessorKey: "invoiceNumber",
        header: "Số hóa đơn",
        Cell: ({ row }) => (
          <Text
            fw={700}
            style={{ cursor: "pointer", color: "#228be6" }}
            onClick={() => navigate(`/cong-no-phai-thu/hoa-don/${row.original.invoiceId}`)}
          >
            {row.original.invoiceNumber}
          </Text>
        ),
      },
      {
        accessorKey: "invoiceDate",
        header: "Ngày HĐ",
        size: 110,
        Cell: ({ row }) => formatDateTime(row.original.invoiceDate, "DD/MM/YYYY")
      },
      {
        accessorKey: "dueDate",
        header: "Ngày đến hạn",
        size: 115,
        Cell: ({ row }) => row.original.dueDate ? formatDateTime(row.original.dueDate, "DD/MM/YYYY") : "-"
      },
      {
        accessorKey: "soldToCustomerId",
        header: "Khách hàng",
        Cell: ({ row }) => {
          const name = MOCK_CUSTOMERS.find(c => c.id === row.original.soldToCustomerId)?.name || "Khách hàng vãng lai";
          return <Text size="sm" truncate>{name}</Text>;
        }
      },
      {
        accessorKey: "totalAmount",
        header: "Tổng tiền (VND)",
        size: 150,
        Cell: ({ row }) => (
          <Text ta="right" fw={700}>
            {formatNumber(row.original.totalAmount)}
          </Text>
        )
      },
      {
        accessorKey: "totalAmountPaid",
        header: "Đã thanh toán",
        size: 135,
        Cell: ({ row }) => <Text ta="right">{formatNumber(row.original.totalAmountPaid || 0)}</Text>
      },
      {
        id: "reducedAmount",
        header: "Đã giảm trừ",
        size: 130,
        Cell: ({ row }) => {
          const reduced = Math.max(
            0,
            (row.original.totalAmount || 0)
              - (row.original.totalAmountPaid || 0)
              - (row.original.totalAmountRemaining ?? row.original.totalAmount ?? 0)
          );
          return <Text ta="right">{formatNumber(reduced)}</Text>;
        }
      },
      {
        accessorKey: "totalAmountRemaining",
        header: "Còn phải thu",
        size: 135,
        Cell: ({ row }) => (
          <Text ta="right" fw={700} c={(row.original.totalAmountRemaining || 0) > 0 ? "indigo" : "teal"}>
            {formatNumber(row.original.totalAmountRemaining ?? row.original.totalAmount ?? 0)}
          </Text>
        )
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        size: 130,
        Cell: ({ row }) => (
          <StatusBadge statusType="document" value={row.original.status || "DRAFT"} />
        )
      },
      {
        accessorKey: "accountingStatus",
        header: "Hạch toán",
        size: 130,
        Cell: ({ row }) => (
          <Badge color={row.original.accountingStatus === "FINAL" ? "teal" : "gray"} variant="light">
            {row.original.accountingStatus === "FINAL" ? "Đã hạch toán" : "Chưa hạch toán"}
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
        <Text size="sm" fw={700} c="dimmed">Danh sách hóa đơn phải thu</Text>
        <Flex gap="sm">
          <ExportButton onClick={handleExportExcel} />
          <Button
            color="indigo"
            leftSection={<IconPlus size={16} />}
            onClick={() => navigate("/cong-no-phai-thu/hoa-don/tao-moi")}
          >
            Tạo hóa đơn
          </Button>
        </Flex>
      </Flex>

      <Grid mb={16} align="end">
        <Grid.Col span={{ base: 12, md: 3 }}>
          <TextInput
            label="Tìm kiếm"
            placeholder="Số hóa đơn..."
            leftSection={<IconSearch size={16} />}
            {...formSearch.getInputProps("keySearch")}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Select
            label="Khách hàng"
            placeholder="Chọn khách hàng"
            data={MOCK_CUSTOMERS.map(c => ({ value: String(c.id), label: c.name }))}
            clearable
            {...formSearch.getInputProps("customerId")}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Select
            label="Trạng thái"
            placeholder="Chọn trạng thái"
            data={[
              { value: "DRAFT", label: "Bản nháp" },
              { value: "OPEN", label: "Đang mở" },
              { value: "COMPLETE", label: "Hoàn tất" },
              { value: "PAID", label: "Đã thanh toán" },
              { value: "OVERDUE", label: "Quá hạn" },
              { value: "VOIDED", label: "Vô hiệu" }
            ]}
            clearable
            {...formSearch.getInputProps("status")}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 2 }}>
          <Button
            color="indigo"
            onClick={() => {
              setKeySearch(formSearch.values.keySearch);
              setStatusFilter(formSearch.values.status);
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
                onClick={() => navigate(`/cong-no-phai-thu/hoa-don/${row.original.invoiceId}`)}
              >
                Chi tiết
              </Menu.Item>
              {row.original.status === "DRAFT" && (
                <>
                  <Menu.Item
                    leftSection={<IconEdit size={14} />}
                    onClick={() => navigate(`/cong-no-phai-thu/hoa-don/${row.original.invoiceId}/chinh-sua`)}
                  >
                    Chỉnh sửa
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<IconCheck size={14} />}
                    color="teal"
                    onClick={() => handleComplete(row.original.invoiceId)}
                  >
                    Hoàn tất HĐ
                  </Menu.Item>
                </>
              )}
              {["OPEN", "COMPLETE", "PARTIALLY_PAID"].includes(row.original.status) && (
                <>
                  <Menu.Item
                    color="blue"
                    onClick={() => navigate(`/cong-no-phai-thu/hoa-don/${row.original.invoiceId}?tab=thu-tien&action=apply`)}
                  >
                    Apply tiền
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => navigate(`/cong-no-phai-thu/credit-memo/tao-moi?invoiceId=${row.original.invoiceId}`)}
                  >
                    Tạo Credit Memo
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => navigate(`/cong-no-phai-thu/dieu-chinh/tao-moi?invoiceId=${row.original.invoiceId}`)}
                  >
                    Tạo Adjustment
                  </Menu.Item>
                </>
              )}
              {["OPEN", "COMPLETE", "PARTIALLY_PAID"].includes(row.original.status) && (
                <Menu.Item
                  leftSection={<IconBan size={14} />}
                  color="red"
                  onClick={() => handleVoid(row.original.invoiceId)}
                >
                  Vô hiệu HĐ
                </Menu.Item>
              )}
              {row.original.status === "DRAFT" && (
                <Menu.Item
                  leftSection={<IconTrash size={14} />}
                  color="red"
                  onClick={() => navigate(`/cong-no-phai-thu/hoa-don/${row.original.invoiceId}/xoa`)}
                >
                  Xóa hóa đơn
                </Menu.Item>
              )}
            </Menu.Dropdown>
          </Menu>
        )}
      />
    </Box>
  );
}

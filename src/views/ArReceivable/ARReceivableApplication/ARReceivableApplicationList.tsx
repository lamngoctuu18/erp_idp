import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MRT_ColumnDef, MRT_PaginationState } from "mantine-react-table";
import { ActionIcon, Box, Button, Flex, Grid, Text, TextInput, Select, Menu, Badge } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconEye, IconPlus, IconSearch, IconDotsVertical, IconTrash } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import DataTable from "../../../_base/component/Core/DataTable";
import { formatDateTime } from "../../../common/FormatDate/FormatDate";
import { ARMockStorage } from "../mock/arMockStorage";
import { MOCK_CUSTOMERS } from "../mock/arMockData";
import { formatNumber } from "../../../common/FormatDate/FormatDate";
import { ExportButton } from "../../../_base/component/Core/ExportButton";

export default function ARReceivableApplicationList() {
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
      const allApps = ARMockStorage.getReceivableApplications();
      // filter
      const filtered = allApps.filter(app => {
        if (!keySearch) return true;
        const receipt = ARMockStorage.getReceipts().find(r => r.receiptId === app.receiptId);
        const invoice = ARMockStorage.getInvoices().find(i => i.invoiceId === app.appliedInvoiceId);
        return (
          receipt?.receiptNumber.toLowerCase().includes(keySearch.toLowerCase()) ||
          invoice?.invoiceNumber.toLowerCase().includes(keySearch.toLowerCase())
        );
      });

      setData(filtered.slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize));
      setRowCount(filtered.length);
    } catch {
      NotificationExtension.Fails("Lỗi khi tải danh sách phân bổ.");
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
        accessorKey: "applicationId",
        header: "Mã phân bổ",
        Cell: ({ row }) => (
          <Text fw={700}>
            APP-{row.original.applicationId.toString().padStart(4, "0")}
          </Text>
        )
      },
      {
        accessorKey: "receiptId",
        header: "Số phiếu thu",
        Cell: ({ row }) => {
          const receipt = ARMockStorage.getReceipts().find(r => r.receiptId === row.original.receiptId);
          return (
            <Text fw={700} c="blue" style={{ cursor: "pointer" }} onClick={() => navigate(`/cong-no-phai-thu/phieu-thu/${row.original.receiptId}`)}>
              {receipt?.receiptNumber || `ID: ${row.original.receiptId}`}
            </Text>
          );
        }
      },
      {
        accessorKey: "appliedInvoiceId",
        header: "Số hóa đơn",
        Cell: ({ row }) => {
          const invoice = ARMockStorage.getInvoices().find(i => i.invoiceId === row.original.appliedInvoiceId);
          return (
            <Text fw={700} c="indigo" style={{ cursor: "pointer" }} onClick={() => navigate(`/cong-no-phai-thu/hoa-don/${row.original.appliedInvoiceId}`)}>
              {invoice?.invoiceNumber || `ID: ${row.original.appliedInvoiceId}`}
            </Text>
          );
        }
      },
      {
        accessorKey: "amountApplied",
        header: "Số tiền cấn trừ (VND)",
        size: 150,
        Cell: ({ row }) => (
          <Text ta="right" fw={700} c="teal">
            {formatNumber(row.original.amountApplied)}
          </Text>
        )
      },
      {
        accessorKey: "applyDate",
        header: "Ngày áp dụng",
        Cell: ({ row }) => formatDateTime(row.original.applyDate, "DD/MM/YYYY")
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
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
      <Flex
        ref={headerRef}
        justify="space-between"
        align="center"
        style={{ border: "1px solid #dee2e6", padding: "8px 12px", background: "#f8f9fa", borderRadius: 4 }}
        mb={16}
      >
        <Text size="sm" fw={700} c="dimmed">Danh sách phân bổ cấn trừ công nợ</Text>
        <Flex gap="sm">
          <ExportButton onClick={async () => { NotificationExtension.Success("Xuất excel cấn trừ thành công!"); }} />
          <Button
            color="indigo"
            leftSection={<IconPlus size={16} />}
            onClick={() => navigate("/cong-no-phai-thu/phieu-thu")}
          >
            Tạo phân bổ mới
          </Button>
        </Flex>
      </Flex>

      <Grid mb={16} align="end">
        <Grid.Col span={{ base: 12, md: 4 }}>
          <TextInput
            label="Tìm kiếm nhanh"
            placeholder="Số hóa đơn hoặc số phiếu thu..."
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
                onClick={() => navigate(`/cong-no-phai-thu/apply-cong-no/${row.original.receiptId}`)}
              >
                Chi tiết cấn trừ
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
      />
    </Box>
  );
}

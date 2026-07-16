import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MRT_ColumnDef, MRT_PaginationState } from "mantine-react-table";
import { Box, Button, Flex, Text } from "@mantine/core";
import { IconReload } from "@tabler/icons-react";
import BreadCrumb from "../../../_base/component/_layout/_breadcrumb";
import DataTable from "../../../_base/component/Core/DataTable";
import { TransactionAccountModel } from "../../../model/InventoryModel";
import { getTransactionAccounts } from "../../../api/inventory/api";
import { formatDateTime } from "../../../common/FormatDate/FormatDate";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";

const TransactionAccountList = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<TransactionAccountModel[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [height, setHeight] = useState(600);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const fetchAccounts = useCallback(async () => {
    setIsLoading(true);
    setIsRefetching(true);
    try {
      const res = await getTransactionAccounts();
      if (res?.success && res.data) {
        const items = res.data;
        const skip = pagination.pageIndex * pagination.pageSize;
        const pageItems = items.slice(skip, skip + pagination.pageSize);
        setData(pageItems);
        setRowCount(items.length);
      } else {
        setData([]);
        setRowCount(0);
      }
    } catch {
      NotificationExtension.Fails("Không thể tải danh sách định khoản.");
      setData([]);
      setRowCount(0);
    } finally {
      setIsLoading(false);
      setIsRefetching(false);
    }
  }, [pagination.pageIndex, pagination.pageSize]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  useEffect(() => {
    const handleResize = () => {
      if (headerRef.current) {
        setHeight(window.innerHeight - headerRef.current.clientHeight - 140);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const columns = useMemo<MRT_ColumnDef<TransactionAccountModel>[]>(
    () => [
      {
        accessorKey: "transactionId",
        header: "Mã giao dịch",
        size: 150,
        Cell: ({ row }: any) => <Text style={{ fontFamily: "monospace" }}>{row.original.transactionId}</Text>
      },
      {
        accessorKey: "transactionDate",
        header: "Ngày định khoản",
        size: 150,
        Cell: ({ row }: any) => formatDateTime(row.original.transactionDate, "DD/MM/YYYY HH:mm")
      },
      {
        accessorKey: "itemNumber",
        header: "Mã vật tư",
        size: 130
      },
      {
        accessorKey: "accountNumber",
        header: "Số tài khoản (COA)",
        size: 150,
        Cell: ({ row }: any) => (
          <Text style={{ fontWeight: 600, color: "#1a56a0", fontFamily: "monospace" }}>
            {row.original.accountNumber}
          </Text>
        )
      },
      {
        accessorKey: "accountDescription",
        header: "Tên tài khoản",
        size: 250
      },
      {
        accessorKey: "debitValue",
        header: "Nợ (Debit)",
        size: 140,
        Cell: ({ row }: any) => {
          const val = row.original.baseTransactionValue;
          return val > 0 ? (
            <Text style={{ fontWeight: 700, color: "green", fontFamily: "monospace" }}>
              {val.toLocaleString()} đ
            </Text>
          ) : "-";
        }
      },
      {
        accessorKey: "creditValue",
        header: "Có (Credit)",
        size: 140,
        Cell: ({ row }: any) => {
          const val = row.original.baseTransactionValue;
          return val < 0 ? (
            <Text style={{ fontWeight: 700, color: "red", fontFamily: "monospace" }}>
              {Math.abs(val).toLocaleString()} đ
            </Text>
          ) : "-";
        }
      },
      {
        accessorKey: "primaryQuantity",
        header: "Số lượng (UOM chính)",
        size: 150,
        Cell: ({ row }: any) => (
          <Text style={{ fontFamily: "monospace" }}>
            {row.original.primaryQuantity.toLocaleString()}
          </Text>
        )
      }
    ],
    []
  );

  return (
    <Box>
      <Flex
        ref={headerRef}
        justify="space-between"
        align="center"
        style={{ border: "1px solid #dee2e6", padding: "5px 10px", backgroundColor: "#f8f9fa", borderRadius: "4px" }}
        mb={16}
      >
        <BreadCrumb />
        <Button
          variant="outline"
          color="blue"
          leftSection={<IconReload size={14} />}
          onClick={fetchAccounts}
        >
          Làm mới
        </Button>
      </Flex>

      <DataTable
        columns={columns}
        data={data}
        rowCount={rowCount}
        pagination={pagination}
        onPaginationChange={setPagination}
        isLoading={isLoading}
        isRefetching={isRefetching}
        height={height}
      />
    </Box>
  );
};

export default TransactionAccountList;

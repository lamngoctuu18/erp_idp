import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MRT_ColumnDef, MRT_PaginationState } from "mantine-react-table";
import { ActionIcon, Box, Button, Flex, Grid, TextInput, Tooltip, Title, Badge } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconEdit, IconPlus, IconSearch, IconTrash, IconEye } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import DataTable from "../../_base/component/Core/DataTable";
import { apInvoiceBatchService } from "../../api/apVendor/apInvoiceMasterMockService";
import { ApInvoiceBatch } from "../../model/ApInvoiceMasterModel";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

export default function ApInvoiceBatchList() {
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<ApInvoiceBatch[]>([]);
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
      const res = await apInvoiceBatchService.getList({
        skip: pagination.pageIndex * pagination.pageSize,
        take: pagination.pageSize,
        keySearch
      });
      if (res?.success && res.data) {
        setData(res.data.items);
        setRowCount(res.data.totalItems);
      } else {
        setData([]);
        setRowCount(0);
      }
    } catch {
      NotificationExtension.Fails("Lỗi khi tải danh sách lô hóa đơn.");
    } finally {
      setIsLoading(false);
      setIsRefetching(false);
    }
  }, [pagination.pageIndex, pagination.pageSize, keySearch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const handleResize = () => {
      if (headerRef.current) {
        setHeight(Math.max(400, window.innerHeight - headerRef.current.clientHeight - 295));
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSearch = () => {
    setKeySearch(formSearch.values.keySearch);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const columns = useMemo<MRT_ColumnDef<ApInvoiceBatch>[]>(
    () => [
      {
        accessorKey: "batchId",
        header: "Mã lô (Batch ID)",
        size: 140,
        Cell: ({ cell }) => cell.getValue() as number
      },
      {
        accessorKey: "batchName",
        header: "Tên lô hóa đơn",
        size: 260,
        Cell: ({ row }) => (
          <span
            style={{ cursor: "pointer", color: "#228be6", fontWeight: 600 }}
            onClick={() => navigate(`/ApInvoiceBatch/Detail/${row.original.batchId}`)}
          >
            {row.original.batchName}
          </span>
        )
      },
      {
        accessorKey: "estimatedAmount",
        header: "Số tiền dự kiến",
        size: 160,
        Cell: ({ cell }) => (cell.getValue() as number)?.toLocaleString("vi-VN") + "đ"
      },
      {
        accessorKey: "actualAmount",
        header: "Số tiền thực tế",
        size: 160,
        Cell: ({ cell }) => (
          <strong style={{ color: "#2b8a3e" }}>
            {(cell.getValue() as number)?.toLocaleString("vi-VN")} đ
          </strong>
        )
      },
      {
        accessorKey: "invoiceCount",
        header: "SL dự kiến",
        size: 130,
      },
      {
        accessorKey: "actualInvoiceCount",
        header: "SL thực tế",
        size: 130,
      },
      {
        accessorKey: "batchStatus",
        header: "Trạng thái",
        size: 130,
        Cell: ({ cell }) => {
          const val = cell.getValue() as string;
          let color = "orange";
          if (val === "APPROVED") color = "green";
          if (val === "CLOSED") color = "red";
          return <Badge color={color}>{val}</Badge>;
        }
      }
    ],
    [navigate]
  );

  return (
    <Box>
      <div style={{ border: "1px solid #dee2e6", padding: "10px", backgroundColor: "#fff" }} ref={headerRef}>
        <Flex direction="column" gap="xs" mb={10}>
          <BreadCrumb />
          <Title order={4}>Lô hóa đơn mua hàng đầu vào</Title>
        </Flex>

        <form onSubmit={formSearch.onSubmit(handleSearch)}>
          <Grid align="flex-end">
            <Grid.Col span={{ base: 12, md: 8 }}>
              <TextInput
                placeholder="Tìm tên lô hóa đơn..."
                label="Từ khóa tìm kiếm"
                leftSection={<IconSearch size={18} color="#15aabf" />}
                {...formSearch.getInputProps("keySearch")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Flex gap="sm" justify="flex-end">
                <Button color="blue" type="submit">
                  Tìm kiếm
                </Button>
                <Button
                  leftSection={<IconPlus size={16} />}
                  color="blue"
                  variant="outline"
                  onClick={() => navigate("/ApInvoiceBatch/Create")}
                >
                  Thêm lô hóa đơn mới
                </Button>
              </Flex>
            </Grid.Col>
          </Grid>
        </form>
      </div>

      <Box mt={10}>
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
            <Flex gap="xs" justify="center">
              <Tooltip label="Xem chi tiết">
                <ActionIcon
                  variant="light"
                  color="blue"
                  onClick={() => navigate(`/ApInvoiceBatch/Detail/${row.original.batchId}`)}
                >
                  <IconEye size={18} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Chỉnh sửa">
                <ActionIcon
                  variant="light"
                  color="yellow"
                  onClick={() => navigate(`/ApInvoiceBatch/Edit/${row.original.batchId}`)}
                >
                  <IconEdit size={18} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Xóa">
                <ActionIcon
                  variant="light"
                  color="red"
                  onClick={() => navigate(`/ApInvoiceBatch/Delete/${row.original.batchId}`)}
                >
                  <IconTrash size={18} />
                </ActionIcon>
              </Tooltip>
            </Flex>
          )}
        />
      </Box>
    </Box>
  );
}

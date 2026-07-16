import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MRT_ColumnDef, MRT_PaginationState } from "mantine-react-table";
import { ActionIcon, Box, Button, Flex, Grid, TextInput, Select, Tooltip, Title, Badge } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconEdit, IconPlus, IconSearch, IconTrash, IconEye } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import DataTable from "../../_base/component/Core/DataTable";
import { apPaymentScheduleService } from "../../api/apVendor/apPaymentMockService";
import { ApPaymentSchedule } from "../../model/ApPaymentModel";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

export default function ApPaymentScheduleList() {
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<ApPaymentSchedule[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [height, setHeight] = useState(500);

  const [invoiceFilter, setInvoiceFilter] = useState<number | null>(null);

  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const formSearch = useForm({
    initialValues: { invoiceId: "" }
  });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsRefetching(true);
    try {
      const res = await apPaymentScheduleService.getList({
        skip: pagination.pageIndex * pagination.pageSize,
        take: pagination.pageSize,
        invoiceId: invoiceFilter
      });
      if (res?.success && res.data) {
        setData(res.data.items);
        setRowCount(res.data.totalItems);
      } else {
        setData([]);
        setRowCount(0);
      }
    } catch {
      NotificationExtension.Fails("Lỗi khi tải danh sách lịch thanh toán nợ.");
    } finally {
      setIsLoading(false);
      setIsRefetching(false);
    }
  }, [pagination.pageIndex, pagination.pageSize, invoiceFilter]);

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
    setInvoiceFilter(formSearch.values.invoiceId ? Number(formSearch.values.invoiceId) : null);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const columns = useMemo<MRT_ColumnDef<ApPaymentSchedule>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Mã lịch thanh toán",
        size: 140,
        Cell: ({ cell }) => (
          <span
            style={{ cursor: "pointer", color: "#228be6", fontWeight: 600 }}
            onClick={() => navigate(`/ApPaymentSchedule/Detail/${cell.getValue() as number}`)}
          >
            {cell.getValue() as number}
          </span>
        )
      },
      {
        accessorKey: "invoiceId",
        header: "Mã hóa đơn (Invoice ID)",
        size: 180,
        Cell: ({ cell }) => <b>INV-{cell.getValue() as number}</b>
      },
      {
        accessorKey: "dueDate",
        header: "Hạn thanh toán",
        size: 150,
        Cell: ({ cell }) => {
          const val = cell.getValue() as string;
          return val ? new Date(val).toLocaleDateString("vi-VN") : "-";
        }
      },
      {
        accessorKey: "grossAmount",
        header: "Tổng nợ gốc",
        size: 160,
        Cell: ({ cell }) => (
          <strong>{(cell.getValue() as number)?.toLocaleString("vi-VN")} đ</strong>
        )
      },
      {
        accessorKey: "amountRemaining",
        header: "Dư nợ còn lại",
        size: 160,
        Cell: ({ cell }) => {
          const val = cell.getValue() as number;
          return (
            <strong style={{ color: val > 0 ? "red" : "green" }}>
              {val?.toLocaleString("vi-VN")} đ
            </strong>
          );
        }
      },
      {
        accessorKey: "holdFlag",
        header: "Chặn thanh toán",
        size: 140,
        Cell: ({ cell }) => (
          <Badge variant="light" color={cell.getValue() === "Y" ? "red" : "gray"}>
            {cell.getValue() === "Y" ? "ĐANG CHẶN" : "Bình thường"}
          </Badge>
        )
      },
      {
        accessorKey: "paymentStatus",
        header: "Tình trạng",
        size: 150,
        Cell: ({ cell }) => {
          const val = cell.getValue() as string;
          let color = "red";
          if (val === "PAID") color = "green";
          if (val === "PARTIALLY_PAID") color = "yellow";
          return <Badge color={color} variant="light">{val}</Badge>;
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
          <Title order={4}>Lịch thanh toán công nợ dự kiến</Title>
        </Flex>

        <form onSubmit={formSearch.onSubmit(handleSearch)}>
          <Grid align="flex-end">
            <Grid.Col span={{ base: 12, md: 8 }}>
              <TextInput
                placeholder="Tìm mã hóa đơn liên kết..."
                label="Lọc theo Mã hóa đơn (Invoice ID)"
                leftSection={<IconSearch size={18} color="#15aabf" />}
                {...formSearch.getInputProps("invoiceId")}
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
                  onClick={() => navigate("/ApPaymentSchedule/Create")}
                >
                  Thêm lịch thanh toán
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
                  onClick={() => navigate(`/ApPaymentSchedule/Detail/${row.original.id}`)}
                >
                  <IconEye size={18} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Chỉnh sửa">
                <ActionIcon
                  variant="light"
                  color="yellow"
                  onClick={() => navigate(`/ApPaymentSchedule/Edit/${row.original.id}`)}
                >
                  <IconEdit size={18} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Xóa">
                <ActionIcon
                  variant="light"
                  color="red"
                  onClick={() => navigate(`/ApPaymentSchedule/Delete/${row.original.id}`)}
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

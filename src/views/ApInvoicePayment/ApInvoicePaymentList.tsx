import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MRT_ColumnDef, MRT_PaginationState } from "mantine-react-table";
import { ActionIcon, Box, Button, Flex, Grid, TextInput, Select, Tooltip, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconEdit, IconPlus, IconSearch, IconTrash, IconEye } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import DataTable from "../../_base/component/Core/DataTable";
import { apInvoicePaymentService, apPaymentService } from "../../api/apVendor/apPaymentMockService";
import { ApInvoicePayment, ApPayment } from "../../model/ApPaymentModel";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

export default function ApInvoicePaymentList() {
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<ApInvoicePayment[]>([]);
  const [payments, setPayments] = useState<ApPayment[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [height, setHeight] = useState(500);

  const [paymentFilter, setPaymentFilter] = useState<number | null>(null);
  const [invoiceFilter, setInvoiceFilter] = useState<number | null>(null);

  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const formSearch = useForm({
    initialValues: { paymentId: "", invoiceId: "" }
  });

  const loadPayments = async () => {
    try {
      const list = await apPaymentService.getAll();
      setPayments(list);
    } catch {
      console.error("Không tải được danh sách phiếu chi.");
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsRefetching(true);
    try {
      const res = await apInvoicePaymentService.getList({
        skip: pagination.pageIndex * pagination.pageSize,
        take: pagination.pageSize,
        paymentId: paymentFilter,
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
      NotificationExtension.Fails("Lỗi khi tải danh sách phân bổ thanh toán.");
    } finally {
      setIsLoading(false);
      setIsRefetching(false);
    }
  }, [pagination.pageIndex, pagination.pageSize, paymentFilter, invoiceFilter]);

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
    setPaymentFilter(formSearch.values.paymentId ? Number(formSearch.values.paymentId) : null);
    setInvoiceFilter(formSearch.values.invoiceId ? Number(formSearch.values.invoiceId) : null);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const columns = useMemo<MRT_ColumnDef<ApInvoicePayment>[]>(
    () => [
      {
        accessorKey: "invoicePaymentId",
        header: "Mã phân bổ (ID)",
        size: 140,
        Cell: ({ cell }) => (
          <span
            style={{ cursor: "pointer", color: "#228be6", fontWeight: 600 }}
            onClick={() => navigate(`/ApInvoicePayment/Detail/${cell.getValue() as number}`)}
          >
            {cell.getValue() as number}
          </span>
        )
      },
      {
        accessorKey: "paymentNumber",
        header: "Số phiếu chi (Check Number)",
        size: 200,
        Cell: ({ row }) => (
          <span
            style={{ cursor: "pointer", color: "#228be6", fontWeight: 700 }}
            onClick={() => navigate(`/ApPayment/Detail/${row.original.paymentId}`)}
          >
            {row.original.paymentNumber || `Payment ID: ${row.original.paymentId}`}
          </span>
        )
      },
      {
        accessorKey: "invoiceNum",
        header: "Số hóa đơn đối trừ",
        size: 180,
        Cell: ({ cell }) => <b>{cell.getValue() as string}</b>
      },
      {
        accessorKey: "amount",
        header: "Số tiền phân bổ chi",
        size: 160,
        Cell: ({ row }) => (
          <strong style={{ color: "#2b8a3e" }}>
            {row.original.amount?.toLocaleString("vi-VN")} {row.original.currencyCode}
          </strong>
        )
      },
      {
        accessorKey: "accountingDate",
        header: "Ngày hạch toán",
        size: 160,
        Cell: ({ cell }) => {
          const val = cell.getValue() as string;
          return val ? new Date(val).toLocaleDateString("vi-VN") : "-";
        }
      },
      {
        accessorKey: "periodName",
        header: "Kỳ kế toán",
        size: 130,
      }
    ],
    [navigate]
  );

  return (
    <Box>
      <div style={{ border: "1px solid #dee2e6", padding: "10px", backgroundColor: "#fff" }} ref={headerRef}>
        <Flex direction="column" gap="xs" mb={10}>
          <BreadCrumb />
          <Title order={4}>Phân bổ thanh toán cho hóa đơn</Title>
        </Flex>

        <form onSubmit={formSearch.onSubmit(handleSearch)}>
          <Grid align="flex-end">
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select
                label="Lọc theo Số phiếu chi"
                placeholder="Tất cả phiếu chi"
                clearable
                data={payments.map((p) => ({ value: String(p.paymentId), label: String(p.paymentNumber) }))}
                {...formSearch.getInputProps("paymentId")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                placeholder="Tìm mã hóa đơn..."
                label="Mã hóa đơn (Invoice ID)"
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
                  onClick={() => navigate("/ApInvoicePayment/Create")}
                >
                  Thêm phân bổ mới
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
                  onClick={() => navigate(`/ApInvoicePayment/Detail/${row.original.invoicePaymentId}`)}
                >
                  <IconEye size={18} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Chỉnh sửa">
                <ActionIcon
                  variant="light"
                  color="yellow"
                  onClick={() => navigate(`/ApInvoicePayment/Edit/${row.original.invoicePaymentId}`)}
                >
                  <IconEdit size={18} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Xóa">
                <ActionIcon
                  variant="light"
                  color="red"
                  onClick={() => navigate(`/ApInvoicePayment/Delete/${row.original.invoicePaymentId}`)}
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

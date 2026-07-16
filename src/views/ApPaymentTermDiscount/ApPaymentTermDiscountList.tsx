import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MRT_ColumnDef, MRT_PaginationState } from "mantine-react-table";
import { ActionIcon, Box, Button, Flex, Grid, Select, Tooltip, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconEdit, IconPlus, IconTrash, IconEye } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import DataTable from "../../_base/component/Core/DataTable";
import { apPaymentTermDiscountService, apPaymentTermService } from "../../api/apVendor/apPaymentMockService";
import { ApPaymentTermDiscount, ApPaymentTerm } from "../../model/ApPaymentModel";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

export default function ApPaymentTermDiscountList() {
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<ApPaymentTermDiscount[]>([]);
  const [terms, setTerms] = useState<ApPaymentTerm[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [height, setHeight] = useState(500);

  const [termFilter, setTermFilter] = useState<number | null>(null);

  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const formSearch = useForm({
    initialValues: { paymentTermId: "" }
  });

  const loadTerms = async () => {
    try {
      const list = await apPaymentTermService.getAll();
      setTerms(list);
    } catch {
      console.error("Không tải được danh sách điều khoản.");
    }
  };

  useEffect(() => {
    loadTerms();
  }, []);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsRefetching(true);
    try {
      const res = await apPaymentTermDiscountService.getList({
        skip: pagination.pageIndex * pagination.pageSize,
        take: pagination.pageSize,
        paymentTermId: termFilter
      });
      if (res?.success && res.data) {
        setData(res.data.items);
        setRowCount(res.data.totalItems);
      } else {
        setData([]);
        setRowCount(0);
      }
    } catch {
      NotificationExtension.Fails("Lỗi khi tải danh sách chiết khấu điều khoản.");
    } finally {
      setIsLoading(false);
      setIsRefetching(false);
    }
  }, [pagination.pageIndex, pagination.pageSize, termFilter]);

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
    setTermFilter(formSearch.values.paymentTermId ? Number(formSearch.values.paymentTermId) : null);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const columns = useMemo<MRT_ColumnDef<ApPaymentTermDiscount>[]>(
    () => [
      {
        accessorKey: "discountId",
        header: "Mã chiết khấu (ID)",
        size: 140,
        Cell: ({ row }) => (
          <span
            style={{ cursor: "pointer", color: "#228be6", fontWeight: 600 }}
            onClick={() => navigate(`/ApPaymentTermDiscount/Detail/${row.original.discountId}`)}
          >
            {row.original.discountId}
          </span>
        )
      },
      {
        accessorKey: "termName",
        header: "Thuộc Điều khoản thanh toán",
        size: 260,
      },
      {
        accessorKey: "discountLevel",
        header: "Cấp bậc chiết khấu (Level)",
        size: 180,
      },
      {
        accessorKey: "discountPercent",
        header: "Tỷ lệ chiết khấu (%)",
        size: 180,
        Cell: ({ cell }) => <b style={{ color: "#2b8a3e" }}>{cell.getValue() as number || 0}%</b>
      },
      {
        accessorKey: "days",
        header: "Số ngày thanh toán sớm yêu cầu",
        size: 200,
        Cell: ({ cell }) => `${cell.getValue() as number || 0} ngày`
      }
    ],
    [navigate]
  );

  return (
    <Box>
      <div style={{ border: "1px solid #dee2e6", padding: "10px", backgroundColor: "#fff" }} ref={headerRef}>
        <Flex direction="column" gap="xs" mb={10}>
          <BreadCrumb />
          <Title order={4}>Danh mục Chiết khấu thanh toán sớm</Title>
        </Flex>

        <form onSubmit={formSearch.onSubmit(handleSearch)}>
          <Grid align="flex-end">
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Select
                label="Lọc theo Điều khoản thanh toán"
                placeholder="Tất cả điều khoản"
                clearable
                data={terms.map((t) => ({ value: String(t.paymentTermId), label: t.termName }))}
                {...formSearch.getInputProps("paymentTermId")}
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
                  onClick={() => navigate("/ApPaymentTermDiscount/Create")}
                >
                  Thêm chiết khấu
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
                  onClick={() => navigate(`/ApPaymentTermDiscount/Detail/${row.original.discountId}`)}
                >
                  <IconEye size={18} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Chỉnh sửa">
                <ActionIcon
                  variant="light"
                  color="yellow"
                  onClick={() => navigate(`/ApPaymentTermDiscount/Edit/${row.original.discountId}`)}
                >
                  <IconEdit size={18} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Xóa">
                <ActionIcon
                  variant="light"
                  color="red"
                  onClick={() => navigate(`/ApPaymentTermDiscount/Delete/${row.original.discountId}`)}
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

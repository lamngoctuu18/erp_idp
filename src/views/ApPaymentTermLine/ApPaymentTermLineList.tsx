import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MRT_ColumnDef, MRT_PaginationState } from "mantine-react-table";
import { ActionIcon, Box, Button, Flex, Grid, Select, Tooltip, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconEdit, IconPlus, IconTrash, IconEye } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import DataTable from "../../_base/component/Core/DataTable";
import { apPaymentTermLineService, apPaymentTermService } from "../../api/apVendor/apPaymentMockService";
import { ApPaymentTermLine, ApPaymentTerm } from "../../model/ApPaymentModel";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

export default function ApPaymentTermLineList() {
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<ApPaymentTermLine[]>([]);
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
      const res = await apPaymentTermLineService.getList({
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
      NotificationExtension.Fails("Lỗi khi tải danh sách dòng điều khoản.");
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

  const columns = useMemo<MRT_ColumnDef<ApPaymentTermLine>[]>(
    () => [
      {
        accessorKey: "termLineId",
        header: "Mã dòng (ID)",
        size: 140,
        Cell: ({ row }) => (
          <span
            style={{ cursor: "pointer", color: "#228be6", fontWeight: 600 }}
            onClick={() => navigate(`/ApPaymentTermLine/Detail/${row.original.termLineId}`)}
          >
            {row.original.termLineId}
          </span>
        )
      },
      {
        accessorKey: "termName",
        header: "Thuộc Điều khoản thanh toán",
        size: 260,
      },
      {
        accessorKey: "lineNum",
        header: "Số thứ tự dòng (Line Num)",
        size: 180,
      },
      {
        accessorKey: "duePercent",
        header: "Tỷ lệ nợ đến hạn (%)",
        size: 180,
        Cell: ({ cell }) => <b>{cell.getValue() as number || 0}%</b>
      },
      {
        accessorKey: "days",
        header: "Số ngày gia hạn nợ",
        size: 180,
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
          <Title order={4}>Danh sách Dòng chi tiết điều khoản thanh toán</Title>
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
                  onClick={() => navigate("/ApPaymentTermLine/Create")}
                >
                  Thêm dòng chi tiết
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
                  onClick={() => navigate(`/ApPaymentTermLine/Detail/${row.original.termLineId}`)}
                >
                  <IconEye size={18} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Chỉnh sửa">
                <ActionIcon
                  variant="light"
                  color="yellow"
                  onClick={() => navigate(`/ApPaymentTermLine/Edit/${row.original.termLineId}`)}
                >
                  <IconEdit size={18} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Xóa">
                <ActionIcon
                  variant="light"
                  color="red"
                  onClick={() => navigate(`/ApPaymentTermLine/Delete/${row.original.termLineId}`)}
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

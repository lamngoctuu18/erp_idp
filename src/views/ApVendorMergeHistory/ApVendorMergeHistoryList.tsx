import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MRT_ColumnDef, MRT_PaginationState } from "mantine-react-table";
import { ActionIcon, Box, Button, Flex, Grid, Select, Tooltip, Title, Badge } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconEdit, IconPlus, IconTrash, IconEye } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import DataTable from "../../_base/component/Core/DataTable";
import { apVendorMergeHistoryService, apVendorMasterService } from "../../api/apVendor/apVendorMasterMockService";
import { ApVendorMergeHistory, ApVendor } from "../../model/ApVendorMasterModel";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

export default function ApVendorMergeHistoryList() {
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<ApVendorMergeHistory[]>([]);
  const [vendors, setVendors] = useState<ApVendor[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [height, setHeight] = useState(500);

  const [fromVendorFilter, setFromVendorFilter] = useState<number | null>(null);
  const [toVendorFilter, setToVendorFilter] = useState<number | null>(null);

  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const formSearch = useForm({
    initialValues: { fromVendorId: "", toVendorId: "" }
  });

  const loadVendors = async () => {
    try {
      const list = await apVendorMasterService.getAll();
      setVendors(list);
    } catch {
      console.error("Không tải được danh sách nhà cung cấp.");
    }
  };

  useEffect(() => {
    loadVendors();
  }, []);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsRefetching(true);
    try {
      const res = await apVendorMergeHistoryService.getList({
        skip: pagination.pageIndex * pagination.pageSize,
        take: pagination.pageSize,
        fromVendorId: fromVendorFilter,
        toVendorId: toVendorFilter
      });
      if (res?.success && res.data) {
        setData(res.data.items);
        setRowCount(res.data.totalItems);
      } else {
        setData([]);
        setRowCount(0);
      }
    } catch {
      NotificationExtension.Fails("Lỗi khi tải lịch sử gộp nhà cung cấp.");
    } finally {
      setIsLoading(false);
      setIsRefetching(false);
    }
  }, [pagination.pageIndex, pagination.pageSize, fromVendorFilter, toVendorFilter]);

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
    setFromVendorFilter(formSearch.values.fromVendorId ? Number(formSearch.values.fromVendorId) : null);
    setToVendorFilter(formSearch.values.toVendorId ? Number(formSearch.values.toVendorId) : null);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const columns = useMemo<MRT_ColumnDef<ApVendorMergeHistory>[]>(
    () => [
      {
        accessorKey: "mergeId",
        header: "Mã giao dịch gộp",
        size: 150,
        Cell: ({ row }) => (
          <span
            style={{ cursor: "pointer", color: "#228be6", fontWeight: 600 }}
            onClick={() => navigate(`/ApVendorMergeHistory/Detail/${row.original.mergeId}`)}
          >
            {row.original.mergeId}
          </span>
        )
      },
      {
        accessorKey: "fromVendorName",
        header: "Nhà cung cấp nguồn (From)",
        size: 220,
      },
      {
        accessorKey: "fromVendorSiteCode",
        header: "Chi nhánh nguồn",
        size: 160,
      },
      {
        accessorKey: "toVendorName",
        header: "Nhà cung cấp đích (To)",
        size: 220,
      },
      {
        accessorKey: "toVendorSiteCode",
        header: "Chi nhánh đích",
        size: 160,
      },
      {
        accessorKey: "mergeDate",
        header: "Ngày thực hiện",
        size: 160,
        Cell: ({ cell }) => {
          const val = cell.getValue() as string;
          return val ? new Date(val).toLocaleDateString("vi-VN") : "-";
        }
      },
      {
        accessorKey: "invoiceScope",
        header: "Phạm vi hóa đơn",
        size: 150,
        Cell: ({ cell }) => {
          const val = cell.getValue() as string;
          return <Badge variant="light" color={val === "ALL" ? "blue" : "orange"}>{val === "ALL" ? "Tất cả" : "Chưa thanh toán"}</Badge>;
        }
      }
    ],
    [navigate]
  );

  return (
    <Box>
      <div style={{ border: "1px solid #dee2e6", padding: "10px", backgroundColor: "#fff" }} ref={headerRef}>
        <Flex justify="space-between" align="center" mb="10">
          <BreadCrumb />
          <Title order={4}>Lịch sử gộp Nhà cung cấp</Title>
        </Flex>

        <form onSubmit={formSearch.onSubmit(handleSearch)}>
          <Grid align="flex-end">
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select
                label="Nhà cung cấp nguồn"
                placeholder="Chọn NCC nguồn"
                clearable
                data={vendors.map((v) => ({ value: String(v.vendorId), label: v.vendorName }))}
                {...formSearch.getInputProps("fromVendorId")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select
                label="Nhà cung cấp đích"
                placeholder="Chọn NCC đích"
                clearable
                data={vendors.map((v) => ({ value: String(v.vendorId), label: v.vendorName }))}
                {...formSearch.getInputProps("toVendorId")}
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
                  onClick={() => navigate("/ApVendorMergeHistory/Create")}
                >
                  Ghi nhận gộp NCC
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
                  onClick={() => navigate(`/ApVendorMergeHistory/Detail/${row.original.mergeId}`)}
                >
                  <IconEye size={18} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Chỉnh sửa">
                <ActionIcon
                  variant="light"
                  color="yellow"
                  onClick={() => navigate(`/ApVendorMergeHistory/Edit/${row.original.mergeId}`)}
                >
                  <IconEdit size={18} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Xóa">
                <ActionIcon
                  variant="light"
                  color="red"
                  onClick={() => navigate(`/ApVendorMergeHistory/Delete/${row.original.mergeId}`)}
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

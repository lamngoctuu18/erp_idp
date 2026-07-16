import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MRT_ColumnDef, MRT_PaginationState } from "mantine-react-table";
import { ActionIcon, Box, Button, Flex, Grid, TextInput, Select, Tooltip, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconEdit, IconPlus, IconSearch, IconTrash, IconEye } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import DataTable from "../../_base/component/Core/DataTable";
import { StatusBadge } from "../../_base/component/Core/StatusBadge";
import { ceBankBranchService, ceBankService } from "../../api/sharedConfig/ceBankMockService";
import { CeBankBranch, CeBank } from "../../model/CeBankModel";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

export default function CeBankBranchList() {
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<CeBankBranch[]>([]);
  const [banks, setBanks] = useState<CeBank[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [height, setHeight] = useState(500);

  const [keySearch, setKeySearch] = useState("");
  const [bankFilter, setBankFilter] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const formSearch = useForm({
    initialValues: { keySearch: "", bankId: "", status: "" }
  });

  const loadBanks = async () => {
    try {
      const list = await ceBankService.getAll();
      setBanks(list);
    } catch {
      console.error("Không tải được danh sách ngân hàng.");
    }
  };

  useEffect(() => {
    loadBanks();
  }, []);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsRefetching(true);
    try {
      const res = await ceBankBranchService.getList({
        skip: pagination.pageIndex * pagination.pageSize,
        take: pagination.pageSize,
        keySearch,
        bankId: bankFilter,
        status: statusFilter || undefined
      });
      if (res?.success && res.data) {
        setData(res.data.items);
        setRowCount(res.data.totalItems);
      } else {
        setData([]);
        setRowCount(0);
      }
    } catch {
      NotificationExtension.Fails("Lỗi khi tải danh sách chi nhánh.");
    } finally {
      setIsLoading(false);
      setIsRefetching(false);
    }
  }, [pagination.pageIndex, pagination.pageSize, keySearch, bankFilter, statusFilter]);

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
    setBankFilter(formSearch.values.bankId ? Number(formSearch.values.bankId) : null);
    setStatusFilter(formSearch.values.status || null);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const columns = useMemo<MRT_ColumnDef<CeBankBranch>[]>(
    () => [
      {
        accessorKey: "branchNumber",
        header: "Mã số chi nhánh",
        size: 140,
        Cell: ({ cell }) => cell.getValue() as string || "-"
      },
      {
        accessorKey: "branchName",
        header: "Tên chi nhánh",
        size: 230,
        Cell: ({ row }) => (
          <span
            style={{ cursor: "pointer", color: "#228be6", fontWeight: 600 }}
            onClick={() => navigate(`/CeBankBranch/Detail/${row.original.branchId}`)}
          >
            {row.original.branchName}
          </span>
        )
      },
      {
        accessorKey: "bankName",
        header: "Thuộc Ngân hàng",
        size: 220,
        Cell: ({ cell }) => cell.getValue() as string || "-"
      },
      {
        accessorKey: "branchType",
        header: "Loại chi nhánh",
        size: 140,
        Cell: ({ cell }) => cell.getValue() as string || "-"
      },
      {
        accessorKey: "city",
        header: "Tỉnh / Thành phố",
        size: 150,
        Cell: ({ cell }) => cell.getValue() as string || "-"
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        size: 140,
        Cell: ({ cell }) => <StatusBadge statusType="masterdata" value={cell.getValue() === "ACTIVE"} />
      }
    ],
    [navigate]
  );

  return (
    <Box>
      <div style={{ border: "1px solid #dee2e6", padding: "10px", backgroundColor: "#fff" }} ref={headerRef}>
        <Flex direction="column" gap="xs" mb={10}>
          <BreadCrumb />
          <Title order={4}>Danh mục Chi nhánh Ngân hàng</Title>
        </Flex>

        <form onSubmit={formSearch.onSubmit(handleSearch)}>
          <Grid align="flex-end">
            <Grid.Col span={{ base: 12, md: 3 }}>
              <TextInput
                placeholder="Tìm tên, mã chi nhánh, thành phố..."
                label="Từ khóa tìm kiếm"
                leftSection={<IconSearch size={18} color="#15aabf" />}
                {...formSearch.getInputProps("keySearch")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Select
                label="Lọc theo Ngân hàng mẹ"
                placeholder="Tất cả ngân hàng"
                clearable
                data={banks.map((b) => ({ value: String(b.bankId), label: b.bankName }))}
                {...formSearch.getInputProps("bankId")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Select
                label="Trạng thái hoạt động"
                placeholder="Tất cả trạng thái"
                clearable
                data={[
                  { value: "ACTIVE", label: "Đang hoạt động" },
                  { value: "INACTIVE", label: "Ngừng hoạt động" }
                ]}
                {...formSearch.getInputProps("status")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Flex gap="sm" justify="flex-end">
                <Button color="blue" type="submit">
                  Tìm kiếm
                </Button>
                <Button
                  leftSection={<IconPlus size={16} />}
                  color="blue"
                  variant="outline"
                  onClick={() => navigate("/CeBankBranch/Create")}
                >
                  Thêm chi nhánh
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
                  onClick={() => navigate(`/CeBankBranch/Detail/${row.original.branchId}`)}
                >
                  <IconEye size={18} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Chỉnh sửa">
                <ActionIcon
                  variant="light"
                  color="yellow"
                  onClick={() => navigate(`/CeBankBranch/Edit/${row.original.branchId}`)}
                >
                  <IconEdit size={18} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Xóa">
                <ActionIcon
                  variant="light"
                  color="red"
                  onClick={() => navigate(`/CeBankBranch/Delete/${row.original.branchId}`)}
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

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MRT_ColumnDef, MRT_PaginationState } from "mantine-react-table";
import { ActionIcon, Box, Button, Flex, Grid, TextInput, Select, Tooltip, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconEdit, IconPlus, IconSearch, IconTrash, IconEye } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import DataTable from "../../_base/component/Core/DataTable";
import { StatusBadge } from "../../_base/component/Core/StatusBadge";
import { ceBankAccountService, ceBankService, ceBankBranchService } from "../../api/sharedConfig/ceBankMockService";
import { CeBankAccount, CeBank, CeBankBranch } from "../../model/CeBankModel";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

export default function CeBankAccountList() {
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<CeBankAccount[]>([]);
  const [banks, setBanks] = useState<CeBank[]>([]);
  const [branches, setBranches] = useState<CeBankBranch[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [height, setHeight] = useState(500);

  const [keySearch, setKeySearch] = useState("");
  const [bankFilter, setBankFilter] = useState<number | null>(null);
  const [branchFilter, setBranchFilter] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const formSearch = useForm({
    initialValues: { keySearch: "", bankId: "", branchId: "", status: "" }
  });

  const loadBanksAndBranches = async () => {
    try {
      const bList = await ceBankService.getAll();
      setBanks(bList);
      const brList = await ceBankBranchService.getAll();
      setBranches(brList);
    } catch {
      console.error("Không tải được danh mục ngân hàng/chi nhánh.");
    }
  };

  useEffect(() => {
    loadBanksAndBranches();
  }, []);

  const filteredBranches = useMemo(() => {
    const bId = formSearch.values.bankId;
    if (!bId) return branches;
    return branches.filter((x) => x.bankId === Number(bId));
  }, [branches, formSearch.values.bankId]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsRefetching(true);
    try {
      const res = await ceBankAccountService.getList({
        skip: pagination.pageIndex * pagination.pageSize,
        take: pagination.pageSize,
        keySearch,
        bankId: bankFilter,
        branchId: branchFilter,
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
      NotificationExtension.Fails("Lỗi khi tải danh sách tài khoản ngân hàng.");
    } finally {
      setIsLoading(false);
      setIsRefetching(false);
    }
  }, [pagination.pageIndex, pagination.pageSize, keySearch, bankFilter, branchFilter, statusFilter]);

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
    setBranchFilter(formSearch.values.branchId ? Number(formSearch.values.branchId) : null);
    setStatusFilter(formSearch.values.status || null);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const columns = useMemo<MRT_ColumnDef<CeBankAccount>[]>(
    () => [
      {
        accessorKey: "accountNumber",
        header: "Số tài khoản",
        size: 150,
        Cell: ({ cell }) => <b>{cell.getValue() as string}</b>
      },
      {
        accessorKey: "accountName",
        header: "Tên tài khoản",
        size: 230,
        Cell: ({ row }) => (
          <span
            style={{ cursor: "pointer", color: "#228be6", fontWeight: 600 }}
            onClick={() => navigate(`/CeBankAccount/Detail/${row.original.bankAccountId}`)}
          >
            {row.original.accountName}
          </span>
        )
      },
      {
        accessorKey: "bankName",
        header: "Ngân hàng",
        size: 200,
      },
      {
        accessorKey: "branchName",
        header: "Chi nhánh",
        size: 180,
      },
      {
        accessorKey: "currencyCode",
        header: "Loại tiền",
        size: 100,
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        size: 120,
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
          <Title order={4}>Danh mục Tài khoản Ngân hàng nội bộ</Title>
        </Flex>

        <form onSubmit={formSearch.onSubmit(handleSearch)}>
          <Grid align="flex-end">
            <Grid.Col span={{ base: 12, md: 3 }}>
              <TextInput
                placeholder="Tìm tên, số tài khoản..."
                label="Từ khóa tìm kiếm"
                leftSection={<IconSearch size={18} color="#15aabf" />}
                {...formSearch.getInputProps("keySearch")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Select
                label="Ngân hàng"
                placeholder="Chọn ngân hàng"
                clearable
                data={banks.map((b) => ({ value: String(b.bankId), label: b.bankName }))}
                {...formSearch.getInputProps("bankId")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Select
                label="Chi nhánh"
                placeholder="Chọn chi nhánh"
                clearable
                disabled={!formSearch.values.bankId}
                data={filteredBranches.map((br) => ({ value: String(br.branchId), label: br.branchName }))}
                {...formSearch.getInputProps("branchId")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Select
                label="Trạng thái"
                placeholder="Chọn trạng thái"
                clearable
                data={[
                  { value: "ACTIVE", label: "Đang hoạt động" },
                  { value: "INACTIVE", label: "Ngừng hoạt động" }
                ]}
                {...formSearch.getInputProps("status")}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <Flex gap="sm" justify="flex-end">
                <Button color="blue" type="submit">
                  Tìm kiếm
                </Button>
                <Button
                  leftSection={<IconPlus size={16} />}
                  color="blue"
                  variant="outline"
                  onClick={() => navigate("/CeBankAccount/Create")}
                >
                  Thêm tài khoản
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
                  onClick={() => navigate(`/CeBankAccount/Detail/${row.original.bankAccountId}`)}
                >
                  <IconEye size={18} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Chỉnh sửa">
                <ActionIcon
                  variant="light"
                  color="yellow"
                  onClick={() => navigate(`/CeBankAccount/Edit/${row.original.bankAccountId}`)}
                >
                  <IconEdit size={18} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Xóa">
                <ActionIcon
                  variant="light"
                  color="red"
                  onClick={() => navigate(`/CeBankAccount/Delete/${row.original.bankAccountId}`)}
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

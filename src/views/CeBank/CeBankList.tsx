import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MRT_ColumnDef, MRT_PaginationState } from "mantine-react-table";
import { ActionIcon, Box, Button, Flex, Grid, TextInput, Select, Tooltip, Title, Badge } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconEdit, IconPlus, IconSearch, IconTrash, IconEye } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import DataTable from "../../_base/component/Core/DataTable";
import { StatusBadge } from "../../_base/component/Core/StatusBadge";
import { ceBankService } from "../../api/sharedConfig/ceBankMockService";
import { CeBank } from "../../model/CeBankModel";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

export default function CeBankList() {
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement>(null);

  /// alo
  const [data, setData] = useState<CeBank[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [height, setHeight] = useState(500);

  const [keySearch, setKeySearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const formSearch = useForm({
    initialValues: { keySearch: "", status: "" }
  });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsRefetching(true);
    try {
      const res = await ceBankService.getList({
        skip: pagination.pageIndex * pagination.pageSize,
        take: pagination.pageSize,
        keySearch,
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
      NotificationExtension.Fails("Lỗi khi tải danh sách ngân hàng.");
    } finally {
      setIsLoading(false);
      setIsRefetching(false);
    }
  }, [pagination.pageIndex, pagination.pageSize, keySearch, statusFilter]);

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
    setStatusFilter(formSearch.values.status || null);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const columns = useMemo<MRT_ColumnDef<CeBank>[]>(
    () => [
      {
        accessorKey: "bankNumber",
        header: "Mã số ngân hàng",
        size: 140,
        Cell: ({ cell }) => cell.getValue() as string || "-"
      },
      {
        accessorKey: "bankName",
        header: "Tên ngân hàng",
        size: 260,
        Cell: ({ row }) => (
          <span
            style={{ cursor: "pointer", color: "#228be6", fontWeight: 600 }}
            onClick={() => navigate(`/CeBank/Detail/${row.original.bankId}`)}
          >
            {row.original.bankName}
          </span>
        )
      },
      {
        accessorKey: "shortBankName",
        header: "Tên viết tắt",
        size: 120,
        Cell: ({ cell }) => cell.getValue() as string || "-"
      },
      {
        accessorKey: "countryCode",
        header: "Quốc gia",
        size: 110,
        Cell: ({ cell }) => <Badge variant="light" color="indigo">{cell.getValue() as string}</Badge>
      },
      {
        accessorKey: "taxRegistrationNumber",
        header: "Mã số thuế",
        size: 140,
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
          <Title order={4}>Danh mục Ngân hàng doanh nghiệp</Title>
        </Flex>

        <form onSubmit={formSearch.onSubmit(handleSearch)}>
          <Grid align="flex-end">
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                placeholder="Tìm tên, viết tắt, mã ngân hàng..."
                label="Từ khóa tìm kiếm"
                leftSection={<IconSearch size={18} color="#15aabf" />}
                {...formSearch.getInputProps("keySearch")}
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
            <Grid.Col span={{ base: 12, md: 5 }}>
              <Flex gap="sm" justify="flex-end">
                <Button color="blue" type="submit">
                  Tìm kiếm
                </Button>
                <Button
                  leftSection={<IconPlus size={16} />}
                  color="blue"
                  variant="outline"
                  onClick={() => navigate("/CeBank/Create")}
                >
                  Thêm ngân hàng
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
                  onClick={() => navigate(`/CeBank/Detail/${row.original.bankId}`)}
                >
                  <IconEye size={18} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Chỉnh sửa">
                <ActionIcon
                  variant="light"
                  color="yellow"
                  onClick={() => navigate(`/CeBank/Edit/${row.original.bankId}`)}
                >
                  <IconEdit size={18} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Xóa">
                <ActionIcon
                  variant="light"
                  color="red"
                  onClick={() => navigate(`/CeBank/Delete/${row.original.bankId}`)}
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

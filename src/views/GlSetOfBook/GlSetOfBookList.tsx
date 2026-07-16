import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MRT_ColumnDef, MRT_PaginationState } from "mantine-react-table";
import { ActionIcon, Box, Button, Flex, Grid, TextInput, Select, Tooltip, Title, Badge } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconEdit, IconPlus, IconSearch, IconTrash, IconEye } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import DataTable from "../../_base/component/Core/DataTable";
import { StatusBadge } from "../../_base/component/Core/StatusBadge";
import { glSetOfBookService } from "../../api/sharedConfig/sharedConfigMockService";
import { GlSetOfBook } from "../../model/SharedConfigModel";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

export default function GlSetOfBookList() {
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<GlSetOfBook[]>([]);
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
      const res = await glSetOfBookService.getList({
        skip: pagination.pageIndex * pagination.pageSize,
        take: pagination.pageSize,
        keySearch,
        enabledFlag: statusFilter || undefined
      });
      if (res?.success && res.data) {
        setData(res.data.items);
        setRowCount(res.data.totalItems);
      } else {
        setData([]);
        setRowCount(0);
      }
    } catch {
      NotificationExtension.Fails("Lỗi khi tải danh sách bộ sổ kế toán.");
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

  const columns = useMemo<MRT_ColumnDef<GlSetOfBook>[]>(
    () => [
      {
        accessorKey: "setOfBooksId",
        header: "Mã bộ sổ",
        size: 100,
        Cell: ({ cell }) => <b>{cell.getValue() as number}</b>
      },
      {
        accessorKey: "name",
        header: "Tên bộ sổ (Sổ cái chính)",
        size: 250,
        Cell: ({ row }) => (
          <span
            style={{ cursor: "pointer", color: "#228be6", fontWeight: 600 }}
            onClick={() => navigate(`/GlSetOfBook/Detail/${row.original.setOfBooksId}`)}
          >
            {row.original.name}
          </span>
        )
      },
      {
        accessorKey: "shortName",
        header: "Tên viết tắt",
        size: 140,
        Cell: ({ cell }) => cell.getValue() as string || "-"
      },
      {
        accessorKey: "currencyCode",
        header: "Loại tiền tệ",
        size: 120,
        Cell: ({ cell }) => <Badge color="blue" variant="outline">{cell.getValue() as string}</Badge>
      },
      {
        accessorKey: "periodSetName",
        header: "Chu kỳ kế toán",
        size: 150,
        Cell: ({ cell }) => cell.getValue() as string || "-"
      },
      {
        accessorKey: "enabledFlag",
        header: "Trạng thái",
        size: 140,
        Cell: ({ cell }) => <StatusBadge statusType="masterdata" value={cell.getValue() === "Y"} />
      }
    ],
    [navigate]
  );

  return (
    <Box>
      <div style={{ border: "1px solid #dee2e6", padding: "10px", backgroundColor: "#fff" }} ref={headerRef}>
        <Flex direction="column" gap="xs" mb={10}>
          <BreadCrumb />
          <Title order={4}>Danh mục Sổ cái chính</Title>
        </Flex>

        <form onSubmit={formSearch.onSubmit(handleSearch)}>
          <Grid align="flex-end">
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                placeholder="Tìm tên, tên viết tắt, mã tiền..."
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
                  { value: "Y", label: "Đang hoạt động" },
                  { value: "N", label: "Ngừng hoạt động" }
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
                  onClick={() => navigate("/GlSetOfBook/Create")}
                >
                  Thêm sổ cái
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
                  onClick={() => navigate(`/GlSetOfBook/Detail/${row.original.setOfBooksId}`)}
                >
                  <IconEye size={18} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Chỉnh sửa">
                <ActionIcon
                  variant="light"
                  color="yellow"
                  onClick={() => navigate(`/GlSetOfBook/Edit/${row.original.setOfBooksId}`)}
                >
                  <IconEdit size={18} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Xóa">
                <ActionIcon
                  variant="light"
                  color="red"
                  onClick={() => navigate(`/GlSetOfBook/Delete/${row.original.setOfBooksId}`)}
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


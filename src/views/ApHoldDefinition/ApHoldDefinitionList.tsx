import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MRT_ColumnDef, MRT_PaginationState } from "mantine-react-table";
import { ActionIcon, Box, Button, Flex, Grid, TextInput, Tooltip, Title, Badge } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconEdit, IconPlus, IconSearch, IconTrash, IconEye } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import DataTable from "../../_base/component/Core/DataTable";
import { apHoldDefinitionService } from "../../api/apVendor/apInvoiceMasterMockService";
import { ApHoldDefinition } from "../../model/ApInvoiceMasterModel";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

export default function ApHoldDefinitionList() {
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<ApHoldDefinition[]>([]);
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
      const res = await apHoldDefinitionService.getList({
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
      NotificationExtension.Fails("Lỗi khi tải danh sách định nghĩa lỗi khóa giữ.");
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

  const columns = useMemo<MRT_ColumnDef<ApHoldDefinition>[]>(
    () => [
      {
        accessorKey: "holdCode",
        header: "Mã lỗi (Hold Code)",
        size: 150,
        Cell: ({ row }) => (
          <span
            style={{ cursor: "pointer", color: "#228be6", fontWeight: 700 }}
            onClick={() => navigate(`/ApHoldDefinition/Detail/${row.original.holdCode}`)}
          >
            {row.original.holdCode}
          </span>
        )
      },
      {
        accessorKey: "holdName",
        header: "Tên lý do khóa giữ",
        size: 240,
      },
      {
        accessorKey: "holdReason",
        header: "Diễn giải chi tiết lý do",
        size: 300,
      },
      {
        accessorKey: "systemFlag",
        header: "Do hệ thống áp",
        size: 140,
        Cell: ({ cell }) => (
          <Badge color={cell.getValue() === "Y" ? "blue" : "gray"}>
            {cell.getValue() === "Y" ? "HỆ THỐNG" : "THỦ CÔNG"}
          </Badge>
        )
      },
      {
        accessorKey: "manualReleaseAllowedFlag",
        header: "Cho mở thủ công",
        size: 150,
        Cell: ({ cell }) => (
          <Badge color={cell.getValue() === "Y" ? "green" : "red"}>
            {cell.getValue() === "Y" ? "ĐƯỢC PHÉP" : "KHÔNG CHO"}
          </Badge>
        )
      },
      {
        accessorKey: "activeFlag",
        header: "Hoạt động",
        size: 130,
        Cell: ({ cell }) => (
          <Badge color={cell.getValue() === "Y" ? "green" : "gray"}>
            {cell.getValue() === "Y" ? "ĐANG DÙNG" : "NGỪNG DÙNG"}
          </Badge>
        )
      }
    ],
    [navigate]
  );

  return (
    <Box>
      <div style={{ border: "1px solid #dee2e6", padding: "10px", backgroundColor: "#fff" }} ref={headerRef}>
        <Flex direction="column" gap="xs" mb={10}>
          <BreadCrumb />
          <Title order={4}>Danh mục Lý do khóa giữ hóa đơn</Title>
        </Flex>

        <form onSubmit={formSearch.onSubmit(handleSearch)}>
          <Grid align="flex-end">
            <Grid.Col span={{ base: 12, md: 8 }}>
              <TextInput
                placeholder="Tìm mã hold code, tên lý do..."
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
                  onClick={() => navigate("/ApHoldDefinition/Create")}
                >
                  Thêm lý do mới
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
                  onClick={() => navigate(`/ApHoldDefinition/Detail/${row.original.holdCode}`)}
                >
                  <IconEye size={18} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Chỉnh sửa">
                <ActionIcon
                  variant="light"
                  color="yellow"
                  onClick={() => navigate(`/ApHoldDefinition/Edit/${row.original.holdCode}`)}
                >
                  <IconEdit size={18} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Xóa">
                <ActionIcon
                  variant="light"
                  color="red"
                  onClick={() => navigate(`/ApHoldDefinition/Delete/${row.original.holdCode}`)}
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

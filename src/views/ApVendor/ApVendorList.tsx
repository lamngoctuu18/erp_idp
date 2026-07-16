import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  MantineReactTable,
  useMantineReactTable,
  MRT_ColumnDef,
  MRT_PaginationState,
} from "mantine-react-table";
import {
  ActionIcon,
  Box,
  Button,
  Title,
  Tooltip,
  Input,
  Select,
  Grid,
  Badge,
  Group,
} from "@mantine/core";
import {
  IconPlus,
  IconSearch,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import _breadcrumb from "../../_base/component/_layout/_breadcrumb";
import { _localization } from "../../config/location";
import { ApVendor } from "../../model/ApVendor";
import { modals } from "@mantine/modals";
import DeleteApVendor from "./DeleteApVendor";
import { styleTableMantine } from "../../_base/_const/_constVar";
import { apVendorService } from "../../api/apVendor/apMockService";

interface SearchCriteria {
  keySearch?: string;
  enabledFlag?: string | null;
}

const ApVendorList = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [data, setData] = useState<ApVendor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [isError, setIsError] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [height, setHeight] = useState(0);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const form = useForm<SearchCriteria>({
    mode: "uncontrolled",
    initialValues: {
      keySearch: "",
      enabledFlag: "",
    },
  });

  const fetchList = async () => {
    setIsLoading(true);
    setIsRefetching(true);
    setIsError(false);
    const search = form.values;

    try {
      let list = await apVendorService.getAll(search.keySearch || "");
      if (search.enabledFlag) {
        list = list.filter((x) => x.enabledFlag === search.enabledFlag);
      }
      setData(list as unknown as ApVendor[]);
      setRowCount(list.length);
    } catch (err: any) {
      console.error(err);
      setIsError(true);
      NotificationExtension.Fails("Lỗi kết nối Mock Service.");
    } finally {
      setIsLoading(false);
      setIsRefetching(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [pagination.pageIndex, pagination.pageSize]);

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    fetchList();
  };

  const openDeleteModal = (id: number) => {
    modals.open({
      title: <Title order={5}>Xóa nhà cung cấp</Title>,
      size: "500px",
      children: (
        <DeleteApVendor
          idItems={[id]}
          onClose={() => {
            fetchList();
          }}
        />
      ),
    });
  };

  const columns = useMemo<MRT_ColumnDef<ApVendor>[]>(
    () => [
      {
        header: "STT",
        accessorKey: "STT",
        enableColumnActions: false,
        enableSorting: false,
        enableResizing: false,
        Cell: ({ row }) => <>{row.index + 1}</>,
        size: 80,
      },
      {
        accessorKey: "segment1",
        header: "Mã code đối tác",
        size: 210,
        Cell: ({ cell }) => <Badge color="teal" variant="dot">{cell.getValue<string>()}</Badge>,
      },
      {
        accessorKey: "vendorName",
        header: "Tên nhà cung cấp",
        size: 250,
      },
      {
        accessorKey: "taxRegistrationNum",
        header: "Mã số thuế",
        size: 170,
      },
      {
        accessorKey: "enabledFlag",
        header: "Trạng thái",
        size: 170,
        Cell: ({ cell }) => {
          const val = cell.getValue<string>();
          return val === "Y" ? (
            <Badge color="green" variant="light">Đang giao dịch</Badge>
          ) : (
            <Badge color="red" variant="light">Khóa giao dịch</Badge>
          );
        },
      },
      {
        accessorKey: "action",
        header: "Thao tác",
        enableSorting: false,
        enableColumnActions: false,
        enableColumnFilter: false,
        enableResizing: false,
        size: 100,
        Cell: ({ row }) => (
          <Box style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Tooltip label="Chỉnh sửa">
              <ActionIcon
                variant="light"
                color="yellow"
                onClick={() =>
                  navigate(`/ApVendor/EditApVendor/${row.original.vendorId}`)
                }
              >
                <IconEdit size={20} stroke={1.5} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Xóa">
              <ActionIcon
                variant="light"
                color="red"
                onClick={() => openDeleteModal(row.original.vendorId)}
              >
                <IconTrash size={20} stroke={1.5} />
              </ActionIcon>
            </Tooltip>
          </Box>
        ),
      },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data,
    enableColumnResizing: true,
    rowCount,
    enableColumnFilters: true,
    enableSorting: true,
    enableColumnActions: true,
    state: {
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      showSkeletons: isLoading,
    },
    enableStickyFooter: true,
    manualFiltering: false,
    manualPagination: true,
    manualSorting: false,
    onPaginationChange: setPagination,
    positionToolbarAlertBanner: "bottom",
    initialState: {
      showColumnFilters: false,
      columnPinning: {
        left: ["STT", "vendorId"],
        right: ["action"],
      },
      columnVisibility: { id: false },
      density: "xs",
    },
    mantineTopToolbarProps: {
      style: {
        display: "none",
      },
    },
    localization: _localization,
    getRowId: (row) => String(row.vendorId),
    mantineTableContainerProps: {
      style: { maxHeight: height, minHeight: height },
    },
    enableStickyHeader: true,
    mantineTableBodyCellProps: ({ row }) => ({
      style: styleTableMantine,
    }),
    mantinePaginationProps: {
      showRowsPerPage: true,
      withEdges: true,
      radius: "xl",
      size: "lg",
      rowsPerPageOptions: ["20", "50", "100"],
    },
    paginationDisplayMode: "pages",
    enableColumnPinning: true,
    mantineTableProps: {
      striped: false,
    },
    mantineTableBodyRowProps: ({ row }) => ({
      onClick: row.getToggleSelectedHandler(),
      sx: { cursor: "pointer" },
    }),
  });

  useEffect(() => {
    const headerHeight = headerRef.current?.offsetHeight || 0;
    const handleResize = () => {
      setHeight(window.innerHeight - (185 + headerHeight));
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [height]);

  return (
    <Box>
      <div
        style={{ border: "1px solid #dee2e6", padding: "10px" }}
        ref={headerRef}
      >
        <Group gap={0} justify="space-between">
          <_breadcrumb></_breadcrumb>
        </Group>
        <Box style={{ display: "flex", justifyContent: "space-between" }}>
          <Grid mt={10}>
            <Grid.Col
              style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
            >
              <Input
                placeholder="Nhập tên đối tác, mã đối tác, mã số thuế..."
                key={form.key("keySearch")}
                type="text"
                leftSection={<IconSearch size={"20"} color="#15aabf" />}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                {...form.getInputProps("keySearch")}
              />
              <Select
                placeholder="Trạng thái"
                clearable
                data={[
                  { value: "Y", label: "Đang hoạt động (Y)" },
                  { value: "N", label: "Ngừng hoạt động (N)" },
                ]}
                key={form.key("enabledFlag")}
                {...form.getInputProps("enabledFlag")}
              />
              <Button
                color="blue"
                variant="outline"
                onClick={handleSearch}
              >
                Tìm kiếm
              </Button>
            </Grid.Col>
          </Grid>

          <Button
            mt={10}
            mr={10}
            leftSection={<IconPlus size={14} />}
            color="blue"
            variant="outline"
            onClick={() => navigate("/ApVendor/CreateApVendor")}
          >
            Thêm nhà cung cấp
          </Button>
        </Box>
      </div>
      <Box mt={10}>
        <MantineReactTable table={table} />
      </Box>
    </Box>
  );
};

export default ApVendorList;

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MRT_ColumnDef, MRT_PaginationState } from "mantine-react-table";
import { ActionIcon, Box, Button, Flex, Grid, TextInput, Select, Tooltip, Title, Badge } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconEdit, IconPlus, IconSearch, IconTrash, IconEye } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import DataTable from "../../_base/component/Core/DataTable";
import { StatusBadge } from "../../_base/component/Core/StatusBadge";
import { apVendorAddressService, apVendorMasterService } from "../../api/apVendor/apVendorMasterMockService";
import { ApVendorAddress, ApVendor } from "../../model/ApVendorMasterModel";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

export default function ApVendorAddressList() {
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<ApVendorAddress[]>([]);
  const [vendors, setVendors] = useState<ApVendor[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [height, setHeight] = useState(500);

  const [keySearch, setKeySearch] = useState("");
  const [vendorFilter, setVendorFilter] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const formSearch = useForm({
    initialValues: { keySearch: "", vendorId: "", enabledFlag: "" }
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
      const res = await apVendorAddressService.getList({
        skip: pagination.pageIndex * pagination.pageSize,
        take: pagination.pageSize,
        keySearch,
        vendorId: vendorFilter,
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
      NotificationExtension.Fails("Lỗi khi tải danh sách địa chỉ.");
    } finally {
      setIsLoading(false);
      setIsRefetching(false);
    }
  }, [pagination.pageIndex, pagination.pageSize, keySearch, vendorFilter, statusFilter]);

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
    setVendorFilter(formSearch.values.vendorId ? Number(formSearch.values.vendorId) : null);
    setStatusFilter(formSearch.values.enabledFlag || null);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const columns = useMemo<MRT_ColumnDef<ApVendorAddress>[]>(
    () => [
      {
        accessorKey: "vendorName",
        header: "Nhà cung cấp",
        size: 240,
        Cell: ({ row }) => (
          <span
            style={{ cursor: "pointer", color: "#228be6", fontWeight: 600 }}
            onClick={() => navigate(`/ApVendorAddress/Detail/${row.original.addressId}`)}
          >
            {row.original.vendorName}
          </span>
        )
      },
      {
        accessorKey: "addressType",
        header: "Loại địa chỉ",
        size: 130,
        Cell: ({ cell }) => {
          const val = cell.getValue() as string;
          let color = "blue";
          if (val === "PRIMARY") color = "violet";
          if (val === "BILLING") color = "cyan";
          if (val === "SHIPPING") color = "teal";
          return <Badge color={color} variant="light">{val || "N/A"}</Badge>;
        }
      },
      {
        accessorKey: "addressLine1",
        header: "Địa chỉ (Dòng 1)",
        size: 250,
      },
      {
        accessorKey: "city",
        header: "Thành phố",
        size: 130,
      },
      {
        accessorKey: "phone",
        header: "Điện thoại",
        size: 130,
      },
      {
        accessorKey: "isPrimary",
        header: "Mặc định",
        size: 100,
        Cell: ({ cell }) => (
          <Badge variant="light" color={cell.getValue() === "Y" ? "green" : "gray"}>
            {cell.getValue() === "Y" ? "Có" : "Không"}
          </Badge>
        )
      },
      {
        accessorKey: "enabledFlag",
        header: "Trạng thái",
        size: 120,
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
          <Title order={4}>Địa chỉ nhà cung cấp</Title>
        </Flex>

        <form onSubmit={formSearch.onSubmit(handleSearch)}>
          <Grid align="flex-end">
            <Grid.Col span={{ base: 12, md: 3 }}>
              <TextInput
                placeholder="Tìm địa chỉ, số điện thoại, email..."
                label="Từ khóa tìm kiếm"
                leftSection={<IconSearch size={18} color="#15aabf" />}
                {...formSearch.getInputProps("keySearch")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Select
                label="Nhà cung cấp"
                placeholder="Tất cả nhà cung cấp"
                clearable
                data={vendors.map((v) => ({ value: String(v.vendorId), label: v.vendorName }))}
                {...formSearch.getInputProps("vendorId")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Select
                label="Trạng thái hoạt động"
                placeholder="Tất cả"
                clearable
                data={[
                  { value: "Y", label: "Đang hoạt động" },
                  { value: "N", label: "Ngừng hoạt động" }
                ]}
                {...formSearch.getInputProps("enabledFlag")}
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
                  onClick={() => navigate("/ApVendorAddress/Create")}
                >
                  Thêm địa chỉ
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
                  onClick={() => navigate(`/ApVendorAddress/Detail/${row.original.addressId}`)}
                >
                  <IconEye size={18} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Chỉnh sửa">
                <ActionIcon
                  variant="light"
                  color="yellow"
                  onClick={() => navigate(`/ApVendorAddress/Edit/${row.original.addressId}`)}
                >
                  <IconEdit size={18} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Xóa">
                <ActionIcon
                  variant="light"
                  color="red"
                  onClick={() => navigate(`/ApVendorAddress/Delete/${row.original.addressId}`)}
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

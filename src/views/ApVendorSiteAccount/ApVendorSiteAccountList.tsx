import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MRT_ColumnDef, MRT_PaginationState } from "mantine-react-table";
import { ActionIcon, Box, Button, Flex, Grid, Select, Tooltip, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconEdit, IconPlus, IconTrash, IconEye } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import DataTable from "../../_base/component/Core/DataTable";
import { StatusBadge } from "../../_base/component/Core/StatusBadge";
import { apVendorSiteAccountService, apVendorSiteMasterService } from "../../api/apVendor/apVendorMasterMockService";
import { ApVendorSiteAccount, ApVendorSite } from "../../model/ApVendorMasterModel";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

export default function ApVendorSiteAccountList() {
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<ApVendorSiteAccount[]>([]);
  const [sites, setSites] = useState<ApVendorSite[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [height, setHeight] = useState(500);

  const [siteFilter, setSiteFilter] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const formSearch = useForm({
    initialValues: { vendorSiteId: "", status: "" }
  });

  const loadSites = async () => {
    try {
      const list = await apVendorSiteMasterService.getAll();
      setSites(list);
    } catch {
      console.error("Không tải được danh sách chi nhánh.");
    }
  };

  useEffect(() => {
    loadSites();
  }, []);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsRefetching(true);
    try {
      const res = await apVendorSiteAccountService.getList({
        skip: pagination.pageIndex * pagination.pageSize,
        take: pagination.pageSize,
        vendorSiteId: siteFilter,
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
      NotificationExtension.Fails("Lỗi khi tải danh sách tài khoản hạch toán chi nhánh.");
    } finally {
      setIsLoading(false);
      setIsRefetching(false);
    }
  }, [pagination.pageIndex, pagination.pageSize, siteFilter, statusFilter]);

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
    setSiteFilter(formSearch.values.vendorSiteId ? Number(formSearch.values.vendorSiteId) : null);
    setStatusFilter(formSearch.values.status || null);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const columns = useMemo<MRT_ColumnDef<ApVendorSiteAccount>[]>(
    () => [
      {
        accessorKey: "siteAccountId",
        header: "Mã TK hạch toán",
        size: 140,
        Cell: ({ row }) => (
          <span
            style={{ cursor: "pointer", color: "#228be6", fontWeight: 600 }}
            onClick={() => navigate(`/ApVendorSiteAccount/Detail/${row.original.siteAccountId}`)}
          >
            {row.original.siteAccountId}
          </span>
        )
      },
      {
        accessorKey: "vendorName",
        header: "Nhà cung cấp",
        size: 220,
      },
      {
        accessorKey: "vendorSiteCode",
        header: "Mã chi nhánh liên kết",
        size: 180,
      },
      {
        accessorKey: "legalEntityId",
        header: "Mã pháp nhân",
        size: 130,
        Cell: ({ cell }) => cell.getValue() as number || "-"
      },
      {
        accessorKey: "liabilityCcid",
        header: "TK Nợ phải trả (Liability)",
        size: 190,
        Cell: ({ cell }) => <b>{cell.getValue() as number || "-"}</b>
      },
      {
        accessorKey: "prepaymentCcid",
        header: "TK Tạm ứng (Prepayment)",
        size: 190,
        Cell: ({ cell }) => cell.getValue() as number || "-"
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
        <Flex justify="space-between" align="center" mb="10">
          <BreadCrumb />
          <Title order={4}>Tài khoản hạch toán chi nhánh</Title>
        </Flex>

        <form onSubmit={formSearch.onSubmit(handleSearch)}>
          <Grid align="flex-end">
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select
                label="Chi nhánh liên kết"
                placeholder="Tất cả chi nhánh"
                clearable
                data={sites.map((s) => ({ value: String(s.vendorSiteId), label: `${s.vendorSiteCode} (${s.vendorName})` }))}
                {...formSearch.getInputProps("vendorSiteId")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select
                label="Trạng thái hạch toán"
                placeholder="Tất cả trạng thái"
                clearable
                data={[
                  { value: "ACTIVE", label: "Đang hoạt động" },
                  { value: "INACTIVE", label: "Ngừng hoạt động" }
                ]}
                {...formSearch.getInputProps("status")}
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
                  onClick={() => navigate("/ApVendorSiteAccount/Create")}
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
                  onClick={() => navigate(`/ApVendorSiteAccount/Detail/${row.original.siteAccountId}`)}
                >
                  <IconEye size={18} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Chỉnh sửa">
                <ActionIcon
                  variant="light"
                  color="yellow"
                  onClick={() => navigate(`/ApVendorSiteAccount/Edit/${row.original.siteAccountId}`)}
                >
                  <IconEdit size={18} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Xóa">
                <ActionIcon
                  variant="light"
                  color="red"
                  onClick={() => navigate(`/ApVendorSiteAccount/Delete/${row.original.siteAccountId}`)}
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

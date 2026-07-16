import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MRT_ColumnDef, MRT_PaginationState } from "mantine-react-table";
import { ActionIcon, Box, Button, Flex, Grid, TextInput, Select, Tooltip, Title, Badge } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconEdit, IconPlus, IconSearch, IconTrash, IconEye } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import DataTable from "../../_base/component/Core/DataTable";
import { apInvoiceMasterService } from "../../api/apVendor/apInvoiceMasterMockService";
import { apVendorMasterService } from "../../api/apVendor/apVendorMasterMockService";
import { ApInvoice } from "../../model/ApInvoiceMasterModel";
import { ApVendor } from "../../model/ApVendorMasterModel";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

export default function ApInvoiceList() {
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<ApInvoice[]>([]);
  const [vendors, setVendors] = useState<ApVendor[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [height, setHeight] = useState(500);

  const [keySearch, setKeySearch] = useState("");
  const [batchFilter, setBatchFilter] = useState<number | null>(null);

  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const formSearch = useForm({
    initialValues: { keySearch: "", batchId: "" }
  });

  const loadVendors = async () => {
    try {
      const vList = await apVendorMasterService.getAll();
      setVendors(vList);
    } catch {
      console.error("Không tải được danh mục nhà cung cấp.");
    }
  };

  useEffect(() => {
    loadVendors();
  }, []);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsRefetching(true);
    try {
      const res = await apInvoiceMasterService.getList({
        skip: pagination.pageIndex * pagination.pageSize,
        take: pagination.pageSize,
        keySearch,
        batchId: batchFilter
      });

      if (res?.success && res.data) {
        // Móc nối tên nhà cung cấp
        const enriched = res.data.items.map((inv) => {
          const v = vendors.find((x) => x.vendorId === inv.vendorId);
          return {
            ...inv,
            vendorName: v ? v.vendorName : `ID: ${inv.vendorId}`
          };
        });
        setData(enriched);
        setRowCount(res.data.totalItems);
      } else {
        setData([]);
        setRowCount(0);
      }
    } catch {
      NotificationExtension.Fails("Lỗi khi tải danh sách hóa đơn mua hàng.");
    } finally {
      setIsLoading(false);
      setIsRefetching(false);
    }
  }, [pagination.pageIndex, pagination.pageSize, keySearch, batchFilter, vendors]);

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
    setBatchFilter(formSearch.values.batchId ? Number(formSearch.values.batchId) : null);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const columns = useMemo<MRT_ColumnDef<ApInvoice>[]>(
    () => [
      {
        accessorKey: "invoiceNum",
        header: "Số hóa đơn (Invoice Num)",
        size: 160,
        Cell: ({ row }) => (
          <span
            style={{ cursor: "pointer", color: "#228be6", fontWeight: 700 }}
            onClick={() => navigate(`/ApInvoice/ApInvoiceDetail/${row.original.invoiceId}`)}
          >
            {row.original.invoiceNum}
          </span>
        )
      },
      {
        accessorKey: "invoiceDate",
        header: "Ngày hóa đơn",
        size: 140,
        Cell: ({ cell }) => {
          const val = cell.getValue() as string;
          return val ? new Date(val).toLocaleDateString("vi-VN") : "-";
        }
      },
      {
        accessorKey: "vendorName",
        header: "Nhà cung cấp xuất",
        size: 230,
      },
      {
        accessorKey: "invoiceAmount",
        header: "Tổng tiền hóa đơn",
        size: 160,
        Cell: ({ row }) => (
          <strong style={{ color: "#2b8a3e" }}>
            {row.original.invoiceAmount?.toLocaleString("vi-VN")} {row.original.invoiceCurrencyCode}
          </strong>
        )
      },
      {
        accessorKey: "remainingAmount",
        header: "Dư nợ còn lại",
        size: 160,
        Cell: ({ cell }) => {
          const val = cell.getValue() as number;
          return (
            <strong style={{ color: val > 0 ? "red" : "green" }}>
              {val?.toLocaleString("vi-VN")}
            </strong>
          );
        }
      },
      {
        accessorKey: "invoiceTypeLookupCode",
        header: "Loại hóa đơn",
        size: 140,
        Cell: ({ cell }) => {
          const val = cell.getValue() as string;
          return <Badge color={val === "PREPAYMENT" ? "blue" : "gray"}>{val}</Badge>;
        }
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        size: 150,
        Cell: ({ cell }) => {
          const val = cell.getValue() as string;
          let color = "gray";
          if (val === "VALIDATED") color = "green";
          if (val === "NEEDS_REVALIDATION") color = "orange";
          if (val === "CANCELLED") color = "red";
          return <Badge color={color}>{val}</Badge>;
        }
      }
    ],
    [navigate]
  );

  return (
    <Box>
      <div style={{ border: "1px solid #dee2e6", padding: "10px", backgroundColor: "#fff" }} ref={headerRef}>
        <Flex direction="column" gap="xs" mb={10}>
          <BreadCrumb />
          <Title order={4}>Hóa đơn mua hàng & Phân bổ hạch toán</Title>
        </Flex>

        <form onSubmit={formSearch.onSubmit(handleSearch)}>
          <Grid align="flex-end">
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                placeholder="Tìm số hóa đơn, mô tả..."
                label="Từ khóa tìm kiếm"
                leftSection={<IconSearch size={18} color="#15aabf" />}
                {...formSearch.getInputProps("keySearch")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                placeholder="Lọc theo Lô hóa đơn (Batch ID)"
                label="Mã lô hóa đơn"
                {...formSearch.getInputProps("batchId")}
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
                  onClick={() => navigate("/ApInvoice/CreateApInvoice")}
                >
                  Tạo hóa đơn mới
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
                  onClick={() => navigate(`/ApInvoice/ApInvoiceDetail/${row.original.invoiceId}`)}
                >
                  <IconEye size={18} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Chỉnh sửa">
                <ActionIcon
                  variant="light"
                  color="yellow"
                  onClick={() => navigate(`/ApInvoice/Edit/${row.original.invoiceId}`)}
                >
                  <IconEdit size={18} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Xóa">
                <ActionIcon
                  variant="light"
                  color="red"
                  onClick={() => navigate(`/ApInvoice/Delete/${row.original.invoiceId}`)}
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

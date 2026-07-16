import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MRT_ColumnDef, MRT_PaginationState } from "mantine-react-table";
import { ActionIcon, Box, Button, Flex, Grid, TextInput, Select, Tooltip, Title, Badge } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconEdit, IconPlus, IconSearch, IconTrash, IconEye } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import DataTable from "../../_base/component/Core/DataTable";
import { StatusBadge } from "../../_base/component/Core/StatusBadge";
import { apPaymentService } from "../../api/apVendor/apPaymentMockService";
import { apVendorMasterService } from "../../api/apVendor/apVendorMasterMockService";
import { ApPayment } from "../../model/ApPaymentModel";
import { ApVendor } from "../../model/ApVendorMasterModel";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

export default function ApPaymentList() {
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<ApPayment[]>([]);
  const [vendors, setVendors] = useState<ApVendor[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [height, setHeight] = useState(500);

  const [keySearch, setKeySearch] = useState("");
  const [vendorFilter, setVendorFilter] = useState<number | null>(null);

  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const formSearch = useForm({
    initialValues: { keySearch: "", vendorId: "" }
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
      const res = await apPaymentService.getList({
        skip: pagination.pageIndex * pagination.pageSize,
        take: pagination.pageSize,
        keySearch,
        vendorId: vendorFilter
      });
      if (res?.success && res.data) {
        setData(res.data.items);
        setRowCount(res.data.totalItems);
      } else {
        setData([]);
        setRowCount(0);
      }
    } catch {
      NotificationExtension.Fails("Lỗi khi tải danh sách phiếu chi.");
    } finally {
      setIsLoading(false);
      setIsRefetching(false);
    }
  }, [pagination.pageIndex, pagination.pageSize, keySearch, vendorFilter]);

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
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const columns = useMemo<MRT_ColumnDef<ApPayment>[]>(
    () => [
      {
        accessorKey: "paymentNumber",
        header: "Số phiếu chi (Check Num)",
        size: 150,
        Cell: ({ row }) => (
          <span
            style={{ cursor: "pointer", color: "#228be6", fontWeight: 700 }}
            onClick={() => navigate(`/ApPayment/Detail/${row.original.paymentId}`)}
          >
            {row.original.paymentNumber}
          </span>
        )
      },
      {
        accessorKey: "checkDate",
        header: "Ngày chi",
        size: 140,
        Cell: ({ cell }) => {
          const val = cell.getValue() as string;
          return val ? new Date(val).toLocaleDateString("vi-VN") : "-";
        }
      },
      {
        accessorKey: "vendorName",
        header: "Nhà cung cấp nhận",
        size: 230,
      },
      {
        accessorKey: "amount",
        header: "Số tiền chi",
        size: 150,
        Cell: ({ row }) => (
          <strong style={{ color: "#2b8a3e" }}>
            {row.original.amount?.toLocaleString("vi-VN")} {row.original.currencyCode}
          </strong>
        )
      },
      {
        accessorKey: "paymentMethodLookupCode",
        header: "Phương thức",
        size: 130,
        Cell: ({ cell }) => {
          const val = cell.getValue() as string;
          return val === "WIRE" ? "Ủy nhiệm chi (WIRE)" : val === "CHECK" ? "Séc (CHECK)" : "Tiền mặt (CASH)";
        }
      },
      {
        accessorKey: "statusLookupCode",
        header: "Trạng thái",
        size: 130,
        Cell: ({ cell }) => {
          const val = cell.getValue() as string;
          const isCleared = val === "NEGOTIABLE" || val === "CLEARED";
          return <Badge color={isCleared ? "green" : "red"}>{val}</Badge>;
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
          <Title order={4}>Danh sách Phiếu chi & Thanh toán</Title>
        </Flex>

        <form onSubmit={formSearch.onSubmit(handleSearch)}>
          <Grid align="flex-end">
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                placeholder="Tìm số phiếu chi, nhà cung cấp, mã ngân hàng..."
                label="Từ khóa tìm kiếm"
                leftSection={<IconSearch size={18} color="#15aabf" />}
                {...formSearch.getInputProps("keySearch")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select
                label="Nhà cung cấp nhận"
                placeholder="Tất cả nhà cung cấp"
                clearable
                data={vendors.map((v) => ({ value: String(v.vendorId), label: v.vendorName }))}
                {...formSearch.getInputProps("vendorId")}
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
                  onClick={() => navigate("/ApPayment/Create")}
                >
                  Lập phiếu chi mới
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
                  onClick={() => navigate(`/ApPayment/Detail/${row.original.paymentId}`)}
                >
                  <IconEye size={18} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Chỉnh sửa">
                <ActionIcon
                  variant="light"
                  color="yellow"
                  onClick={() => navigate(`/ApPayment/Edit/${row.original.paymentId}`)}
                >
                  <IconEdit size={18} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Xóa">
                <ActionIcon
                  variant="light"
                  color="red"
                  onClick={() => navigate(`/ApPayment/Delete/${row.original.paymentId}`)}
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

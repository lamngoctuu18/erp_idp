import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MRT_ColumnDef, MRT_PaginationState } from "mantine-react-table";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  Select,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconEdit, IconEye, IconPlus, IconSearch, IconTrash } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { useNavigate } from "react-router-dom";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import DataTable from "../../../_base/component/Core/DataTable";
import { FaNotice, FaPageHeader, money } from "../_components/FaCommon";
import { FaAsset } from "../../../model/FixedAssetModel";
import { deleteAsset, getAssetList, FA_BOOKS } from "../../../api/fixed-asset/api";

const typeLabel: Record<string, string> = {
  CAPITALIZED: "Capitalized",
  CIP: "CIP",
  GROUP: "Group",
};

const AssetList = () => {
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<FaAsset[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [height, setHeight] = useState(560);

  const [keySearch, setKeySearch] = useState("");
  const [bookFilter, setBookFilter] = useState<string | null>("ALL");
  const [typeFilter, setTypeFilter] = useState<string | null>("ALL");
  const [statusFilter, setStatusFilter] = useState<string | null>("ALL");
  const [pagination, setPagination] = useState<MRT_PaginationState>({ pageIndex: 0, pageSize: 20 });

  const formSearch = useForm({ initialValues: { keySearch: "" } });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsRefetching(true);
    try {
      const res = await getAssetList({
        skip: pagination.pageIndex * pagination.pageSize,
        take: pagination.pageSize,
        keySearch,
        book: bookFilter || "ALL",
        assetType: typeFilter || "ALL",
        status: statusFilter || "ALL",
      });
      if (res?.success) {
        setData(res.data?.lists ?? []);
        setRowCount(res.data?.totalCount ?? 0);
      }
    } catch {
      NotificationExtension.Fails("Lỗi khi tải danh sách tài sản.");
      setData([]);
      setRowCount(0);
    } finally {
      setIsLoading(false);
      setIsRefetching(false);
    }
  }, [pagination.pageIndex, pagination.pageSize, keySearch, bookFilter, typeFilter, statusFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const handleResize = () => {
      if (headerRef.current) setHeight(window.innerHeight - headerRef.current.clientHeight - 300);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDelete = useCallback(
    async (assetNumber: string) => {
      const res = await deleteAsset(assetNumber);
      if (res?.success) {
        NotificationExtension.Success(`Đã xóa ${assetNumber}`);
        fetchData();
      } else {
        NotificationExtension.Fails(res?.message || "Xóa thất bại!");
      }
    },
    [fetchData]
  );

  const columns = useMemo<MRT_ColumnDef<FaAsset>[]>(
    () => [
      {
        accessorKey: "assetNumber",
        header: "Mã tài sản",
        size: 150,
        Cell: ({ row }: any) => (
          <Box>
            <Text
              style={{ cursor: "pointer", color: "#2563eb", fontWeight: 600 }}
              onClick={() => navigate(`/fixed-asset/asset/${row.original.assetNumber}`)}
            >
              {row.original.assetNumber}
            </Text>
            {row.original.tagNumber && (
              <Text size="xs" c="dimmed">
                {row.original.tagNumber}
              </Text>
            )}
          </Box>
        ),
      },
      { accessorKey: "description", header: "Tên tài sản", size: 220 },
      { accessorKey: "category", header: "Category", size: 200 },
      {
        accessorKey: "assetType",
        header: "Loại",
        size: 120,
        Cell: ({ row }: any) => typeLabel[row.original.assetType as string] || row.original.assetType,
      },
      {
        accessorKey: "currentCost",
        header: "Nguyên giá",
        size: 150,
        mantineTableBodyCellProps: { align: "right" },
        Cell: ({ row }: any) => money(row.original.currentCost),
      },
      {
        accessorKey: "netBookValue",
        header: "GTCL",
        size: 150,
        mantineTableBodyCellProps: { align: "right" },
        Cell: ({ row }: any) => money(row.original.netBookValue),
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        size: 120,
        Cell: ({ row }: any) => {
          const s = row.original.status;
          const color = s === "CIP" ? "yellow" : s === "Retired" ? "red" : s === "Draft" ? "gray" : "teal";
          return (
            <Badge color={color} variant="light">
              {s}
            </Badge>
          );
        },
      },
    ],
    [navigate]
  );

  return (
    <Box>
      <FaPageHeader
        actions={
          <Button color="blue" leftSection={<IconPlus size={14} />} onClick={() => navigate("/fixed-asset/addition")}>
            Thêm tài sản
          </Button>
        }
      />

      <FaNotice>
        <b>Quy tắc Sửa/Xóa:</b> chỉ tài sản chưa hạch toán và chưa chạy khấu hao mới được xóa. Tài sản đã phát sinh giao
        dịch chỉ được điều chỉnh qua nghiệp vụ tương ứng để giữ audit trail.
      </FaNotice>

      <Grid mb={16} align="end">
        <Grid.Col span={{ base: 12, md: 4 }}>
          <TextInput
            label="Mã / tên / thẻ tài sản"
            placeholder="VD: TS000184 hoặc xe nâng"
            leftSection={<IconSearch size={16} />}
            {...formSearch.getInputProps("keySearch")}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Select
            label="Book"
            data={[{ value: "ALL", label: "Tất cả Book" }, ...FA_BOOKS]}
            value={bookFilter}
            onChange={setBookFilter}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 6, md: 2 }}>
          <Select
            label="Loại"
            data={[
              { value: "ALL", label: "Tất cả" },
              { value: "CAPITALIZED", label: "Capitalized" },
              { value: "CIP", label: "CIP" },
              { value: "GROUP", label: "Group" },
            ]}
            value={typeFilter}
            onChange={setTypeFilter}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 6, md: 2 }}>
          <Select
            label="Trạng thái"
            data={[
              { value: "ALL", label: "Tất cả" },
              { value: "Active", label: "Active" },
              { value: "CIP", label: "CIP" },
              { value: "Retired", label: "Retired" },
            ]}
            value={statusFilter}
            onChange={setStatusFilter}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 1 }}>
          <Button
            fullWidth
            onClick={() => {
              setPagination((p) => ({ ...p, pageIndex: 0 }));
              setKeySearch(formSearch.values.keySearch);
            }}
          >
            Tìm
          </Button>
        </Grid.Col>
      </Grid>

      <div ref={headerRef} />

      <DataTable
        columns={columns}
        data={data}
        rowCount={rowCount}
        pagination={pagination}
        onPaginationChange={setPagination}
        isLoading={isLoading}
        isRefetching={isRefetching}
        height={height}
        actionColumnSize={130}
        renderRowActions={(row: any) => {
          const a = row.original as FaAsset;
          const locked = a.accounted || a.depreciated;
          const reason = a.depreciated ? "đã chạy khấu hao" : a.accounted ? "đã hạch toán" : "";
          return (
            <Flex gap="xs">
              <Tooltip label={locked ? "Xem" : "Sửa"}>
                <ActionIcon
                  variant="light"
                  color={locked ? "gray" : "yellow"}
                  onClick={() => navigate(`/fixed-asset/asset/${a.assetNumber}`)}
                >
                  {locked ? <IconEye size={18} stroke={1.5} /> : <IconEdit size={18} stroke={1.5} />}
                </ActionIcon>
              </Tooltip>
              <Tooltip label={locked ? `Khóa xóa: ${reason}` : "Xóa"}>
                <ActionIcon
                  variant="light"
                  color="red"
                  disabled={locked}
                  onClick={() =>
                    modals.openConfirmModal({
                      title: "Xác nhận xóa",
                      children: <Text>Bạn có chắc muốn xóa tài sản "{a.description}"?</Text>,
                      labels: { confirm: "Xóa", cancel: "Hủy" },
                      confirmProps: { color: "red" },
                      onConfirm: () => handleDelete(a.assetNumber),
                    })
                  }
                >
                  <IconTrash size={18} stroke={1.5} />
                </ActionIcon>
              </Tooltip>
            </Flex>
          );
        }}
      />
    </Box>
  );
};

export default AssetList;

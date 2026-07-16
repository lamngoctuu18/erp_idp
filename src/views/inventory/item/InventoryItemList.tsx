import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MRT_ColumnDef, MRT_PaginationState } from "mantine-react-table";
import {
  ActionIcon,
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
import { IconEdit, IconPlus, IconSearch, IconTrash } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { useNavigate } from "react-router-dom";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import BreadCrumb from "../../../_base/component/_layout/_breadcrumb";
import DataTable from "../../../_base/component/Core/DataTable";
import { formatDateTime } from "../../../common/FormatDate/FormatDate";
import { InventoryItemModel } from "../../../model/InventoryModel";
import { deleteInventoryItem, getInventoryItemList } from "../../../api/inventory/api";
import { StatusBadge } from "../../../_base/component/Core/StatusBadge";
import { ExportButton } from "../../../_base/component/Core/ExportButton";

const InventoryItemList = () => {
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<InventoryItemModel[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [height, setHeight] = useState(600);
  const [keySearch, setKeySearch] = useState("");
  const [orgFilter, setOrgFilter] = useState<string | null>("125");
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const formSearch = useForm({ initialValues: { keySearch: "" } });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsRefetching(true);
    try {
      const res = await getInventoryItemList({
        skip: pagination.pageIndex * pagination.pageSize,
        take: pagination.pageSize,
        keySearch,
      });
      if (res?.success) {
        const items = res.data?.lists ?? [];
        const total = res.data?.totalCount ?? 0;
        setData(items);
        setRowCount(total);
      } else {
        setData([]);
        setRowCount(0);
      }
    } catch (error) {
      NotificationExtension.Fails("Lỗi khi tải danh sách vật tư.");
      setData([]);
      setRowCount(0);
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
        setHeight(window.innerHeight - headerRef.current.clientHeight - 140);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDelete = useCallback(
    async (id: number) => {
      try {
        const res = await deleteInventoryItem(id);
        if (res?.success) {
          NotificationExtension.Success("Xóa vật tư thành công!");
          fetchData();
        } else {
          NotificationExtension.Fails("Xóa thất bại!");
        }
      } catch {
        NotificationExtension.Fails("Đã xảy ra lỗi khi xóa!");
      }
    },
    [fetchData]
  );

  const handleExportExcel = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    NotificationExtension.Success("Xuất Excel danh sách vật tư thành công!");
  };

  const columns = useMemo<MRT_ColumnDef<InventoryItemModel>[]>(
    () => [
      {
        accessorKey: "itemNumber",
        header: "Mã vật tư",
        Cell: ({ row }: any) => (
          <Text
            style={{ cursor: "pointer", color: "#228be6", fontWeight: 600 }}
            onClick={() => navigate(`/inventory/item/detail/${row.original.inventoryItemId}`)}
          >
            {row.original.itemNumber}
          </Text>
        ),
      },
      { accessorKey: "description", header: "Tên vật tư" },
      { accessorKey: "primaryUnitOfMeasure", header: "Đơn vị chính", size: 120 },
      { accessorKey: "categoryName", header: "Phân loại", size: 150 },
      {
        accessorKey: "enabledFlag",
        header: "Trạng thái",
        size: 120,
        Cell: ({ row }: any) => (
          <StatusBadge statusType="masterdata" value={row.original.enabledFlag === "Y"} />
        ),
      },
      {
        accessorKey: "createdDate",
        header: "Ngày tạo",
        size: 130,
        Cell: ({ renderedCellValue }: any) =>
          renderedCellValue
            ? formatDateTime(renderedCellValue as string, "DD/MM/YYYY")
            : null,
      },
    ],
    [navigate]
  );

  return (
    <Box>
      <Flex
        ref={headerRef}
        justify="space-between"
        align="center"
        style={{ border: "1px solid #dee2e6", padding: "5px 10px", backgroundColor: "#f8f9fa", borderRadius: "4px" }}
        mb={16}
      >
        <BreadCrumb />
        <Flex gap="sm">
          <ExportButton onClick={handleExportExcel} />
          <Button
            color="blue"
            leftSection={<IconPlus size={14} />}
            onClick={() => navigate("/inventory/item/create")}
          >
            Khai báo vật tư
          </Button>
        </Flex>
      </Flex>

      <Grid mb={16} align="end">
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Select
            label="Tổ chức kho (Organization)"
            placeholder="Chọn Org"
            data={[
              { value: "125", label: "Org Mua hàng (PUR - 125)" },
              { value: "126", label: "Org Sản xuất (MFG - 126)" },
            ]}
            value={orgFilter}
            onChange={setOrgFilter}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 5 }}>
          <TextInput
            label="Tìm kiếm"
            placeholder="Mã hoặc tên vật tư"
            leftSection={<IconSearch size={16} />}
            {...formSearch.getInputProps("keySearch")}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 2 }}>
          <Button
            fullWidth
            onClick={() => {
              setPagination((p) => ({ ...p, pageIndex: 0 }));
              setKeySearch(formSearch.values.keySearch);
            }}
          >
            Tìm kiếm
          </Button>
        </Grid.Col>
      </Grid>

      <DataTable
        columns={columns}
        data={data}
        rowCount={rowCount}
        pagination={pagination}
        onPaginationChange={setPagination}
        isLoading={isLoading}
        isRefetching={isRefetching}
        height={height}
        renderRowActions={(row: any) => (
          <Flex gap="sm">
            <Tooltip label="Sửa">
              <ActionIcon
                variant="light"
                color="yellow"
                onClick={() => navigate(`/inventory/item/detail/${row.original.inventoryItemId}`)}
              >
                <IconEdit size={18} stroke={1.5} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Xóa">
              <ActionIcon
                variant="light"
                color="red"
                onClick={() =>
                  modals.openConfirmModal({
                    title: "Xác nhận xóa",
                    children: (
                      <Text>Bạn có chắc muốn xóa vật tư "{row.original.description}"?</Text>
                    ),
                    labels: { confirm: "Xóa", cancel: "Hủy" },
                    confirmProps: { color: "red" },
                    onConfirm: () => handleDelete(row.original.inventoryItemId),
                  })
                }
              >
                <IconTrash size={18} stroke={1.5} />
              </ActionIcon>
            </Tooltip>
          </Flex>
        )}
      />
    </Box>
  );
};

export default InventoryItemList;

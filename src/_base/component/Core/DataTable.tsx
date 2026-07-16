import { ReactNode, useMemo } from "react";
import {
  MantineReactTable,
  useMantineReactTable,
  MRT_ColumnDef,
  MRT_PaginationState,
  MRT_Row,
  MRT_TableOptions,
} from "mantine-react-table";
import { _localization } from "../../../config/location";

/**
 * DataTable — khung bảng danh sách chuẩn cho các màn hình List.
 *
 * Gói sẵn: cột STT (đánh số theo trang), cột "Thao tác" pin phải,
 * localization tiếng Việt, phân trang server-side, sticky header,
 * resize cột, mật độ hiển thị gọn (density xs).
 *
 * @example
 * ```tsx
 * const columns = useMemo<MRT_ColumnDef<ExampleModel>[]>(() => [
 *   { accessorKey: "code", header: "Mã" },
 *   { accessorKey: "name", header: "Tên" },
 * ], []);
 *
 * <DataTable
 *   columns={columns}                 // chỉ khai báo cột dữ liệu
 *   data={data}
 *   rowCount={rowCount}
 *   pagination={pagination}
 *   onPaginationChange={setPagination}
 *   isLoading={isLoading}
 *   isRefetching={isRefetching}
 *   height={height}
 *   renderRowActions={(row) => (      // có prop này -> tự thêm cột "Thao tác"
 *     <ActionIcon onClick={() => edit(row.original.id)}>...</ActionIcon>
 *   )}
 * />
 * ```
 */
export interface DataTableProps<T extends Record<string, any>> {
  /** Các cột dữ liệu — KHÔNG cần khai báo STT / Thao tác */
  columns: MRT_ColumnDef<T>[];
  data: T[];
  /** Tổng số bản ghi (server trả về) cho phân trang manual */
  rowCount: number;
  pagination: MRT_PaginationState;
  onPaginationChange: MRT_TableOptions<T>["onPaginationChange"];
  isLoading?: boolean;
  isRefetching?: boolean;
  /** maxHeight vùng cuộn của bảng (px). Mặc định 500 */
  height?: number;
  /** Tự thêm cột STT pin trái. Mặc định true */
  enableSTT?: boolean;
  /** Render nút thao tác từng dòng — truyền vào sẽ tự thêm cột "Thao tác" pin phải */
  renderRowActions?: (row: MRT_Row<T>) => ReactNode;
  /** Độ rộng cột "Thao tác". Mặc định 110 */
  actionColumnSize?: number;
  /** Ghi đè / bổ sung mọi option khác của MantineReactTable khi cần */
  tableOptions?: Partial<MRT_TableOptions<T>>;
}

const DataTable = <T extends Record<string, any>>({
  columns,
  data,
  rowCount,
  pagination,
  onPaginationChange,
  isLoading = false,
  isRefetching = false,
  height = 500,
  enableSTT = true,
  renderRowActions,
  actionColumnSize = 110,
  tableOptions,
}: DataTableProps<T>) => {
  const allColumns = useMemo<MRT_ColumnDef<T>[]>(() => {
    const cols: MRT_ColumnDef<T>[] = [];

    if (enableSTT) {
      cols.push({
        id: "STT",
        header: "STT",
        size: 70,
        enableSorting: false,
        enableColumnActions: false,
        Cell: ({ row }) => (
          <span>
            {row.index + 1 + pagination.pageIndex * pagination.pageSize}
          </span>
        ),
      });
    }

    cols.push(...columns);

    if (renderRowActions) {
      cols.push({
        id: "action",
        header: "Thao tác",
        size: actionColumnSize,
        enableSorting: false,
        enableColumnActions: false,
        Cell: ({ row }) => <>{renderRowActions(row)}</>,
      });
    }

    return cols;
  }, [
    columns,
    enableSTT,
    renderRowActions,
    actionColumnSize,
    pagination.pageIndex,
    pagination.pageSize,
  ]);

  const table = useMantineReactTable<T>({
    columns: allColumns,
    data,
    localization: _localization,
    enableColumnResizing: true,
    enableTopToolbar: false,
    enableRowSelection: false,
    enableStickyHeader: true,
    enableColumnPinning: true,
    manualPagination: true,
    rowCount,
    onPaginationChange,
    initialState: {
      density: "xs",
      columnPinning: {
        left: enableSTT ? ["STT"] : [],
        right: renderRowActions ? ["action"] : [],
      },
    },
    state: {
      isLoading,
      pagination,
      showProgressBars: isRefetching,
      showSkeletons: isLoading,
    },
    mantineTableContainerProps: {
      style: { maxHeight: height, minHeight: 300, overflow: "auto" },
    },
    mantinePaginationProps: {
      rowsPerPageOptions: ["20", "50", "100"],
    },
    ...tableOptions,
  });

  return <MantineReactTable table={table} />;
};

export default DataTable;

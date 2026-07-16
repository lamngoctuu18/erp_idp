import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MRT_ColumnDef, MRT_PaginationState } from "mantine-react-table";
import { Box, Button, Flex, Badge, Text, ActionIcon, Tooltip } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { IconPlus, IconCheck, IconSettings, IconReload } from "@tabler/icons-react";
import BreadCrumb from "../../../_base/component/_layout/_breadcrumb";
import DataTable from "../../../_base/component/Core/DataTable";
import { MoveOrderHeaderModel } from "../../../model/InventoryModel";
import { getMoveOrders, approveMoveOrder } from "../../../api/inventory/api";
import { formatDateTime } from "../../../common/FormatDate/FormatDate";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";

const MoveOrderList = () => {
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<MoveOrderHeaderModel[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [height, setHeight] = useState(600);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const fetchMoveOrders = useCallback(async () => {
    setIsLoading(true);
    setIsRefetching(true);
    try {
      const res = await getMoveOrders();
      if (res?.success && res.data) {
        const items = res.data;
        const skip = pagination.pageIndex * pagination.pageSize;
        const pageItems = items.slice(skip, skip + pagination.pageSize);
        setData(pageItems);
        setRowCount(items.length);
      } else {
        setData([]);
        setRowCount(0);
      }
    } catch {
      NotificationExtension.Fails("Không thể tải danh sách Move Order.");
      setData([]);
      setRowCount(0);
    } finally {
      setIsLoading(false);
      setIsRefetching(false);
    }
  }, [pagination.pageIndex, pagination.pageSize]);

  useEffect(() => {
    fetchMoveOrders();
  }, [fetchMoveOrders]);

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

  const handleApprove = async (headerId: number) => {
    try {
      const res = await approveMoveOrder(headerId);
      if (res?.success) {
        NotificationExtension.Success("Đã duyệt yêu cầu Move Order thành công!");
        fetchMoveOrders();
      }
    } catch {
      NotificationExtension.Fails("Lỗi khi duyệt yêu cầu.");
    }
  };

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 1: return <Badge color="gray">Chưa hoàn thành</Badge>;
      case 2: return <Badge color="yellow">Chờ phê duyệt</Badge>;
      case 3: return <Badge color="blue">Đã duyệt (Chờ cấp phát)</Badge>;
      case 4: return <Badge color="red">Từ chối</Badge>;
      case 5: return <Badge color="green">Đã cấp phát (Closed)</Badge>;
      case 6: return <Badge color="gray" variant="dashed">Đã hủy</Badge>;
      default: return <Badge color="gray">Không rõ</Badge>;
    }
  };

  const columns = useMemo<MRT_ColumnDef<MoveOrderHeaderModel>[]>(
    () => [
      {
        accessorKey: "requestNumber",
        header: "Mã yêu cầu (Request #)",
        size: 160,
        Cell: ({ row }: any) => (
          <Text
            style={{ cursor: "pointer", color: "#228be6", fontWeight: 600 }}
            onClick={() => navigate(`/inventory/move-order/process/${row.original.headerId}`)}
          >
            {row.original.requestNumber}
          </Text>
        )
      },
      {
        accessorKey: "moveOrderType",
        header: "Loại yêu cầu",
        size: 150,
        Cell: ({ row }: any) => row.original.moveOrderType === 1 ? "Yêu cầu NVL (Requisition)" : "Cấp phát khác"
      },
      {
        accessorKey: "description",
        header: "Lý do yêu cầu / Diễn giải",
        size: 250
      },
      {
        accessorKey: "dateRequired",
        header: "Ngày cần hàng",
        size: 130,
        Cell: ({ row }: any) => formatDateTime(row.original.dateRequired, "DD/MM/YYYY")
      },
      {
        accessorKey: "headerStatus",
        header: "Trạng thái",
        size: 150,
        Cell: ({ row }: any) => getStatusBadge(row.original.headerStatus)
      },
      {
        accessorKey: "creationDate",
        header: "Ngày lập phiếu",
        size: 150,
        Cell: ({ row }: any) => formatDateTime(row.original.creationDate, "DD/MM/YYYY HH:mm")
      }
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
          <Button
            variant="outline"
            color="gray"
            leftSection={<IconReload size={14} />}
            onClick={fetchMoveOrders}
          >
            Làm mới
          </Button>
          <Button
            color="blue"
            leftSection={<IconPlus size={14} />}
            onClick={() => navigate("/inventory/move-order/create")}
          >
            Tạo yêu cầu cấp phát
          </Button>
        </Flex>
      </Flex>

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
            {row.original.headerStatus === 2 && (
              <Tooltip label="Duyệt yêu cầu">
                <ActionIcon
                  variant="light"
                  color="green"
                  onClick={() => handleApprove(row.original.headerId)}
                >
                  <IconCheck size={18} />
                </ActionIcon>
              </Tooltip>
            )}
            {(row.original.headerStatus === 3 || row.original.headerStatus === 2) && (
              <Tooltip label="Xử lý cấp phát kho">
                <ActionIcon
                  variant="light"
                  color="blue"
                  onClick={() => navigate(`/inventory/move-order/process/${row.original.headerId}`)}
                >
                  <IconSettings size={18} />
                </ActionIcon>
              </Tooltip>
            )}
          </Flex>
        )}
      />
    </Box>
  );
};

export default MoveOrderList;

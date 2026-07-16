import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MRT_ColumnDef, MRT_PaginationState } from "mantine-react-table";
import { Box, Button, Flex, Badge, Text, Group, Modal, Table, Card, Grid } from "@mantine/core";
import { IconPlus, IconReload, IconEye } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import BreadCrumb from "../../../_base/component/_layout/_breadcrumb";
import DataTable from "../../../_base/component/Core/DataTable";
import { TransferSlipModel, MaterialTransactionModel } from "../../../model/InventoryModel";
import { getTransferSlips, getTransferSlipDetails } from "../../../api/inventory/api";
import { formatDateTime } from "../../../common/FormatDate/FormatDate";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";

const TransferTransactionList = () => {
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<TransferSlipModel[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [height, setHeight] = useState(550);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  // Modal xem chi tiết phiếu
  const [selectedShipment, setSelectedShipment] = useState<string | null>(null);
  const [details, setDetails] = useState<MaterialTransactionModel[]>([]);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const fetchSlips = useCallback(async () => {
    setIsLoading(true);
    setIsRefetching(true);
    try {
      const res = await getTransferSlips();
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
      NotificationExtension.Fails("Không thể tải danh sách phiếu chuyển kho.");
    } finally {
      setIsLoading(false);
      setIsRefetching(false);
    }
  }, [pagination.pageIndex, pagination.pageSize]);

  useEffect(() => {
    fetchSlips();
  }, [fetchSlips]);

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

  const handleViewDetails = async (shipmentNum: string) => {
    setSelectedShipment(shipmentNum);
    setDetailsLoading(true);
    try {
      const res = await getTransferSlipDetails(shipmentNum);
      if (res?.success && res.data) {
        // Group by transactionId to avoid double listing Out/In for detail lines
        // Filter out inbound records to display each transfer line once
        const filteredLines = res.data.filter(t => t.transactionQuantity < 0);
        setDetails(filteredLines);
      } else {
        setDetails([]);
      }
    } catch {
      NotificationExtension.Fails("Không thể tải chi tiết phiếu chuyển.");
    } finally {
      setDetailsLoading(false);
    }
  };

  const columns = useMemo<MRT_ColumnDef<TransferSlipModel>[]>(
    () => [
      {
        accessorKey: "shipmentNumber",
        header: "Mã vận đơn / Phiếu",
        size: 160,
        Cell: ({ row }: any) => (
          <Text
            onClick={() => handleViewDetails(row.original.shipmentNumber)}
            style={{ 
              fontFamily: "monospace", 
              fontWeight: 600, 
              color: "#1971c2", 
              cursor: "pointer",
              textDecoration: "underline"
            }}
          >
            {row.original.shipmentNumber}
          </Text>
        )
      },
      {
        accessorKey: "transactionDate",
        header: "Ngày lập phiếu",
        size: 150,
        Cell: ({ row }: any) => formatDateTime(row.original.transactionDate, "DD/MM/YYYY HH:mm")
      },
      {
        accessorKey: "transferType",
        header: "Phân loại chuyển",
        size: 180,
        Cell: ({ row }: any) => {
          const isSub = row.original.transferType === "SUBINVENTORY";
          return (
            <Badge color={isSub ? "teal" : "blue"} variant="light">
              {isSub ? "Chuyển kho nội bộ" : "Chuyển giữa 2 đơn vị"}
            </Badge>
          );
        }
      },
      {
        accessorKey: "fromSubinventory",
        header: "Từ kho",
        size: 100,
        Cell: ({ row }: any) => <Badge color="gray">{row.original.fromSubinventory}</Badge>
      },
      {
        accessorKey: "toSubinventory",
        header: "Đến kho / Đơn vị",
        size: 160,
        Cell: ({ row }: any) => {
          const isSub = row.original.transferType === "SUBINVENTORY";
          return isSub ? (
            <Badge color="gray">{row.original.toSubinventory}</Badge>
          ) : (
            <Text size="sm" style={{ fontWeight: 600 }}>
              Org {row.original.toOrgCode} ({row.original.toSubinventory})
            </Text>
          );
        }
      },
      {
        accessorKey: "itemsSummary",
        header: "Vật tư chuyển",
        size: 260,
        Cell: ({ row }: any) => (
          <Text size="sm" truncate style={{ maxWidth: "240px" }}>
            {row.original.itemsSummary}
          </Text>
        )
      },
      {
        accessorKey: "lineCount",
        header: "Số dòng",
        size: 90,
        Cell: ({ row }: any) => (
          <Text className="erp-number" style={{ fontWeight: 600 }}>{row.original.lineCount}</Text>
        )
      },
      {
        accessorKey: "totalQuantity",
        header: "Tổng lượng",
        size: 110,
        Cell: ({ row }: any) => (
          <Text className="erp-number" style={{ fontWeight: 600, color: "#1971c2" }}>
            {row.original.totalQuantity.toLocaleString()}
          </Text>
        )
      },
      {
        id: "actions",
        header: "Hành động",
        size: 100,
        Cell: ({ row }: any) => (
          <Button
            size="xs"
            variant="subtle"
            leftSection={<IconEye size={12} />}
            onClick={() => handleViewDetails(row.original.shipmentNumber)}
          >
            Xem
          </Button>
        )
      }
    ],
    []
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
        <Group>
          <Button
            variant="outline"
            color="gray"
            leftSection={<IconReload size={14} />}
            onClick={fetchSlips}
          >
            Làm mới
          </Button>
          <Button
            style={{ backgroundColor: "#1971c2" }}
            leftSection={<IconPlus size={14} />}
            onClick={() => navigate("/inventory/transaction/transfer/create")}
          >
            Lập phiếu Chuyển kho mới
          </Button>
        </Group>
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
      />

      {/* Modal chi tiết phiếu chuyển */}
      <Modal
        opened={selectedShipment !== null}
        onClose={() => setSelectedShipment(null)}
        title={`Chi tiết phiếu chuyển kho: ${selectedShipment}`}
        size="lg"
      >
        {detailsLoading ? (
          <Text>Đang tải dữ liệu...</Text>
        ) : (
          <Box>
            <Card withBorder p="md" radius="md" mb="md" style={{ backgroundColor: "#f8fafc" }}>
              <Grid>
                <Grid.Col span={4}>
                  <Text size="xs" c="dimmed">Mã phiếu/vận đơn</Text>
                  <Text style={{ fontWeight: 700 }} size="sm">{selectedShipment}</Text>
                </Grid.Col>
                <Grid.Col span={4}>
                  <Text size="xs" c="dimmed">Loại hình chuyển</Text>
                  <Text style={{ fontWeight: 700 }} size="sm" c="blue">
                    {details[0]?.transactionActionId === 2 ? "Chuyển kho nội bộ" : "Chuyển giữa 2 đơn vị (Inter-Org)"}
                  </Text>
                </Grid.Col>
                <Grid.Col span={4}>
                  <Text size="xs" c="dimmed">Ngày chuyển</Text>
                  <Text style={{ fontWeight: 700 }} size="sm">{details[0] ? formatDateTime(details[0].transactionDate, "DD/MM/YYYY HH:mm") : ""}</Text>
                </Grid.Col>

                <Grid.Col span={4} mt={5}>
                  <Text size="xs" c="dimmed">Kho xuất nguồn</Text>
                  <Text size="sm" style={{ fontWeight: 600 }}>{details[0]?.subinventoryCode}</Text>
                </Grid.Col>
                <Grid.Col span={4} mt={5}>
                  <Text size="xs" c="dimmed">Kho/Đơn vị đích</Text>
                  <Text size="sm" style={{ fontWeight: 600 }}>
                    {details[0]?.transferSubinventory} 
                    {details[0]?.transferOrganizationCode ? ` (Org ${details[0].transferOrganizationCode})` : ""}
                  </Text>
                </Grid.Col>
                <Grid.Col span={4} mt={5}>
                  <Text size="xs" c="dimmed">Người lập phiếu</Text>
                  <Text size="sm" style={{ fontWeight: 600 }}>Nguyễn Văn Hùng</Text>
                </Grid.Col>

                {details[0]?.waybillAirbill && (
                  <Grid.Col span={6} mt={5}>
                    <Text size="xs" c="dimmed">Số vận đơn (Waybill)</Text>
                    <Text size="sm" style={{ fontFamily: "monospace" }}>{details[0].waybillAirbill}</Text>
                  </Grid.Col>
                )}
                {details[0]?.freightCode && (
                  <Grid.Col span={6} mt={5}>
                    <Text size="xs" c="dimmed">Đơn vị vận chuyển (Freight)</Text>
                    <Text size="sm">{details[0].freightCode}</Text>
                  </Grid.Col>
                )}

                <Grid.Col span={12} mt={5} style={{ borderTop: "1px dashed #dee2e6", paddingTop: "5px" }}>
                  <Text size="xs" c="dimmed">Diễn giải chung (Description)</Text>
                  <Text size="sm" style={{ fontStyle: "italic" }}>{details[0]?.reason || "Không có diễn giải"}</Text>
                </Grid.Col>
              </Grid>
            </Card>

            <Table withTableBorder withColumnBorders highlightOnHover>
              <Table.Thead style={{ backgroundColor: "#f8f9fa" }}>
                <Table.Tr>
                  <Table.Th>Mã vật tư</Table.Th>
                  <Table.Th>Vị trí nguồn</Table.Th>
                  <Table.Th>Vị trí đích</Table.Th>
                  <Table.Th>Số lô</Table.Th>
                  <Table.Th>Số lượng</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {details.map((line, idx) => (
                  <Table.Tr key={idx}>
                    <Table.Td style={{ fontWeight: 600 }}>{line.itemNumber}</Table.Td>
                    <Table.Td>{line.locatorCode || "-"}</Table.Td>
                    <Table.Td>{line.transferLocatorCode || "-"}</Table.Td>
                    <Table.Td>{line.lotNumber ? <Badge color="orange">{line.lotNumber}</Badge> : "-"}</Table.Td>
                    <Table.Td className="erp-number" style={{ fontWeight: 600, color: "#1971c2" }}>
                      {Math.abs(line.transactionQuantity).toLocaleString()} Tam
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Box>
        )}
      </Modal>
    </Box>
  );
};

export default TransferTransactionList;

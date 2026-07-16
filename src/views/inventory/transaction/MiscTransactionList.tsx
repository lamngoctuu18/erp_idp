import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MRT_ColumnDef, MRT_PaginationState } from "mantine-react-table";
import { Box, Button, Flex, Badge, Text, Group, Modal, Table, Card, Grid } from "@mantine/core";
import { IconPlus, IconReload, IconEye } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import BreadCrumb from "../../../_base/component/_layout/_breadcrumb";
import DataTable from "../../../_base/component/Core/DataTable";
import { MiscSlipModel, MaterialTransactionModel } from "../../../model/InventoryModel";
import { getMiscSlips, getMiscSlipDetails } from "../../../api/inventory/api";
import { formatDateTime } from "../../../common/FormatDate/FormatDate";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";

const MiscTransactionList = () => {
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement>(null);
  
  const [data, setData] = useState<MiscSlipModel[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [height, setHeight] = useState(550);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  // Modal xem chi tiết phiếu
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [details, setDetails] = useState<MaterialTransactionModel[]>([]);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const fetchSlips = useCallback(async () => {
    setIsLoading(true);
    setIsRefetching(true);
    try {
      const res = await getMiscSlips();
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
      NotificationExtension.Fails("Không thể tải danh sách phiếu nhập xuất.");
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

  const handleViewDetails = async (docNum: string) => {
    setSelectedDoc(docNum);
    setDetailsLoading(true);
    try {
      const res = await getMiscSlipDetails(docNum);
      if (res?.success && res.data) {
        setDetails(res.data);
      } else {
        setDetails([]);
      }
    } catch {
      NotificationExtension.Fails("Không thể tải chi tiết phiếu.");
    } finally {
      setDetailsLoading(false);
    }
  };

  const columns = useMemo<MRT_ColumnDef<MiscSlipModel>[]>(
    () => [
      {
        accessorKey: "documentNumber",
        header: "Số chứng từ",
        size: 150,
        Cell: ({ row }: any) => (
          <Text
            onClick={() => handleViewDetails(row.original.documentNumber)}
            style={{ 
              fontFamily: "monospace", 
              fontWeight: 600, 
              color: "#1971c2", 
              cursor: "pointer",
              textDecoration: "underline"
            }}
          >
            {row.original.documentNumber}
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
        accessorKey: "transactionTypeName",
        header: "Loại phiếu",
        size: 160,
        Cell: ({ row }: any) => {
          const isReceipt = row.original.transactionTypeName.includes("Nhập");
          return (
            <Badge color={isReceipt ? "blue" : "indigo"} variant="light">
              {row.original.transactionTypeName}
            </Badge>
          );
        }
      },
      {
        accessorKey: "receivedBy",
        header: "Người/Nơi nhận",
        size: 180,
        Cell: ({ row }: any) => row.original.receivedBy || "-"
      },
      {
        accessorKey: "itemsSummary",
        header: "Danh sách vật tư",
        size: 300,
        Cell: ({ row }: any) => (
          <Text size="sm" truncate style={{ maxWidth: "280px" }}>
            {row.original.itemsSummary}
          </Text>
        )
      },
      {
        accessorKey: "lineCount",
        header: "Số dòng",
        size: 100,
        Cell: ({ row }: any) => (
          <Text className="erp-number" style={{ fontWeight: 600 }}>{row.original.lineCount}</Text>
        )
      },
      {
        accessorKey: "totalQuantity",
        header: "Tổng lượng",
        size: 120,
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
            onClick={() => handleViewDetails(row.original.documentNumber)}
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
            onClick={() => navigate("/inventory/transaction/misc/create")}
          >
            Lập phiếu Nhập/Xuất mới
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

      {/* Modal chi tiết phiếu */}
      <Modal
        opened={selectedDoc !== null}
        onClose={() => setSelectedDoc(null)}
        title={`Chi tiết chứng từ Nhập/Xuất trực tiếp: ${selectedDoc}`}
        size="lg"
      >
        {detailsLoading ? (
          <Text>Đang tải dữ liệu...</Text>
        ) : (
          <Box>
            <Card withBorder p="md" radius="md" mb="md" style={{ backgroundColor: "#f8fafc" }}>
              <Grid>
                <Grid.Col span={4}>
                  <Text size="xs" c="dimmed">Số chứng từ</Text>
                  <Text style={{ fontWeight: 700 }} size="sm">{selectedDoc}</Text>
                </Grid.Col>
                <Grid.Col span={4}>
                  <Text size="xs" c="dimmed">Đơn vị (Organization)</Text>
                  <Text style={{ fontWeight: 700 }} size="sm">{details[0]?.organizationCode === "MFG" ? "Org Sản xuất (MFG - 126)" : "Org Mua hàng (PUR - 125)"}</Text>
                </Grid.Col>
                <Grid.Col span={4}>
                  <Text size="xs" c="dimmed">Loại phiếu</Text>
                  <Text style={{ fontWeight: 700 }} size="sm" c="blue">{details[0]?.transactionTypeName}</Text>
                </Grid.Col>
                
                <Grid.Col span={4} mt={5}>
                  <Text size="xs" c="dimmed">Ngày lập phiếu</Text>
                  <Text size="sm">{details[0] ? formatDateTime(details[0].transactionDate, "DD/MM/YYYY HH:mm") : ""}</Text>
                </Grid.Col>
                <Grid.Col span={4} mt={5}>
                  <Text size="xs" c="dimmed">Người lập phiếu</Text>
                  <Text size="sm" style={{ fontWeight: 600 }}>Nguyễn Văn Hùng</Text>
                </Grid.Col>
                <Grid.Col span={4} mt={5}>
                  <Text size="xs" c="dimmed">Người giao/nhận</Text>
                  <Text size="sm">{details[0]?.receivedBy || "-"}</Text>
                </Grid.Col>

                <Grid.Col span={12} mt={5} style={{ borderTop: "1px dashed #dee2e6", paddingTop: "5px" }}>
                  <Text size="xs" c="dimmed">Diễn giải chung (Description)</Text>
                  <Text size="sm" style={{ fontStyle: "italic" }}>{details[0]?.reason || "Không có diễn giải"}</Text>
                </Grid.Col>
              </Grid>
            </Card>

            <Table withTableBorder withColumnBorders highlightOnHover>
              <Table.Thead style={{ backgroundColor: "#f8f9fa" }}>
                <Table.Tr>
                  <Table.Th>Vật tư</Table.Th>
                  <Table.Th>Kho con</Table.Th>
                  <Table.Th>Vị trí</Table.Th>
                  <Table.Th>Số lô</Table.Th>
                  <Table.Th>Số lượng</Table.Th>
                  <Table.Th>Đơn giá GD</Table.Th>
                  <Table.Th>Lý do</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {details.map((line, idx) => (
                  <Table.Tr key={idx}>
                    <Table.Td style={{ fontWeight: 600 }}>{line.itemNumber}</Table.Td>
                    <Table.Td>{line.subinventoryCode}</Table.Td>
                    <Table.Td>{line.locatorCode || "-"}</Table.Td>
                    <Table.Td>{line.lotNumber ? <Badge color="orange">{line.lotNumber}</Badge> : "-"}</Table.Td>
                    <Table.Td className="erp-number" style={{ fontWeight: 600 }}>
                      {Math.abs(line.transactionQuantity).toLocaleString()} {line.transactionUom}
                    </Table.Td>
                    <Table.Td className="erp-number">
                      {line.actualCost.toLocaleString()} đ
                    </Table.Td>
                    <Table.Td>{line.reason || "-"}</Table.Td>
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

export default MiscTransactionList;

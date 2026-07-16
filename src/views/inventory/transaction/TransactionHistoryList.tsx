import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MRT_ColumnDef, MRT_PaginationState } from "mantine-react-table";
import { Box, Button, Flex, Grid, Badge, Text, ActionIcon, Modal, Table, Divider, Title } from "@mantine/core";
import { IconReload, IconEye } from "@tabler/icons-react";
import BreadCrumb from "../../../_base/component/_layout/_breadcrumb";
import DataTable from "../../../_base/component/Core/DataTable";
import { MaterialTransactionModel, TransactionAccountModel } from "../../../model/InventoryModel";
import { getTransactionHistory, getTransactionAccounts } from "../../../api/inventory/api";
import { formatDateTime } from "../../../common/FormatDate/FormatDate";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";

const TransactionHistoryList = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<MaterialTransactionModel[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [height, setHeight] = useState(600);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  // Modal details state
  const [selectedTxn, setSelectedTxn] = useState<MaterialTransactionModel | null>(null);
  const [accounts, setAccounts] = useState<TransactionAccountModel[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    setIsRefetching(true);
    try {
      const res = await getTransactionHistory();
      if (res?.success && res.data) {
        // Client side pagination
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
      NotificationExtension.Fails("Không thể tải lịch sử giao dịch.");
      setData([]);
      setRowCount(0);
    } finally {
      setIsLoading(false);
      setIsRefetching(false);
    }
  }, [pagination.pageIndex, pagination.pageSize]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

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

  const handleViewDetail = async (txn: MaterialTransactionModel) => {
    setSelectedTxn(txn);
    setIsModalOpen(true);
    setIsModalLoading(true);
    try {
      const res = await getTransactionAccounts();
      if (res?.success && res.data) {
        const filtered = res.data.filter(acc => acc.transactionId === txn.transactionId);
        setAccounts(filtered);
      } else {
        setAccounts([]);
      }
    } catch {
      console.error("Lỗi khi tải định khoản kế toán.");
      setAccounts([]);
    } finally {
      setIsModalLoading(false);
    }
  };

  const columns = useMemo<MRT_ColumnDef<MaterialTransactionModel>[]>(
    () => [
      {
        accessorKey: "transactionId",
        header: "Mã giao dịch (Txn ID)",
        size: 160,
        Cell: ({ row }: any) => (
          <Text
            style={{ cursor: "pointer", color: "#1971c2", fontWeight: 700, fontFamily: "monospace", textDecoration: "underline" }}
            onClick={() => handleViewDetail(row.original)}
          >
            {row.original.transactionId}
          </Text>
        )
      },
      {
        accessorKey: "transactionDate",
        header: "Ngày giao dịch",
        size: 150,
        Cell: ({ row }: any) => formatDateTime(row.original.transactionDate, "DD/MM/YYYY HH:mm")
      },
      {
        accessorKey: "itemNumber",
        header: "Vật tư",
        size: 130
      },
      {
        accessorKey: "transactionTypeName",
        header: "Loại giao dịch",
        size: 180,
        Cell: ({ row }: any) => {
          const isReceipt = row.original.transactionQuantity > 0;
          return (
            <Badge color={isReceipt ? "green" : "red"} variant="filled">
              {row.original.transactionTypeName}
            </Badge>
          );
        }
      },
      {
        accessorKey: "subinventoryCode",
        header: "Kho con",
        size: 100,
        Cell: ({ row }: any) => <Badge color="blue">{row.original.subinventoryCode}</Badge>
      },
      {
        accessorKey: "locatorCode",
        header: "Vị trí",
        size: 110,
        Cell: ({ row }: any) => row.original.locatorCode || <Text c="dimmed" size="xs">Không có</Text>
      },
      {
        accessorKey: "lotNumber",
        header: "Số lô (Lot)",
        size: 110,
        Cell: ({ row }: any) => row.original.lotNumber ? (
          <Badge color="orange">{row.original.lotNumber}</Badge>
        ) : (
          <Text c="dimmed" size="xs">-</Text>
        )
      },
      {
        accessorKey: "transactionQuantity",
        header: "Số lượng GD",
        size: 120,
        Cell: ({ row }: any) => {
          const qty = row.original.transactionQuantity;
          return (
            <Text style={{ fontWeight: 600, color: qty > 0 ? "green" : "red", fontFamily: "monospace" }}>
              {qty > 0 ? `+${qty.toLocaleString()}` : qty.toLocaleString()} {row.original.transactionUom}
            </Text>
          );
        }
      },
      {
        accessorKey: "actualCost",
        header: "Đơn giá gốc",
        size: 130,
        Cell: ({ row }: any) => `${row.original.actualCost.toLocaleString()} đ`
      },
      {
        accessorKey: "documentNumber",
        header: "Số chứng từ",
        size: 130,
        Cell: ({ row }: any) => row.original.documentNumber || "-"
      },
      {
        accessorKey: "receivedBy",
        header: "Người/Nơi nhận",
        size: 150,
        Cell: ({ row }: any) => row.original.receivedBy || "-"
      },
      {
        accessorKey: "reason",
        header: "Lý do",
        size: 180
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
        <Button
          variant="outline"
          color="blue"
          leftSection={<IconReload size={14} />}
          onClick={fetchHistory}
        >
          Làm mới dữ liệu
        </Button>
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
          <ActionIcon
            color="blue"
            variant="light"
            title="Xem chi tiết giao dịch & định khoản"
            onClick={() => handleViewDetail(row.original)}
          >
            <IconEye size={16} />
          </ActionIcon>
        )}
        actionColumnSize={80}
      />

      {/* Modal Chi tiết Giao dịch & Định khoản */}
      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Chi tiết giao dịch kho & Bút toán định khoản"
        size="lg"
        radius="md"
      >
        {selectedTxn && (
          <Box>
            <Title order={5} c="blue" mb="md">Thông tin chung giao dịch</Title>
            <Grid mb="lg">
              <Grid.Col span={6}>
                <Text size="xs" c="dimmed">Mã giao dịch (ID)</Text>
                <Text style={{ fontFamily: "monospace", fontWeight: 700 }} size="sm">{selectedTxn.transactionId}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="xs" c="dimmed">Ngày thực tế</Text>
                <Text size="sm">{formatDateTime(selectedTxn.transactionDate, "DD/MM/YYYY HH:mm:ss")}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="xs" c="dimmed">Vật tư</Text>
                <Text size="sm" style={{ fontWeight: 600 }}>{selectedTxn.itemNumber}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="xs" c="dimmed">Loại giao dịch</Text>
                <Badge color={selectedTxn.transactionQuantity > 0 ? "green" : "red"}>
                  {selectedTxn.transactionTypeName}
                </Badge>
              </Grid.Col>
              <Grid.Col span={4}>
                <Text size="xs" c="dimmed">Kho con</Text>
                <Badge color="blue" variant="light">Kho {selectedTxn.subinventoryCode}</Badge>
              </Grid.Col>
              <Grid.Col span={4}>
                <Text size="xs" c="dimmed">Vị trí kệ</Text>
                <Text size="sm">{selectedTxn.locatorCode || "Không phân vị trí"}</Text>
              </Grid.Col>
              <Grid.Col span={4}>
                <Text size="xs" c="dimmed">Số lô (Lot)</Text>
                <Text size="sm">{selectedTxn.lotNumber || "Không quản lý lô"}</Text>
              </Grid.Col>
              <Grid.Col span={4}>
                <Text size="xs" c="dimmed">Số lượng giao dịch</Text>
                <Text style={{ fontWeight: 700 }} size="sm">
                  {selectedTxn.transactionQuantity > 0 ? `+${selectedTxn.transactionQuantity}` : selectedTxn.transactionQuantity} {selectedTxn.transactionUom}
                </Text>
              </Grid.Col>
              <Grid.Col span={4}>
                <Text size="xs" c="dimmed">Đơn giá thực tế</Text>
                <Text style={{ fontFamily: "monospace" }} size="sm">{selectedTxn.actualCost.toLocaleString()} đ</Text>
              </Grid.Col>
              <Grid.Col span={4}>
                <Text size="xs" c="dimmed">Thành tiền</Text>
                <Text style={{ fontFamily: "monospace", fontWeight: 700 }} size="sm">
                  {(Math.abs(selectedTxn.transactionQuantity) * selectedTxn.actualCost).toLocaleString()} đ
                </Text>
              </Grid.Col>
              <Grid.Col span={6} style={{ borderTop: "1px dashed #dee2e6", paddingTop: "8px" }}>
                <Text size="xs" c="dimmed">Số chứng từ</Text>
                <Text size="sm">{selectedTxn.documentNumber || "-"}</Text>
              </Grid.Col>
              <Grid.Col span={6} style={{ borderTop: "1px dashed #dee2e6", paddingTop: "8px" }}>
                <Text size="xs" c="dimmed">Người nhận / Giao dịch với</Text>
                <Text size="sm">{selectedTxn.receivedBy || "-"}</Text>
              </Grid.Col>
              <Grid.Col span={12}>
                <Text size="xs" c="dimmed">Lý do giao dịch</Text>
                <Text size="sm">{selectedTxn.reason || "-"}</Text>
              </Grid.Col>
            </Grid>

            <Divider my="md" label="HẠCH TOÁN KẾ TOÁN (GL LEDGER LINES)" labelPosition="center" />

            {isModalLoading ? (
              <Text size="sm" c="dimmed" ta="center" my="md">Đang tải bút toán định khoản...</Text>
            ) : accounts.length === 0 ? (
              <Text size="sm" c="dimmed" ta="center" my="md" style={{ fontStyle: "italic" }}>
                Giao dịch này không phát sinh bút toán hạch toán kho (Kho chi phí / Phi tài sản).
              </Text>
            ) : (
              <Table withTableBorder withColumnBorders highlightOnHover>
                <Table.Thead style={{ backgroundColor: "#f8f9fa" }}>
                  <Table.Tr>
                    <Table.Th style={{ width: "100px" }}>Số tài khoản</Table.Th>
                    <Table.Th>Tên tài khoản đối ứng</Table.Th>
                    <Table.Th style={{ width: "120px", textAlign: "right" }}>Nợ (Debit)</Table.Th>
                    <Table.Th style={{ width: "120px", textAlign: "right" }}>Có (Credit)</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {accounts.map((acc, idx) => {
                    const isDebit = acc.baseTransactionValue > 0;
                    return (
                      <Table.Tr key={idx}>
                        <Table.Td style={{ fontWeight: 600, fontFamily: "monospace" }}>{acc.accountNumber}</Table.Td>
                        <Table.Td>{acc.accountDescription}</Table.Td>
                        <Table.Td align="right" style={{ fontFamily: "monospace" }}>
                          {isDebit ? `${acc.baseTransactionValue.toLocaleString()} đ` : ""}
                        </Table.Td>
                        <Table.Td align="right" style={{ fontFamily: "monospace" }}>
                          {!isDebit ? `${Math.abs(acc.baseTransactionValue).toLocaleString()} đ` : ""}
                        </Table.Td>
                      </Table.Tr>
                    );
                  })}
                </Table.Tbody>
              </Table>
            )}
          </Box>
        )}
      </Modal>
    </Box>
  );
};

export default TransactionHistoryList;

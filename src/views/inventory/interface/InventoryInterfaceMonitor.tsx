import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Flex,
  Group,
  Modal,
  Paper,
  Select,
  SimpleGrid,
  Table,
  Text,
  Tooltip,
} from "@mantine/core";
import { MRT_ColumnDef, MRT_PaginationState } from "mantine-react-table";
import {
  IconDatabaseImport,
  IconEye,
  IconRefresh,
  IconReload,
} from "@tabler/icons-react";
import DataTable from "../../../_base/component/Core/DataTable";
import {
  InventoryInterfaceBatchModel,
  InventoryInterfaceKind,
  InventoryInterfaceRecordModel,
  InventoryInterfaceStatus,
} from "../../../model/InventoryModel";
import {
  getInventoryInterfaceBatches,
  getInventoryInterfaceRecords,
  reprocessInventoryInterfaceBatch,
} from "../../../api/inventory/api";
import { formatDateTime } from "../../../common/FormatDate/FormatDate";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";

const statusColor: Record<InventoryInterfaceStatus, string> = {
  PENDING: "yellow",
  PROCESSED: "green",
  ERROR: "red",
};

const statusLabel: Record<InventoryInterfaceStatus, string> = {
  PENDING: "Pending",
  PROCESSED: "Processed",
  ERROR: "Error",
};

const processFlagLabel: Record<1 | 2 | 3, string> = {
  1: "Pending",
  2: "Processed",
  3: "Error",
};

export default function InventoryInterfaceMonitor() {
  const [kind, setKind] = useState<InventoryInterfaceKind | "ALL">("ALL");
  const [data, setData] = useState<InventoryInterfaceBatchModel[]>([]);
  const [records, setRecords] = useState<InventoryInterfaceRecordModel[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<InventoryInterfaceBatchModel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const fetchBatches = useCallback(async () => {
    setIsLoading(true);
    setIsRefetching(true);
    try {
      const res = await getInventoryInterfaceBatches(kind);
      if (res.success) {
        setData(res.data || []);
      }
    } catch {
      NotificationExtension.Fails("Không thể tải dữ liệu interface.");
      setData([]);
    } finally {
      setIsLoading(false);
      setIsRefetching(false);
    }
  }, [kind]);

  useEffect(() => {
    fetchBatches();
  }, [fetchBatches]);

  const openRecords = useCallback(async (batch: InventoryInterfaceBatchModel) => {
    setSelectedBatch(batch);
    setRecordsLoading(true);
    try {
      const res = await getInventoryInterfaceRecords(batch.batchId);
      setRecords(res.success ? res.data || [] : []);
    } catch {
      NotificationExtension.Fails("Không thể tải chi tiết interface.");
      setRecords([]);
    } finally {
      setRecordsLoading(false);
    }
  }, []);

  const handleReprocess = useCallback(async (batchId: string) => {
    const res = await reprocessInventoryInterfaceBatch(batchId);
    if (res.success) {
      NotificationExtension.Success("Đã reprocess batch interface thành công.");
      fetchBatches();
      if (selectedBatch?.batchId === batchId) {
        openRecords(res.data as InventoryInterfaceBatchModel);
      }
    } else {
      NotificationExtension.Fails(res.message || "Không thể reprocess batch.");
    }
  }, [fetchBatches, openRecords, selectedBatch?.batchId]);

  const metrics = useMemo(() => {
    return {
      pending: data.filter((batch) => batch.status === "PENDING").length,
      processed: data.filter((batch) => batch.status === "PROCESSED").length,
      error: data.filter((batch) => batch.status === "ERROR").length,
      records: data.reduce((sum, batch) => sum + batch.recordCount, 0),
    };
  }, [data]);

  const pageData = useMemo(() => {
    const skip = pagination.pageIndex * pagination.pageSize;
    return data.slice(skip, skip + pagination.pageSize);
  }, [data, pagination.pageIndex, pagination.pageSize]);

  const columns = useMemo<MRT_ColumnDef<InventoryInterfaceBatchModel>[]>(
    () => [
      {
        accessorKey: "batchId",
        header: "Batch",
        size: 210,
        Cell: ({ row }: any) => (
          <Text
            fw={700}
            c="blue.7"
            className="inv-number"
            style={{ cursor: "pointer" }}
            onClick={() => openRecords(row.original)}
          >
            {row.original.batchId}
          </Text>
        ),
      },
      {
        accessorKey: "interfaceKind",
        header: "Nhóm",
        size: 120,
        Cell: ({ row }: any) => (
          <Badge color={row.original.interfaceKind === "ITEM" ? "indigo" : "orange"} variant="light">
            {row.original.interfaceKind === "ITEM" ? "Item" : "Transaction"}
          </Badge>
        ),
      },
      { accessorKey: "sourceCode", header: "Source Code", size: 150 },
      {
        accessorKey: "setProcessId",
        header: "Set Process ID",
        size: 140,
        Cell: ({ row }: any) => row.original.setProcessId || "-",
      },
      {
        accessorKey: "processFlag",
        header: "Process Flag",
        size: 130,
        Cell: ({ row }: any) => processFlagLabel[row.original.processFlag as 1 | 2 | 3],
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        size: 120,
        Cell: ({ row }: any) => (
          <Badge color={statusColor[row.original.status as InventoryInterfaceStatus]} variant="light">
            {statusLabel[row.original.status as InventoryInterfaceStatus]}
          </Badge>
        ),
      },
      {
        accessorKey: "recordCount",
        header: "Records",
        size: 100,
        Cell: ({ row }: any) => (
          <Text className="inv-number" ta="right">
            {row.original.recordCount.toLocaleString("vi-VN")}
          </Text>
        ),
      },
      {
        accessorKey: "errorCount",
        header: "Lỗi",
        size: 90,
        Cell: ({ row }: any) => (
          <Badge color={row.original.errorCount > 0 ? "red" : "green"} variant="light">
            {row.original.errorCount}
          </Badge>
        ),
      },
      {
        accessorKey: "createdDate",
        header: "Ngày tạo",
        size: 150,
        Cell: ({ row }: any) => formatDateTime(row.original.createdDate, "DD/MM/YYYY HH:mm"),
      },
      { accessorKey: "owner", header: "Người phụ trách", size: 140 },
    ],
    [openRecords]
  );

  return (
    <Box>
      <Group justify="space-between" align="flex-start" mb="md">
        <Box>
          <Text fw={800} size="xl">
            Interface Monitor
          </Text>
          <Text c="dimmed" size="sm" mt={4}>
            Item interface, material transaction interface và lot interface.
          </Text>
        </Box>
        <Group gap="xs">
          <Select
            w={240}
            value={kind}
            onChange={(value) => {
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
              setKind((value as InventoryInterfaceKind | "ALL") || "ALL");
            }}
            data={[
              { value: "ALL", label: "Tất cả interface" },
              { value: "ITEM", label: "Item Interface" },
              { value: "TRANSACTION", label: "Material Transaction" },
            ]}
          />
          <Button variant="light" leftSection={<IconRefresh size={16} />} onClick={fetchBatches}>
            Làm mới
          </Button>
        </Group>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md" mb="md">
        <Paper className="inv-stat-card" p="md">
          <Text c="dimmed" size="xs" fw={700} tt="uppercase">Pending</Text>
          <Text fw={800} size="xl" className="inv-number">{metrics.pending}</Text>
        </Paper>
        <Paper className="inv-stat-card" p="md">
          <Text c="dimmed" size="xs" fw={700} tt="uppercase">Processed</Text>
          <Text fw={800} size="xl" className="inv-number">{metrics.processed}</Text>
        </Paper>
        <Paper className="inv-stat-card" p="md">
          <Text c="dimmed" size="xs" fw={700} tt="uppercase">Error</Text>
          <Text fw={800} size="xl" className="inv-number">{metrics.error}</Text>
        </Paper>
        <Paper className="inv-stat-card" p="md">
          <Text c="dimmed" size="xs" fw={700} tt="uppercase">Records</Text>
          <Text fw={800} size="xl" className="inv-number">{metrics.records}</Text>
        </Paper>
      </SimpleGrid>

      <DataTable
        columns={columns}
        data={pageData}
        rowCount={data.length}
        pagination={pagination}
        onPaginationChange={setPagination}
        isLoading={isLoading}
        isRefetching={isRefetching}
        height={560}
        actionColumnSize={130}
        renderRowActions={(row: any) => (
          <Flex gap="xs">
            <Tooltip label="Xem records">
              <ActionIcon variant="light" color="blue" onClick={() => openRecords(row.original)}>
                <IconEye size={16} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Reprocess">
              <ActionIcon
                variant="light"
                color="orange"
                disabled={row.original.status !== "ERROR"}
                onClick={() => handleReprocess(row.original.batchId)}
              >
                <IconReload size={16} />
              </ActionIcon>
            </Tooltip>
          </Flex>
        )}
      />

      <Modal
        opened={!!selectedBatch}
        onClose={() => setSelectedBatch(null)}
        title={selectedBatch ? `Chi tiết batch ${selectedBatch.batchId}` : "Chi tiết interface"}
        size="xl"
        radius="md"
      >
        {recordsLoading ? (
          <Text c="dimmed" ta="center" py="lg">
            Đang tải records...
          </Text>
        ) : (
          <Table withTableBorder withColumnBorders highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Interface</Table.Th>
                <Table.Th>ID</Table.Th>
                <Table.Th>Org</Table.Th>
                <Table.Th>Item</Table.Th>
                <Table.Th>Kho</Table.Th>
                <Table.Th>Loại GD</Table.Th>
                <Table.Th>Số lượng</Table.Th>
                <Table.Th>Lot</Table.Th>
                <Table.Th>Trạng thái</Table.Th>
                <Table.Th>Lỗi</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {records.map((record) => (
                <Table.Tr key={`${record.batchId}-${record.interfaceId}`}>
                  <Table.Td>{record.interfaceName}</Table.Td>
                  <Table.Td className="inv-number">{record.interfaceId}</Table.Td>
                  <Table.Td>{record.organizationCode}</Table.Td>
                  <Table.Td>{record.itemNumber || "-"}</Table.Td>
                  <Table.Td>{record.subinventoryCode || "-"}</Table.Td>
                  <Table.Td>{record.transactionType || "-"}</Table.Td>
                  <Table.Td className="inv-number">
                    {record.transactionQuantity != null
                      ? `${record.transactionQuantity.toLocaleString("vi-VN")} ${record.transactionUom || ""}`
                      : "-"}
                  </Table.Td>
                  <Table.Td>{record.lotNumber || "-"}</Table.Td>
                  <Table.Td>
                    <Badge color={statusColor[record.status]} variant="light">
                      {statusLabel[record.status]}
                    </Badge>
                  </Table.Td>
                  <Table.Td>{record.errorMessage || "-"}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
        {selectedBatch?.status === "ERROR" ? (
          <Group justify="flex-end" mt="md">
            <Button
              leftSection={<IconDatabaseImport size={16} />}
              onClick={() => handleReprocess(selectedBatch.batchId)}
            >
              Reprocess batch
            </Button>
          </Group>
        ) : null}
      </Modal>
    </Box>
  );
}

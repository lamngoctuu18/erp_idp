import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MRT_ColumnDef, MRT_PaginationState } from "mantine-react-table";
import { Box, Button, Flex, Grid, Select, TextInput, Badge, Text, Card, Group, ThemeIcon } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconSearch, IconReload, IconCoins, IconBox, IconLock, IconAlertTriangle } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import BreadCrumb from "../../../_base/component/_layout/_breadcrumb";
import DataTable from "../../../_base/component/Core/DataTable";
import { OnhandModel } from "../../../model/InventoryModel";
import { getOnhandList, getSubinventories } from "../../../api/inventory/api";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";

const OnhandList = () => {
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<OnhandModel[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [height, setHeight] = useState(550);

  const [subinvsList, setSubinvsList] = useState<Array<{ value: string; label: string }>>([]);
  const [subFilter, setSubFilter] = useState<string | null>(null);
  const [itemSearch, setItemSearch] = useState("");
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const formSearch = useForm({ initialValues: { itemSearch: "" } });

  const fetchSubinvs = async () => {
    try {
      const res = await getSubinventories();
      if (res?.success && res.data) {
        const list = res.data.map((s) => ({
          value: s.secondaryInventoryName,
          label: `${s.secondaryInventoryName} - ${s.description}`
        }));
        setSubinvsList([{ value: "", label: "Tất cả kho" }, ...list]);
      }
    } catch {
      console.error("Lỗi khi tải danh sách kho.");
    }
  };

  const fetchOnhand = useCallback(async () => {
    setIsLoading(true);
    setIsRefetching(true);
    try {
      const res = await getOnhandList({
        subCode: subFilter || undefined,
        itemNumber: itemSearch || undefined
      });
      if (res?.success && res.data) {
        setData(res.data);
        setRowCount(res.data.length);
      }
    } catch {
      NotificationExtension.Fails("Không thể kết nối máy chủ để tải dữ liệu tồn kho.");
    } finally {
      setIsLoading(false);
      setIsRefetching(false);
    }
  }, [subFilter, itemSearch]);

  useEffect(() => {
    fetchSubinvs();
  }, []);

  useEffect(() => {
    fetchOnhand();
  }, [fetchOnhand]);

  // KPI Calculations based on loaded data
  const totalValue = useMemo(() => data.reduce((sum, item) => sum + (item.totalValue || 0), 0), [data]);
  const totalPhysical = useMemo(() => data.reduce((sum, item) => sum + item.transactionQuantity, 0), [data]);
  const totalAllocated = useMemo(() => data.reduce((sum, item) => sum + (item.allocatedQuantity || 0), 0), [data]);
  const lowStockCount = useMemo(() => data.filter(item => (item.availableToTransact || 0) < 5).length, [data]);

  const columns = useMemo<MRT_ColumnDef<OnhandModel>[]>(
    () => [
      {
        accessorKey: "itemNumber",
        header: "Mã vật tư",
        size: 130,
        Cell: ({ row }: any) => (
          <Text
            style={{ fontWeight: 700, color: "#228be6", cursor: "pointer" }}
            size="sm"
            onClick={() => navigate(`/inventory/item/detail/${row.original.inventoryItemId}`)}
          >
            {row.original.itemNumber}
          </Text>
        )
      },
      {
        accessorKey: "description",
        header: "Tên vật tư",
        size: 200,
        Cell: ({ row }: any) => (
          <Text size="sm" style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
            {row.original.description}
          </Text>
        )
      },
      {
        accessorKey: "categoryName",
        header: "Nhóm vật tư",
        size: 130,
        Cell: ({ row }: any) => (
          <Badge color="gray" variant="light" size="sm">{row.original.categoryName || "Gỗ Công Nghiệp"}</Badge>
        )
      },
      {
        accessorKey: "subinventoryCode",
        header: "Kho con",
        size: 220,
        Cell: ({ row }: any) => (
          <Group gap="xs" style={{ whiteSpace: "nowrap" }}>
            <Badge color="blue" variant="light" size="sm">{row.original.subinventoryCode}</Badge>
            <Text size="xs" c="dimmed" span>{row.original.subinventoryDescription}</Text>
          </Group>
        )
      },
      {
        accessorKey: "locatorCode",
        header: "Vị trí kệ (Locator)",
        size: 220,
        Cell: ({ row }: any) => row.original.locatorCode ? (
          <Group gap="xs">
            <Text size="xs" style={{ fontWeight: 600 }}>{row.original.locatorCode}</Text>
            <Text size="xs" c="dimmed" span>({row.original.locatorDescription})</Text>
          </Group>
        ) : (
          <Text c="dimmed" size="xs" style={{ fontStyle: "italic" }}>Không phân vị trí</Text>
        )
      },
      {
        accessorKey: "lotNumber",
        header: "Số lô (Lot) / Hạn dùng",
        size: 180,
        Cell: ({ row }: any) => row.original.lotNumber ? (
          <Group gap="xs">
            <Badge color="orange" size="xs">{row.original.lotNumber}</Badge>
            {row.original.lotExpirationDate && (
              <Text size="10px" c="dimmed">HSD: {new Date(row.original.lotExpirationDate).toLocaleDateString("vi-VN")}</Text>
            )}
          </Group>
        ) : (
          <Text c="dimmed" size="xs">Không quản lý lô</Text>
        )
      },
      {
        accessorKey: "transactionQuantity",
        header: "Tồn vật lý (Physical)",
        size: 130,
        Cell: ({ row }: any) => (
          <Text style={{ fontWeight: 600, fontFamily: "monospace" }}>
            {row.original.transactionQuantity.toLocaleString("vi-VN")}
          </Text>
        ),
        Footer: () => (
          <Text style={{ fontFamily: "monospace", fontWeight: 700 }} size="sm">
            {totalPhysical.toLocaleString("vi-VN")}
          </Text>
        )
      },
      {
        accessorKey: "allocatedQuantity",
        header: "Đã phân bổ (Allocated)",
        size: 130,
        Cell: ({ row }: any) => (
          <Text style={{ fontFamily: "monospace" }} c={row.original.allocatedQuantity > 0 ? "orange" : "dimmed"}>
            {row.original.allocatedQuantity.toLocaleString("vi-VN")}
          </Text>
        ),
        Footer: () => (
          <Text style={{ fontFamily: "monospace", fontWeight: 700 }} size="sm">
            {totalAllocated.toLocaleString("vi-VN")}
          </Text>
        )
      },
      {
        accessorKey: "availableToTransact",
        header: "Khả dụng (ATT)",
        size: 130,
        Cell: ({ row }: any) => {
          const att = row.original.availableToTransact ?? row.original.transactionQuantity;
          return (
            <Text style={{ fontWeight: 700, fontFamily: "monospace" }} c={att < 5 ? "red" : "teal"}>
              {att.toLocaleString("vi-VN")}
            </Text>
          );
        },
        Footer: () => (
          <Text style={{ fontFamily: "monospace", fontWeight: 700 }} c="teal" size="sm">
            {data.reduce((sum, item) => sum + (item.availableToTransact ?? item.transactionQuantity), 0).toLocaleString("vi-VN")}
          </Text>
        )
      },
      {
        accessorKey: "transactionUomCode",
        header: "ĐVT (UOM)",
        size: 95,
        Cell: ({ row }: any) => (
          <Text size="xs" style={{ fontWeight: 600 }}>{row.original.transactionUomCode}</Text>
        )
      },
      {
        accessorKey: "unitCost",
        header: "Đơn giá gốc",
        size: 120,
        Cell: ({ row }: any) => (
          <Text style={{ fontFamily: "monospace" }} size="sm">
            {row.original.unitCost ? `${row.original.unitCost.toLocaleString("vi-VN")} đ` : "-"}
          </Text>
        )
      },
      {
        accessorKey: "totalValue",
        header: "Giá trị tồn kho",
        size: 150,
        Cell: ({ row }: any) => (
          <Text style={{ fontWeight: 700, fontFamily: "monospace", color: "#1971c2" }} size="sm">
            {row.original.totalValue ? `${row.original.totalValue.toLocaleString("vi-VN")} đ` : "-"}
          </Text>
        ),
        Footer: () => (
          <Text style={{ fontFamily: "monospace", fontWeight: 700, color: "#1971c2" }} size="sm">
            {totalValue.toLocaleString("vi-VN")} đ
          </Text>
        )
      }
    ],
    [data, totalPhysical, totalAllocated, totalValue]
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
          onClick={fetchOnhand}
        >
          Làm mới
        </Button>
      </Flex>

      {/* KPI Cards section */}
      <Grid mb={16}>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder radius="md" p="sm" style={{ cursor: "pointer", transition: "transform 150ms ease" }}>
            <Group justify="space-between">
              <Text size="xs" c="dimmed" style={{ fontWeight: 700 }}>TỔNG GIÁ TRỊ TỒN KHO</Text>
              <ThemeIcon color="blue" variant="light" size="md">
                <IconCoins size={16} />
              </ThemeIcon>
            </Group>
            <Text style={{ fontWeight: 800, fontFamily: "monospace", fontSize: "20px" }} c="blue" mt="xs">
              {totalValue.toLocaleString("vi-VN")} đ
            </Text>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder radius="md" p="sm" style={{ cursor: "pointer", transition: "transform 150ms ease" }}>
            <Group justify="space-between">
              <Text size="xs" c="dimmed" style={{ fontWeight: 700 }}>TỒN VẬT LÝ THỰC TẾ</Text>
              <ThemeIcon color="teal" variant="light" size="md">
                <IconBox size={16} />
              </ThemeIcon>
            </Group>
            <Text style={{ fontWeight: 800, fontFamily: "monospace", fontSize: "20px" }} c="teal" mt="xs">
              {totalPhysical.toLocaleString("vi-VN")}
            </Text>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder radius="md" p="sm" style={{ cursor: "pointer", transition: "transform 150ms ease" }}>
            <Group justify="space-between">
              <Text size="xs" c="dimmed" style={{ fontWeight: 700 }}>LƯỢNG ĐÃ PHÂN BỔ</Text>
              <ThemeIcon color="orange" variant="light" size="md">
                <IconLock size={16} />
              </ThemeIcon>
            </Group>
            <Text style={{ fontWeight: 800, fontFamily: "monospace", fontSize: "20px" }} c="orange" mt="xs">
              {totalAllocated.toLocaleString("vi-VN")}
            </Text>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder radius="md" p="sm" style={{ cursor: "pointer", transition: "transform 150ms ease" }}>
            <Group justify="space-between">
              <Text size="xs" c="dimmed" style={{ fontWeight: 700 }}>VẬT TƯ CẢNH BÁO HẾT</Text>
              <ThemeIcon color="red" variant="light" size="md">
                <IconAlertTriangle size={16} />
              </ThemeIcon>
            </Group>
            <Text style={{ fontWeight: 800, fontFamily: "monospace", fontSize: "20px" }} c="red" mt="xs">
              {lowStockCount} dòng tồn
            </Text>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Filter panel */}
      <Grid mb={16} align="end">
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Select
            label="Lọc theo kho con"
            styles={{ label: { whiteSpace: "nowrap" } }}
            placeholder="Tất cả kho"
            data={subinvsList}
            value={subFilter}
            onChange={setSubFilter}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Tìm kiếm vật tư"
            styles={{ label: { whiteSpace: "nowrap" } }}
            placeholder="Nhập mã hoặc tên vật tư cần tra cứu..."
            leftSection={<IconSearch size={16} />}
            {...formSearch.getInputProps("itemSearch")}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Button
            fullWidth
            style={{ backgroundColor: "#1971c2" }}
            onClick={() => {
              setPagination((p) => ({ ...p, pageIndex: 0 }));
              setItemSearch(formSearch.values.itemSearch);
            }}
          >
            Lọc kết quả
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
      />
    </Box>
  );
};

export default OnhandList;

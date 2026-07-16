import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MRT_ColumnDef, MRT_PaginationState } from "mantine-react-table";
import { Box, Button, Flex, Grid, Select, Text } from "@mantine/core";
import { IconReload } from "@tabler/icons-react";
import BreadCrumb from "../../../_base/component/_layout/_breadcrumb";
import DataTable from "../../../_base/component/Core/DataTable";
import { NxtReportModel, PeriodModel } from "../../../model/InventoryModel";
import { getNxtReport, getSubinventories, getAccountingPeriods } from "../../../api/inventory/api";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";

const NxtReportList = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<NxtReportModel[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);

  const [periodsList, setPeriodsList] = useState<Array<{ value: string; label: string }>>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>("202607");
  const [subinvsList, setSubinvsList] = useState<Array<{ value: string; label: string }>>([]);
  const [selectedSub, setSelectedSub] = useState<string | null>(null);

  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const loadFilters = async () => {
    try {
      const pRes = await getAccountingPeriods();
      if (pRes?.success && pRes.data) {
        setPeriodsList(pRes.data.map(p => ({
          value: p.acctPeriodId.toString(),
          label: `${p.periodName} (${p.openFlag === "Y" ? "Đang mở" : "Đã khóa"})`
        })));
      }

      const sRes = await getSubinventories();
      if (sRes?.success && sRes.data) {
        const list = sRes.data.map((s) => ({
          value: s.secondaryInventoryName,
          label: `${s.secondaryInventoryName} - ${s.description}`
        }));
        setSubinvsList([{ value: "", label: "Tất cả kho con" }, ...list]);
      }
    } catch {
      console.error("Lỗi nạp bộ lọc NXT");
    }
  };

  const fetchReport = useCallback(async () => {
    setIsLoading(true);
    setIsRefetching(true);
    try {
      const res = await getNxtReport({
        periodId: selectedPeriod ? Number(selectedPeriod) : undefined,
        subCode: selectedSub || undefined
      });
      if (res?.success && res.data) {
        setData(res.data);
        setRowCount(res.data.length);
      }
    } catch {
      NotificationExtension.Fails("Không thể tải báo cáo Nhập - Xuất - Tồn.");
    } finally {
      setIsLoading(false);
      setIsRefetching(false);
    }
  }, [selectedPeriod, selectedSub]);

  useEffect(() => {
    loadFilters();
  }, []);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  // Summary totals calculations
  const totalBeginVal = useMemo(() => data.reduce((sum, r) => sum + r.beginValue, 0), [data]);
  const totalInVal = useMemo(() => data.reduce((sum, r) => sum + r.inValue, 0), [data]);
  const totalOutVal = useMemo(() => data.reduce((sum, r) => sum + r.outValue, 0), [data]);
  const totalEndVal = useMemo(() => data.reduce((sum, r) => sum + r.endValue, 0), [data]);

  const columns = useMemo<MRT_ColumnDef<NxtReportModel>[]>(
    () => [
      {
        accessorKey: "itemNumber",
        header: "Mã vật tư",
        size: 120,
        Cell: ({ cell }) => <Text style={{ fontWeight: 700 }} size="sm">{cell.getValue<string>()}</Text>
      },
      {
        accessorKey: "description",
        header: "Tên vật tư",
        size: 180,
      },
      {
        accessorKey: "primaryUomCode",
        header: "ĐVT",
        size: 70,
        Cell: ({ cell }) => <Text size="xs" style={{ fontWeight: 600 }}>{cell.getValue<string>()}</Text>
      },
      // Cột Nhóm 1: Đầu kỳ
      {
        id: "opening",
        header: "TỒN ĐẦU KỲ",
        columns: [
          {
            accessorKey: "beginQty",
            header: "Số lượng",
            size: 110,
            Cell: ({ cell }) => (
              <Text style={{ fontFamily: "monospace" }} size="sm">
                {cell.getValue<number>().toLocaleString("vi-VN")}
              </Text>
            )
          },
          {
            accessorKey: "beginValue",
            header: "Giá trị",
            size: 130,
            Cell: ({ cell }) => (
              <Text style={{ fontFamily: "monospace" }} size="sm">
                {cell.getValue<number>().toLocaleString("vi-VN")} đ
              </Text>
            ),
            Footer: () => (
              <Text style={{ fontFamily: "monospace", fontWeight: 700 }} size="sm">
                {totalBeginVal.toLocaleString("vi-VN")} đ
              </Text>
            )
          }
        ]
      },
      // Cột Nhóm 2: Nhập trong kỳ
      {
        id: "receipts",
        header: "NHẬP TRONG KỲ",
        columns: [
          {
            accessorKey: "inQty",
            header: "Số lượng",
            size: 110,
            Cell: ({ cell }) => (
              <Text style={{ fontFamily: "monospace", color: "teal", fontWeight: 600 }} size="sm">
                {cell.getValue<number>() > 0 ? `+${cell.getValue<number>().toLocaleString("vi-VN")}` : "0"}
              </Text>
            )
          },
          {
            accessorKey: "inValue",
            header: "Giá trị",
            size: 130,
            Cell: ({ cell }) => (
              <Text style={{ fontFamily: "monospace", color: "teal" }} size="sm">
                {cell.getValue<number>() > 0 ? `${cell.getValue<number>().toLocaleString("vi-VN")} đ` : "0 đ"}
              </Text>
            ),
            Footer: () => (
              <Text style={{ fontFamily: "monospace", fontWeight: 700, color: "teal" }} size="sm">
                {totalInVal.toLocaleString("vi-VN")} đ
              </Text>
            )
          }
        ]
      },
      // Cột Nhóm 3: Xuất trong kỳ
      {
        id: "issues",
        header: "XUẤT TRONG KỲ",
        columns: [
          {
            accessorKey: "outQty",
            header: "Số lượng",
            size: 110,
            Cell: ({ cell }) => (
              <Text style={{ fontFamily: "monospace", color: "red", fontWeight: 600 }} size="sm">
                {cell.getValue<number>() > 0 ? `-${cell.getValue<number>().toLocaleString("vi-VN")}` : "0"}
              </Text>
            )
          },
          {
            accessorKey: "outValue",
            header: "Giá trị",
            size: 130,
            Cell: ({ cell }) => (
              <Text style={{ fontFamily: "monospace", color: "red" }} size="sm">
                {cell.getValue<number>() > 0 ? `${cell.getValue<number>().toLocaleString("vi-VN")} đ` : "0 đ"}
              </Text>
            ),
            Footer: () => (
              <Text style={{ fontFamily: "monospace", fontWeight: 700, color: "red" }} size="sm">
                {totalOutVal.toLocaleString("vi-VN")} đ
              </Text>
            )
          }
        ]
      },
      // Cột Nhóm 4: Tồn cuối kỳ
      {
        id: "closing",
        header: "TỒN CUỐI KỲ",
        columns: [
          {
            accessorKey: "endQty",
            header: "Số lượng",
            size: 110,
            Cell: ({ cell }) => (
              <Text style={{ fontFamily: "monospace", fontWeight: 700 }} size="sm">
                {cell.getValue<number>().toLocaleString("vi-VN")}
              </Text>
            )
          },
          {
            accessorKey: "endValue",
            header: "Giá trị",
            size: 140,
            Cell: ({ cell }) => (
              <Text style={{ fontFamily: "monospace", fontWeight: 700, color: "#1971c2" }} size="sm">
                {cell.getValue<number>().toLocaleString("vi-VN")} đ
              </Text>
            ),
            Footer: () => (
              <Text style={{ fontFamily: "monospace", fontWeight: 700, color: "#1971c2" }} size="sm">
                {totalEndVal.toLocaleString("vi-VN")} đ
              </Text>
            )
          }
        ]
      }
    ],
    [data, totalBeginVal, totalInVal, totalOutVal, totalEndVal]
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
          onClick={fetchReport}
        >
          Làm mới báo cáo
        </Button>
      </Flex>

      {/* Bộ lọc báo cáo */}
      <Grid mb={16} align="end">
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Select
            label="Kỳ kế toán báo cáo"
            styles={{ label: { whiteSpace: "nowrap" } }}
            placeholder="Chọn kỳ kế toán"
            data={periodsList}
            value={selectedPeriod}
            onChange={setSelectedPeriod}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Select
            label="Kho con kiểm tra"
            styles={{ label: { whiteSpace: "nowrap" } }}
            placeholder="Tất cả kho con"
            data={subinvsList}
            value={selectedSub}
            onChange={setSelectedSub}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Button
            fullWidth
            style={{ backgroundColor: "#1971c2" }}
            onClick={fetchReport}
          >
            Xuất dữ liệu báo cáo
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
        height={500}
      />
    </Box>
  );
};

export default NxtReportList;

import { useEffect, useState, useMemo } from "react";
import { Box, Flex, Title } from "@mantine/core";
import { MRT_ColumnDef } from "mantine-react-table";
import DataTable from "../../_base/component/Core/DataTable";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";
import { ApInvoiceDistributionModel } from "../../model/ApInvoiceModel";
import { apInvoiceService } from "../../api/apVendor/apMockService";

const ApInvoiceDistributionList = () => {
  const [data, setData] = useState<ApInvoiceDistributionModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState<any>({
    pageIndex: 0,
    pageSize: 20,
  });

  useEffect(() => {
    const fetchDists = async () => {
      setIsLoading(true);
      try {
        const invoices = await apInvoiceService.getAll();
        const allDists: ApInvoiceDistributionModel[] = [];
        for (const inv of invoices) {
          const d = await apInvoiceService.getDistributions(inv.invoiceId);
          allDists.push(...d);
        }
        setData(allDists);
      } catch {
        console.error("Lỗi khi tải danh sách phân bổ hạch toán");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDists();
  }, []);

  const columns = useMemo<MRT_ColumnDef<ApInvoiceDistributionModel>[]>(
    () => [
      { accessorKey: "invoiceId", header: "Mã hóa đơn Header", size: 120 },
      { accessorKey: "invoiceLineId", header: "ID Dòng hóa đơn", size: 120 },
      { accessorKey: "distributionLineNumber", header: "STT Phân bổ", size: 100 },
      { accessorKey: "accountCcid", header: "Tài khoản đối ứng (CCID)", size: 180 },
      { accessorKey: "amount", header: "Số tiền hạch toán", size: 150, Cell: ({ cell }) => (cell.getValue() as number)?.toLocaleString("vi-VN") + "đ" },
      { accessorKey: "description", header: "Diễn giải chi tiết", size: 250 },
    ],
    []
  );

  return (
    <Box>
      <Flex justify="space-between" align="center" style={{ border: "1px solid #dee2e6", padding: "5px 10px" }} mb={16}>
        <BreadCrumb />
        <Title order={4}>Danh sách Dòng Phân bổ Hạch toán Hóa đơn</Title>
      </Flex>
      <DataTable
        columns={columns}
        data={data}
        rowCount={data.length}
        pagination={pagination}
        onPaginationChange={setPagination}
        isLoading={isLoading}
        height={500}
      />
    </Box>
  );
};

export default ApInvoiceDistributionList;

import { useEffect, useState, useMemo } from "react";
import { Box, Flex, Title } from "@mantine/core";
import { MRT_ColumnDef } from "mantine-react-table";
import DataTable from "../../_base/component/Core/DataTable";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";
import { ApInvoiceLineModel } from "../../model/ApInvoiceModel";
import { apInvoiceService } from "../../api/apVendor/apMockService";

const ApInvoiceLineList = () => {
  const [data, setData] = useState<ApInvoiceLineModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState<any>({
    pageIndex: 0,
    pageSize: 20,
  });

  useEffect(() => {
    const fetchLines = async () => {
      setIsLoading(true);
      try {
        const invoices = await apInvoiceService.getAll();
        const allLines: ApInvoiceLineModel[] = [];
        for (const inv of invoices) {
          const l = await apInvoiceService.getLines(inv.invoiceId);
          allLines.push(...l);
        }
        setData(allLines);
      } catch {
        console.error("Lỗi khi tải danh sách dòng hóa đơn");
      } finally {
        setIsLoading(false);
      }
    };
    fetchLines();
  }, []);

  const columns = useMemo<MRT_ColumnDef<ApInvoiceLineModel>[]>(
    () => [
      { accessorKey: "invoiceId", header: "Mã hóa đơn Header", size: 120 },
      { accessorKey: "lineNum", header: "Dòng số", size: 90 },
      { accessorKey: "lineType", header: "Loại dòng", size: 120 },
      { accessorKey: "quantityInvoiced", header: "Số lượng khớp", size: 120 },
      { accessorKey: "unitPrice", header: "Đơn giá", size: 150, Cell: ({ cell }) => (cell.getValue() as number)?.toLocaleString("vi-VN") + "đ" },
      { accessorKey: "amount", header: "Thành tiền", size: 150, Cell: ({ cell }) => (cell.getValue() as number)?.toLocaleString("vi-VN") + "đ" },
      { accessorKey: "description", header: "Nội dung / Mô tả", size: 250 },
    ],
    []
  );

  return (
    <Box>
      <Flex justify="space-between" align="center" style={{ border: "1px solid #dee2e6", padding: "5px 10px" }} mb={16}>
        <BreadCrumb />
        <Title order={4}>Danh sách Dòng chi tiết Hóa đơn mua hàng</Title>
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

export default ApInvoiceLineList;

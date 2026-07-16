import { useEffect, useState, useMemo } from "react";
import { Badge, Box, Flex, Title } from "@mantine/core";
import { MRT_ColumnDef } from "mantine-react-table";
import DataTable from "../../_base/component/Core/DataTable";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

const ApActEventLineList = () => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState<any>({
    pageIndex: 0,
    pageSize: 20,
  });

  useEffect(() => {
    setIsLoading(true);
    const list = JSON.parse(localStorage.getItem("ap_act_event_lines") || "[]");
    setData(list);
    setIsLoading(false);
  }, []);

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      { accessorKey: "accountingLineId", header: "Mã dòng hạch toán", size: 120 },
      { accessorKey: "accountingHeaderId", header: "ID Tiêu đề bút toán", size: 120 },
      { accessorKey: "lineNum", header: "Dòng số", size: 90 },
      { accessorKey: "accountCcid", header: "Tài khoản đối ứng (CCID)", size: 150 },
      {
        accessorKey: "debitAmount",
        header: "Bên Nợ (Debit)",
        size: 150,
        Cell: ({ cell }) => (cell.getValue() as number ? `${(cell.getValue() as number).toLocaleString("vi-VN")}đ` : "-"),
      },
      {
        accessorKey: "creditAmount",
        header: "Bên Có (Credit)",
        size: 150,
        Cell: ({ cell }) => (cell.getValue() as number ? `${(cell.getValue() as number).toLocaleString("vi-VN")}đ` : "-"),
      },
      { accessorKey: "description", header: "Diễn giải chi tiết dòng", size: 250 },
    ],
    []
  );

  return (
    <Box>
      <Flex justify="space-between" align="center" style={{ border: "1px solid #dee2e6", padding: "5px 10px" }} mb={16}>
        <BreadCrumb />
        <Title order={4}>Danh sách Dòng bút toán chi tiết (Debit/Credit Lines)</Title>
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

export default ApActEventLineList;

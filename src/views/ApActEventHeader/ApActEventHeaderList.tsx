import { useEffect, useState, useMemo } from "react";
import { Badge, Box, Flex, Title } from "@mantine/core";
import { MRT_ColumnDef } from "mantine-react-table";
import DataTable from "../../_base/component/Core/DataTable";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";
import { formatDateTime } from "../../common/FormatDate/FormatDate";

const ApActEventHeaderList = () => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState<any>({
    pageIndex: 0,
    pageSize: 20,
  });

  useEffect(() => {
    setIsLoading(true);
    const list = JSON.parse(localStorage.getItem("ap_act_event_headers") || "[]");
    setData(list);
    setIsLoading(false);
  }, []);

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      { accessorKey: "accountingHeaderId", header: "Mã bút toán Header", size: 120 },
      { accessorKey: "eventId", header: "Mã sự kiện", size: 100 },
      { accessorKey: "ledgerId", header: "ID Sổ cái", size: 100 },
      {
        accessorKey: "glDate",
        header: "Ngày ghi sổ",
        size: 130,
        Cell: ({ cell }) => formatDateTime(cell.getValue() as string, "DD/MM/YYYY"),
      },
      { accessorKey: "description", header: "Diễn giải bút toán", size: 300 },
      {
        accessorKey: "postedFlag",
        header: "Đã ghi sổ cái (GL Posted)",
        size: 150,
        Cell: ({ cell }) => <Badge color={cell.getValue() === "Y" ? "green" : "gray"}>{cell.getValue() === "Y" ? "Có" : "Không"}</Badge>,
      },
    ],
    []
  );

  return (
    <Box>
      <Flex justify="space-between" align="center" style={{ border: "1px solid #dee2e6", padding: "5px 10px" }} mb={16}>
        <BreadCrumb />
        <Title order={4}>Danh sách Tiêu đề Bút toán (Accounting Headers)</Title>
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

export default ApActEventHeaderList;

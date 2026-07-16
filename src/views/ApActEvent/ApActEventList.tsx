import { useEffect, useState, useMemo } from "react";
import { Badge, Box, Flex, Title } from "@mantine/core";
import { MRT_ColumnDef } from "mantine-react-table";
import DataTable from "../../_base/component/Core/DataTable";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

const ApActEventList = () => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState<any>({
    pageIndex: 0,
    pageSize: 20,
  });

  useEffect(() => {
    setIsLoading(true);
    const list = JSON.parse(localStorage.getItem("ap_act_events") || "[]");
    setData(list);
    setIsLoading(false);
  }, []);

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      { accessorKey: "eventId", header: "Mã sự kiện", size: 100 },
      { accessorKey: "eventTypeCode", header: "Loại sự kiện hạch toán", size: 250 },
      {
        accessorKey: "eventStatus",
        header: "Trạng thái truyền",
        size: 150,
        Cell: ({ cell }) => <Badge color="green">{cell.getValue() as string}</Badge>,
      },
      { accessorKey: "sourceTable", header: "Bảng dữ liệu nguồn", size: 150 },
      { accessorKey: "sourceId", header: "ID nguồn", size: 120 },
    ],
    []
  );

  return (
    <Box>
      <Flex justify="space-between" align="center" style={{ border: "1px solid #dee2e6", padding: "5px 10px" }} mb={16}>
        <BreadCrumb />
        <Title order={4}>Danh sách Sự kiện Hạch toán kế toán Subledger (Subledger Events)</Title>
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

export default ApActEventList;

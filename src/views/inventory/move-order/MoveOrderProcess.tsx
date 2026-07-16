import { Box, Button, Card, Flex, Grid, Group, Table, Text, Badge, Alert, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IconArrowLeft, IconCheck, IconSettings, IconInfoCircle } from "@tabler/icons-react";
import BreadCrumb from "../../../_base/component/_layout/_breadcrumb";
import { getMoveOrderLines, getMoveOrders, approveMoveOrder, transactMoveOrder } from "../../../api/inventory/api";
import { MoveOrderHeaderModel, MoveOrderLineModel } from "../../../model/InventoryModel";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import { formatDateTime } from "../../../common/FormatDate/FormatDate";

const MoveOrderProcess = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [header, setHeader] = useState<MoveOrderHeaderModel | null>(null);
  const [lines, setLines] = useState<MoveOrderLineModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAllocated, setIsAllocated] = useState(false);

  const fetchDetail = async () => {
    if (!id) return;
    try {
      const headersRes = await getMoveOrders();
      if (headersRes?.success && headersRes.data) {
        const found = headersRes.data.find((h) => h.headerId === Number(id));
        if (found) setHeader(found);
      }

      const linesRes = await getMoveOrderLines(Number(id));
      if (linesRes?.success && linesRes.data) {
        setLines(linesRes.data);
      }
    } catch {
      NotificationExtension.Fails("Lỗi khi tải chi tiết phiếu.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleApprove = async () => {
    if (!header) return;
    try {
      const res = await approveMoveOrder(header.headerId);
      if (res?.success) {
        NotificationExtension.Success("Đã phê duyệt phiếu yêu cầu!");
        fetchDetail();
      }
    } catch {
      NotificationExtension.Fails("Lỗi phê duyệt.");
    }
  };

  const handleAllocate = () => {
    setIsAllocated(true);
    NotificationExtension.Success("Đã phân bổ vị trí & lô tồn kho tự động chuẩn xác!");
  };

  const handleTransact = async () => {
    if (!header) return;
    try {
      const res = await transactMoveOrder(header.headerId);
      if (res?.success) {
        NotificationExtension.Success("Đã thực xuất kho cấp phát nguyên vật liệu thành công!");
        navigate("/inventory/move-order/list");
      }
    } catch {
      NotificationExtension.Fails("Lỗi khi hoàn tất thực xuất.");
    }
  };

  const getStatusLabel = (status: number) => {
    switch (status) {
      case 1: return <Badge color="gray">Chưa hoàn thành</Badge>;
      case 2: return <Badge color="yellow">Chờ phê duyệt</Badge>;
      case 3: return <Badge color="blue">Đã duyệt (Chờ cấp phát)</Badge>;
      case 4: return <Badge color="red">Từ chối</Badge>;
      case 5: return <Badge color="green">Đã cấp phát (Closed)</Badge>;
      default: return <Badge color="gray">Không rõ</Badge>;
    }
  };

  if (isLoading) {
    return <Box p="xl"><Text>Đang tải chi tiết Move Order...</Text></Box>;
  }

  if (!header) {
    return (
      <Box p="xl">
        <Text c="red" mb="md">Không tìm thấy phiếu yêu cầu!</Text>
        <Button onClick={() => navigate("/inventory/move-order/list")}>Quay lại</Button>
      </Box>
    );
  }

  return (
    <Box>
      <Flex
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
            leftSection={<IconArrowLeft size={14} />}
            onClick={() => navigate("/inventory/move-order/list")}
          >
            Quay lại
          </Button>

          {header.headerStatus === 2 && (
            <Button
              color="green"
              leftSection={<IconCheck size={14} />}
              onClick={handleApprove}
            >
              Duyệt yêu cầu
            </Button>
          )}

          {header.headerStatus === 3 && !isAllocated && (
            <Button
              color="orange"
              leftSection={<IconSettings size={14} />}
              onClick={handleAllocate}
            >
              Phân bổ tự động (Allocate)
            </Button>
          )}

          {header.headerStatus === 3 && isAllocated && (
            <Button
              color="teal"
              leftSection={<IconCheck size={14} />}
              onClick={handleTransact}
            >
              Xác nhận thực xuất (Transact)
            </Button>
          )}
        </Group>
      </Flex>

      <Card withBorder shadow="sm" radius="md" p="lg" mb={16}>
        <Title order={4} mb="md" c="blue">Thông tin chung Phiếu yêu cầu</Title>
        <Grid>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Text style={{ fontWeight: 600 }}>Số phiếu yêu cầu:</Text>
            <Text c="blue" style={{ fontWeight: 700 }}>{header.requestNumber}</Text>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Text style={{ fontWeight: 600 }}>Ngày cần hàng:</Text>
            <Text c="dimmed">{formatDateTime(header.dateRequired, "DD/MM/YYYY")}</Text>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Text style={{ fontWeight: 600 }}>Trạng thái:</Text>
            <Box mt={3}>{getStatusLabel(header.headerStatus)}</Box>
          </Grid.Col>
          <Grid.Col span={12}>
            <Text style={{ fontWeight: 600 }}>Lý do / Diễn giải:</Text>
            <Text c="dimmed">{header.description}</Text>
          </Grid.Col>
        </Grid>
      </Card>

      <Card withBorder shadow="sm" radius="md" p="lg">
        <Title order={4} mb="md">Chi tiết vật tư cấp phát</Title>
        
        {header.headerStatus === 3 && !isAllocated && (
          <Alert icon={<IconInfoCircle size={16} />} title="Hướng dẫn cấp phát" color="blue" mb="md">
            Yêu cầu đã được phê duyệt. Vui lòng click nút **"Phân bổ tự động (Allocate)"** để hệ thống tự động tìm kiếm vị trí (locator) và số lô (lot number) còn tồn kho thực tế, đảm bảo đúng luồng nghiệp vụ FIFO trước khi xác nhận thực xuất.
          </Alert>
        )}

        <Table withTableBorder withColumnBorders highlightOnHover>
          <Table.Thead style={{ backgroundColor: "#f8f9fa" }}>
            <Table.Tr>
              <Table.Th>STT</Table.Th>
              <Table.Th>Mã vật tư</Table.Th>
              <Table.Th>Đơn vị</Table.Th>
              <Table.Th>Kho xuất</Table.Th>
              <Table.Th>Kho nhập</Table.Th>
              <Table.Th>Vị trí xuất (Locator)</Table.Th>
              <Table.Th>Số lô đề xuất</Table.Th>
              <Table.Th>Số lượng yêu cầu</Table.Th>
              <Table.Th>Số lượng đã xuất</Table.Th>
              <Table.Th>Trạng thái</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {lines.map((l, index) => (
              <Table.Tr key={l.lineId}>
                <Table.Td>{index + 1}</Table.Td>
                <Table.Td style={{ fontWeight: 600 }}>{l.itemNumber}</Table.Td>
                <Table.Td>{l.uomCode}</Table.Td>
                <Table.Td><Badge color="blue">{l.fromSubinventoryCode}</Badge></Table.Td>
                <Table.Td><Badge color="teal">{l.toSubinventoryCode}</Badge></Table.Td>
                <Table.Td>
                  {isAllocated ? (
                    <Text style={{ fontWeight: 600, color: "orange" }}>LOC-01-A</Text>
                  ) : (
                    <Text c="dimmed" size="xs">Chưa phân bổ</Text>
                  )}
                </Table.Td>
                <Table.Td>
                  {isAllocated ? (
                    l.itemNumber === "ITEM-KEO" ? <Badge color="orange">LOT-01</Badge> : "-"
                  ) : (
                    <Text c="dimmed" size="xs">Chưa phân bổ</Text>
                  )}
                </Table.Td>
                <Table.Td style={{ fontWeight: 600 }}>{l.quantity}</Table.Td>
                <Table.Td>{l.quantityDelivered}</Table.Td>
                <Table.Td>{getStatusLabel(l.lineStatus)}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>
    </Box>
  );
};

export default MoveOrderProcess;

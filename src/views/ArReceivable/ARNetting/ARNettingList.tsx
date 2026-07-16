import { useEffect, useState } from "react";
import { Box, Table, Card, Button, Flex, Title, Badge, Grid, Group, Text } from "@mantine/core";
import { arNettingService } from "../services/arNettingService";
import { formatNumber, formatDateTime } from "../../../common/FormatDate/FormatDate";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import { IconCheck, IconCoins, IconFileText } from "@tabler/icons-react";

export default function ARNettingList() {
  const [agreements, setAgreements] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);

  const fetchNetting = () => {
    arNettingService.getAgreements().then(res => {
      if (res.success) setAgreements(res.data || []);
    });
    arNettingService.getBatches().then(res => {
      if (res.success) setBatches(res.data || []);
    });
  };

  useEffect(() => {
    fetchNetting();
  }, []);

  const handleApprove = async (id: number) => {
    const res = await arNettingService.submitNetting(id);
    if (res.success) {
      NotificationExtension.Success(res.message);
      fetchNetting();
    }
  };

  return (
    <Box>
      <Flex
        justify="space-between"
        align="center"
        style={{ border: "1px solid #dee2e6", padding: "8px 12px", background: "#f8f9fa", borderRadius: 4 }}
        mb={20}
      >
        <Text size="sm" fw={700} c="dimmed">Bù trừ công nợ đối tác liên quan AR/AP Netting</Text>
      </Flex>

      <Grid>
        {/* Netting Agreements */}
        <Grid.Col span={12} mb="md">
          <Card withBorder shadow="sm" radius="md">
            <Group gap="xs" mb="md">
              <IconFileText size={20} color="#4f46e5" />
              <Title order={5} c="indigo">Hợp đồng & Thỏa thuận Bù trừ công nợ liên bên (Netting Agreements)</Title>
            </Group>
            
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Tên hợp đồng thỏa thuận</Table.Th>
                  <Table.Th>Ngày bắt đầu hiệu lực</Table.Th>
                  <Table.Th>Ngày kết thúc hiệu lực</Table.Th>
                  <Table.Th>Mức độ phê duyệt</Table.Th>
                  <Table.Th>Tình trạng</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {agreements.map((a, idx) => (
                  <Table.Tr key={idx}>
                    <Table.Td fw={700}>{a.agreementName}</Table.Td>
                    <Table.Td>{formatDateTime(a.startDate, "DD/MM/YYYY")}</Table.Td>
                    <Table.Td>{formatDateTime(a.endDate, "DD/MM/YYYY")}</Table.Td>
                    <Table.Td>
                      <Badge color="blue" variant="light">
                        {a.approvalRequired}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Badge color="green">Đang hiệu lực</Badge>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Card>
        </Grid.Col>

        {/* Netting Batches */}
        <Grid.Col span={12}>
          <Card withBorder shadow="sm" radius="md">
            <Group gap="xs" mb="md">
              <IconCoins size={20} color="#10b981" />
              <Title order={5} c="indigo">Đợt chạy cấn trừ đối soát công nợ thực tế (Netting Batches)</Title>
            </Group>

            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Mã đợt netting</Table.Th>
                  <Table.Th>Tên đợt chạy</Table.Th>
                  <Table.Th>Ngày hạch toán (GL Date)</Table.Th>
                  <Table.Th>Trạng thái</Table.Th>
                  <Table.Th style={{ textAlign: "center" }}>Hành động</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {batches.map((b, idx) => (
                  <Table.Tr key={idx}>
                    <Table.Td fw={700} c="blue">{b.batchNumber}</Table.Td>
                    <Table.Td fw={500}>{b.batchName}</Table.Td>
                    <Table.Td>{formatDateTime(b.glDate, "DD/MM/YYYY")}</Table.Td>
                    <Table.Td>
                      <Badge color={b.status === "COMPLETE" ? "green" : "yellow"}>
                        {b.status}
                      </Badge>
                    </Table.Td>
                    <Table.Td style={{ textAlign: "center" }}>
                      {b.status === "DRAFT" ? (
                        <Button 
                          color="teal" 
                          size="xs" 
                          leftSection={<IconCheck size={12} />} 
                          onClick={() => handleApprove(b.apNettingBatchId)}
                        >
                          Duyệt &amp; Khấu trừ
                        </Button>
                      ) : (
                        <Badge color="gray" variant="outline">Hoàn thành</Badge>
                      )}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Card>
        </Grid.Col>
      </Grid>
    </Box>
  );
}

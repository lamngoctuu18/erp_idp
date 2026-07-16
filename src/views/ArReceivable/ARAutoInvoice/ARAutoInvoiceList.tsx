import { useEffect, useState } from "react";
import { Box, Table, Card, Button, Title, Badge, Text, Grid, Group, Stepper } from "@mantine/core";
import { arIntegrationService } from "../services/arIntegrationService";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";

export default function ARAutoInvoiceList() {
  const [activeStep, setActiveStep] = useState(0);
  const [requests, setRequests] = useState<any[]>([]);
  const [errors, setErrors] = useState<any[]>([]);

  const loadData = () => {
    arIntegrationService.getRequests().then(res => {
      if (res.success) setRequests(res.data || []);
    });
    arIntegrationService.getInterfaceErrors().then(res => {
      if (res.success) setErrors(res.data || []);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRetry = async (lineId: number) => {
    const res = await arIntegrationService.retryLine(lineId);
    if (res.success) {
      NotificationExtension.Success("Đang chạy lại kiểm tra giao dịch...");
      loadData();
    }
  };

  return (
    <Box>
      <Title order={4} mb={4} c="indigo">AutoInvoice</Title>
      <Text c="dimmed" size="sm" mb="md">Import, kiểm tra và tạo hóa đơn theo một luồng xử lý thống nhất.</Text>

      <Card withBorder radius="md" mb="lg">
        <Stepper active={activeStep} size="sm" color="indigo">
          <Stepper.Step label="Nhập dữ liệu" description="Upload hoặc nhập tay" />
          <Stepper.Step label="Validate" description="Kiểm tra dữ liệu" />
          <Stepper.Step label="Kết quả kiểm tra" description="Xử lý lỗi" />
          <Stepper.Step label="Process" description="Tạo giao dịch AR" />
          <Stepper.Step label="Kết quả" description="Mở hóa đơn" />
        </Stepper>
        <Group justify="flex-end" mt="lg">
          <Button variant="default" disabled={activeStep === 0} onClick={() => setActiveStep(step => Math.max(0, step - 1))}>Quay lại</Button>
          <Button disabled={activeStep === 4} onClick={() => setActiveStep(step => Math.min(4, step + 1))}>
            {activeStep === 0 ? "Nhập dữ liệu Demo" : activeStep === 1 ? "Validate" : activeStep === 2 ? "Xác nhận lỗi" : "Tiếp tục"}
          </Button>
        </Group>
      </Card>
      
      <Grid>
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Card withBorder>
            <Title order={5} mb="sm" c="dimmed">Lịch sử nạp dữ liệu</Title>
            <Table striped>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Request ID</Table.Th>
                  <Table.Th>Tên đợt nạp</Table.Th>
                  <Table.Th>Đã chạy</Table.Th>
                  <Table.Th>Số lỗi</Table.Th>
                  <Table.Th>Trạng thái</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {requests.map((r, idx) => (
                  <Table.Tr key={idx}>
                    <Table.Td fw={700}>#{r.requestId}</Table.Td>
                    <Table.Td>{r.batchName}</Table.Td>
                    <Table.Td fw={500}>{r.processedCount} HĐ</Table.Td>
                    <Table.Td fw={700} c="red">{r.errorCount}</Table.Td>
                    <Table.Td><Badge color={r.status === "PROCESSED" ? "green" : "red"}>{r.status}</Badge></Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 7 }}>
          <Card withBorder>
            <Title order={5} mb="sm" c="dimmed">Chi tiết dữ liệu lỗi</Title>
            <Table striped>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Giao dịch lỗi</Table.Th>
                  <Table.Th>Chi tiết lỗi</Table.Th>
                  <Table.Th>Thao tác</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {errors.map((e, idx) => (
                  <Table.Tr key={idx}>
                    <Table.Td fw={700}>TRX_ERR_{e.transactionInterfaceHdrId || idx + 1}</Table.Td>
                    <Table.Td style={{ maxWidth: 350 }}><Text size="xs" c="red">{e.errorMessage}</Text></Table.Td>
                    <Table.Td>
                      <Group gap={4} wrap="nowrap">
                        <Button size="xs" variant="subtle">Xem lỗi</Button>
                        <Button size="xs" variant="subtle">Sửa dữ liệu</Button>
                        <Button size="xs" variant="outline" color="blue" onClick={() => handleRetry(e.transactionInterfaceHdrId)}>
                          Retry
                        </Button>
                      </Group>
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

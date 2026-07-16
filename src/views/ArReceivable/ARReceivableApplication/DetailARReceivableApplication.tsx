import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Card, Grid, Title, Text, Button, Flex } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { ARMockStorage } from "../mock/arMockStorage";
import { formatNumber, formatDateTime } from "../../../common/FormatDate/FormatDate";

export default function DetailARReceivableApplication() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [app, setApp] = useState<any>(null);

  useEffect(() => {
    const list = ARMockStorage.getReceivableApplications();
    const item = list.find(x => x.applicationId === Number(id));
    setApp(item);
  }, [id]);

  if (!app) return <Text>Đang tải...</Text>;

  const receipt = ARMockStorage.getReceipts().find(r => r.receiptId === app.receiptId);
  const invoice = ARMockStorage.getInvoices().find(i => i.invoiceId === app.appliedInvoiceId);

  return (
    <Box>
      <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/cong-no-phai-thu/apply-cong-no")} mb="lg">
        Quay lại
      </Button>

      <Card withBorder shadow="sm">
        <Title order={4} mb="md" c="indigo">Chi tiết phân bổ công nợ #APP-{app.applicationId}</Title>
        <Grid>
          <Grid.Col span={6}>
            <Text size="sm">Số phiếu thu: <b>{receipt?.receiptNumber || "N/A"}</b></Text>
            <Text size="sm">Số tiền phiếu thu: <b>{receipt?.totalAmount?.toLocaleString()} VND</b></Text>
          </Grid.Col>
          <Grid.Col span={6}>
            <Text size="sm">Số hóa đơn: <b>{invoice?.invoiceNumber || "N/A"}</b></Text>
            <Text size="sm">Tổng tiền hóa đơn: <b>{invoice?.totalAmount?.toLocaleString()} VND</b></Text>
          </Grid.Col>
          <Grid.Col span={12} style={{ borderTop: "1px solid #dee2e6", marginTop: 15, paddingTop: 15 }}>
            <Text size="sm">Số tiền phân bổ: <b style={{ color: "green", fontSize: "1.1rem" }}>{formatNumber(app.amountApplied)} VND</b></Text>
            <Text size="sm">Ngày áp dụng: <b>{formatDateTime(app.applyDate, "DD/MM/YYYY")}</b></Text>
            <Text size="sm">Trạng thái: <b>{app.status}</b></Text>
          </Grid.Col>
        </Grid>
      </Card>
    </Box>
  );
}

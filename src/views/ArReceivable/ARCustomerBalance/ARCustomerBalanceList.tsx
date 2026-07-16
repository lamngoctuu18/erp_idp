import { useEffect, useState } from "react";
import { Box, Table, Card, Title, Text } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { ARMockStorage } from "../mock/arMockStorage";
import { formatNumber } from "../../../common/FormatDate/FormatDate";
import { MOCK_CUSTOMERS } from "../mock/arMockData";

export default function ARCustomerBalanceList() {
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const schedules = ARMockStorage.getPaymentSchedules();
    const invoices = ARMockStorage.getInvoices();
    const receipts = ARMockStorage.getReceipts();
    const adjustments = ARMockStorage.getAdjustments();
    const customerBalances: Record<number, { id: number; code: string; name: string; invoiced: number; collected: number; credited: number; adjusted: number; total: number; current: number; overdue: number }> = {};

    MOCK_CUSTOMERS.forEach(cust => {
      customerBalances[Number(cust.id)] = { id: Number(cust.id), code: String(cust.code), name: cust.name, invoiced: 0, collected: 0, credited: 0, adjusted: 0, total: 0, current: 0, overdue: 0 };
    });

    invoices.forEach(invoice => {
      const balance = customerBalances[invoice.soldToCustomerId];
      if (!balance) return;
      const amount = invoice.totalAmount || 0;
      if (amount < 0 || invoice.type === "CREDIT_MEMO") balance.credited += Math.abs(amount);
      else balance.invoiced += amount;
    });

    receipts.forEach(receipt => {
      const balance = receipt.customerId ? customerBalances[receipt.customerId] : undefined;
      if (balance) balance.collected += receipt.appliedAmount || 0;
    });

    adjustments.forEach(adjustment => {
      const invoice = invoices.find(item => item.invoiceId === adjustment.invoiceId);
      const balance = invoice ? customerBalances[invoice.soldToCustomerId] : undefined;
      if (balance) balance.adjusted += Math.abs(adjustment.adjustmentAmount || 0);
    });

    schedules.forEach(s => {
      const remaining = s.amountDueRemaining || 0;
      const custId = s.customerId || 0;
      if (customerBalances[custId]) {
        customerBalances[custId].total += remaining;
        const due = new Date(s.dueDate);
        if (due >= new Date()) {
          customerBalances[custId].current += remaining;
        } else {
          customerBalances[custId].overdue += remaining;
        }
      }
    });

    setData(Object.values(customerBalances));
  }, []);

  return (
    <Box>
      <Title order={4} mb="md" c="indigo">Báo cáo số dư công nợ khách hàng</Title>
      <Card withBorder shadow="sm" radius="sm">
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Mã KH</Table.Th>
              <Table.Th>Tên khách hàng</Table.Th>
              <Table.Th style={{ textAlign: "right" }}>Tổng hóa đơn</Table.Th>
              <Table.Th style={{ textAlign: "right" }}>Đã thu</Table.Th>
              <Table.Th style={{ textAlign: "right" }}>Credit</Table.Th>
              <Table.Th style={{ textAlign: "right" }}>Adjustment</Table.Th>
              <Table.Th style={{ textAlign: "right" }}>Chưa đến hạn (VND)</Table.Th>
              <Table.Th style={{ textAlign: "right" }}>Quá hạn (VND)</Table.Th>
              <Table.Th style={{ textAlign: "right" }}>Tổng nợ phải thu</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data.map((c, idx) => (
              <Table.Tr key={idx}>
                <Table.Td fw={700}>{c.code}</Table.Td>
                <Table.Td>
                  <Text fw={600} c="indigo" style={{ cursor: "pointer" }} onClick={() => navigate(`/cong-no-phai-thu/cong-no?tab=hoa-don&customerId=${c.id}`)}>{c.name}</Text>
                </Table.Td>
                <Table.Td style={{ textAlign: "right" }}>{formatNumber(c.invoiced)}</Table.Td>
                <Table.Td style={{ textAlign: "right" }} c="teal">{formatNumber(c.collected)}</Table.Td>
                <Table.Td style={{ textAlign: "right" }} c="orange">{formatNumber(c.credited)}</Table.Td>
                <Table.Td style={{ textAlign: "right" }} c="blue">{formatNumber(c.adjusted)}</Table.Td>
                <Table.Td style={{ textAlign: "right" }} c="teal">{formatNumber(c.current)}</Table.Td>
                <Table.Td style={{ textAlign: "right" }} c="red">{formatNumber(c.overdue)}</Table.Td>
                <Table.Td style={{ textAlign: "right" }} fw={700} c="indigo">{formatNumber(c.total)}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>
    </Box>
  );
}

import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Card, Grid, Title, Text, Button, Table, Checkbox, NumberInput, Flex, Stack, Group } from "@mantine/core";
import { IconArrowLeft, IconCheck } from "@tabler/icons-react";
import { arCashService } from "../services/arCashService";
import { ARMockStorage } from "../mock/arMockStorage";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import { formatNumber, formatDateTime } from "../../../common/FormatDate/FormatDate";
import { MOCK_CUSTOMERS } from "../mock/arMockData";

interface CreateARReceivableApplicationProps {
  receiptId?: number;
  embedded?: boolean;
  preferredInvoiceId?: number;
  onCompleted?: () => void;
}

export default function CreateARReceivableApplication({
  receiptId: receiptIdProp,
  embedded = false,
  preferredInvoiceId,
  onCompleted,
}: CreateARReceivableApplicationProps = {}) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const receiptId = receiptIdProp ?? Number(id);

  const [receipt, setReceipt] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [selectedInvs, setSelectedInvs] = useState<Record<number, boolean>>({});
  const [applyAmounts, setApplyAmounts] = useState<Record<number, number>>({});
  const [appliedList, setAppliedList] = useState<any[]>([]);

  const fetchDetails = useCallback(() => {
    arCashService.getById(receiptId).then(res => {
      if (res.success && res.data) {
        const rec = res.data;
        setReceipt(rec);

        // Fetch unpaid invoices of this customer
        const unpaid = ARMockStorage.getPaymentSchedules().filter(x => x.customerId === rec.customerId && x.amountDueRemaining > 0);
        setInvoices(unpaid);

        const currentApps = ARMockStorage.getReceivableApplications().filter(x => x.receiptId === receiptId && x.status === "APPLIED");
        setAppliedList(currentApps);

        // Init default apply amounts to remaining debt
        const defAmts: Record<number, number> = {};
        unpaid.forEach(inv => {
          defAmts[inv.invoiceId] = inv.amountDueRemaining;
        });
        setApplyAmounts(defAmts);
        if (preferredInvoiceId && unpaid.some(inv => inv.invoiceId === preferredInvoiceId)) {
          setSelectedInvs({ [preferredInvoiceId]: true });
        }
      }
    });
  }, [preferredInvoiceId, receiptId]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  if (!receipt) return <Text>Đang tải thông tin apply công nợ...</Text>;

  const custName = MOCK_CUSTOMERS.find(c => c.id === receipt.customerId)?.name || "Chưa xác định KH";

  // Applied amounts summary
  const totalApplied = appliedList.reduce((sum, a) => sum + a.amountApplied, 0);
  const remainingUnapplied = receipt.totalAmount - totalApplied;

  const handleCheckboxChange = (invoiceId: number) => {
    setSelectedInvs(prev => ({ ...prev, [invoiceId]: !prev[invoiceId] }));
  };

  const handleAmountChange = (invoiceId: number, val: number) => {
    setApplyAmounts(prev => ({ ...prev, [invoiceId]: val }));
  };

  const handleApply = async () => {
    const selectedIds = Object.keys(selectedInvs).filter(k => selectedInvs[Number(k)]).map(Number);
    if (selectedIds.length === 0) {
      NotificationExtension.Fails("Vui lòng chọn ít nhất 1 hóa đơn để apply.");
      return;
    }

    let sumApply = 0;
    for (const invId of selectedIds) {
      sumApply += applyAmounts[invId] || 0;
    }

    if (sumApply > remainingUnapplied) {
      NotificationExtension.Fails(`Số tiền apply (${formatNumber(sumApply)}) vượt quá số tiền chưa phân bổ còn lại của phiếu thu (${formatNumber(remainingUnapplied)}).`);
      return;
    }

    try {
      for (const invId of selectedIds) {
        const amt = applyAmounts[invId] || 0;
        await arCashService.applyReceipt(receipt.receiptId, invId, amt);
      }
      NotificationExtension.Success("Đã apply thanh toán hóa đơn thành công!");
      setSelectedInvs({});
      fetchDetails();
      onCompleted?.();
    } catch (err: any) {
      NotificationExtension.Fails(err.message);
    }
  };

  const handleUnapply = async (appId: number) => {
    const res = await arCashService.unapplyReceipt(appId);
    if (res.success) {
      NotificationExtension.Success("Đã hủy apply thành công!");
      fetchDetails();
      onCompleted?.();
    } else {
      NotificationExtension.Fails(res.message);
    }
  };

  return (
    <Box>
      {!embedded && (
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate(`/cong-no-phai-thu/phieu-thu/${receiptId}`)} mb="lg">
          Quay lại phiếu thu
        </Button>
      )}

      <Grid>
        {/* Left column: Receipt info & Applied items */}
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Stack gap="md">
            <Card withBorder>
              <Title order={5} mb="sm" c="indigo">Thông tin phiếu thu</Title>
              <Text size="sm">Số phiếu thu: <b>{receipt.receiptNumber}</b></Text>
              <Text size="sm">Khách hàng: <b>{custName}</b></Text>
              <Text size="sm">Ngày thu: <b>{formatDateTime(receipt.receiptDate, "DD/MM/YYYY")}</b></Text>
              
              <Group mt="md" justify="space-between" style={{ borderTop: "1px solid #dee2e6", paddingTop: 10 }}>
                <Box>
                  <Text size="xs" c="dimmed">Số tiền thu</Text>
                  <Text fw={700} size="md">{formatNumber(receipt.totalAmount)} VND</Text>
                </Box>
                <Box>
                  <Text size="xs" c="dimmed">Đã apply</Text>
                  <Text fw={700} size="md" c="green">{formatNumber(totalApplied)} VND</Text>
                </Box>
                <Box>
                  <Text size="xs" c="dimmed">Còn lại</Text>
                  <Text fw={700} size="md" c="red">{formatNumber(remainingUnapplied)} VND</Text>
                </Box>
              </Group>
            </Card>

            <Card withBorder>
              <Title order={5} mb="sm" c="indigo">Giao dịch đã apply</Title>
              <Table striped>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Mã hóa đơn</Table.Th>
                    <Table.Th style={{ textAlign: "right" }}>Số tiền</Table.Th>
                    <Table.Th style={{ textAlign: "center" }}>Hủy</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {appliedList.map((app, idx) => (
                    <Table.Tr key={idx}>
                      <Table.Td fw={700}>INV-2026-{app.appliedInvoiceId.toString().padStart(4, "0")}</Table.Td>
                      <Table.Td style={{ textAlign: "right" }} fw={700}>{formatNumber(app.amountApplied)}</Table.Td>
                      <Table.Td style={{ textAlign: "center" }}>
                        <Button color="red" variant="subtle" size="xs" onClick={() => handleUnapply(app.applicationId)}>
                          Hủy apply
                        </Button>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                  {appliedList.length === 0 && (
                    <Table.Tr>
                      <Table.Td colSpan={3} align="center">Chưa có giao dịch thanh toán.</Table.Td>
                    </Table.Tr>
                  )}
                </Table.Tbody>
              </Table>
            </Card>
          </Stack>
        </Grid.Col>

        {/* Right column: Unpaid invoices table */}
        <Grid.Col span={{ base: 12, md: 7 }}>
          <Card withBorder>
            <Flex justify="space-between" align="center" mb="md">
              <Title order={5} c="indigo">Danh sách hóa đơn chưa thanh toán</Title>
              <Button leftSection={<IconCheck size={16} />} color="teal" onClick={handleApply}>
                Áp dụng thanh toán (Apply)
              </Button>
            </Flex>

            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th style={{ width: 50 }}>Chọn</Table.Th>
                  <Table.Th>Mã hóa đơn</Table.Th>
                  <Table.Th>Hạn thanh toán</Table.Th>
                  <Table.Th style={{ textAlign: "right" }}>Số nợ (VND)</Table.Th>
                  <Table.Th style={{ width: 140 }}>Số tiền apply</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {invoices.map((inv, idx) => {
                  const isChecked = !!selectedInvs[inv.invoiceId];
                  return (
                    <Table.Tr key={idx}>
                      <Table.Td>
                        <Checkbox checked={isChecked} onChange={() => handleCheckboxChange(inv.invoiceId)} />
                      </Table.Td>
                      <Table.Td fw={700}>INV-2026-{inv.invoiceId.toString().padStart(4, "0")}</Table.Td>
                      <Table.Td>{formatDateTime(inv.dueDate, "DD/MM/YYYY")}</Table.Td>
                      <Table.Td style={{ textAlign: "right" }} fw={700} c="red">{formatNumber(inv.amountDueRemaining)}</Table.Td>
                      <Table.Td>
                        <NumberInput
                          value={applyAmounts[inv.invoiceId] || 0}
                          onChange={(val) => handleAmountChange(inv.invoiceId, Number(val))}
                          min={1}
                          max={inv.amountDueRemaining}
                          disabled={!isChecked}
                        />
                      </Table.Td>
                    </Table.Tr>
                  );
                })}
                {invoices.length === 0 && (
                  <Table.Tr>
                    <Table.Td colSpan={5} align="center">Không có hóa đơn nợ đối với khách hàng này.</Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </Card>
        </Grid.Col>
      </Grid>
    </Box>
  );
}

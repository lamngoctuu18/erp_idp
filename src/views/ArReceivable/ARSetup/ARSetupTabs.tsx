import { ReactNode, useEffect, useState } from "react";
import { Badge, Box, Button, Card, Flex, ScrollArea, Table, Tabs, Text, Title } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { arSetupService } from "../services/arSetupService";
import { ARMockStorage } from "../mock/arMockStorage";
import { formatDateTime } from "../../../common/FormatDate/FormatDate";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";

interface CatalogColumn {
  label: string;
  render: (row: any) => ReactNode;
  align?: "left" | "right";
}

function CatalogTable({ title, description, rows, columns }: {
  title: string;
  description: string;
  rows: any[];
  columns: CatalogColumn[];
}) {
  return (
    <Box>
      <Flex justify="space-between" align="center" gap="md" wrap="wrap" mb="md">
        <Box>
          <Title order={4}>{title}</Title>
          <Text size="sm" c="dimmed">{description}</Text>
        </Box>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => NotificationExtension.Success(`Đã mở drawer tạo mới ${title} (Demo).`)}
        >
          Thêm mới
        </Button>
      </Flex>

      <Card withBorder radius="md" padding={0}>
        <ScrollArea>
          <Table striped highlightOnHover miw={760}>
            <Table.Thead>
              <Table.Tr>
                {columns.map((column) => <Table.Th key={column.label} ta={column.align}>{column.label}</Table.Th>)}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rows.map((row, index) => (
                <Table.Tr key={row.id || row.transactionSourceId || row.transactionTypeId || row.termId || row.receiptClassId || row.receiptMethodId || row.methodBankAccountId || row.receivableActivityId || row.distributionSetId || index}>
                  {columns.map((column) => <Table.Td key={column.label} ta={column.align}>{column.render(row)}</Table.Td>)}
                </Table.Tr>
              ))}
              {rows.length === 0 && (
                <Table.Tr><Table.Td colSpan={columns.length} ta="center" py="xl"><Text c="dimmed">Chưa có dữ liệu.</Text></Table.Td></Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Card>
    </Box>
  );
}

export default function ARSetupTabs() {
  const [sources, setSources] = useState<any[]>([]);
  const [types, setTypes] = useState<any[]>([]);
  const [terms, setTerms] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [methods, setMethods] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [distributionSets, setDistributionSets] = useState<any[]>([]);
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);

  useEffect(() => {
    arSetupService.getTransactionSources().then((res) => res.success && setSources(res.data || []));
    arSetupService.getTransactionTypes().then((res) => res.success && setTypes((res.data || []).filter((item: any) => {
      const text = `${item.typeCode || ""} ${item.typeName || ""} ${item.description || ""} ${item.typeClass || ""}`.toLowerCase();
      return !text.includes("netting") && !text.includes("bù trừ");
    })));
    arSetupService.getPaymentTerms().then((res) => res.success && setTerms(res.data || []));
    arSetupService.getReceiptClasses().then((res) => res.success && setClasses(res.data || []));
    arSetupService.getReceiptMethods().then((res) => res.success && setMethods(res.data || []));
    arSetupService.getReceivableActivities().then((res) => res.success && setActivities((res.data || []).filter((item: any) => {
      const text = `${item.activityCode || ""} ${item.activityName || ""} ${item.description || ""} ${item.activityType || ""}`.toLowerCase();
      return !text.includes("netting") && !text.includes("ar/ap") && !text.includes("bù trừ");
    })));
    arSetupService.getDistributionSets().then((res) => res.success && setDistributionSets(res.data || []));
    setBankAccounts(ARMockStorage.getReceiptMethodBankAccts());
  }, []);

  const activeBadge = (value: unknown) => (
    <Badge color={value === "N" || value === false ? "gray" : "teal"} variant="light">
      {value === "N" || value === false ? "Tạm ngưng" : "Đang dùng"}
    </Badge>
  );

  return (
    <Tabs defaultValue="sources" orientation="vertical" color="indigo" keepMounted={false}>
      <Tabs.List miw={210} mr="lg">
        <Tabs.Tab value="sources">Nguồn giao dịch</Tabs.Tab>
        <Tabs.Tab value="types">Loại giao dịch</Tabs.Tab>
        <Tabs.Tab value="terms">Điều khoản thanh toán</Tabs.Tab>
        <Tabs.Tab value="receipt-classes">Nhóm phương thức thu</Tabs.Tab>
        <Tabs.Tab value="receipt-methods">Phương thức thu</Tabs.Tab>
        <Tabs.Tab value="bank-accounts">Tài khoản ngân hàng</Tabs.Tab>
        <Tabs.Tab value="activities">Hoạt động phải thu</Tabs.Tab>
        <Tabs.Tab value="distribution-sets">Bộ phân bổ tài khoản</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="sources" style={{ flex: 1 }}>
        <CatalogTable title="Nguồn giao dịch" description="Nguồn tạo hóa đơn thủ công hoặc tích hợp AutoInvoice." rows={sources} columns={[
          { label: "Mã nguồn", render: (row) => <Text fw={700}>{row.sourceCode || `SOURCE-${row.transactionSourceId}`}</Text> },
          { label: "Tên nguồn", render: (row) => row.sourceName || row.description || "—" },
          { label: "Loại nguồn", render: (row) => row.sourceType || "MANUAL" },
          { label: "Ngày hiệu lực", render: (row) => formatDateTime(row.startDate, "DD/MM/YYYY") },
          { label: "Trạng thái", render: (row) => activeBadge(row.activeFlag) },
        ]} />
      </Tabs.Panel>

      <Tabs.Panel value="types" style={{ flex: 1 }}>
        <CatalogTable title="Loại giao dịch" description="Quy định class chứng từ và tài khoản hạch toán mặc định." rows={types} columns={[
          { label: "Mã loại", render: (row) => <Text fw={700}>{row.typeCode || `TYPE-${row.transactionTypeId}`}</Text> },
          { label: "Tên / Mô tả", render: (row) => row.typeName || row.description || "—" },
          { label: "Class", render: (row) => row.typeClass || "INVOICE" },
          { label: "TK phải thu", render: (row) => row.receivableCcid || "131000" },
          { label: "Trạng thái", render: (row) => activeBadge(row.activeFlag) },
        ]} />
      </Tabs.Panel>

      <Tabs.Panel value="terms" style={{ flex: 1 }}>
        <CatalogTable title="Điều khoản thanh toán" description="Chọn một điều khoản để quản lý header và các kỳ hạn trong cùng drawer." rows={terms} columns={[
          { label: "Mã", render: (row) => <Text fw={700}>{row.termCode}</Text> },
          { label: "Tên điều khoản", render: (row) => row.termName },
          { label: "Diễn giải", render: (row) => row.description || "—" },
          { label: "Ngày hiệu lực", render: (row) => formatDateTime(row.startDate, "DD/MM/YYYY") },
          { label: "Trạng thái", render: (row) => activeBadge(row.activeFlag) },
        ]} />
      </Tabs.Panel>

      <Tabs.Panel value="receipt-classes" style={{ flex: 1 }}>
        <CatalogTable title="Nhóm phương thức thu" description="Cấu hình cách tạo, remittance và clearing của phiếu thu." rows={classes} columns={[
          { label: "Mã nhóm", render: (row) => <Text fw={700}>{row.classCode || `CLASS-${row.receiptClassId}`}</Text> },
          { label: "Tên nhóm", render: (row) => row.className },
          { label: "Cách tạo", render: (row) => row.creationMethod },
          { label: "Remittance", render: (row) => row.remittanceMethod },
          { label: "Clearing", render: (row) => row.clearanceMethod },
        ]} />
      </Tabs.Panel>

      <Tabs.Panel value="receipt-methods" style={{ flex: 1 }}>
        <CatalogTable title="Phương thức thu" description="Phương thức nhận tiền gắn với nhóm thu và tài khoản ngân hàng." rows={methods} columns={[
          { label: "Mã", render: (row) => <Text fw={700}>{row.methodCode || `METHOD-${row.receiptMethodId}`}</Text> },
          { label: "Tên phương thức", render: (row) => row.methodName || row.printedName || `Phương thức #${row.receiptMethodId}` },
          { label: "Nhóm phương thức", render: (row) => classes.find((item) => item.receiptClassId === row.receiptClassId)?.className || `#${row.receiptClassId}` },
          { label: "Ngày hiệu lực", render: (row) => formatDateTime(row.startDate, "DD/MM/YYYY") },
          { label: "Trạng thái", render: (row) => activeBadge(row.activeFlag) },
        ]} />
      </Tabs.Panel>

      <Tabs.Panel value="bank-accounts" style={{ flex: 1 }}>
        <CatalogTable title="Tài khoản ngân hàng" description="Tài khoản nhận tiền và các tài khoản đối ứng Unapplied, Unidentified, On-account." rows={bankAccounts} columns={[
          { label: "Phương thức thu", render: (row) => `METHOD-${row.receiptMethodId}` },
          { label: "Tài khoản ngân hàng", render: (row) => <Text fw={700}>BANK-{row.bankAccountId}</Text> },
          { label: "Tiền tệ", render: (row) => row.currencyCode || "VND" },
          { label: "TK Cash", render: (row) => row.cashCcid || "112100" },
          { label: "TK Unapplied", render: (row) => row.unappliedCcid || "131900" },
          { label: "Chính", render: (row) => <Badge variant="light">{row.primaryFlag === "N" ? "Không" : "Có"}</Badge> },
        ]} />
      </Tabs.Panel>

      <Tabs.Panel value="activities" style={{ flex: 1 }}>
        <CatalogTable title="Hoạt động phải thu" description="Các hoạt động dùng cho Adjustment, write-off và giao dịch thu khác." rows={activities} columns={[
          { label: "Mã hoạt động", render: (row) => <Text fw={700}>{row.activityCode || `ACT-${row.receivableActivityId}`}</Text> },
          { label: "Tên hoạt động", render: (row) => row.activityName || row.name || row.description },
          { label: "Loại", render: (row) => row.activityType },
          { label: "TK hạch toán", render: (row) => row.activityCcid || row.glAccountId || "131000" },
          { label: "Trạng thái", render: (row) => activeBadge(row.activeFlag ?? row.active) },
        ]} />
      </Tabs.Panel>

      <Tabs.Panel value="distribution-sets" style={{ flex: 1 }}>
        <CatalogTable title="Bộ phân bổ tài khoản" description="Bộ quy tắc phân bổ doanh thu và chi phí mặc định." rows={distributionSets} columns={[
          { label: "Mã bộ", render: (row) => <Text fw={700}>{row.distributionSetCode || `DIST-${row.distributionSetId}`}</Text> },
          { label: "Tên bộ", render: (row) => row.distributionSetName || row.name || "—" },
          { label: "Mô tả", render: (row) => row.description || "—" },
          { label: "Trạng thái", render: (row) => activeBadge(row.activeFlag) },
        ]} />
      </Tabs.Panel>
    </Tabs>
  );
}

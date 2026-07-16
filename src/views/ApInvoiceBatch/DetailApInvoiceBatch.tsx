import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Card, Title, Text, Group, Button, Grid, Divider, Center, Loader, Badge, Table } from "@mantine/core";
import { IconArrowLeft, IconEdit, IconTrash } from "@tabler/icons-react";
import { apInvoiceBatchService, apInvoiceMasterService } from "../../api/apVendor/apInvoiceMasterMockService";
import { apPaymentTermService } from "../../api/apVendor/apPaymentMockService";
import { apVendorMasterService } from "../../api/apVendor/apVendorMasterMockService";
import { ApInvoiceBatch, ApInvoice } from "../../model/ApInvoiceMasterModel";
import { ApPaymentTerm } from "../../model/ApPaymentModel";
import { ApVendor } from "../../model/ApVendorMasterModel";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

export default function DetailApInvoiceBatch() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<ApInvoiceBatch | null>(null);
  const [invoices, setInvoices] = useState<ApInvoice[]>([]);
  const [vendors, setVendors] = useState<ApVendor[]>([]);
  const [terms, setTerms] = useState<ApPaymentTerm[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMetadata = async () => {
    try {
      const vList = await apVendorMasterService.getAll();
      setVendors(vList);
      const tList = await apPaymentTermService.getAll();
      setTerms(tList);
    } catch {
      console.error("Lỗi tải metadata.");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        await loadMetadata();
        const res = await apInvoiceBatchService.getById(Number(id));
        if (res.success && res.data) {
          setData(res.data);

          // Tải danh sách hóa đơn thuộc lô này
          const invRes = await apInvoiceMasterService.getList({ batchId: Number(id), take: 100 });
          if (invRes.success && invRes.data) {
            setInvoices(invRes.data.items);
          }
        } else {
          NotificationExtension.Fails(res.message || "Không tìm thấy lô hóa đơn.");
          navigate("/ApInvoiceBatch/ApInvoiceBatchList");
        }
      } catch {
        NotificationExtension.Fails("Lỗi khi tải thông tin lô hóa đơn.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const termName = useMemo(() => {
    if (!data) return "-";
    const t = terms.find((x) => x.paymentTermId === data.paymentTermId);
    return t ? t.termName : `ID: ${data.paymentTermId}`;
  }, [data, terms]);

  if (loading) {
    return (
      <Center style={{ height: "300px" }}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (!data) return null;

  return (
    <Box>
      <Group justify="space-between" align="center" mb="lg">
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/ApInvoiceBatch/ApInvoiceBatchList")}>
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="xl" mb="lg">
        <Group justify="space-between" align="center" mb="xs">
          <Title order={3}>Chi tiết lô hóa đơn: {data.batchName}</Title>
          <Group>
            <Button
              leftSection={<IconEdit size={16} />}
              color="yellow"
              variant="light"
              onClick={() => navigate(`/ApInvoiceBatch/Edit/${data.batchId}`)}
            >
              Chỉnh sửa lô
            </Button>
            <Button
              leftSection={<IconTrash size={16} />}
              color="red"
              variant="light"
              onClick={() => navigate(`/ApInvoiceBatch/Delete/${data.batchId}`)}
            >
              Xóa lô hóa đơn
            </Button>
          </Group>
        </Group>
        <Divider mb="xl" />

        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Mã lô hóa đơn (Batch ID)</Text>
            <Text fw={600} size="md">{data.batchId}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Tên lô hóa đơn</Text>
            <Text fw={600} size="md">{data.batchName}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Số tiền dự kiến</Text>
            <Text fw={600} size="md">{data.estimatedAmount?.toLocaleString("vi-VN")} {data.invoiceCurrencyCode}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Số tiền thực tế hạch toán</Text>
            <Text fw={700} size="md" style={{ color: "#2b8a3e" }}>{data.actualAmount?.toLocaleString("vi-VN")} {data.invoiceCurrencyCode}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Số lượng hóa đơn (Dự kiến / Thực tế)</Text>
            <Text fw={600} size="md">{data.invoiceCount || 0} / {data.actualInvoiceCount || 0}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Điều khoản thanh toán mặc định</Text>
            <Text fw={600} size="md">{termName}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Nhóm thanh toán (Pay Group)</Text>
            <Text fw={600} size="md">{data.payGroup || "N/A"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Trạng thái lô chi</Text>
            <Box mt="xs">
              <Badge color={data.batchStatus === "APPROVED" ? "green" : data.batchStatus === "CLOSED" ? "red" : "orange"}>
                {data.batchStatus}
              </Badge>
            </Box>
          </Grid.Col>
        </Grid>
      </Card>

      {/* Danh sách hóa đơn trong lô */}
      <Card withBorder shadow="sm" radius="md" padding="xl">
        <Title order={4} mb="md">Danh sách hóa đơn mua hàng thuộc lô ({invoices.length})</Title>
        <Divider mb="md" />

        <Table striped highlightOnHover withTableBorder withColumnBorders style={{ fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f8f9fa" }}>
              <th style={{ width: 120, padding: 8 }}>Mã hóa đơn</th>
              <th style={{ width: 180, padding: 8 }}>Số hóa đơn (Invoice Num)</th>
              <th style={{ padding: 8 }}>Nhà cung cấp</th>
              <th style={{ padding: 8, textAlign: "right" }}>Số tiền hóa đơn</th>
              <th style={{ padding: 8 }}>Ngày hóa đơn</th>
              <th style={{ width: 150, padding: 8 }}>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: 12, color: "#868e96" }}>Lô hóa đơn này hiện trống.</td>
              </tr>
            ) : (
              invoices.map((inv) => {
                const v = vendors.find((x) => x.vendorId === inv.vendorId);
                return (
                  <tr key={inv.invoiceId}>
                    <td style={{ padding: 8 }}>{inv.invoiceId}</td>
                    <td style={{ padding: 8, fontWeight: 700, color: "#228be6", cursor: "pointer" }} onClick={() => navigate(`/ApInvoice/ApInvoiceDetail/${inv.invoiceId}`)}>{inv.invoiceNum}</td>
                    <td style={{ padding: 8 }}>{v ? v.vendorName : `ID: ${inv.vendorId}`}</td>
                    <td style={{ padding: 8, textAlign: "right", fontWeight: 600, color: "#2b8a3e" }}>{inv.invoiceAmount?.toLocaleString("vi-VN")} {inv.invoiceCurrencyCode}</td>
                    <td style={{ padding: 8 }}>{inv.invoiceDate ? new Date(inv.invoiceDate).toLocaleDateString("vi-VN") : "-"}</td>
                    <td style={{ padding: 8 }}>
                      <Badge color={inv.status === "VALIDATED" ? "green" : "orange"}>{inv.status}</Badge>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
      </Card>
    </Box>
  );
}

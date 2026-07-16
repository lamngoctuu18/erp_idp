import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Card, Title, Text, Group, Button, Grid, Divider, Center, Loader, Table, Badge } from "@mantine/core";
import { IconArrowLeft, IconEdit, IconTrash } from "@tabler/icons-react";
import { apPaymentService, apInvoicePaymentService } from "../../api/apVendor/apPaymentMockService";
import { ApPayment, ApInvoicePayment } from "../../model/ApPaymentModel";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

export default function DetailApPayment() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<ApPayment | null>(null);
  const [invoicePayments, setInvoicePayments] = useState<ApInvoicePayment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const res = await apPaymentService.getById(Number(id));
        if (res.success && res.data) {
          setData(res.data);

          // Lấy phân bổ thanh toán cho hóa đơn tương ứng với paymentId này
          const ipRes = await apInvoicePaymentService.getList({ paymentId: Number(id), take: 100 });
          if (ipRes.success && ipRes.data) {
            setInvoicePayments(ipRes.data.items);
          }
        } else {
          NotificationExtension.Fails(res.message || "Không tìm thấy thông tin phiếu chi.");
          navigate("/ApPayment/ApPaymentList");
        }
      } catch {
        NotificationExtension.Fails("Lỗi khi tải thông tin phiếu chi.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

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
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/ApPayment/ApPaymentList")}>
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="xl" mb="lg">
        <Group justify="space-between" align="center" mb="xs">
          <Title order={3}>Phiếu chi số: #{data.paymentNumber}</Title>
          <Group>
            <Button
              leftSection={<IconEdit size={16} />}
              color="yellow"
              variant="light"
              onClick={() => navigate(`/ApPayment/Edit/${data.paymentId}`)}
            >
              Chỉnh sửa
            </Button>
            <Button
              leftSection={<IconTrash size={16} />}
              color="red"
              variant="light"
              onClick={() => navigate(`/ApPayment/Delete/${data.paymentId}`)}
            >
              Xóa phiếu chi
            </Button>
          </Group>
        </Group>
        <Divider mb="xl" />

        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Mã phiếu chi (ID)</Text>
            <Text fw={600} size="md">{data.paymentId}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Số phiếu chi (UNC / Check Number)</Text>
            <Text fw={700} size="md">{data.paymentNumber}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Nhà cung cấp thụ hưởng</Text>
            <Text fw={600} size="md" style={{ color: "#228be6" }}>{data.vendorName}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Chi nhánh nhà cung cấp (Site)</Text>
            <Text fw={600} size="md">{data.vendorSiteCode}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Số tài khoản ngân hàng thụ hưởng</Text>
            <Text fw={600} size="md">{data.bankAccountNum || "-"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Tên tài khoản chi trả</Text>
            <Text fw={600} size="md">{data.bankAccountName || "-"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Text size="sm" c="dimmed">Ngày lập chi</Text>
            <Text fw={600} size="md">
              {data.checkDate ? new Date(data.checkDate).toLocaleDateString("vi-VN") : "-"}
            </Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Text size="sm" c="dimmed">Số tiền thanh toán</Text>
            <Text fw={700} size="md" style={{ color: "#2b8a3e" }}>
              {data.amount?.toLocaleString("vi-VN")} {data.currencyCode}
            </Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Text size="sm" c="dimmed">Số tiền quy đổi (Base Amount)</Text>
            <Text fw={600} size="md">
              {data.baseAmount?.toLocaleString("vi-VN")} VND
            </Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Phương thức thanh toán</Text>
            <Text fw={600} size="md">
              {data.paymentMethodLookupCode === "WIRE" ? "Ủy nhiệm chi (WIRE)" : data.paymentMethodLookupCode === "CHECK" ? "Séc (CHECK)" : "Tiền mặt (CASH)"}
            </Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Trạng thái phiếu chi</Text>
            <Box mt="xs">
              <Badge color={data.statusLookupCode === "NEGOTIABLE" || data.statusLookupCode === "CLEARED" ? "green" : "red"}>
                {data.statusLookupCode}
              </Badge>
            </Box>
          </Grid.Col>

          <Grid.Col span={12}>
            <Text size="sm" c="dimmed">Nội dung / Diễn giải chi tiền</Text>
            <Text fw={600} size="md">{data.description || "-"}</Text>
          </Grid.Col>
        </Grid>
      </Card>

      {/* Danh sách phân bổ thanh toán hóa đơn đi kèm */}
      <Card withBorder shadow="sm" radius="md" padding="xl">
        <Title order={4} mb="md">Danh sách Hóa đơn được thanh toán đối trừ ({invoicePayments.length})</Title>
        <Divider mb="md" />

        <Table striped highlightOnHover withTableBorder withColumnBorders style={{ fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f8f9fa" }}>
              <th style={{ width: 120, padding: 8 }}>Mã phân bổ</th>
              <th style={{ width: 180, padding: 8 }}>Số hóa đơn (Invoice)</th>
              <th style={{ padding: 8, textAlign: "right" }}>Số tiền thanh toán (VND)</th>
              <th style={{ padding: 8, textAlign: "right" }}>Số tiền quy đổi (Base)</th>
              <th style={{ width: 150, padding: 8 }}>Ngày hạch toán</th>
              <th style={{ width: 120, padding: 8 }}>Kỳ kế toán</th>
            </tr>
          </thead>
          <tbody>
            {invoicePayments.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: 12, color: "#868e96" }}>Phiếu chi này chưa phân bổ cho hóa đơn nào.</td>
              </tr>
            ) : (
              invoicePayments.map((ip) => (
                <tr key={ip.invoicePaymentId}>
                  <td style={{ padding: 8 }}>{ip.invoicePaymentId}</td>
                  <td style={{ padding: 8, fontWeight: 700, color: "#228be6", cursor: "pointer" }} onClick={() => navigate(`/ApInvoicePayment/Detail/${ip.invoicePaymentId}`)}>{ip.invoiceNum}</td>
                  <td style={{ padding: 8, textAlign: "right", fontWeight: 600, color: "#2b8a3e" }}>{ip.amount?.toLocaleString("vi-VN")}</td>
                  <td style={{ padding: 8, textAlign: "right" }}>{ip.paymentBaseAmount?.toLocaleString("vi-VN")}</td>
                  <td style={{ padding: 8 }}>{ip.accountingDate ? new Date(ip.accountingDate).toLocaleDateString("vi-VN") : "-"}</td>
                  <td style={{ padding: 8 }}>{ip.periodName}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card>
    </Box>
  );
}

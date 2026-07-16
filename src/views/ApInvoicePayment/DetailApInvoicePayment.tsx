import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Card, Title, Text, Group, Button, Grid, Divider, Center, Loader, Badge } from "@mantine/core";
import { IconArrowLeft, IconEdit, IconTrash } from "@tabler/icons-react";
import { apInvoicePaymentService } from "../../api/apVendor/apPaymentMockService";
import { ApInvoicePayment } from "../../model/ApPaymentModel";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

export default function DetailApInvoicePayment() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<ApInvoicePayment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const res = await apInvoicePaymentService.getById(Number(id));
        if (res.success && res.data) {
          setData(res.data);
        } else {
          NotificationExtension.Fails(res.message || "Không tìm thấy thông tin phân bổ.");
          navigate("/ApInvoicePayment/ApInvoicePaymentList");
        }
      } catch {
        NotificationExtension.Fails("Lỗi khi tải thông tin phân bổ thanh toán.");
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
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/ApInvoicePayment/ApInvoicePaymentList")}>
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="xl">
        <Group justify="space-between" align="center" mb="xs">
          <Title order={3}>Phân bổ thanh toán hóa đơn: #{data.invoicePaymentId}</Title>
          <Group>
            <Button
              leftSection={<IconEdit size={16} />}
              color="yellow"
              variant="light"
              onClick={() => navigate(`/ApInvoicePayment/Edit/${data.invoicePaymentId}`)}
            >
              Chỉnh sửa
            </Button>
            <Button
              leftSection={<IconTrash size={16} />}
              color="red"
              variant="light"
              onClick={() => navigate(`/ApInvoicePayment/Delete/${data.invoicePaymentId}`)}
            >
              Xóa phân bổ
            </Button>
          </Group>
        </Group>
        <Divider mb="xl" />

        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Mã phân bổ thanh toán (ID)</Text>
            <Text fw={600} size="md">{data.invoicePaymentId}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Số phiếu chi thanh toán liên kết</Text>
            <Text fw={600} size="md" style={{ color: "#228be6", cursor: "pointer" }} onClick={() => navigate(`/ApPayment/Detail/${data.paymentId}`)}>{data.paymentNumber ? `Check Num: ${data.paymentNumber}` : `Check ID: ${data.paymentId}`}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Hóa đơn nhận phân bổ (Invoice)</Text>
            <Text fw={700} size="md" style={{ color: "#228be6" }}>{data.invoiceNum}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Số tiền thanh toán phân bổ</Text>
            <Text fw={700} size="md" style={{ color: "#2b8a3e" }}>
              {data.amount?.toLocaleString("vi-VN")} {data.currencyCode}
            </Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Ngày hạch toán (Accounting Date)</Text>
            <Text fw={600} size="md">
              {data.accountingDate ? new Date(data.accountingDate).toLocaleDateString("vi-VN") : "-"}
            </Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Kỳ kế toán hạch toán</Text>
            <Text fw={600} size="md">{data.periodName}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Cờ đảo bút toán (Reversal Flag)</Text>
            <Box mt="xs">
              <Badge color={data.reversalFlag === "Y" ? "red" : "gray"}>
                {data.reversalFlag === "Y" ? "ĐÃ ĐẢO BÚT TOÁN (REVERSED)" : "GHI NHẬN BÌNH THƯỜNG"}
              </Badge>
            </Box>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Tỷ giá đối trừ quy đổi</Text>
            <Text fw={600} size="md">{data.exchangeRate || "1"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Text size="sm" c="dimmed">Tổng tiền hóa đơn gốc</Text>
            <Text fw={600} size="md">{data.invoiceAmount?.toLocaleString("vi-VN")} {data.currencyCode}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Text size="sm" c="dimmed">Số tiền phân bổ quy đổi (VND)</Text>
            <Text fw={600} size="md">{data.paymentBaseAmount?.toLocaleString("vi-VN")} VND</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Text size="sm" c="dimmed">Mã Sổ kế toán (Set of Books)</Text>
            <Text fw={600} size="md">{data.setOfBooksId}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Text size="sm" c="dimmed">Tài khoản nợ hạch toán (Dr CCID)</Text>
            <Text fw={600} size="md">{data.ccidDr || "-"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Text size="sm" c="dimmed">Tài khoản có hạch toán (Cr CCID)</Text>
            <Text fw={600} size="md">{data.ccidCr || "-"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Text size="sm" c="dimmed">Mã đơn vị hoạt động (Org ID)</Text>
            <Text fw={600} size="md">{data.orgId}</Text>
          </Grid.Col>
        </Grid>
      </Card>
    </Box>
  );
}

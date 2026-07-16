import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Card, Title, Text, Group, Button, Grid, Divider, Center, Loader, Table } from "@mantine/core";
import { IconArrowLeft, IconEdit, IconTrash } from "@tabler/icons-react";
import { apPaymentTermService, apPaymentTermLineService, apPaymentTermDiscountService } from "../../api/apVendor/apPaymentMockService";
import { ApPaymentTerm, ApPaymentTermLine, ApPaymentTermDiscount } from "../../model/ApPaymentModel";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import { StatusBadge } from "../../_base/component/Core/StatusBadge";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";

export default function DetailApPaymentTerm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<ApPaymentTerm | null>(null);
  const [lines, setLines] = useState<ApPaymentTermLine[]>([]);
  const [discounts, setDiscounts] = useState<ApPaymentTermDiscount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const res = await apPaymentTermService.getById(Number(id));
        if (res.success && res.data) {
          setData(res.data);

          // Lấy dòng chi tiết điều khoản
          const lineRes = await apPaymentTermLineService.getList({ paymentTermId: Number(id), take: 100 });
          if (lineRes.success && lineRes.data) {
            setLines(lineRes.data.items);
          }

          // Lấy chiết khấu điều khoản
          const discRes = await apPaymentTermDiscountService.getList({ paymentTermId: Number(id), take: 100 });
          if (discRes.success && discRes.data) {
            setDiscounts(discRes.data.items);
          }
        } else {
          NotificationExtension.Fails(res.message || "Không tìm thấy điều khoản thanh toán.");
          navigate("/ApPaymentTerm/ApPaymentTermList");
        }
      } catch {
        NotificationExtension.Fails("Lỗi khi tải thông tin điều khoản.");
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
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/ApPaymentTerm/ApPaymentTermList")}>
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="xl" mb="lg">
        <Group justify="space-between" align="center" mb="xs">
          <Title order={3}>Điều khoản: {data.termName}</Title>
          <Group>
            <Button
              leftSection={<IconEdit size={16} />}
              color="yellow"
              variant="light"
              onClick={() => navigate(`/ApPaymentTerm/Edit/${data.paymentTermId}`)}
            >
              Chỉnh sửa
            </Button>
            <Button
              leftSection={<IconTrash size={16} />}
              color="red"
              variant="light"
              onClick={() => navigate(`/ApPaymentTerm/Delete/${data.paymentTermId}`)}
            >
              Xóa điều khoản
            </Button>
          </Group>
        </Group>
        <Divider mb="xl" />

        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Mã điều khoản (ID)</Text>
            <Text fw={600} size="md">{data.paymentTermId}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Tên điều khoản thanh toán</Text>
            <Text fw={600} size="md">{data.termName}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Số ngày chốt thanh toán (Cutoff Day)</Text>
            <Text fw={600} size="md">{data.cutoffDay || "0"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Độ ưu tiên (Rank No.)</Text>
            <Text fw={600} size="md">{data.rankNo || "-"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Có hiệu lực từ ngày</Text>
            <Text fw={600} size="md">{data.effectiveFrom || "-"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Có hiệu lực đến ngày</Text>
            <Text fw={600} size="md">{data.effectiveTo || "-"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">Trạng thái hoạt động</Text>
            <Box mt="xs">
              <StatusBadge statusType="masterdata" value={data.status === "ACTIVE"} />
            </Box>
          </Grid.Col>

          <Grid.Col span={12}>
            <Text size="sm" c="dimmed">Mô tả chi tiết</Text>
            <Text fw={600} size="md">{data.description || "-"}</Text>
          </Grid.Col>
        </Grid>
      </Card>

      {/* Dòng điều khoản */}
      <Card withBorder shadow="sm" radius="md" padding="xl" mb="lg">
        <Title order={4} mb="md">Dòng chi tiết tỷ lệ thanh toán ({lines.length})</Title>
        <Divider mb="md" />

        <Table striped highlightOnHover withTableBorder withColumnBorders style={{ fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f8f9fa" }}>
              <th style={{ width: 100, padding: 8 }}>Mã dòng</th>
              <th style={{ width: 100, padding: 8 }}>Số dòng</th>
              <th style={{ padding: 8, textAlign: "right" }}>Tỷ lệ nợ đến hạn (%)</th>
              <th style={{ padding: 8, textAlign: "right" }}>Số tiền đến hạn cụ thể</th>
              <th style={{ width: 150, padding: 8 }}>Số ngày quá hạn</th>
            </tr>
          </thead>
          <tbody>
            {lines.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: 12, color: "#868e96" }}>Chưa cấu hình tỷ lệ thanh toán chi tiết.</td>
              </tr>
            ) : (
              lines.map((l) => (
                <tr key={l.termLineId}>
                  <td style={{ padding: 8 }}>{l.termLineId}</td>
                  <td style={{ padding: 8 }}>{l.lineNum}</td>
                  <td style={{ padding: 8, textAlign: "right", fontWeight: 600 }}>{l.duePercent || 0}%</td>
                  <td style={{ padding: 8, textAlign: "right" }}>{l.dueAmount ? `${l.dueAmount.toLocaleString()}đ` : "-"}</td>
                  <td style={{ padding: 8 }}>{l.days || 0} ngày</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card>

      {/* Chiết khấu điều khoản */}
      <Card withBorder shadow="sm" radius="md" padding="xl">
        <Title order={4} mb="md">Cấu hình chiết khấu thanh toán sớm ({discounts.length})</Title>
        <Divider mb="md" />

        <Table striped highlightOnHover withTableBorder withColumnBorders style={{ fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f8f9fa" }}>
              <th style={{ width: 100, padding: 8 }}>Mã chiết khấu</th>
              <th style={{ width: 150, padding: 8 }}>Bậc chiết khấu (Level)</th>
              <th style={{ padding: 8, textAlign: "right" }}>Tỷ lệ chiết khấu (%)</th>
              <th style={{ padding: 8 }}>Số ngày thanh toán sớm được hưởng</th>
            </tr>
          </thead>
          <tbody>
            {discounts.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", padding: 12, color: "#868e96" }}>Không có chiết khấu thanh toán sớm cho điều khoản này.</td>
              </tr>
            ) : (
              discounts.map((d) => (
                <tr key={d.discountId}>
                  <td style={{ padding: 8 }}>{d.discountId}</td>
                  <td style={{ padding: 8 }}>Cấp {d.discountLevel}</td>
                  <td style={{ padding: 8, textAlign: "right", fontWeight: 600, color: "#2b8a3e" }}>{d.discountPercent || 0}%</td>
                  <td style={{ padding: 8 }}>Trong vòng {d.days || 0} ngày</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card>
    </Box>
  );
}

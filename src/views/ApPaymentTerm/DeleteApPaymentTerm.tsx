import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Card, Title, Text, Button, List, Alert, Group, Stack, Center, Loader } from "@mantine/core";
import { IconAlertTriangle, IconArrowLeft, IconTrash } from "@tabler/icons-react";
import { apPaymentTermService, apPaymentTermLineService, apPaymentTermDiscountService } from "../../api/apVendor/apPaymentMockService";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";
import { ApPaymentTerm, ApPaymentTermLine, ApPaymentTermDiscount } from "../../model/ApPaymentModel";

export default function DeleteApPaymentTerm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [term, setTerm] = useState<ApPaymentTerm | null>(null);
  const [loading, setLoading] = useState(true);
  const [blockingLines, setBlockingLines] = useState<ApPaymentTermLine[]>([]);
  const [blockingDiscounts, setBlockingDiscounts] = useState<ApPaymentTermDiscount[]>([]);

  useEffect(() => {
    const checkDelete = async () => {
      if (!id) return;
      try {
        const termRes = await apPaymentTermService.getById(Number(id));
        if (termRes.success && termRes.data) {
          setTerm(termRes.data);

          // Kiểm tra dòng phụ thuộc
          const lineRes = await apPaymentTermLineService.getList({ paymentTermId: Number(id), take: 100 });
          if (lineRes.success && lineRes.data) {
            setBlockingLines(lineRes.data.items);
          }

          // Kiểm tra chiết khấu phụ thuộc
          const discRes = await apPaymentTermDiscountService.getList({ paymentTermId: Number(id), take: 100 });
          if (discRes.success && discRes.data) {
            setBlockingDiscounts(discRes.data.items);
          }
        } else {
          NotificationExtension.Fails(termRes.message || "Không tìm thấy điều khoản thanh toán.");
          navigate("/ApPaymentTerm/ApPaymentTermList");
        }
      } catch {
        NotificationExtension.Fails("Lỗi kiểm tra điều kiện xóa điều khoản.");
      } finally {
        setLoading(false);
      }
    };

    checkDelete();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!id) return;
    try {
      const res = await apPaymentTermService.delete(Number(id));
      if (res.success) {
        NotificationExtension.Success("Xóa điều khoản thanh toán thành công!");
        navigate("/ApPaymentTerm/ApPaymentTermList");
      } else {
        NotificationExtension.Fails(res.message || "Lỗi khi xóa.");
      }
    } catch {
      NotificationExtension.Fails("Lỗi khi kết nối Mock API.");
    }
  };

  if (loading) {
    return (
      <Center style={{ height: "300px" }}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (!term) return null;

  const canDelete = blockingLines.length === 0 && blockingDiscounts.length === 0;

  return (
    <Box>
      <Group justify="space-between" align="center" mb="lg">
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/ApPaymentTerm/ApPaymentTermList")}>
          Quay lại danh sách
        </Button>
        <BreadCrumb />
      </Group>

      <Card withBorder shadow="sm" radius="md" padding="lg">
        <Group mb="md">
          <IconAlertTriangle size={28} color={canDelete ? "orange" : "red"} />
          <Title order={3} c={canDelete ? "orange" : "red"}>
            {canDelete ? "Xác nhận xóa Điều khoản Thanh toán" : "Không thể xóa Điều khoản này"}
          </Title>
        </Group>

        <Text mb="md">
          Mã số: <b>{term.paymentTermId}</b> | Tên điều khoản: <b>{term.termName}</b>
        </Text>

        {!canDelete ? (
          <Stack gap="md">
            {blockingLines.length > 0 && (
              <Alert color="red" icon={<IconAlertTriangle size={16} />} title="Có dòng chi tiết phụ thuộc:">
                <Text size="sm" mb="xs">
                  Không thể xóa điều khoản này khi vẫn tồn tại các Dòng chi tiết tỷ lệ thanh toán.
                </Text>
                <List size="sm" withPadding>
                  {blockingLines.map((l) => (
                    <List.Item key={l.termLineId}>
                      Dòng số: <b>{l.lineNum}</b> | Tỷ lệ nợ: {l.duePercent}% | Số ngày nợ: {l.days} ngày
                    </List.Item>
                  ))}
                </List>
              </Alert>
            )}

            {blockingDiscounts.length > 0 && (
              <Alert color="red" icon={<IconAlertTriangle size={16} />} title="Có cấu hình chiết khấu phụ thuộc:">
                <Text size="sm" mb="xs">
                  Không thể xóa điều khoản này khi vẫn tồn tại cấu hình Chiết khấu thanh toán sớm.
                </Text>
                <List size="sm" withPadding>
                  {blockingDiscounts.map((d) => (
                    <List.Item key={d.discountId}>
                      Chiết khấu cấp: <b>{d.discountLevel}</b> | Tỷ lệ chiết khấu: {d.discountPercent}%
                    </List.Item>
                  ))}
                </List>
              </Alert>
            )}

            <Alert color="blue" title="Hướng dẫn xử lý:">
              <Text size="sm">
                Vui lòng xóa các Dòng chi tiết và Chiết khấu thanh toán sớm liên quan trước khi thực hiện xóa Điều khoản này.
              </Text>
            </Alert>
          </Stack>
        ) : (
          <Box>
            <Text size="sm" mb="lg">
              Điều khoản thanh toán này hiện không có dữ liệu chi tiết phụ thuộc. Bạn có chắc chắn muốn xóa vĩnh viễn? Hành động này không thể hoàn tác.
            </Text>
            <Group>
              <Button color="red" leftSection={<IconTrash size={16} />} onClick={handleDelete}>
                Xác nhận xóa vĩnh viễn
              </Button>
              <Button variant="outline" color="gray" onClick={() => navigate("/ApPaymentTerm/ApPaymentTermList")}>
                Hủy bỏ
              </Button>
            </Group>
          </Box>
        )}
      </Card>
    </Box>
  );
}

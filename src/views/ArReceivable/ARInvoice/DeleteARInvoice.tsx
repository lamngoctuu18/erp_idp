import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Card, Title, Text, Button, List, Alert, Group, Stack } from "@mantine/core";
import { IconAlertTriangle, IconArrowLeft, IconTrash, IconRotate } from "@tabler/icons-react";
import { arBillingService } from "../services/arBillingService";
import { ARMockStorage } from "../mock/arMockStorage";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import { formatNumber } from "../../../common/FormatDate/FormatDate";

export default function DeleteARInvoice() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [header, setHeader] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [blockingReasons, setBlockingReasons] = useState<string[]>([]);

  useEffect(() => {
    const checkDelete = async () => {
      const res = await arBillingService.getById(Number(id));
      if (res.success && res.data) {
        const { header } = res.data;
        setHeader(header);

        const reasons: string[] = [];
        
        // 1. Status complete
        if (header.status === "COMPLETE" || header.status === "PAID" || header.status === "PARTIALLY_PAID") {
          reasons.push(`Trạng thái hóa đơn là "${header.status}". Chỉ có thể xóa hóa đơn ở trạng thái bản nháp (DRAFT).`);
        }

        // 2. Active payment schedule
        const schedules = ARMockStorage.getPaymentSchedules().filter(x => x.invoiceId === header.invoiceId);
        const hasActiveSchedule = schedules.some(s => (s.amountApplied ?? 0) > 0 || (s.amountCredited ?? 0) > 0 || (s.amountAdjusted ?? 0) > 0);
        if (hasActiveSchedule) {
          reasons.push("Đã có lịch thanh toán phát sinh số tiền thực tế (đã thu, đã giảm trừ hoặc điều chỉnh).");
        }

        // 3. Receipt Applications
        const apps = ARMockStorage.getReceivableApplications().filter(x => x.appliedInvoiceId === header.invoiceId && x.status !== "REVERSED");
        if (apps.length > 0) {
          reasons.push(`Đã có ${apps.length} phiếu thu được áp dụng thanh toán cho hóa đơn này.`);
        }

        // 4. Credit Memo
        const cmApps = ARMockStorage.getReceivableApplications().filter(x => x.appliedInvoiceId === header.invoiceId); // CM apps
        if (cmApps.length > 0 && header.transactionTypeId === 2) {
          reasons.push("Hóa đơn Credit Memo đã được áp dụng giảm trừ công nợ.");
        }

        // 5. Adjustments
        const adjs = ARMockStorage.getAdjustments().filter(x => x.invoiceId === header.invoiceId);
        if (adjs.length > 0) {
          reasons.push(`Đã có ${adjs.length} giao dịch điều chỉnh nợ liên đới.`);
        }

        // 6. Accounting
        if (header.accountingStatus === "FINAL") {
          reasons.push("Hóa đơn đã hạch toán chính thức (Final Accounting) sang Kế toán.");
        }

        // 7. GL Transfer
        if (header.transferToGlStatus === "TRANSFERRED") {
          reasons.push("Hóa đơn đã chuyển sổ định khoản sang Sổ cái (GL).");
        }

        setBlockingReasons(reasons);
      }
      setLoading(false);
    };

    checkDelete();
  }, [id]);

  const handleDelete = async () => {
    const res = await arBillingService.delete(Number(id));
    if (res.success) {
      NotificationExtension.Success("Xóa hóa đơn thành công!");
      navigate("/cong-no-phai-thu/hoa-don");
    } else {
      NotificationExtension.Fails(res.message);
    }
  };

  if (loading) return <Text>Đang kiểm tra điều kiện xóa...</Text>;
  if (!header) return <Text>Không tìm thấy hóa đơn</Text>;

  const canDelete = blockingReasons.length === 0;

  return (
    <Box>
      <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/cong-no-phai-thu/hoa-don")} mb="lg">
        Quay lại danh sách
      </Button>

      <Card withBorder shadow="sm" radius="sm" padding="lg">
        <Group mb="md">
          <IconAlertTriangle size={28} color={canDelete ? "orange" : "red"} />
          <Title order={3} c={canDelete ? "orange" : "red"}>
            {canDelete ? "Xác nhận xóa hóa đơn" : "Không thể xóa hóa đơn này"}
          </Title>
        </Group>

        <Text mb="md">
          Số hóa đơn: <b>{header.invoiceNumber}</b> | Tổng tiền: <b>{formatNumber(header.totalAmount)} VND</b>
        </Text>

        {!canDelete ? (
          <Stack gap="md">
            <Alert color="red" icon={<IconAlertTriangle size={16} />} title="Nguyên nhân chặn xóa:">
              <List size="sm" withPadding>
                {blockingReasons.map((r, i) => (
                  <List.Item key={i}>{r}</List.Item>
                ))}
              </List>
            </Alert>

            <Alert color="blue" title="Đề xuất xử lý:">
              <Text size="sm">
                Theo quy chuẩn nghiệp vụ tài chính ERP, bạn không thể xóa hóa đơn đã phát sinh chứng từ liên quan hoặc hạch toán sổ sách.
              </Text>
              <Text size="sm" mt="xs" fw={700}>
                Lựa chọn thay thế:
              </Text>
              <List size="sm" withPadding mt="xs">
                <List.Item>Sử dụng chức năng <b>Vô hiệu hóa đơn (Void)</b> trong màn hình danh sách để hủy ghi nhận khoản phải thu.</List.Item>
                <List.Item>Tạo một chứng từ <b>Credit Memo</b> để giảm trừ/bù trừ khoản phải thu của hóa đơn này.</List.Item>
                <List.Item>Tạo một giao dịch <b>Điều chỉnh công nợ (Adjustment)</b> để xóa nợ khó đòi hoặc giảm công nợ.</List.Item>
              </List>
            </Alert>
          </Stack>
        ) : (
          <Box>
            <Text size="sm" mb="lg">
              Hóa đơn này hiện đang ở trạng thái nháp và chưa có chứng từ liên quan. Bạn có chắc chắn muốn xóa vĩnh viễn?
            </Text>
            <Group>
              <Button color="red" leftSection={<IconTrash size={16} />} onClick={handleDelete}>
                Xác nhận xóa vĩnh viễn
              </Button>
              <Button variant="outline" color="gray" onClick={() => navigate("/cong-no-phai-thu/hoa-don")}>
                Hủy bỏ
              </Button>
            </Group>
          </Box>
        )}
      </Card>
    </Box>
  );
}

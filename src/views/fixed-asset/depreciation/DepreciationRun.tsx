import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  Checkbox,
  Grid,
  Group,
  Select,
  TextInput,
  Title,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCalculator, IconHistory, IconArrowBackUp } from "@tabler/icons-react";
import { FaNotice, FaPageHeader, FaRequestTable } from "../_components/FaCommon";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import { FA_BOOKS, getRequests, submitRequest } from "../../../api/fixed-asset/api";
import { FaRequest } from "../../../model/FixedAssetModel";

const DepreciationRun = () => {
  const [requests, setRequests] = useState<FaRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      book: "IDP_CORP",
      period: "JUL-26",
      mode: "Preview",
      closePeriod: false,
    },
  });

  const loadRequests = async () => {
    try {
      const res = await getRequests();
      if (res?.success) {
        // filter for depreciation runs
        const filtered = (res.data || []).filter(
          (r) => r.program === "Run Depreciation" || r.program === "Rollback Depreciation"
        );
        setRequests(filtered);
      }
    } catch {
      NotificationExtension.Fails("Không thể tải lịch sử chạy khấu hao.");
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleRun = async () => {
    setLoading(true);
    try {
      const v = form.values;
      const prog = "Run Depreciation" + (v.closePeriod ? " & Close Period" : "");
      const res = await submitRequest({
        program: prog,
        book: v.book,
        period: v.period,
        mode: v.mode,
      });

      if (res?.success) {
        NotificationExtension.Success(
          `Đã gửi yêu cầu chạy khấu hao kỳ ${v.period} (${v.mode}). Vui lòng kiểm tra trạng thái Request.`
        );
        loadRequests();
      } else {
        NotificationExtension.Fails((res as any)?.message || "Yêu cầu thất bại.");
      }
    } catch {
      NotificationExtension.Fails("Lỗi kết nối hệ thống.");
    } finally {
      setLoading(false);
    }
  };

  const handleRollback = async () => {
    setLoading(true);
    try {
      const v = form.values;
      const res = await submitRequest({
        program: "Rollback Depreciation",
        book: v.book,
        period: v.period,
        mode: "Final",
      });

      if (res?.success) {
        NotificationExtension.Success(`Đã yêu cầu Rollback khấu hao kỳ ${v.period}. Số liệu đã được hoàn nguyên.`);
        loadRequests();
      } else {
        NotificationExtension.Fails((res as any)?.message || "Rollback thất bại.");
      }
    } catch {
      NotificationExtension.Fails("Lỗi kết nối hệ thống.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <FaPageHeader />

      <Title order={3} mb={8}>
        Chạy khấu hao định kỳ (Run Depreciation)
      </Title>

      <FaNotice type="warning">
        <b>Chú ý:</b> Chạy khấu hao kỳ mở (Depreciation Run) có thể thực hiện nhiều lần ở chế độ <b>Preview</b> để kiểm tra báo cáo chênh lệch. Nếu chọn <b>Close Period</b> ở chế độ <b>Final</b>, kỳ kế toán sẽ bị đóng vĩnh viễn và hệ thống tự động mở kỳ tiếp theo. Lúc này KHÔNG THỂ rollback số liệu.
      </FaNotice>

      <Grid mt="md">
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Card withBorder p="lg" radius="md">
            <Title order={5} mb="md">Tham số chạy khấu hao</Title>
            <Select
              label="Sổ tài sản (Book)"
              withAsterisk
              data={FA_BOOKS}
              {...form.getInputProps("book")}
              mb="sm"
            />

            <TextInput
              label="Kỳ tính khấu hao (Period)"
              placeholder="VD: JUL-26"
              withAsterisk
              {...form.getInputProps("period")}
              mb="sm"
            />

            <Select
              label="Chế độ chạy (Mode)"
              data={[
                { value: "Preview", label: "Preview (Chạy thử & đối chiếu)" },
                { value: "Final", label: "Final (Ghi nhận số liệu chính thức)" },
              ]}
              {...form.getInputProps("mode")}
              mb="sm"
            />

            <Checkbox
              label="Đóng kỳ kế toán sau khi hoàn thành (Close Period)"
              mt="md"
              {...form.getInputProps("closePeriod", { type: "checkbox" })}
            />

            <Group mt="xl" grow>
              <Button
                color="red"
                variant="outline"
                leftSection={<IconArrowBackUp size={16} />}
                onClick={handleRollback}
                loading={loading}
              >
                Rollback số liệu
              </Button>
              <Button
                color="blue"
                leftSection={<IconCalculator size={16} />}
                onClick={handleRun}
                loading={loading}
              >
                Chạy khấu hao
              </Button>
            </Group>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 7 }}>
          <FaRequestTable rows={requests} title="Khấu hao tài sản" />
        </Grid.Col>
      </Grid>
    </Box>
  );
};

export default DepreciationRun;

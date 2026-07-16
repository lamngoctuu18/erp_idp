import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  Grid,
  Group,
  Select,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconBookUpload } from "@tabler/icons-react";
import { FaNotice, FaPageHeader, FaRequestTable } from "../_components/FaCommon";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import { FA_BOOKS, getRequests, submitRequest } from "../../../api/fixed-asset/api";
import { FaRequest } from "../../../model/FixedAssetModel";

const CreateAccounting = () => {
  const [requests, setRequests] = useState<FaRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      book: "IDP_CORP",
      period: "JUL-26",
      mode: "Draft",
      report: "Detail",
    },
  });

  const loadRequests = async () => {
    try {
      const res = await getRequests();
      if (res?.success) {
        // filter for accounting runs
        const filtered = (res.data || []).filter(
          (r) => r.program === "Create Accounting" || r.program.startsWith("Create Accounting")
        );
        setRequests(filtered);
      }
    } catch {
      NotificationExtension.Fails("Không thể tải lịch sử hạch toán.");
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleRun = async () => {
    setLoading(true);
    try {
      const v = form.values;
      const res = await submitRequest({
        program: `Create Accounting - ${v.mode}`,
        book: v.book,
        period: v.period,
        mode: v.mode,
      });

      if (res?.success) {
        NotificationExtension.Success(
          `Đã gửi yêu cầu chạy hạch toán kỳ ${v.period} ở chế độ ${v.mode}. Vui lòng kiểm tra báo cáo SLA.`
        );
        loadRequests();
      } else {
        NotificationExtension.Fails((res as any)?.message || "Hạch toán thất bại.");
      }
    } catch {
      NotificationExtension.Fails("Lỗi xử lý hệ thống.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <FaPageHeader />

      <Title order={3} mb={8}>
        Tạo bút toán hạch toán lên GL (Create Accounting)
      </Title>

      <FaNotice type="info">
        <b>Định khoản phụ (SLA):</b> Giao dịch tài sản cố định (Ghi tăng, Điều chuyển, Khấu hao, Thanh lý) được tạo định khoản phụ trước khi chuyển lên Sổ cái (GL).<br />
        <b>Chế độ Draft:</b> Tạo bút toán nháp để đối chiếu số liệu báo cáo trước khi chốt.<br />
        <b>Chế độ Final Post:</b> Hạch toán chính thức và thực hiện Post thẳng bút toán lên GL Journal.
      </FaNotice>

      <Grid mt="md">
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Card withBorder p="lg" radius="md">
            <Title order={5} mb="md">Tham số hạch toán tài sản</Title>
            <Select
              label="Sổ tài sản (Book)"
              withAsterisk
              data={FA_BOOKS}
              {...form.getInputProps("book")}
              mb="sm"
            />

            <TextInput
              label="Kỳ hạch toán (Period)"
              placeholder="VD: JUL-26"
              withAsterisk
              {...form.getInputProps("period")}
              mb="sm"
            />

            <Select
              label="Chế độ định khoản (Mode)"
              data={[
                { value: "Draft", label: "Draft - Tạo bút toán nháp" },
                { value: "Final", label: "Final - Hạch toán chính thức" },
                { value: "Final Post", label: "Final Post - Hạch toán và Ghi sổ cái" },
              ]}
              {...form.getInputProps("mode")}
              mb="sm"
            />

            <Select
              label="Báo cáo chi tiết định khoản"
              data={[
                { value: "Detail", label: "Detail - Chi tiết từng tài sản" },
                { value: "Summary", label: "Summary - Tổng hợp theo tài khoản" },
                { value: "No Report", label: "No Report - Không xuất báo cáo" },
              ]}
              {...form.getInputProps("report")}
              mb="sm"
            />

            <Button
              fullWidth
              mt="xl"
              color="blue"
              leftSection={<IconBookUpload size={16} />}
              onClick={handleRun}
              loading={loading}
            >
              Tạo hạch toán GL
            </Button>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 7 }}>
          <FaRequestTable rows={requests} title="Tạo hạch toán" />
        </Grid.Col>
      </Grid>
    </Box>
  );
};

export default CreateAccounting;

import { useEffect, useState } from "react";
import {
  ActionIcon,
  Box,
  Button,
  Card,
  Grid,
  Group,
  NumberInput,
  Select,
  Table,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IconDeviceFloppy, IconArrowBackUp } from "@tabler/icons-react";
import { FaNotice, FaPageHeader, money } from "../_components/FaCommon";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import { StatusBadge } from "../../../_base/component/Core/StatusBadge";
import { FA_BOOKS, getRetirements, createRetirement, undoRetirement, getAssetByNumber } from "../../../api/fixed-asset/api";
import { FaRetirement } from "../../../model/FixedAssetModel";

const RetirementForm = () => {
  const [retirements, setRetirements] = useState<FaRetirement[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      assetNumber: "TS000184",
      book: "IDP_CORP",
      retireDate: new Date(),
      retirementType: "Sale" as "Sale" | "Extraordinary",
      unitsRetired: 1,
      costRetired: 200000000,
      proceedsOfSale: 120000000,
      costOfRemoval: 5000000,
      soldTo: "Cửa hàng Thanh lý Đồng Tâm",
      checkInvoice: "HDTL-260701",
    },
    validate: {
      assetNumber: (v: string) => (!v ? "Nhập mã tài sản" : null),
      costRetired: (v: number) => (v <= 0 ? "Cost retired phải > 0" : null),
    },
  });

  const loadRetirements = async () => {
    try {
      const res = await getRetirements();
      if (res?.success) {
        setRetirements(res.data || []);
      }
    } catch {
      NotificationExtension.Fails("Không thể tải danh sách thanh lý.");
    }
  };

  useEffect(() => {
    loadRetirements();
  }, []);

  const handleRetire = async () => {
    if (form.validate().hasErrors) return;
    setLoading(true);
    try {
      const v = form.values;
      // Get asset current cost to check
      const assetRes = await getAssetByNumber(v.assetNumber);
      if (assetRes?.success && assetRes.data) {
        if (v.costRetired > assetRes.data.currentCost) {
          NotificationExtension.Fails(`Số tiền thanh lý (${v.costRetired.toLocaleString()} ₫) không được vượt quá nguyên giá hiện tại (${assetRes.data.currentCost.toLocaleString()} ₫).`);
          setLoading(false);
          return;
        }
      }

      const res = await createRetirement({
        ...v,
        retireDate: v.retireDate.toISOString().slice(0, 10),
      });

      if (res?.success) {
        NotificationExtension.Success(`Đã ghi nhận yêu cầu thanh lý tài sản ${v.assetNumber}.`);
        form.reset();
        loadRetirements();
      } else {
        NotificationExtension.Fails((res as any)?.message || "Thanh lý thất bại.");
      }
    } catch {
      NotificationExtension.Fails("Lỗi xử lý hệ thống.");
    } finally {
      setLoading(false);
    }
  };

  const handleUndo = async (id: number) => {
    const res = await undoRetirement(id);
    if (res?.success) {
      NotificationExtension.Success("Đã hủy giao dịch thanh lý và phục hồi tài sản (Reinstate).");
      loadRetirements();
    } else {
      NotificationExtension.Fails((res as any)?.message || "Phục hồi thất bại.");
    }
  };

  const currentNbv = form.values.costRetired * 0.6; // Giả định GTCL chiếm 60% nguyên giá hạch toán thanh lý
  const estimatedGainLoss = form.values.proceedsOfSale - form.values.costOfRemoval - currentNbv;

  return (
    <Box>
      <FaPageHeader />

      <Title order={3} mb={8}>
        Thanh lý & Bán tài sản (Asset Retirement)
      </Title>

      <FaNotice type="info">
        <b>Quy tắc thanh lý:</b> Cho phép thanh lý toàn bộ (Full Retirement) hoặc một phần (Partial Retirement) về mặt giá trị/số lượng. Hệ thống tự động tính toán lãi/lỗ thanh lý (Gain/Loss) dựa trên: Thu thanh lý (Proceeds) − Chi phí dỡ bỏ (Removal) − Giá trị còn lại tương ứng (NBV retired).
      </FaNotice>

      <Grid mt="md">
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Card withBorder p="lg" radius="md">
            <Title order={5} mb="md">Ghi nhận thanh lý tài sản</Title>
            <form onSubmit={(e) => { e.preventDefault(); handleRetire(); }}>
              <Grid>
                <Grid.Col span={6}>
                  <TextInput label="Mã tài sản" withAsterisk {...form.getInputProps("assetNumber")} />
                </Grid.Col>
                <Grid.Col span={6}>
                  <Select label="Sổ tài sản" withAsterisk data={FA_BOOKS} {...form.getInputProps("book")} />
                </Grid.Col>
                <Grid.Col span={6}>
                  <DateInput label="Ngày thanh lý" withAsterisk valueFormat="DD/MM/YYYY" {...form.getInputProps("retireDate")} />
                </Grid.Col>
                <Grid.Col span={6}>
                  <Select label="Hình thức" data={["Sale", "Extraordinary"]} {...form.getInputProps("retirementType")} />
                </Grid.Col>
                <Grid.Col span={6}>
                  <NumberInput label="Units thanh lý" min={1} {...form.getInputProps("unitsRetired")} />
                </Grid.Col>
                <Grid.Col span={6}>
                  <NumberInput label="Nguyên giá thanh lý" withAsterisk thousandSeparator="." decimalSeparator="," {...form.getInputProps("costRetired")} />
                </Grid.Col>
                <Grid.Col span={6}>
                  <NumberInput label="Doanh thu bán thanh lý" thousandSeparator="." decimalSeparator="," {...form.getInputProps("proceedsOfSale")} />
                </Grid.Col>
                <Grid.Col span={6}>
                  <NumberInput label="Chi phí thu hồi/dỡ bỏ" thousandSeparator="." decimalSeparator="," {...form.getInputProps("costOfRemoval")} />
                </Grid.Col>

                <Grid.Col span={12}>
                  <TextInput label="Đối tác mua thanh lý" placeholder="Nhập tên đơn vị..." {...form.getInputProps("soldTo")} />
                </Grid.Col>
                <Grid.Col span={12}>
                  <TextInput label="Hóa đơn thanh lý" placeholder="Số hóa đơn VAT..." {...form.getInputProps("checkInvoice")} />
                </Grid.Col>

                <Grid.Col span={12} mt="xs">
                  <Card p="xs" bg="#f8fafc" style={{ border: "1px dashed #cbd5e1" }}>
                    <Group justify="space-between">
                      <Text size="sm" fw={600}>Ước tính lãi/lỗ thanh lý (Gain/Loss):</Text>
                      <Text fw={700} color={estimatedGainLoss >= 0 ? "green" : "red"}>
                        {money(estimatedGainLoss)}
                      </Text>
                    </Group>
                    <Text size="xs" c="dimmed" mt={4}>
                      * Tính toán dựa trên doanh thu trừ chi phí trừ ước lượng giá trị còn lại ({money(currentNbv)}).
                    </Text>
                  </Card>
                </Grid.Col>
              </Grid>

              <Button fullWidth mt="lg" color="blue" leftSection={<IconDeviceFloppy size={16} />} type="submit" loading={loading}>
                Xử lý thanh lý
              </Button>
            </form>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 7 }}>
          <Card withBorder p="md" radius="md">
            <Title order={5} mb="sm">Lịch sử thanh lý tài sản</Title>
            <Table striped highlightOnHover withTableBorder>
              <Table.Thead style={{ background: "#f8fafc" }}>
                <Table.Tr>
                  <Table.Th>Asset</Table.Th>
                  <Table.Th>Ngày</Table.Th>
                  <Table.Th>Giá trị TL</Table.Th>
                  <Table.Th>Lãi / Lỗ</Table.Th>
                  <Table.Th>Trạng thái</Table.Th>
                  <Table.Th style={{ width: 60 }} />
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {retirements.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={6} style={{ textAlign: "center", padding: 24 }}>
                      Chưa có lịch sử giao dịch thanh lý.
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  retirements.map((r) => (
                    <Table.Tr key={r.retirementId}>
                      <Table.Td style={{ fontWeight: 600 }}>{r.assetNumber}</Table.Td>
                      <Table.Td>{r.retireDate}</Table.Td>
                      <Table.Td>{money(r.costRetired)}</Table.Td>
                      <Table.Td style={{ color: r.gainLoss >= 0 ? "#16a34a" : "#dc2626", fontWeight: 700 }}>
                        {money(r.gainLoss)}
                      </Table.Td>
                      <Table.Td>
                        <StatusBadge statusType="document" value={r.status} />
                      </Table.Td>
                      <Table.Td>
                        {r.status === "Pending" && (
                          <Tooltip label="Hủy thanh lý (Phục hồi tài sản)">
                            <ActionIcon variant="light" color="orange" onClick={() => handleUndo(r.retirementId)}>
                              <IconArrowBackUp size={16} />
                            </ActionIcon>
                          </Tooltip>
                        )}
                      </Table.Td>
                    </Table.Tr>
                  ))
                )}
              </Table.Tbody>
            </Table>
          </Card>
        </Grid.Col>
      </Grid>
    </Box>
  );
};

export default RetirementForm;

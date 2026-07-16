import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  Grid,
  Group,
  NumberInput,
  Select,
  Table,
  Tabs,
  TextInput,
  Title,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconArrowLeft, IconDeviceFloppy, IconHistory, IconInfoCircle, IconLayersDifference, IconUsers } from "@tabler/icons-react";
import { FaNotice, FaPageHeader, money } from "../_components/FaCommon";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import { getAssetByNumber, updateAsset, getAssignments, getTransactions } from "../../../api/fixed-asset/api";
import { FaAsset, FaAssignment, FaTransaction } from "../../../model/FixedAssetModel";

const AssetDetail = () => {
  const { assetNumber } = useParams<{ assetNumber: string }>();
  const navigate = useNavigate();
  const [asset, setAsset] = useState<FaAsset | null>(null);
  const [assignments, setAssignments] = useState<FaAssignment[]>([]);
  const [transactions, setTransactions] = useState<FaTransaction[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      description: "",
      tagNumber: "",
      serialNumber: "",
      manufacturer: "",
      model: "",
      assetType: "CAPITALIZED",
      ownership: "Owned",
      bought: "New",
      currentCost: 0,
      salvageValue: 0,
      netBookValue: 0,
      ytdDepreciation: 0,
      accumulatedDepreciation: 0,
      depreciate: "Yes",
      method: "STL",
      lifeYears: 5,
      lifeMonths: 0,
      dateInService: "",
      prorateConvention: "",
    },
  });

  const loadData = async () => {
    if (!assetNumber) return;
    setLoading(true);
    try {
      const res = await getAssetByNumber(assetNumber);
      if (res?.success && res.data) {
        const a = res.data;
        setAsset(a);
        form.setValues({
          description: a.description || "",
          tagNumber: a.tagNumber || "",
          serialNumber: a.serialNumber || "",
          manufacturer: a.manufacturer || "",
          model: a.model || "",
          assetType: a.assetType,
          ownership: a.ownership,
          bought: a.bought,
          currentCost: a.currentCost,
          salvageValue: a.salvageValue,
          netBookValue: a.netBookValue,
          ytdDepreciation: a.ytdDepreciation,
          accumulatedDepreciation: a.accumulatedDepreciation,
          depreciate: a.depreciate ? "Yes" : "No",
          method: a.method,
          lifeYears: a.lifeYears,
          lifeMonths: a.lifeMonths,
          dateInService: a.dateInService,
          prorateConvention: a.prorateConvention,
        });

        // Load assignments & transactions
        const assignRes = await getAssignments(assetNumber);
        if (assignRes?.success) setAssignments(assignRes.data || []);

        const txRes = await getTransactions(assetNumber);
        if (txRes?.success) setTransactions(txRes.data || []);
      } else {
        NotificationExtension.Fails("Không tìm thấy tài sản.");
      }
    } catch {
      NotificationExtension.Fails("Lỗi khi tải thông tin chi tiết tài sản.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [assetNumber]);

  const handleSave = async () => {
    if (!assetNumber || !asset) return;
    const v = form.values;
    const res = await updateAsset(assetNumber, {
      description: v.description,
      tagNumber: v.tagNumber,
      serialNumber: v.serialNumber,
      manufacturer: v.manufacturer,
      model: v.model,
      ownership: v.ownership as "Owned" | "Leased",
      bought: v.bought as "New" | "Used",
    });

    if (res?.success) {
      NotificationExtension.Success("Cập nhật thông tin nhận diện tài sản thành công.");
      loadData();
    } else {
      NotificationExtension.Fails(res?.message || "Cập nhật thất bại.");
    }
  };

  const isLocked = asset?.accounted || asset?.depreciated;

  return (
    <Box>
      <FaPageHeader
        actions={
          <>
            <Button variant="outline" color="gray" leftSection={<IconArrowLeft size={14} />} onClick={() => navigate("/fixed-asset/asset/list")}>
              Danh sách
            </Button>
            <Button color="blue" leftSection={<IconDeviceFloppy size={14} />} onClick={handleSave}>
              Lưu thay đổi
            </Button>
          </>
        }
      />

      <Title order={3} mb={8}>
        Chi tiết tài sản: {assetNumber} - {asset?.description}
      </Title>

      {isLocked && (
        <FaNotice type="info">
          Tài sản này đã được hạch toán hoặc chạy khấu hao trong kỳ. Một số trường tài chính chỉ xem, không thể sửa đổi trực tiếp mà cần điều chỉnh qua nghiệp vụ điều chỉnh.
        </FaNotice>
      )}

      <Tabs defaultValue="general" variant="outline" mt="md">
        <Tabs.List>
          <Tabs.Tab value="general" leftSection={<IconInfoCircle size={14} />}>Thông tin nhận diện</Tabs.Tab>
          <Tabs.Tab value="book" leftSection={<IconLayersDifference size={14} />}>Tài chính & Khấu hao</Tabs.Tab>
          <Tabs.Tab value="assignments" leftSection={<IconUsers size={14} />}>Phân bổ sử dụng ({assignments.length})</Tabs.Tab>
          <Tabs.Tab value="transactions" leftSection={<IconHistory size={14} />}>Lịch sử giao dịch ({transactions.length})</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="general" pt="md">
          <Card withBorder p="lg" radius="md">
            <Title order={5} mb="md">Chi tiết hồ sơ lý lịch</Title>
            <Grid>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput label="Tên tài sản (Description)" withAsterisk {...form.getInputProps("description")} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput label="Số thẻ TS (Tag Number)" {...form.getInputProps("tagNumber")} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput label="Số Serial" {...form.getInputProps("serialNumber")} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput label="Nhà sản xuất" {...form.getInputProps("manufacturer")} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput label="Model / Kiểu dáng" {...form.getInputProps("model")} />
              </Grid.Col>
              <Grid.Col span={{ base: 6, md: 3 }}>
                <Select label="Sở hữu" data={["Owned", "Leased"]} {...form.getInputProps("ownership")} />
              </Grid.Col>
              <Grid.Col span={{ base: 6, md: 3 }}>
                <Select label="Tình trạng mua" data={["New", "Used"]} {...form.getInputProps("bought")} />
              </Grid.Col>
              <Grid.Col span={{ base: 6, md: 3 }}>
                <TextInput label="Loại tài sản" readOnly value={form.values.assetType} styles={{ input: { background: "#f1f5f9" } }} />
              </Grid.Col>
              <Grid.Col span={{ base: 6, md: 3 }}>
                <TextInput label="Số lượng (Units)" readOnly value={String(asset?.units || 1)} styles={{ input: { background: "#f1f5f9" } }} />
              </Grid.Col>
            </Grid>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="book" pt="md">
          <Card withBorder p="lg" radius="md">
            <Title order={5} mb="md">Thông số tài chính và sổ (Corporate Book)</Title>
            <Grid>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <TextInput label="Corporate Book" readOnly value={asset?.book} styles={{ input: { background: "#f1f5f9" } }} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <TextInput label="Category" readOnly value={asset?.category} styles={{ input: { background: "#f1f5f9" } }} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <TextInput label="Asset Key" readOnly value={asset?.assetKey || ""} styles={{ input: { background: "#f1f5f9" } }} />
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 4 }}>
                <TextInput label="Nguyên giá hiện tại (Cost)" readOnly value={money(form.values.currentCost)} styles={{ input: { background: "#f1f5f9" } }} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <TextInput label="Giá trị thanh lý ước tính" readOnly value={money(form.values.salvageValue)} styles={{ input: { background: "#f1f5f9" } }} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <TextInput label="Giá trị khấu hao lũy kế" readOnly value={money(form.values.accumulatedDepreciation)} styles={{ input: { background: "#f1f5f9" } }} />
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 4 }}>
                <TextInput label="Giá trị còn lại (NBV)" readOnly value={money(form.values.netBookValue)} styles={{ input: { background: "#f1f5f9", fontWeight: 700 } }} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <TextInput label="Khấu hao YTD (Năm nay)" readOnly value={money(form.values.ytdDepreciation)} styles={{ input: { background: "#f1f5f9" } }} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <TextInput label="Trạng thái tài sản" readOnly value={asset?.status} styles={{ input: { background: "#f1f5f9" } }} />
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 4 }}>
                <TextInput label="Có tính khấu hao?" readOnly value={form.values.depreciate} styles={{ input: { background: "#f1f5f9" } }} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <TextInput label="Phương pháp (Method)" readOnly value={form.values.method} styles={{ input: { background: "#f1f5f9" } }} />
              </Grid.Col>
              <Grid.Col span={{ base: 6, md: 2 }}>
                <NumberInput label="Số năm sd" readOnly value={form.values.lifeYears} styles={{ input: { background: "#f1f5f9" } }} />
              </Grid.Col>
              <Grid.Col span={{ base: 6, md: 2 }}>
                <NumberInput label="Số tháng sd" readOnly value={form.values.lifeMonths} styles={{ input: { background: "#f1f5f9" } }} />
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput label="Ngày đưa vào sử dụng" readOnly value={form.values.dateInService} styles={{ input: { background: "#f1f5f9" } }} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput label="Công ước tính khấu hao (Prorate)" readOnly value={form.values.prorateConvention} styles={{ input: { background: "#f1f5f9" } }} />
              </Grid.Col>
            </Grid>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="assignments" pt="md">
          <Card withBorder p="lg" radius="md">
            <Title order={5} mb="md">Thông tin phân bổ nhân viên & bộ phận sử dụng</Title>
            <Table striped highlightOnHover withTableBorder>
              <Table.Thead style={{ background: "#f8fafc" }}>
                <Table.Tr>
                  <Table.Th style={{ width: 120 }}>Số lượng (Units)</Table.Th>
                  <Table.Th style={{ width: 150 }}>Mã nhân viên</Table.Th>
                  <Table.Th>Họ và tên</Table.Th>
                  <Table.Th>Đơn vị (Location flexfield)</Table.Th>
                  <Table.Th>Tài khoản chi phí khấu hao</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {assignments.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={5} style={{ textAlign: "center", padding: 20 }}>
                      Chưa được phân bổ sử dụng.
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  assignments.map((item) => (
                    <Table.Tr key={item.assignmentId}>
                      <Table.Td fw={600}>{item.units}</Table.Td>
                      <Table.Td>{item.employeeNumber}</Table.Td>
                      <Table.Td>{item.employeeName}</Table.Td>
                      <Table.Td>{item.location}</Table.Td>
                      <Table.Td style={{ fontFamily: "monospace" }}>{item.expenseAccount}</Table.Td>
                    </Table.Tr>
                  ))
                )}
              </Table.Tbody>
            </Table>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="transactions" pt="md">
          <Card withBorder p="lg" radius="md">
            <Title order={5} mb="md">Nhật ký giao dịch tài sản</Title>
            <Table striped highlightOnHover withTableBorder>
              <Table.Thead style={{ background: "#f8fafc" }}>
                <Table.Tr>
                  <Table.Th style={{ width: 100 }}>Txn ID</Table.Th>
                  <Table.Th style={{ width: 160 }}>Loại giao dịch</Table.Th>
                  <Table.Th style={{ width: 120 }}>Kỳ hiệu lực</Table.Th>
                  <Table.Th style={{ width: 120 }}>Kỳ nhập liệu</Table.Th>
                  <Table.Th style={{ width: 120 }}>Sổ sách</Table.Th>
                  <Table.Th style={{ textAlign: "right" }}>Giá trị giao dịch</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {transactions.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={6} style={{ textAlign: "center", padding: 20 }}>
                      Chưa phát sinh giao dịch nào.
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  transactions.map((t) => (
                    <Table.Tr key={t.transactionId}>
                      <Table.Td style={{ fontWeight: 600, color: "#4b5563" }}>{t.transactionId}</Table.Td>
                      <Table.Td style={{ fontWeight: 600, color: t.transactionType === "ADDITION" ? "#16a34a" : "#2563eb" }}>{t.transactionType}</Table.Td>
                      <Table.Td>{t.periodEffective}</Table.Td>
                      <Table.Td>{t.periodEntered}</Table.Td>
                      <Table.Td>{t.book}</Table.Td>
                      <Table.Td style={{ textAlign: "right" }}>
                        {t.amount !== undefined ? money(t.amount) : "—"}
                      </Table.Td>
                    </Table.Tr>
                  ))
                )}
              </Table.Tbody>
            </Table>
          </Card>
        </Tabs.Panel>
      </Tabs>
    </Box>
  );
};

export default AssetDetail;

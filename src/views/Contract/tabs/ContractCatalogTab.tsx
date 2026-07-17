import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Checkbox,
  Grid,
  Group,
  NumberInput,
  Paper,
  Progress,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { modals } from "@mantine/modals";
import {
  CatalogItem,
  CatalogItemStatus,
  Contract,
} from "../../../model/ContractModel";
import { contractService } from "../../../api/contract/contractMockService";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import { formatMoney } from "../components/contractShared";

interface Props {
  contract: Contract;
  onChanged: () => void;
}

const emptyDraft = {
  productCode: "",
  productName: "",
  category: "",
  unitPrice: 0,
  unit: "",
  status: "pending" as CatalogItemStatus,
  effectiveFrom: "",
  effectiveTo: "",
};

const ContractCatalogTab = ({ contract, onChanged }: Props) => {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [draft, setDraft] = useState({ ...emptyDraft });
  const [closeReason, setCloseReason] = useState("");
  const [checks, setChecks] = useState({ debt: false, archive: false, notify: false });
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setItems(await contractService.getCatalogItems(contract.contractId));
  }, [contract.contractId]);

  useEffect(() => {
    load();
  }, [load]);

  const pendingCount = items.filter((i) => i.status === "pending").length;
  const activeCount = items.filter((i) => i.status === "approved").length;
  const published = contract.catalogStatus === "published";
  const closed = contract.status === "closed";

  const usedValue = useMemo(() => items.reduce((s, i) => s + i.unitPrice, 0), [items]);
  const usageRate = contract.value > 0 ? Math.round((usedValue / contract.value) * 100) : 0;

  const handleAddItem = async () => {
    if (!draft.productCode.trim() || !draft.productName.trim()) {
      NotificationExtension.Fails("Nhập mã và tên sản phẩm.");
      return;
    }
    await contractService.addCatalogItem({
      contractId: contract.contractId,
      productCode: draft.productCode.trim(),
      productName: draft.productName.trim(),
      category: draft.category,
      unitPrice: draft.unitPrice,
      unit: draft.unit,
      status: draft.status,
      effectiveFrom: draft.effectiveFrom || null,
      effectiveTo: draft.effectiveTo || null,
    });
    setDraft({ ...emptyDraft });
    await load();
  };

  const handleRemove = async (id: number) => {
    await contractService.removeCatalogItem(id);
    await load();
  };

  const handlePublish = async () => {
    if (pendingCount > 0) {
      NotificationExtension.Fails("Còn sản phẩm ở trạng thái chờ duyệt, không thể xuất bản.");
      return;
    }
    setBusy(true);
    try {
      await contractService.publishCatalog(contract.contractId);
      await load();
      onChanged();
      NotificationExtension.Success("Đã xuất bản catalog.");
    } finally {
      setBusy(false);
    }
  };

  const handleClose = () => {
    if (!checks.debt || !checks.archive || !checks.notify) {
      NotificationExtension.Fails("Cần hoàn tất đủ 3 mục kiểm tra trước khi đóng.");
      return;
    }
    modals.openConfirmModal({
      title: <Title order={5}>Đóng hợp đồng</Title>,
      children: <Text size="sm">Xác nhận đóng hợp đồng {contract.contractCode}?</Text>,
      labels: { confirm: "Đóng hợp đồng", cancel: "Hủy" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        await contractService.changeStatus(
          contract.contractId,
          "closed",
          "close_contract",
          closeReason || "Đóng hợp đồng."
        );
        NotificationExtension.Success("Đã đóng hợp đồng.");
        onChanged();
      },
    });
  };

  return (
    <Stack gap="md">
      {/* Thông tin catalog */}
      <Card withBorder>
        <Title order={5} mb="sm">
          Thông tin Catalog
        </Title>
        <Grid>
          <ReadCol label="Tên Catalog" value={contract.catalogName || contract.name} />
          <ReadCol label="Phạm vi áp dụng" value={contract.catalogScope || contract.supplierName} />
          <ReadCol label="Loại Catalog" value={contract.catalogType || contract.contractType || "-"} />
        </Grid>
      </Card>

      {/* Sản phẩm / dịch vụ liên kết */}
      <Card withBorder>
        <Title order={5} mb="sm">
          Sản phẩm / Dịch vụ được liên kết
        </Title>
        {!closed && (
          <Grid align="flex-end" mb="sm">
            <Grid.Col span={{ base: 6, md: 2 }}>
              <TextInput
                placeholder="Mã sản phẩm"
                value={draft.productCode}
                onChange={(e) => setDraft({ ...draft, productCode: e.currentTarget.value })}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 6, md: 3 }}>
              <TextInput
                placeholder="Tên sản phẩm/dịch vụ"
                value={draft.productName}
                onChange={(e) => setDraft({ ...draft, productName: e.currentTarget.value })}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 6, md: 2 }}>
              <TextInput
                placeholder="Danh mục"
                value={draft.category}
                onChange={(e) => setDraft({ ...draft, category: e.currentTarget.value })}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 6, md: 2 }}>
              <NumberInput
                placeholder="Đơn giá"
                thousandSeparator="."
                decimalSeparator=","
                min={0}
                value={draft.unitPrice}
                onChange={(v) => setDraft({ ...draft, unitPrice: Number(v) || 0 })}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 6, md: 1 }}>
              <TextInput
                placeholder="ĐV"
                value={draft.unit}
                onChange={(e) => setDraft({ ...draft, unit: e.currentTarget.value })}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 6, md: 2 }}>
              <Select
                data={[
                  { value: "pending", label: "Chờ duyệt" },
                  { value: "approved", label: "Đã duyệt" },
                  { value: "inactive", label: "Ngừng dùng" },
                ]}
                value={draft.status}
                onChange={(v) => v && setDraft({ ...draft, status: v as CatalogItemStatus })}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 12 }}>
              <Button leftSection={<IconPlus size={16} />} onClick={handleAddItem}>
                Thêm sản phẩm
              </Button>
            </Grid.Col>
          </Grid>
        )}

        <Table.ScrollContainer minWidth={640}>
          <Table verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>MÃ SẢN PHẨM</Table.Th>
                <Table.Th>TÊN SẢN PHẨM/DỊCH VỤ</Table.Th>
                <Table.Th>DANH MỤC</Table.Th>
                <Table.Th>ĐƠN GIÁ</Table.Th>
                <Table.Th>ĐƠN VỊ</Table.Th>
                <Table.Th>TRẠNG THÁI</Table.Th>
                <Table.Th>HÀNH ĐỘNG</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {items.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={7}>
                    <Text size="sm" c="dimmed" ta="center">
                      Chưa có sản phẩm/dịch vụ nào trong catalog
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                items.map((it) => (
                  <Table.Tr key={it.itemId}>
                    <Table.Td>{it.productCode}</Table.Td>
                    <Table.Td>{it.productName}</Table.Td>
                    <Table.Td>{it.category || "-"}</Table.Td>
                    <Table.Td>{formatMoney(it.unitPrice, contract.currency)}</Table.Td>
                    <Table.Td>{it.unit || "-"}</Table.Td>
                    <Table.Td>
                      <Badge
                        variant="light"
                        color={it.status === "approved" ? "green" : it.status === "pending" ? "yellow" : "gray"}
                      >
                        {it.status === "approved" ? "Đã duyệt" : it.status === "pending" ? "Chờ duyệt" : "Ngừng dùng"}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      {!closed && (
                        <ActionIcon variant="light" color="red" onClick={() => handleRemove(it.itemId)}>
                          <IconTrash size={16} />
                        </ActionIcon>
                      )}
                    </Table.Td>
                  </Table.Tr>
                ))
              )}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Card>

      {/* Trạng thái & xuất bản catalog */}
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder h="100%">
            <Title order={5} mb="sm">
              Trạng thái Catalog
            </Title>
            <Stack gap="xs">
              <StatusLine
                label="Catalog đã tạo"
                sub={`${items.length} sản phẩm/dịch vụ được thêm`}
                value="Hoàn thành"
                color="green"
              />
              <StatusLine
                label="Đang chờ phê duyệt"
                sub={`${pendingCount} sản phẩm chờ duyệt`}
                value={pendingCount > 0 ? "Đang xử lý" : "Không có"}
                color={pendingCount > 0 ? "yellow" : "gray"}
              />
              <StatusLine
                label="Trạng thái xuất bản"
                sub={published ? "Đã xuất bản" : "Chưa xuất bản"}
                value={contract.catalogStatus}
                color={published ? "green" : "gray"}
              />
            </Stack>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder h="100%">
            <Title order={5} mb="sm">
              Xuất bản Catalog
            </Title>
            <Paper bg="var(--mantine-color-blue-0)" p="sm" radius="sm" mb="sm">
              <Text fw={600} size="sm">
                Sẵn sàng xuất bản
              </Text>
              <Text size="xs" c="dimmed">
                Catalog chỉ được xuất bản khi không còn sản phẩm ở trạng thái chờ duyệt.
              </Text>
            </Paper>
            <Button fullWidth loading={busy} disabled={published || closed} onClick={handlePublish}>
              {published ? "Catalog đã xuất bản" : "Xuất bản Catalog"}
            </Button>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Theo dõi sử dụng hợp đồng */}
      <Card withBorder>
        <Title order={5} mb="sm">
          Theo dõi sử dụng hợp đồng
        </Title>
        <Grid>
          <MetricCol value={formatMoney(usedValue, contract.currency)} label="Đã sử dụng" color="blue" />
          <MetricCol value={`${usageRate}%`} label="Tỷ lệ sử dụng" color="green" />
          <MetricCol value={String(items.length)} label="Sản phẩm/Dịch vụ" color="orange" />
          <MetricCol value={String(activeCount)} label="Đang hoạt động" color="grape" />
        </Grid>
        <Progress value={usageRate} mt="md" />
      </Card>

      {/* Đóng hợp đồng */}
      <Card withBorder>
        <Title order={5} mb="sm">
          Đóng hợp đồng
        </Title>
        {closed ? (
          <Badge color="red" variant="light" size="lg">
            Hợp đồng đã đóng
          </Badge>
        ) : (
          <Grid>
            <Grid.Col span={{ base: 12, md: 7 }}>
              <Paper bg="var(--mantine-color-red-0)" p="sm" radius="sm" mb="sm">
                <Text fw={600} size="sm">
                  Chuẩn bị đóng hợp đồng
                </Text>
                <Text size="xs" c="dimmed">
                  Kiểm tra toàn bộ giao dịch và nghĩa vụ liên quan trước khi đóng.
                </Text>
              </Paper>
              <Textarea
                label="Lý do đóng hợp đồng"
                placeholder="Nhập lý do đóng hợp đồng"
                minRows={3}
                autosize
                value={closeReason}
                onChange={(e) => setCloseReason(e.currentTarget.value)}
                mb="sm"
              />
              <Stack gap="xs">
                <Checkbox
                  label="Đã hoàn tất đối soát công nợ"
                  checked={checks.debt}
                  onChange={(e) => setChecks({ ...checks, debt: e.currentTarget.checked })}
                />
                <Checkbox
                  label="Đã lưu trữ hồ sơ hợp đồng"
                  checked={checks.archive}
                  onChange={(e) => setChecks({ ...checks, archive: e.currentTarget.checked })}
                />
                <Checkbox
                  label="Đã thông báo các bên liên quan"
                  checked={checks.notify}
                  onChange={(e) => setChecks({ ...checks, notify: e.currentTarget.checked })}
                />
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 5 }}>
              <Box>
                <Text size="sm" c="dimmed">
                  Trạng thái hợp đồng: {contract.status}
                </Text>
                <Group mt="md">
                  <Button color="red" onClick={handleClose}>
                    Đóng hợp đồng
                  </Button>
                </Group>
              </Box>
            </Grid.Col>
          </Grid>
        )}
      </Card>
    </Stack>
  );
};

const ReadCol = ({ label, value }: { label: string; value: string }) => (
  <Grid.Col span={{ base: 12, md: 4 }}>
    <TextInput label={label} value={value} readOnly variant="filled" />
  </Grid.Col>
);

const StatusLine = ({
  label,
  sub,
  value,
  color,
}: {
  label: string;
  sub: string;
  value: string;
  color: string;
}) => (
  <Paper withBorder p="sm" radius="sm">
    <Group justify="space-between">
      <div>
        <Text size="sm" fw={600}>
          {label}
        </Text>
        <Text size="xs" c="dimmed">
          {sub}
        </Text>
      </div>
      <Badge variant="light" color={color}>
        {value}
      </Badge>
    </Group>
  </Paper>
);

const MetricCol = ({ value, label, color }: { value: string; label: string; color: string }) => (
  <Grid.Col span={{ base: 6, md: 3 }}>
    <Text fw={700} size="xl" c={color}>
      {value}
    </Text>
    <Text size="xs" c="dimmed">
      {label}
    </Text>
  </Grid.Col>
);

export default ContractCatalogTab;

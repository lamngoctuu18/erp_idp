import { Badge, Box, Group, Input, Stack, Text, Title, UnstyledButton } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import {
  Contract,
  ContractStatus,
  CONTRACT_STATUS_COLOR,
  CONTRACT_STATUS_LABEL,
} from "../../../model/ContractModel";
import { formatDateVi, formatMoney } from "./contractShared";

interface Props {
  contracts: Contract[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

// Các chip lọc nhanh hiển thị trên đầu danh sách.
const FILTER_CHIPS: { label: string; value: ContractStatus | "all" }[] = [
  { label: "Tất cả", value: "all" },
  { label: "Nháp", value: "draft" },
  { label: "Chờ duyệt", value: "pending_approval" },
  { label: "Đang hoạt động", value: "active" },
];

const ContractListPanel = ({ contracts, selectedId, onSelect }: Props) => {
  const [keyword, setKeyword] = useState("");
  const [filter, setFilter] = useState<ContractStatus | "all">("all");

  const filtered = useMemo(() => {
    return contracts.filter((c) => {
      if (filter !== "all" && c.status !== filter) return false;
      if (keyword) {
        const q = keyword.toLowerCase();
        return (
          c.contractCode.toLowerCase().includes(q) ||
          c.name.toLowerCase().includes(q) ||
          c.supplierName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [contracts, keyword, filter]);

  return (
    <Stack gap="sm" p="md" h="100%" style={{ overflowY: "auto" }}>
      <div>
        <Title order={4}>Danh sách hợp đồng</Title>
        <Text size="sm" c="dimmed">
          {contracts.length} hợp đồng
        </Text>
      </div>

      <Input
        placeholder="Tìm kiếm hợp đồng"
        leftSection={<IconSearch size={16} />}
        value={keyword}
        onChange={(e) => setKeyword(e.currentTarget.value)}
      />

      <Group gap="xs">
        {FILTER_CHIPS.map((chip) => (
          <Badge
            key={chip.value}
            variant={filter === chip.value ? "filled" : "light"}
            color={filter === chip.value ? "blue" : "gray"}
            style={{ cursor: "pointer" }}
            onClick={() => setFilter(chip.value)}
          >
            {chip.label}
          </Badge>
        ))}
      </Group>

      <Stack gap="xs">
        {filtered.length === 0 && (
          <Text size="sm" c="dimmed" ta="center" mt="lg">
            Không có hợp đồng phù hợp
          </Text>
        )}
        {filtered.map((c) => {
          const active = c.contractId === selectedId;
          return (
            <UnstyledButton
              key={c.contractId}
              onClick={() => onSelect(c.contractId)}
              style={{
                border: `1px solid ${active ? "#4dabf7" : "#e9ecef"}`,
                background: active ? "#e7f5ff" : "#fff",
                borderRadius: 8,
                padding: "10px 12px",
              }}
            >
              <Group justify="space-between" wrap="nowrap" mb={4}>
                <Text fw={600} size="sm">
                  {c.contractCode}
                </Text>
                <Badge size="sm" variant="light" color={CONTRACT_STATUS_COLOR[c.status]}>
                  {CONTRACT_STATUS_LABEL[c.status]}
                </Badge>
              </Group>
              <Text size="sm">{c.supplierName}</Text>
              <Text size="xs" c="dimmed">
                {c.contractType}
              </Text>
              <Group justify="space-between" mt={4}>
                <Text size="xs" c="dimmed">
                  {formatDateVi(c.effectiveDate)}
                </Text>
                <Text size="xs" fw={600}>
                  {formatMoney(c.value, c.currency)}
                </Text>
              </Group>
            </UnstyledButton>
          );
        })}
      </Stack>
    </Stack>
  );
};

export default ContractListPanel;

import { Box, Grid, Group, Loader, Tabs, Text } from "@mantine/core";
import {
  IconCheck,
  IconFileText,
  IconMessages,
  IconPackage,
} from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import _breadcrumb from "../../_base/component/_layout/_breadcrumb";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import { Contract } from "../../model/ContractModel";
import { contractService } from "../../api/contract/contractMockService";
import ContractListPanel from "./components/ContractListPanel";
import { hasReached } from "./components/contractShared";
import ContractCreateTab from "./tabs/ContractCreateTab";
import ContractNegotiationTab from "./tabs/ContractNegotiationTab";
import ContractApprovalTab from "./tabs/ContractApprovalTab";
import ContractCatalogTab from "./tabs/ContractCatalogTab";

/**
 * Màn hình chính Quản lý Hợp đồng — bố cục 2 cột:
 *  - Cột trái: danh sách hợp đồng (tìm kiếm + lọc).
 *  - Cột phải: 4 tab quy trình (Tạo → Đàm phán → Phê duyệt → Catalog & Đóng).
 *
 * Tab được khóa nếu hợp đồng chưa đạt tới giai đoạn tương ứng.
 */
const ContractManagement = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<string>("create");
  const [loading, setLoading] = useState(true);

  const selected = contracts.find((c) => c.contractId === selectedId) || null;

  const loadContracts = useCallback(async (keepSelection = true) => {
    setLoading(true);
    try {
      const list = await contractService.getAll();
      setContracts(list);
      setSelectedId((prev) => {
        if (keepSelection && prev && list.some((c) => c.contractId === prev)) return prev;
        return list.length > 0 ? list[0].contractId : null;
      });
    } catch (e) {
      console.error(e);
      NotificationExtension.Fails("Lỗi tải danh sách hợp đồng.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContracts(false);
  }, [loadContracts]);

  // Sau mỗi hành động của tab → refresh để cập nhật trạng thái/danh sách.
  const handleChanged = useCallback(() => {
    loadContracts(true);
  }, [loadContracts]);

  // Khi tạo mới thành công → chọn hợp đồng mới, chuyển tab đàm phán nếu đã gửi.
  const handleCreated = useCallback(
    async (newId: number, gotoTab?: string) => {
      await loadContracts(false);
      setSelectedId(newId);
      if (gotoTab) setActiveTab(gotoTab);
    },
    [loadContracts]
  );

  const negotiationLocked = !hasReached(selected, "in_negotiation");
  const approvalLocked = !hasReached(selected, "pending_approval");
  const catalogLocked = !hasReached(selected, "active");

  return (
    <Box>
      <Box style={{ borderBottom: "1px solid #dee2e6", padding: "8px 12px" }}>
        <_breadcrumb />
      </Box>

      <Grid gutter={0} style={{ minHeight: "calc(100vh - 160px)" }}>
        {/* Cột trái: danh sách */}
        <Grid.Col
          span={{ base: 12, md: 3 }}
          style={{ borderRight: "1px solid #dee2e6", maxHeight: "calc(100vh - 120px)" }}
        >
          {loading && contracts.length === 0 ? (
            <Group justify="center" p="xl">
              <Loader size="sm" />
            </Group>
          ) : (
            <ContractListPanel
              contracts={contracts}
              selectedId={selectedId}
              onSelect={(id) => setSelectedId(id)}
            />
          )}
        </Grid.Col>

        {/* Cột phải: các tab */}
        <Grid.Col span={{ base: 12, md: 9 }} p="md">
          <Tabs value={activeTab} onChange={(v) => v && setActiveTab(v)} keepMounted={false}>
            <Tabs.List mb="md">
              <Tabs.Tab value="create" leftSection={<IconFileText size={16} />}>
                Tạo hợp đồng
              </Tabs.Tab>
              <Tabs.Tab
                value="negotiation"
                leftSection={<IconMessages size={16} />}
                disabled={negotiationLocked}
              >
                Đàm phán
              </Tabs.Tab>
              <Tabs.Tab
                value="approval"
                leftSection={<IconCheck size={16} />}
                disabled={approvalLocked}
              >
                Phê duyệt
              </Tabs.Tab>
              <Tabs.Tab
                value="catalog"
                leftSection={<IconPackage size={16} />}
                disabled={catalogLocked}
              >
                Catalog & Đóng
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="create">
              <ContractCreateTab contract={selected} onCreated={handleCreated} onChanged={handleChanged} />
            </Tabs.Panel>

            <Tabs.Panel value="negotiation">
              {selected && !negotiationLocked ? (
                <ContractNegotiationTab contract={selected} onChanged={handleChanged} />
              ) : (
                <EmptyStage text="Hợp đồng chưa bước vào giai đoạn đàm phán." />
              )}
            </Tabs.Panel>

            <Tabs.Panel value="approval">
              {selected && !approvalLocked ? (
                <ContractApprovalTab contract={selected} onChanged={handleChanged} />
              ) : (
                <EmptyStage text="Hợp đồng chưa được gửi phê duyệt." />
              )}
            </Tabs.Panel>

            <Tabs.Panel value="catalog">
              {selected && !catalogLocked ? (
                <ContractCatalogTab contract={selected} onChanged={handleChanged} />
              ) : (
                <EmptyStage text="Hợp đồng cần được xuất bản (active) trước khi tạo catalog." />
              )}
            </Tabs.Panel>
          </Tabs>
        </Grid.Col>
      </Grid>
    </Box>
  );
};

const EmptyStage = ({ text }: { text: string }) => (
  <Group justify="center" py={80}>
    <Text c="dimmed">{text}</Text>
  </Group>
);

export default ContractManagement;

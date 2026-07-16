import { ReactNode } from "react";
import { Box, Group, Tabs, Text, Title } from "@mantine/core";
import { useSearchParams } from "react-router-dom";

export interface InventoryWorkspaceTab {
  value: string;
  label: string;
  content: ReactNode;
}

interface InventoryWorkspaceShellProps {
  title: string;
  description?: string;
  tabs: InventoryWorkspaceTab[];
  defaultTab: string;
  actions?: ReactNode;
}

export default function InventoryWorkspaceShell({
  title,
  description,
  tabs,
  defaultTab,
  actions,
}: InventoryWorkspaceShellProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = searchParams.get("tab") || defaultTab;
  const activeTab = tabs.some((tab) => tab.value === requestedTab)
    ? requestedTab
    : defaultTab;

  const handleTabChange = (value: string | null) => {
    if (!value) return;
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("tab", value);
    setSearchParams(nextParams);
  };

  return (
    <Box className="inv-workspace">
      <Group justify="space-between" align="flex-start" gap="md" mb="md">
        <Box>
          <Title order={3} c="dark.8">
            {title}
          </Title>
          {description ? (
            <Text c="dimmed" size="sm" mt={4}>
              {description}
            </Text>
          ) : null}
        </Box>
        {actions ? <Group gap="xs">{actions}</Group> : null}
      </Group>

      <Tabs value={activeTab} onChange={handleTabChange} color="blue" keepMounted={false}>
        <Tabs.List className="inv-tabs-list" mb="md">
          {tabs.map((tab) => (
            <Tabs.Tab key={tab.value} value={tab.value}>
              {tab.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        {tabs.map((tab) => (
          <Tabs.Panel key={tab.value} value={tab.value}>
            {tab.content}
          </Tabs.Panel>
        ))}
      </Tabs>
    </Box>
  );
}

import { ReactNode } from "react";
import { Box, Paper, Tabs, Text, Title } from "@mantine/core";
import { useSearchParams } from "react-router-dom";

export interface ARWorkspaceTab {
  value: string;
  label: string;
  content: ReactNode;
}

interface ARWorkspaceShellProps {
  title: string;
  description: string;
  tabs: ARWorkspaceTab[];
  defaultTab: string;
}

export default function ARWorkspaceShell({
  title,
  description,
  tabs,
  defaultTab,
}: ARWorkspaceShellProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = searchParams.get("tab") || defaultTab;
  const activeTab = tabs.some((tab) => tab.value === requestedTab)
    ? requestedTab
    : defaultTab;

  const handleTabChange = (value: string | null) => {
    if (!value) return;

    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("tab", value);
    nextParams.delete("filter");
    nextParams.delete("status");
    setSearchParams(nextParams);
  };

  return (
    <Box>
      <Box mb="lg">
        <Title order={3} c="dark.8">{title}</Title>
        <Text c="dimmed" size="sm" mt={4}>{description}</Text>
      </Box>

      <Paper withBorder radius="md" p="md" shadow="xs">
        <Tabs value={activeTab} onChange={handleTabChange} color="indigo" keepMounted={false}>
          <Tabs.List style={{ overflowX: "auto", flexWrap: "nowrap" }} mb="lg">
            {tabs.map((tab) => (
              <Tabs.Tab key={tab.value} value={tab.value} style={{ whiteSpace: "nowrap" }}>
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
      </Paper>
    </Box>
  );
}

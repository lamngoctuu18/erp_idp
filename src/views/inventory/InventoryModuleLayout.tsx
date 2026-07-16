import { Box } from "@mantine/core";
import { Outlet } from "react-router-dom";
import "./Inventory.css";

export default function InventoryModuleLayout() {
  return (
    <Box className="inv-module-shell">
      <Outlet />
    </Box>
  );
}

import { Box, Flex } from "@mantine/core";
import { Outlet } from "react-router-dom";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";
import "./ArReceivable.css";

export default function ARModuleLayout() {
  return (
    <Box p="md" className="ar-view-fade-in" style={{ minWidth: 1000, overflowX: "auto" }}>
      {/* Module Title and Breadcrumb */}
      {/* Compact Breadcrumb Header like Fixed Assets */}
      <Flex
        justify="space-between"
        align="center"
        style={{
          border: "1px solid #dee2e6",
          padding: "5px 10px",
          backgroundColor: "#f8f9fa",
          borderRadius: 4,
        }}
        mb={16}
      >
        <BreadCrumb />
      </Flex>

      {/* Routed child views */}
      <Box style={{ minHeight: 500 }}>
        <Outlet />
      </Box>
    </Box>
  );
}

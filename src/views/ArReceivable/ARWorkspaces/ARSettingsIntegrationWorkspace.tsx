import ARSetupTabs from "../ARSetup/ARSetupTabs";
import ARAutoInvoiceList from "../ARAutoInvoice/ARAutoInvoiceList";
import ARPromotionsPanel from "./ARPromotionsPanel";
import ARDemoToolsPanel from "./ARDemoToolsPanel";
import ARWorkspaceShell from "./ARWorkspaceShell";

export default function ARSettingsIntegrationWorkspace() {
  return (
    <ARWorkspaceShell
      title="Thiết lập & Tích hợp"
      description="Cấu hình nền tảng AR, theo dõi AutoInvoice và truy cập các tiện ích quản trị ít dùng."
      defaultTab="thiet-lap"
      tabs={[
        { value: "thiet-lap", label: "Thiết lập AR", content: <ARSetupTabs /> },
        { value: "autoinvoice", label: "AutoInvoice", content: <ARAutoInvoiceList /> },
        { value: "khuyen-mai", label: "Khuyến mại", content: <ARPromotionsPanel /> },
        { value: "cong-cu-demo", label: "Công cụ Demo", content: <ARDemoToolsPanel /> },
      ]}
    />
  );
}

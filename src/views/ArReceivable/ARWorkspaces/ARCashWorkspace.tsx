import ARReceiptList from "../ARReceipt/ARReceiptList";
import ARReceivableApplicationList from "../ARReceivableApplication/ARReceivableApplicationList";
import ARWorkspaceShell from "./ARWorkspaceShell";

export default function ARCashWorkspace() {
  return (
    <ARWorkspaceShell
      title="Thu tiền & Cấn trừ"
      description="Theo dõi phiếu thu và thực hiện cấn trừ ngay trong ngữ cảnh chứng từ, không cần mở menu Apply riêng."
      defaultTab="phieu-thu"
      tabs={[
        { value: "phieu-thu", label: "Phiếu thu", content: <ARReceiptList /> },
        { value: "applications", label: "Khoản đã cấn trừ", content: <ARReceivableApplicationList /> },
        { value: "unapplied", label: "Chưa phân bổ", content: <ARReceiptList balanceView="unapplied" /> },
        { value: "on-account", label: "On-account", content: <ARReceiptList balanceView="on-account" /> },
      ]}
    />
  );
}

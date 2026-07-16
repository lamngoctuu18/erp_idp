import ARCustomerBalanceList from "../ARCustomerBalance/ARCustomerBalanceList";
import ARAccountingList from "../ARAccounting/ARAccountingList";
import ARAgingReport from "./ARAgingReport";
import ARGLTransferDemo from "./ARGLTransferDemo";
import ARReconciliation from "./ARReconciliation";
import ARWorkspaceShell from "./ARWorkspaceShell";

export default function ARAccountingReportsWorkspace() {
  return (
    <ARWorkspaceShell
      title="Kế toán & Báo cáo"
      description="Một điểm làm việc chung cho số dư, tuổi nợ, sự kiện hạch toán, chuyển GL mô phỏng và đối soát."
      defaultTab="so-du"
      tabs={[
        { value: "so-du", label: "Số dư khách hàng", content: <ARCustomerBalanceList /> },
        { value: "tuoi-no", label: "Tuổi nợ", content: <ARAgingReport /> },
        { value: "accounting-events", label: "Accounting Events", content: <ARAccountingList /> },
        { value: "gl-transfer", label: "GL Transfer Demo", content: <ARGLTransferDemo /> },
        { value: "doi-soat", label: "Đối soát", content: <ARReconciliation /> },
      ]}
    />
  );
}

import ARInvoiceList from "../ARInvoice/ARInvoiceList";
import ARCreditMemoList from "../ARCreditMemo/ARCreditMemoList";
import ARAdjustmentList from "../ARAdjustment/ARAdjustmentList";
import ARWorkspaceShell from "./ARWorkspaceShell";

export default function ARReceivablesWorkspace() {
  return (
    <ARWorkspaceShell
      title="Công nợ phải thu"
      description="Quản lý toàn bộ vòng đời hóa đơn, giảm trừ và điều chỉnh trong cùng một workspace."
      defaultTab="hoa-don"
      tabs={[
        { value: "hoa-don", label: "Hóa đơn", content: <ARInvoiceList /> },
        { value: "credit-memo", label: "Credit Memo", content: <ARCreditMemoList /> },
        { value: "dieu-chinh", label: "Điều chỉnh", content: <ARAdjustmentList /> },
      ]}
    />
  );
}

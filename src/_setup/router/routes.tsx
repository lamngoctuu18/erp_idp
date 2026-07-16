import { createBrowserRouter, redirect } from "react-router-dom";
import { Box, Text, Title } from "@mantine/core";
import { Layout1 } from "../../_base/component/_layout/_layout1";
import { LayoutAuth } from "../../_base/component/_layout/_layoutAuth";
import LayoutLogin from "../../_base/component/_login/_LayoutLogin";
import _404 from "../../_base/component/_layout/_404";

// Sample views (giữ lại làm ví dụ trong base)

// Phân hệ Vật tư (Inventory Module)
import InventoryItemList from "../../views/inventory/item/InventoryItemList";
import InventoryItemCreate from "../../views/inventory/item/InventoryItemCreate";
import InventoryItemDetail from "../../views/inventory/item/InventoryItemDetail";
import SubinventorySetup from "../../views/inventory/subinventory/SubinventorySetup";
import OnhandList from "../../views/inventory/onhand/OnhandList";
import TransactionHistoryList from "../../views/inventory/transaction/TransactionHistoryList";
import MiscTransactionCreate from "../../views/inventory/transaction/MiscTransactionCreate";
import MiscTransactionList from "../../views/inventory/transaction/MiscTransactionList";
import TransferTransactionCreate from "../../views/inventory/transaction/TransferTransactionCreate";
import TransferTransactionList from "../../views/inventory/transaction/TransferTransactionList";
import MoveOrderList from "../../views/inventory/move-order/MoveOrderList";
import MoveOrderCreate from "../../views/inventory/move-order/MoveOrderCreate";
import MoveOrderProcess from "../../views/inventory/move-order/MoveOrderProcess";
import PeriodControlList from "../../views/inventory/period/PeriodControlList";
import TransactionAccountList from "../../views/inventory/costing/TransactionAccountList";
import NxtReportList from "../../views/inventory/report/NxtReportList";
import InventoryModuleLayout from "../../views/inventory/InventoryModuleLayout";
import InventoryDashboard from "../../views/inventory/dashboard/InventoryDashboard";
import InventoryInterfaceMonitor from "../../views/inventory/interface/InventoryInterfaceMonitor";
import {
  InventoryAvailabilityWorkspace,
  InventoryCostingWorkspace,
  InventoryMasterDataWorkspace,
  InventoryMoveOrderWorkspace,
  InventoryReportsWorkspace,
  InventoryTransactionWorkspace,
} from "../../views/inventory/InventoryWorkspaces";

// Phân hệ Tài sản cố định (Fixed Assets Module)
import AssetDashboard from "../../views/fixed-asset/dashboard/AssetDashboard";
import AssetList from "../../views/fixed-asset/asset/AssetList";
import AssetDetail from "../../views/fixed-asset/asset/AssetDetail";
import AssetAddition from "../../views/fixed-asset/asset/AssetAddition";
import MassAddition from "../../views/fixed-asset/asset/MassAddition";
import ParentAssetForm from "../../views/fixed-asset/asset/ParentAssetForm";
import GroupAssetForm from "../../views/fixed-asset/asset/GroupAssetForm";
import CategoryReclass from "../../views/fixed-asset/lifecycle/CategoryReclass";
import AssignmentForm from "../../views/fixed-asset/lifecycle/AssignmentForm";
import GroupTransfer from "../../views/fixed-asset/lifecycle/GroupTransfer";
import BookAdjustment from "../../views/fixed-asset/lifecycle/BookAdjustment";
import CipCostAddition from "../../views/fixed-asset/lifecycle/CipCostAddition";
import DepreciationMethod from "../../views/fixed-asset/depreciation/DepreciationMethod";
import DepreciationRun from "../../views/fixed-asset/depreciation/DepreciationRun";
import UnplannedDepreciation from "../../views/fixed-asset/depreciation/UnplannedDepreciation";
import RetirementForm from "../../views/fixed-asset/depreciation/RetirementForm";
import CreateAccounting from "../../views/fixed-asset/depreciation/CreateAccounting";

// AR - Accounts Receivable Views
import ARModuleLayout from "../../views/ArReceivable/ARModuleLayout";

// ARDashboard
import ARDashboard from "../../views/ArReceivable/ARDashboard/ARDashboard";

// ARInvoice
import CreateARInvoice from "../../views/ArReceivable/ARInvoice/CreateARInvoice";
import EditARInvoice from "../../views/ArReceivable/ARInvoice/EditARInvoice";
import DetailARInvoice from "../../views/ArReceivable/ARInvoice/DetailARInvoice";
import DeleteARInvoice from "../../views/ArReceivable/ARInvoice/DeleteARInvoice";

// ARReceipt
import CreateARReceipt from "../../views/ArReceivable/ARReceipt/CreateARReceipt";
import EditARReceipt from "../../views/ArReceivable/ARReceipt/EditARReceipt";
import DetailARReceipt from "../../views/ArReceivable/ARReceipt/DetailARReceipt";
import DeleteARReceipt from "../../views/ArReceivable/ARReceipt/DeleteARReceipt";

// ARReceivableApplication
import CreateARReceivableApplication from "../../views/ArReceivable/ARReceivableApplication/CreateARReceivableApplication";
import EditARReceivableApplication from "../../views/ArReceivable/ARReceivableApplication/EditARReceivableApplication";
import DetailARReceivableApplication from "../../views/ArReceivable/ARReceivableApplication/DetailARReceivableApplication";
import DeleteARReceivableApplication from "../../views/ArReceivable/ARReceivableApplication/DeleteARReceivableApplication";

// ARCreditMemo
import CreateARCreditMemo from "../../views/ArReceivable/ARCreditMemo/CreateARCreditMemo";
import EditARCreditMemo from "../../views/ArReceivable/ARCreditMemo/EditARCreditMemo";
import DetailARCreditMemo from "../../views/ArReceivable/ARCreditMemo/DetailARCreditMemo";
import DeleteARCreditMemo from "../../views/ArReceivable/ARCreditMemo/DeleteARCreditMemo";

// ARAdjustment
import CreateARAdjustment from "../../views/ArReceivable/ARAdjustment/CreateARAdjustment";
import EditARAdjustment from "../../views/ArReceivable/ARAdjustment/EditARAdjustment";
import DetailARAdjustment from "../../views/ArReceivable/ARAdjustment/DetailARAdjustment";
import DeleteARAdjustment from "../../views/ArReceivable/ARAdjustment/DeleteARAdjustment";

// ARCustomerBalance
import CreateARCustomerBalance from "../../views/ArReceivable/ARCustomerBalance/CreateARCustomerBalance";
import EditARCustomerBalance from "../../views/ArReceivable/ARCustomerBalance/EditARCustomerBalance";
import DetailARCustomerBalance from "../../views/ArReceivable/ARCustomerBalance/DetailARCustomerBalance";
import DeleteARCustomerBalance from "../../views/ArReceivable/ARCustomerBalance/DeleteARCustomerBalance";

// ARAutoInvoice
import CreateARAutoInvoice from "../../views/ArReceivable/ARAutoInvoice/CreateARAutoInvoice";
import EditARAutoInvoice from "../../views/ArReceivable/ARAutoInvoice/EditARAutoInvoice";
import DetailARAutoInvoice from "../../views/ArReceivable/ARAutoInvoice/DetailARAutoInvoice";
import DeleteARAutoInvoice from "../../views/ArReceivable/ARAutoInvoice/DeleteARAutoInvoice";

// ARAccounting
import CreateARAccounting from "../../views/ArReceivable/ARAccounting/CreateARAccounting";
import EditARAccounting from "../../views/ArReceivable/ARAccounting/EditARAccounting";
import DetailARAccounting from "../../views/ArReceivable/ARAccounting/DetailARAccounting";
import DeleteARAccounting from "../../views/ArReceivable/ARAccounting/DeleteARAccounting";

// AR task-oriented workspaces
import ARReceivablesWorkspace from "../../views/ArReceivable/ARWorkspaces/ARReceivablesWorkspace";
import ARCashWorkspace from "../../views/ArReceivable/ARWorkspaces/ARCashWorkspace";
import ARAccountingReportsWorkspace from "../../views/ArReceivable/ARWorkspaces/ARAccountingReportsWorkspace";
import ARSettingsIntegrationWorkspace from "../../views/ArReceivable/ARWorkspaces/ARSettingsIntegrationWorkspace";

// Phân hệ AP - Nhà cung cấp & Công nợ
import ApVendorList from "../../views/ApVendor/ApVendorList";
import ApVendorCreate from "../../views/ApVendor/ApVendorCreate";
import ApVendorEdit from "../../views/ApVendor/ApVendorEdit";
import ApVendorDetail from "../../views/ApVendor/ApVendorDetail";
// ApVendorAddress
import ApVendorAddressList from "../../views/ApVendorAddress/ApVendorAddressList";
import CreateApVendorAddress from "../../views/ApVendorAddress/CreateApVendorAddress";
import EditApVendorAddress from "../../views/ApVendorAddress/EditApVendorAddress";
import DetailApVendorAddress from "../../views/ApVendorAddress/DetailApVendorAddress";
import DeleteApVendorAddress from "../../views/ApVendorAddress/DeleteApVendorAddress";

// ApVendorSite
import ApVendorSiteList from "../../views/ApVendorSite/ApVendorSiteList";
import CreateApVendorSite from "../../views/ApVendorSite/CreateApVendorSite";
import EditApVendorSite from "../../views/ApVendorSite/EditApVendorSite";
import DetailApVendorSite from "../../views/ApVendorSite/DetailApVendorSite";
import DeleteApVendorSite from "../../views/ApVendorSite/DeleteApVendorSite";

// ApVendorSiteAccount
import ApVendorSiteAccountList from "../../views/ApVendorSiteAccount/ApVendorSiteAccountList";
import CreateApVendorSiteAccount from "../../views/ApVendorSiteAccount/CreateApVendorSiteAccount";
import EditApVendorSiteAccount from "../../views/ApVendorSiteAccount/EditApVendorSiteAccount";
import DetailApVendorSiteAccount from "../../views/ApVendorSiteAccount/DetailApVendorSiteAccount";
import DeleteApVendorSiteAccount from "../../views/ApVendorSiteAccount/DeleteApVendorSiteAccount";

// ApVendorMergeHistory
import ApVendorMergeHistoryList from "../../views/ApVendorMergeHistory/ApVendorMergeHistoryList";
import CreateApVendorMergeHistory from "../../views/ApVendorMergeHistory/CreateApVendorMergeHistory";
import EditApVendorMergeHistory from "../../views/ApVendorMergeHistory/EditApVendorMergeHistory";
import DetailApVendorMergeHistory from "../../views/ApVendorMergeHistory/DetailApVendorMergeHistory";
import DeleteApVendorMergeHistory from "../../views/ApVendorMergeHistory/DeleteApVendorMergeHistory";

import ApInvoiceList from "../../views/ApInvoice/ApInvoiceList";
import CreateApInvoice from "../../views/ApInvoice/CreateApInvoice";
import EditApInvoice from "../../views/ApInvoice/EditApInvoice";
import ApInvoiceDetail from "../../views/ApInvoice/ApInvoiceDetail";
import DeleteApInvoice from "../../views/ApInvoice/DeleteApInvoice";

// ApInvoiceBatch
import ApInvoiceBatchList from "../../views/ApInvoiceBatch/ApInvoiceBatchList";
import CreateApInvoiceBatch from "../../views/ApInvoiceBatch/CreateApInvoiceBatch";
import EditApInvoiceBatch from "../../views/ApInvoiceBatch/EditApInvoiceBatch";
import DetailApInvoiceBatch from "../../views/ApInvoiceBatch/DetailApInvoiceBatch";
import DeleteApInvoiceBatch from "../../views/ApInvoiceBatch/DeleteApInvoiceBatch";

// ApHoldDefinition
import ApHoldDefinitionList from "../../views/ApHoldDefinition/ApHoldDefinitionList";
import CreateApHoldDefinition from "../../views/ApHoldDefinition/CreateApHoldDefinition";
import EditApHoldDefinition from "../../views/ApHoldDefinition/EditApHoldDefinition";
import DetailApHoldDefinition from "../../views/ApHoldDefinition/DetailApHoldDefinition";
import DeleteApHoldDefinition from "../../views/ApHoldDefinition/DeleteApHoldDefinition";

// ApPayment
import ApPaymentList from "../../views/ApPayment/ApPaymentList";
import CreateApPayment from "../../views/ApPayment/CreateApPayment";
import EditApPayment from "../../views/ApPayment/EditApPayment";
import DetailApPayment from "../../views/ApPayment/DetailApPayment";
import DeleteApPayment from "../../views/ApPayment/DeleteApPayment";

// ApPaymentBatch
import ApPaymentBatchList from "../../views/ApPaymentBatch/ApPaymentBatchList";
import CreateApPaymentBatch from "../../views/ApPaymentBatch/CreateApPaymentBatch";
import EditApPaymentBatch from "../../views/ApPaymentBatch/EditApPaymentBatch";
import DetailApPaymentBatch from "../../views/ApPaymentBatch/DetailApPaymentBatch";
import DeleteApPaymentBatch from "../../views/ApPaymentBatch/DeleteApPaymentBatch";

// ApPaymentSchedule
import ApPaymentScheduleList from "../../views/ApPaymentSchedule/ApPaymentScheduleList";
import CreateApPaymentSchedule from "../../views/ApPaymentSchedule/CreateApPaymentSchedule";
import EditApPaymentSchedule from "../../views/ApPaymentSchedule/EditApPaymentSchedule";
import DetailApPaymentSchedule from "../../views/ApPaymentSchedule/DetailApPaymentSchedule";
import DeleteApPaymentSchedule from "../../views/ApPaymentSchedule/DeleteApPaymentSchedule";

// ApPaymentTerm
import ApPaymentTermList from "../../views/ApPaymentTerm/ApPaymentTermList";
import CreateApPaymentTerm from "../../views/ApPaymentTerm/CreateApPaymentTerm";
import EditApPaymentTerm from "../../views/ApPaymentTerm/EditApPaymentTerm";
import DetailApPaymentTerm from "../../views/ApPaymentTerm/DetailApPaymentTerm";
import DeleteApPaymentTerm from "../../views/ApPaymentTerm/DeleteApPaymentTerm";

// ApPaymentTermLine
import ApPaymentTermLineList from "../../views/ApPaymentTermLine/ApPaymentTermLineList";
import CreateApPaymentTermLine from "../../views/ApPaymentTermLine/CreateApPaymentTermLine";
import EditApPaymentTermLine from "../../views/ApPaymentTermLine/EditApPaymentTermLine";
import DetailApPaymentTermLine from "../../views/ApPaymentTermLine/DetailApPaymentTermLine";
import DeleteApPaymentTermLine from "../../views/ApPaymentTermLine/DeleteApPaymentTermLine";

// ApPaymentTermDiscount
import ApPaymentTermDiscountList from "../../views/ApPaymentTermDiscount/ApPaymentTermDiscountList";
import CreateApPaymentTermDiscount from "../../views/ApPaymentTermDiscount/CreateApPaymentTermDiscount";
import EditApPaymentTermDiscount from "../../views/ApPaymentTermDiscount/EditApPaymentTermDiscount";
import DetailApPaymentTermDiscount from "../../views/ApPaymentTermDiscount/DetailApPaymentTermDiscount";
import DeleteApPaymentTermDiscount from "../../views/ApPaymentTermDiscount/DeleteApPaymentTermDiscount";

// ApInvoicePayment
import ApInvoicePaymentList from "../../views/ApInvoicePayment/ApInvoicePaymentList";
import CreateApInvoicePayment from "../../views/ApInvoicePayment/CreateApInvoicePayment";
import EditApInvoicePayment from "../../views/ApInvoicePayment/EditApInvoicePayment";
import DetailApInvoicePayment from "../../views/ApInvoicePayment/DetailApInvoicePayment";
import DeleteApInvoicePayment from "../../views/ApInvoicePayment/DeleteApInvoicePayment";


import ApActEventList from "../../views/ApActEvent/ApActEventList";
import ApActEventHeaderList from "../../views/ApActEventHeader/ApActEventHeaderList";
import ApActEventLineList from "../../views/ApActEventLine/ApActEventLineList";

// Shared Config - Sổ cái chính & Đơn vị hoạt động
import GlSetOfBookList from "../../views/GlSetOfBook/GlSetOfBookList";
import CreateGlSetOfBook from "../../views/GlSetOfBook/CreateGlSetOfBook";
import EditGlSetOfBook from "../../views/GlSetOfBook/EditGlSetOfBook";
import DetailGlSetOfBook from "../../views/GlSetOfBook/DetailGlSetOfBook";
import DeleteGlSetOfBook from "../../views/GlSetOfBook/DeleteGlSetOfBook";

import HrOperatingUnitList from "../../views/HrOperatingUnit/HrOperatingUnitList";
import CreateHrOperatingUnit from "../../views/HrOperatingUnit/CreateHrOperatingUnit";
import EditHrOperatingUnit from "../../views/HrOperatingUnit/EditHrOperatingUnit";
import DetailHrOperatingUnit from "../../views/HrOperatingUnit/DetailHrOperatingUnit";
import DeleteHrOperatingUnit from "../../views/HrOperatingUnit/DeleteHrOperatingUnit";

// Ngân hàng nội bộ (Cash & Bank)
import CeBankList from "../../views/CeBank/CeBankList";
import CreateCeBank from "../../views/CeBank/CreateCeBank";
import EditCeBank from "../../views/CeBank/EditCeBank";
import DetailCeBank from "../../views/CeBank/DetailCeBank";
import DeleteCeBank from "../../views/CeBank/DeleteCeBank";

import CeBankBranchList from "../../views/CeBankBranch/CeBankBranchList";
import CreateCeBankBranch from "../../views/CeBankBranch/CreateCeBankBranch";
import EditCeBankBranch from "../../views/CeBankBranch/EditCeBankBranch";
import DetailCeBankBranch from "../../views/CeBankBranch/DetailCeBankBranch";
import DeleteCeBankBranch from "../../views/CeBankBranch/DeleteCeBankBranch";

import CeBankAccountList from "../../views/CeBankAccount/CeBankAccountList";
import CreateCeBankAccount from "../../views/CeBankAccount/CreateCeBankAccount";
import EditCeBankAccount from "../../views/CeBankAccount/EditCeBankAccount";
import DetailCeBankAccount from "../../views/CeBankAccount/DetailCeBankAccount";
import DeleteCeBankAccount from "../../views/CeBankAccount/DeleteCeBankAccount";

const TEMP_HIDE_LOGIN_PAGE = true;

/**
 * Router của base.
 *
 * Cách thêm 1 module mới:
 * 1. Tạo view trong `src/views/<TenModule>` (tham khảo `src/views/_example`).
 * 2. Thêm 1 khối route vào mảng `children` bên dưới, kèm `handle.crumb` để breadcrumb hoạt động.
 * 3. Thêm mục điều hướng tương ứng vào `src/_setup/navdata/_sideNavData.tsx`.
 */
const router = createBrowserRouter([
  {
    path: "/",
    id: "root",
    element: <Layout1 />,
    errorElement: <_404 />,
    loader: async () => {
      if (TEMP_HIDE_LOGIN_PAGE) {
        return null;
      }

      const auth = localStorage.getItem("token");
      if (!auth) {
        throw redirect("/auth/login");
      }
      return null;
    },
    children: [
      {
        path: "/",
        loader: () => redirect("/inventory/dashboard"),
      },
      {
        path: "/inventory",
        element: <InventoryModuleLayout />,
        handle: {
          crumb: () => ({
            disabled: false,
            group: null,
            selected: false,
            text: "Quản lý Kho & Vật tư",
            value: "/inventory/dashboard",
          }),
        },
        children: [
          {
            index: true,
            loader: () => redirect("/inventory/dashboard"),
          },
          {
            path: "dashboard",
            element: <InventoryDashboard />,
            handle: {
              crumb: () => ({
                disabled: false,
                group: null,
                selected: false,
                text: "Tổng quan kho",
                value: "/inventory/dashboard",
              }),
            },
          },
          {
            path: "master-data",
            element: <InventoryMasterDataWorkspace />,
            handle: {
              crumb: () => ({
                disabled: false,
                group: null,
                selected: false,
                text: "Thiết lập & danh mục",
                value: "/inventory/master-data",
              }),
            },
          },
          {
            path: "availability",
            element: <InventoryAvailabilityWorkspace />,
            handle: {
              crumb: () => ({
                disabled: false,
                group: null,
                selected: false,
                text: "Tồn kho & khả dụng",
                value: "/inventory/availability",
              }),
            },
          },
          {
            path: "transactions",
            element: <InventoryTransactionWorkspace />,
            handle: {
              crumb: () => ({
                disabled: false,
                group: null,
                selected: false,
                text: "Giao dịch kho",
                value: "/inventory/transactions",
              }),
            },
          },
          {
            path: "move-orders",
            element: <InventoryMoveOrderWorkspace />,
            handle: {
              crumb: () => ({
                disabled: false,
                group: null,
                selected: false,
                text: "Move Order",
                value: "/inventory/move-orders",
              }),
            },
          },
          {
            path: "costing-workspace",
            element: <InventoryCostingWorkspace />,
            handle: {
              crumb: () => ({
                disabled: false,
                group: null,
                selected: false,
                text: "Costing & kỳ kế toán",
                value: "/inventory/costing-workspace",
              }),
            },
          },
          {
            path: "interfaces",
            element: <InventoryInterfaceMonitor />,
            handle: {
              crumb: () => ({
                disabled: false,
                group: null,
                selected: false,
                text: "Interface Monitor",
                value: "/inventory/interfaces",
              }),
            },
          },
          {
            path: "reports",
            element: <InventoryReportsWorkspace />,
            handle: {
              crumb: () => ({
                disabled: false,
                group: null,
                selected: false,
                text: "Báo cáo kho",
                value: "/inventory/reports",
              }),
            },
          },
          {
            path: "item/list",
            element: <InventoryItemList />,
            handle: {
              crumb: () => ({
                disabled: false,
                group: null,
                selected: false,
                text: "Danh mục Vật tư",
                value: "/inventory/item/list",
              }),
            },
          },
          {
            path: "item/create",
            element: <InventoryItemCreate />,
            handle: {
              crumb: () => ({
                disabled: false,
                group: null,
                selected: false,
                text: "Khai báo Vật tư",
                value: "/inventory/item/create",
              }),
            },
          },
          {
            path: "item/detail/:id",
            element: <InventoryItemDetail />,
            handle: {
              crumb: () => ({
                disabled: false,
                group: null,
                selected: false,
                text: "Chi tiết Vật tư",
                value: "/inventory/item/detail",
              }),
            },
          },
          {
            path: "subinventory/setup",
            element: <SubinventorySetup />,
            handle: {
              crumb: () => ({
                disabled: false,
                group: null,
                selected: false,
                text: "Cấu hình Kho con",
                value: "/inventory/subinventory/setup",
              }),
            },
          },
          {
            path: "onhand/list",
            element: <OnhandList />,
            handle: {
              crumb: () => ({
                disabled: false,
                group: null,
                selected: false,
                text: "Báo cáo Tồn kho",
                value: "/inventory/onhand/list",
              }),
            },
          },
          {
            path: "transaction/history",
            element: <TransactionHistoryList />,
            handle: {
              crumb: () => ({
                disabled: false,
                group: null,
                selected: false,
                text: "Lịch sử Giao dịch",
                value: "/inventory/transaction/history",
              }),
            },
          },
          {
            path: "transaction/misc",
            element: <MiscTransactionList />,
            handle: {
              crumb: () => ({
                disabled: false,
                group: null,
                selected: false,
                text: "Nhập/Xuất trực tiếp",
                value: "/inventory/transaction/misc",
              }),
            },
          },
          {
            path: "transaction/misc/create",
            element: <MiscTransactionCreate />,
            handle: {
              crumb: () => ({
                disabled: false,
                group: null,
                selected: false,
                text: "Lập phiếu Nhập/Xuất mới",
                value: "/inventory/transaction/misc/create",
              }),
            },
          },
          {
            path: "transaction/transfer",
            element: <TransferTransactionList />,
            handle: {
              crumb: () => ({
                disabled: false,
                group: null,
                selected: false,
                text: "Phiếu Chuyển kho",
                value: "/inventory/transaction/transfer",
              }),
            },
          },
          {
            path: "transaction/transfer/create",
            element: <TransferTransactionCreate />,
            handle: {
              crumb: () => ({
                disabled: false,
                group: null,
                selected: false,
                text: "Lập phiếu Chuyển kho mới",
                value: "/inventory/transaction/transfer/create",
              }),
            },
          },
          {
            path: "move-order/list",
            element: <MoveOrderList />,
            handle: {
              crumb: () => ({
                disabled: false,
                group: null,
                selected: false,
                text: "Yêu cầu Move Order",
                value: "/inventory/move-order/list",
              }),
            },
          },
          {
            path: "move-order/create",
            element: <MoveOrderCreate />,
            handle: {
              crumb: () => ({
                disabled: false,
                group: null,
                selected: false,
                text: "Tạo yêu cầu Move Order",
                value: "/inventory/move-order/create",
              }),
            },
          },
          {
            path: "move-order/process/:id",
            element: <MoveOrderProcess />,
            handle: {
              crumb: () => ({
                disabled: false,
                group: null,
                selected: false,
                text: "Xử lý Move Order",
                value: "/inventory/move-order/process",
              }),
            },
          },
          {
            path: "period/control",
            element: <PeriodControlList />,
            handle: {
              crumb: () => ({
                disabled: false,
                group: null,
                selected: false,
                text: "Kỳ kế toán Kho",
                value: "/inventory/period/control",
              }),
            },
          },
          {
            path: "costing/accounts",
            element: <TransactionAccountList />,
            handle: {
              crumb: () => ({
                disabled: false,
                group: null,
                selected: false,
                text: "Bút toán Định khoản",
                value: "/inventory/costing/accounts",
              }),
            },
          },
          {
            path: "report/nxt",
            element: <NxtReportList />,
            handle: {
              crumb: () => ({
                disabled: false,
                group: null,
                selected: false,
                text: "Nhập - Xuất - Tồn",
                value: "/inventory/report/nxt",
              }),
            },
          },
        ],
      },
      {
        path: "/fixed-asset",
        handle: {
          crumb: () => ({
            disabled: false,
            group: null,
            selected: false,
            text: "Quản lý Tài sản cố định",
            value: "/fixed-asset/dashboard",
          }),
        },
        children: [
          {
            path: "dashboard",
            element: <AssetDashboard />,
            handle: {
              crumb: () => ({
                disabled: false,
                group: null,
                selected: false,
                text: "Dashboard tài sản",
                value: "/fixed-asset/dashboard",
              }),
            },
          },
          {
            path: "asset/list",
            element: <AssetList />,
            handle: {
              crumb: () => ({
                disabled: false,
                group: null,
                selected: false,
                text: "Asset Workbench",
                value: "/fixed-asset/asset/list",
              }),
            },
          },
          {
            path: "asset/:assetNumber",
            element: <AssetDetail />,
            handle: {
              crumb: () => ({
                disabled: false,
                group: null,
                selected: false,
                text: "Chi tiết tài sản",
                value: "/fixed-asset/asset/list",
              }),
            },
          },
          {
            path: "addition",
            element: <AssetAddition mode="addition" />,
            handle: {
              crumb: () => ({
                disabled: false,
                group: null,
                selected: false,
                text: "Ghi tăng tài sản",
                value: "/fixed-asset/addition",
              }),
            },
          },
          {
            path: "addition/opening",
            element: <AssetAddition mode="opening" />,
            handle: {
              crumb: () => ({
                disabled: false,
                group: null,
                selected: false,
                text: "Ghi tăng đầu kỳ",
                value: "/fixed-asset/addition/opening",
              }),
            },
          },
          {
            path: "addition/quick",
            element: <AssetAddition mode="quick" />,
            handle: {
              crumb: () => ({
                disabled: false,
                group: null,
                selected: false,
                text: "Ghi tăng nhanh",
                value: "/fixed-asset/addition/quick",
              }),
            },
          },
          {
            path: "mass-addition",
            element: <MassAddition />,
            handle: {
              crumb: () => ({
                disabled: false,
                group: null,
                selected: false,
                text: "Prepare Mass Additions",
                value: "/fixed-asset/mass-addition",
              }),
            },
          },
          {
            path: "parent-setup",
            element: <ParentAssetForm />,
            handle: {
              crumb: () => ({
                disabled: false,
                group: null,
                selected: false,
                text: "Khai báo tài sản cha",
                value: "/fixed-asset/parent-setup",
              }),
            },
          },
          {
            path: "group-setup",
            element: <GroupAssetForm />,
            handle: {
              crumb: () => ({
                disabled: false,
                group: null,
                selected: false,
                text: "Khai báo nhóm tài sản",
                value: "/fixed-asset/group-setup",
              }),
            },
          },
          {
            path: "lifecycle/reclass",
            element: <CategoryReclass />,
            handle: {
              crumb: () => ({
                disabled: false,
                group: null,
                selected: false,
                text: "Reclass tài sản",
                value: "/fixed-asset/lifecycle/reclass",
              }),
            },
          },
          {
            path: "lifecycle/assignment",
            element: <AssignmentForm />,
            handle: {
              crumb: () => ({
                disabled: false,
                group: null,
                selected: false,
                text: "Điều chuyển bộ phận",
                value: "/fixed-asset/lifecycle/assignment",
              }),
            },
          },
          {
            path: "lifecycle/group-transfer",
            element: <GroupTransfer />,
            handle: {
              crumb: () => ({
                disabled: false,
                group: null,
                selected: false,
                text: "Điều chuyển giữa Group",
                value: "/fixed-asset/lifecycle/group-transfer",
              }),
            },
          },
          {
            path: "lifecycle/book",
            element: <BookAdjustment />,
            handle: {
              crumb: () => ({
                disabled: false,
                group: null,
                selected: false,
                text: "Điều chỉnh Book",
                value: "/fixed-asset/lifecycle/book",
              }),
            },
          },
          {
            path: "lifecycle/cip",
            element: <CipCostAddition />,
            handle: {
              crumb: () => ({
                disabled: false,
                group: null,
                selected: false,
                text: "Bổ sung CIP Cost",
                value: "/fixed-asset/lifecycle/cip",
              }),
            },
          },
          {
            path: "depreciation/methods",
            element: <DepreciationMethod />,
            handle: {
              crumb: () => ({
                disabled: false,
                group: null,
                selected: false,
                text: "Phương pháp khấu hao",
                value: "/fixed-asset/depreciation/methods",
              }),
            },
          },
          {
            path: "depreciation/run",
            element: <DepreciationRun />,
            handle: {
              crumb: () => ({
                disabled: false,
                group: null,
                selected: false,
                text: "Chạy khấu hao",
                value: "/fixed-asset/depreciation/run",
              }),
            },
          },
          {
            path: "depreciation/unplanned",
            element: <UnplannedDepreciation />,
            handle: {
              crumb: () => ({
                disabled: false,
                group: null,
                selected: false,
                text: "Khấu hao ngoài kế hoạch",
                value: "/fixed-asset/depreciation/unplanned",
              }),
            },
          },
          {
            path: "depreciation/retirement",
            element: <RetirementForm />,
            handle: {
              crumb: () => ({
                disabled: false,
                group: null,
                selected: false,
                text: "Thanh lý tài sản",
                value: "/fixed-asset/depreciation/retirement",
              }),
            },
          },
          {
            path: "depreciation/accounting",
            element: <CreateAccounting />,
            handle: {
              crumb: () => ({
                disabled: false,
                group: null,
                selected: false,
                text: "Tạo hạch toán GL",
                value: "/fixed-asset/depreciation/accounting",
              }),
            },
          },
        ],
      },
      {
        path: "/cong-no-phai-thu",
        element: <ARModuleLayout />,
        handle: {
          crumb: () => ({
            disabled: false,
            group: null,
            selected: false,
            text: "Công nợ phải thu",
            value: "/cong-no-phai-thu",
          }),
        },
        children: [
          {
            index: true,
            loader: () => redirect("/cong-no-phai-thu/tong-quan"),
          },
          {
            path: "tong-quan",
            element: <ARDashboard />,
            handle: {
              crumb: () => ({
                disabled: false,
                group: null,
                selected: false,
                text: "Tổng quan",
                value: "/cong-no-phai-thu/tong-quan",
              }),
            },
          },
          {
            path: "cong-no",
            element: <ARReceivablesWorkspace />,
            handle: {
              crumb: () => ({
                disabled: false,
                group: null,
                selected: false,
                text: "Công nợ phải thu",
                value: "/cong-no",
              }),
            },
          },
          {
            path: "thu-tien",
            element: <ARCashWorkspace />,
            handle: {
              crumb: () => ({
                disabled: false,
                group: null,
                selected: false,
                text: "Thu tiền & Cấn trừ",
                value: "/thu-tien",
              }),
            },
          },
          {
            path: "ke-toan-bao-cao",
            element: <ARAccountingReportsWorkspace />,
            handle: {
              crumb: () => ({
                disabled: false,
                group: null,
                selected: false,
                text: "Kế toán & Báo cáo",
                value: "/ke-toan-bao-cao",
              }),
            },
          },
          {
            path: "thiet-lap-tich-hop",
            element: <ARSettingsIntegrationWorkspace />,
            handle: {
              crumb: () => ({
                disabled: false,
                group: null,
                selected: false,
                text: "Thiết lập & Tích hợp",
                value: "/thiet-lap-tich-hop",
              }),
            },
          },
          {
            path: "hoa-don",
            children: [
              {
                index: true,
                loader: () => redirect("/cong-no-phai-thu/cong-no?tab=hoa-don"),
              },
              {
                path: "tao-moi",
                element: <CreateARInvoice />,
              },
              {
                path: ":id",
                element: <DetailARInvoice />,
              },
              {
                path: ":id/chinh-sua",
                element: <EditARInvoice />,
              },
              {
                path: ":id/xoa",
                element: <DeleteARInvoice />,
              },
            ],
          },
          {
            path: "phieu-thu",
            children: [
              {
                index: true,
                loader: () => redirect("/cong-no-phai-thu/thu-tien?tab=phieu-thu"),
              },
              {
                path: "tao-moi",
                element: <CreateARReceipt />,
              },
              {
                path: ":id",
                element: <DetailARReceipt />,
              },
              {
                path: ":id/chinh-sua",
                element: <EditARReceipt />,
              },
              {
                path: ":id/xoa",
                element: <DeleteARReceipt />,
              },
            ],
          },
          {
            path: "apply-cong-no",
            children: [
              {
                index: true,
                loader: () => redirect("/cong-no-phai-thu/thu-tien?tab=applications"),
              },
              {
                path: "tao-moi",
                element: <CreateARReceivableApplication />,
              },
              {
                path: ":id",
                element: <CreateARReceivableApplication />,
              },
              {
                path: ":id/chi-tiet",
                element: <DetailARReceivableApplication />,
              },
              {
                path: ":id/chinh-sua",
                element: <EditARReceivableApplication />,
              },
              {
                path: ":id/xoa",
                element: <DeleteARReceivableApplication />,
              },
            ],
          },
          {
            path: "credit-memo",
            children: [
              {
                index: true,
                loader: () => redirect("/cong-no-phai-thu/cong-no?tab=credit-memo"),
              },
              {
                path: "tao-moi",
                element: <CreateARCreditMemo />,
              },
              {
                path: ":id",
                element: <DetailARCreditMemo />,
              },
              {
                path: ":id/chinh-sua",
                element: <EditARCreditMemo />,
              },
              {
                path: ":id/xoa",
                element: <DeleteARCreditMemo />,
              },
            ],
          },
          {
            path: "dieu-chinh",
            children: [
              {
                index: true,
                loader: () => redirect("/cong-no-phai-thu/cong-no?tab=dieu-chinh"),
              },
              {
                path: "tao-moi",
                element: <CreateARAdjustment />,
              },
              {
                path: ":id",
                element: <DetailARAdjustment />,
              },
              {
                path: ":id/chinh-sua",
                element: <EditARAdjustment />,
              },
              {
                path: ":id/xoa",
                element: <DeleteARAdjustment />,
              },
            ],
          },
          {
            path: "cong-no-khach-hang",
            children: [
              {
                index: true,
                loader: () => redirect("/cong-no-phai-thu/ke-toan-bao-cao?tab=so-du"),
              },
              {
                path: "tao-moi",
                element: <CreateARCustomerBalance />,
              },
              {
                path: ":id",
                element: <DetailARCustomerBalance />,
              },
              {
                path: ":id/chinh-sua",
                element: <EditARCustomerBalance />,
              },
              {
                path: ":id/xoa",
                element: <DeleteARCustomerBalance />,
              },
            ],
          },
          {
            path: "autoinvoice",
            children: [
              {
                index: true,
                loader: () => redirect("/cong-no-phai-thu/thiet-lap-tich-hop?tab=autoinvoice"),
              },
              {
                path: "tao-moi",
                element: <CreateARAutoInvoice />,
              },
              {
                path: ":id",
                element: <DetailARAutoInvoice />,
              },
              {
                path: ":id/chinh-sua",
                element: <EditARAutoInvoice />,
              },
              {
                path: ":id/xoa",
                element: <DeleteARAutoInvoice />,
              },
            ],
          },
          {
            path: "hach-toan",
            children: [
              {
                index: true,
                loader: () => redirect("/cong-no-phai-thu/ke-toan-bao-cao?tab=accounting-events"),
              },
              {
                path: "tao-moi",
                element: <CreateARAccounting />,
              },
              {
                path: ":id",
                element: <DetailARAccounting />,
              },
              {
                path: ":id/chinh-sua",
                element: <EditARAccounting />,
              },
              {
                path: ":id/xoa",
                element: <DeleteARAccounting />,
              },
            ],
          },
          {
            path: "thiet-lap",
            loader: () => redirect("/cong-no-phai-thu/thiet-lap-tich-hop?tab=thiet-lap"),
          },
        ],
      },
      // ROUTING CHO CÁC VIEW PHÂN HỆ SHARED CONFIG (GL SET OF BOOK & HR OPERATING UNIT)
      {
        path: "/GlSetOfBook",
        handle: {
          crumb: () => ({ text: "Sổ cái chính", value: "/GlSetOfBook/GlSetOfBookList" }),
        },
        children: [
          {
            path: "GlSetOfBookList",
            element: <GlSetOfBookList />,
            handle: { crumb: () => ({ text: "Danh sách sổ cái", value: "/GlSetOfBook/GlSetOfBookList" }) },
          },
          {
            path: "Create",
            element: <CreateGlSetOfBook />,
            handle: { crumb: () => ({ text: "Thêm mới", value: "/GlSetOfBook/Create" }) },
          },
          {
            path: "Edit/:id",
            element: <EditGlSetOfBook />,
            handle: { crumb: () => ({ text: "Chỉnh sửa", value: "/GlSetOfBook/Edit" }) },
          },
          {
            path: "Detail/:id",
            element: <DetailGlSetOfBook />,
            handle: { crumb: () => ({ text: "Chi tiết", value: "/GlSetOfBook/Detail" }) },
          },
          {
            path: "Delete/:id",
            element: <DeleteGlSetOfBook />,
            handle: { crumb: () => ({ text: "Xác nhận xóa", value: "/GlSetOfBook/Delete" }) },
          },
        ],
      },
      {
        path: "/HrOperatingUnit",
        handle: {
          crumb: () => ({ text: "Đơn vị hoạt động", value: "/HrOperatingUnit/HrOperatingUnitList" }),
        },
        children: [
          {
            path: "HrOperatingUnitList",
            element: <HrOperatingUnitList />,
            handle: { crumb: () => ({ text: "Danh sách đơn vị", value: "/HrOperatingUnit/HrOperatingUnitList" }) },
          },
          {
            path: "Create",
            element: <CreateHrOperatingUnit />,
            handle: { crumb: () => ({ text: "Thêm mới", value: "/HrOperatingUnit/Create" }) },
          },
          {
            path: "Edit/:id",
            element: <EditHrOperatingUnit />,
            handle: { crumb: () => ({ text: "Chỉnh sửa", value: "/HrOperatingUnit/Edit" }) },
          },
          {
            path: "Detail/:id",
            element: <DetailHrOperatingUnit />,
            handle: { crumb: () => ({ text: "Chi tiết", value: "/HrOperatingUnit/Detail" }) },
          },
          {
            path: "Delete/:id",
            element: <DeleteHrOperatingUnit />,
            handle: { crumb: () => ({ text: "Xác nhận xóa", value: "/HrOperatingUnit/Delete" }) },
          },
        ],
      },
      // ROUTING CHO CÁC VIEW PHÂN HỆ SHARED CONFIG (CE BANK, CE BANK BRANCH & CE BANK ACCOUNT)
      {
        path: "/CeBank",
        handle: {
          crumb: () => ({ text: "Ngân hàng", value: "/CeBank/CeBankList" }),
        },
        children: [
          {
            path: "CeBankList",
            element: <CeBankList />,
            handle: { crumb: () => ({ text: "Danh sách ngân hàng", value: "/CeBank/CeBankList" }) },
          },
          {
            path: "Create",
            element: <CreateCeBank />,
            handle: { crumb: () => ({ text: "Thêm mới", value: "/CeBank/Create" }) },
          },
          {
            path: "Edit/:id",
            element: <EditCeBank />,
            handle: { crumb: () => ({ text: "Chỉnh sửa", value: "/CeBank/Edit" }) },
          },
          {
            path: "Detail/:id",
            element: <DetailCeBank />,
            handle: { crumb: () => ({ text: "Chi tiết", value: "/CeBank/Detail" }) },
          },
          {
            path: "Delete/:id",
            element: <DeleteCeBank />,
            handle: { crumb: () => ({ text: "Xác nhận xóa", value: "/CeBank/Delete" }) },
          },
        ],
      },
      {
        path: "/CeBankBranch",
        handle: {
          crumb: () => ({ text: "Chi nhánh ngân hàng", value: "/CeBankBranch/CeBankBranchList" }),
        },
        children: [
          {
            path: "CeBankBranchList",
            element: <CeBankBranchList />,
            handle: { crumb: () => ({ text: "Danh sách chi nhánh", value: "/CeBankBranch/CeBankBranchList" }) },
          },
          {
            path: "Create",
            element: <CreateCeBankBranch />,
            handle: { crumb: () => ({ text: "Thêm mới", value: "/CeBankBranch/Create" }) },
          },
          {
            path: "Edit/:id",
            element: <EditCeBankBranch />,
            handle: { crumb: () => ({ text: "Chỉnh sửa", value: "/CeBankBranch/Edit" }) },
          },
          {
            path: "Detail/:id",
            element: <DetailCeBankBranch />,
            handle: { crumb: () => ({ text: "Chi tiết", value: "/CeBankBranch/Detail" }) },
          },
          {
            path: "Delete/:id",
            element: <DeleteCeBankBranch />,
            handle: { crumb: () => ({ text: "Xác nhận xóa", value: "/CeBankBranch/Delete" }) },
          },
        ],
      },
      {
        path: "/CeBankAccount",
        handle: {
          crumb: () => ({ text: "Tài khoản ngân hàng", value: "/CeBankAccount/CeBankAccountList" }),
        },
        children: [
          {
            path: "CeBankAccountList",
            element: <CeBankAccountList />,
            handle: { crumb: () => ({ text: "Danh sách tài khoản", value: "/CeBankAccount/CeBankAccountList" }) },
          },
          {
            path: "Create",
            element: <CreateCeBankAccount />,
            handle: { crumb: () => ({ text: "Thêm mới", value: "/CeBankAccount/Create" }) },
          },
          {
            path: "Edit/:id",
            element: <EditCeBankAccount />,
            handle: { crumb: () => ({ text: "Chỉnh sửa", value: "/CeBankAccount/Edit" }) },
          },
          {
            path: "Detail/:id",
            element: <DetailCeBankAccount />,
            handle: { crumb: () => ({ text: "Chi tiết", value: "/CeBankAccount/Detail" }) },
          },
          {
            path: "Delete/:id",
            element: <DeleteCeBankAccount />,
            handle: { crumb: () => ({ text: "Xác nhận xóa", value: "/CeBankAccount/Delete" }) },
          },
        ],
      },
      // ROUTING CHO CÁC VIEW PHÂN HỆ AP (NHÀ CUNG CẤP & CÔNG NỢ)
      {
        path: "/ApVendor",
        handle: {
          crumb: () => ({ text: "Nhà cung cấp", value: "/ApVendor" }),
        },
        children: [
          {
            path: "ApVendorList",
            element: <ApVendorList />,
            handle: { crumb: () => ({ text: "Danh sách nhà cung cấp", value: "/ApVendor/ApVendorList" }) },
          },
          {
            path: "CreateApVendor",
            element: <ApVendorCreate />,
            handle: { crumb: () => ({ text: "Thêm mới", value: "/ApVendor/CreateApVendor" }) },
          },
          {
            path: "EditApVendor/:id",
            element: <ApVendorEdit />,
            handle: { crumb: () => ({ text: "Sửa đổi", value: "/ApVendor/EditApVendor" }) },
          },
          {
            path: "DetailApVendor/:id",
            element: <ApVendorDetail />,
            handle: { crumb: () => ({ text: "Chi tiết", value: "/ApVendor/DetailApVendor" }) },
          },
        ],
      },
      {
        path: "/ApVendorAddress",
        handle: {
          crumb: () => ({ text: "Địa chỉ nhà cung cấp", value: "/ApVendorAddress/ApVendorAddressList" }),
        },
        children: [
          {
            path: "ApVendorAddressList",
            element: <ApVendorAddressList />,
            handle: { crumb: () => ({ text: "Danh sách địa chỉ", value: "/ApVendorAddress/ApVendorAddressList" }) },
          },
          {
            path: "Create",
            element: <CreateApVendorAddress />,
            handle: { crumb: () => ({ text: "Thêm mới", value: "/ApVendorAddress/Create" }) },
          },
          {
            path: "Edit/:id",
            element: <EditApVendorAddress />,
            handle: { crumb: () => ({ text: "Chỉnh sửa", value: "/ApVendorAddress/Edit" }) },
          },
          {
            path: "Detail/:id",
            element: <DetailApVendorAddress />,
            handle: { crumb: () => ({ text: "Chi tiết", value: "/ApVendorAddress/Detail" }) },
          },
          {
            path: "Delete/:id",
            element: <DeleteApVendorAddress />,
            handle: { crumb: () => ({ text: "Xác nhận xóa", value: "/ApVendorAddress/Delete" }) },
          },
        ],
      },
      {
        path: "/ApVendorSite",
        handle: {
          crumb: () => ({ text: "Chi nhánh nhà cung cấp", value: "/ApVendorSite/ApVendorSiteList" }),
        },
        children: [
          {
            path: "ApVendorSiteList",
            element: <ApVendorSiteList />,
            handle: { crumb: () => ({ text: "Danh sách chi nhánh", value: "/ApVendorSite/ApVendorSiteList" }) },
          },
          {
            path: "Create",
            element: <CreateApVendorSite />,
            handle: { crumb: () => ({ text: "Thêm mới", value: "/ApVendorSite/Create" }) },
          },
          {
            path: "Edit/:id",
            element: <EditApVendorSite />,
            handle: { crumb: () => ({ text: "Chỉnh sửa", value: "/ApVendorSite/Edit" }) },
          },
          {
            path: "Detail/:id",
            element: <DetailApVendorSite />,
            handle: { crumb: () => ({ text: "Chi tiết", value: "/ApVendorSite/Detail" }) },
          },
          {
            path: "Delete/:id",
            element: <DeleteApVendorSite />,
            handle: { crumb: () => ({ text: "Xác nhận xóa", value: "/ApVendorSite/Delete" }) },
          },
        ],
      },
      {
        path: "/ApVendorSiteAccount",
        handle: {
          crumb: () => ({ text: "Tài khoản hạch toán chi nhánh", value: "/ApVendorSiteAccount/ApVendorSiteAccountList" }),
        },
        children: [
          {
            path: "ApVendorSiteAccountList",
            element: <ApVendorSiteAccountList />,
            handle: { crumb: () => ({ text: "Danh sách tài khoản", value: "/ApVendorSiteAccount/ApVendorSiteAccountList" }) },
          },
          {
            path: "Create",
            element: <CreateApVendorSiteAccount />,
            handle: { crumb: () => ({ text: "Thêm mới", value: "/ApVendorSiteAccount/Create" }) },
          },
          {
            path: "Edit/:id",
            element: <EditApVendorSiteAccount />,
            handle: { crumb: () => ({ text: "Chỉnh sửa", value: "/ApVendorSiteAccount/Edit" }) },
          },
          {
            path: "Detail/:id",
            element: <DetailApVendorSiteAccount />,
            handle: { crumb: () => ({ text: "Chi tiết", value: "/ApVendorSiteAccount/Detail" }) },
          },
          {
            path: "Delete/:id",
            element: <DeleteApVendorSiteAccount />,
            handle: { crumb: () => ({ text: "Xác nhận xóa", value: "/ApVendorSiteAccount/Delete" }) },
          },
        ],
      },
      {
        path: "/ApVendorMergeHistory",
        handle: {
          crumb: () => ({ text: "Lịch sử gộp nhà cung cấp", value: "/ApVendorMergeHistory/ApVendorMergeHistoryList" }),
        },
        children: [
          {
            path: "ApVendorMergeHistoryList",
            element: <ApVendorMergeHistoryList />,
            handle: { crumb: () => ({ text: "Danh sách lịch sử gộp", value: "/ApVendorMergeHistory/ApVendorMergeHistoryList" }) },
          },
          {
            path: "Create",
            element: <CreateApVendorMergeHistory />,
            handle: { crumb: () => ({ text: "Thêm mới", value: "/ApVendorMergeHistory/Create" }) },
          },
          {
            path: "Edit/:id",
            element: <EditApVendorMergeHistory />,
            handle: { crumb: () => ({ text: "Chỉnh sửa", value: "/ApVendorMergeHistory/Edit" }) },
          },
          {
            path: "Detail/:id",
            element: <DetailApVendorMergeHistory />,
            handle: { crumb: () => ({ text: "Chi tiết", value: "/ApVendorMergeHistory/Detail" }) },
          },
          {
            path: "Delete/:id",
            element: <DeleteApVendorMergeHistory />,
            handle: { crumb: () => ({ text: "Xác nhận xóa", value: "/ApVendorMergeHistory/Delete" }) },
          },
        ],
      },
      {
        path: "/ApInvoice",
        handle: { crumb: () => ({ text: "Hóa đơn mua hàng", value: "/ApInvoice/ApInvoiceList" }) },
        children: [
          {
            path: "ApInvoiceList",
            element: <ApInvoiceList />,
            handle: { crumb: () => ({ text: "Danh sách hóa đơn", value: "/ApInvoice/ApInvoiceList" }) },
          },
          {
            path: "CreateApInvoice",
            element: <CreateApInvoice />,
            handle: { crumb: () => ({ text: "Tạo hóa đơn", value: "/ApInvoice/CreateApInvoice" }) },
          },
          {
            path: "Edit/:id",
            element: <EditApInvoice />,
            handle: { crumb: () => ({ text: "Cập nhật hóa đơn", value: "/ApInvoice/Edit" }) },
          },
          {
            path: "ApInvoiceDetail/:id",
            element: <ApInvoiceDetail />,
            handle: { crumb: () => ({ text: "Chi tiết hóa đơn", value: "/ApInvoice/ApInvoiceDetail" }) },
          },
          {
            path: "Delete/:id",
            element: <DeleteApInvoice />,
            handle: { crumb: () => ({ text: "Xóa hóa đơn", value: "/ApInvoice/Delete" }) },
          },
        ],
      },
      {
        path: "/ApInvoiceBatch",
        handle: { crumb: () => ({ text: "Lô hóa đơn", value: "/ApInvoiceBatch/ApInvoiceBatchList" }) },
        children: [
          {
            path: "ApInvoiceBatchList",
            element: <ApInvoiceBatchList />,
            handle: { crumb: () => ({ text: "Danh sách lô", value: "/ApInvoiceBatch/ApInvoiceBatchList" }) },
          },
          {
            path: "Create",
            element: <CreateApInvoiceBatch />,
            handle: { crumb: () => ({ text: "Tạo lô mới", value: "/ApInvoiceBatch/Create" }) },
          },
          {
            path: "Edit/:id",
            element: <EditApInvoiceBatch />,
            handle: { crumb: () => ({ text: "Cập nhật lô", value: "/ApInvoiceBatch/Edit" }) },
          },
          {
            path: "Detail/:id",
            element: <DetailApInvoiceBatch />,
            handle: { crumb: () => ({ text: "Chi tiết lô", value: "/ApInvoiceBatch/Detail" }) },
          },
          {
            path: "Delete/:id",
            element: <DeleteApInvoiceBatch />,
            handle: { crumb: () => ({ text: "Xóa lô", value: "/ApInvoiceBatch/Delete" }) },
          },
        ],
      },
      {
        path: "/ApHoldDefinition",
        handle: { crumb: () => ({ text: "Lý do khóa giữ", value: "/ApHoldDefinition/ApHoldDefinitionList" }) },
        children: [
          {
            path: "ApHoldDefinitionList",
            element: <ApHoldDefinitionList />,
            handle: { crumb: () => ({ text: "Danh sách lý do", value: "/ApHoldDefinition/ApHoldDefinitionList" }) },
          },
          {
            path: "Create",
            element: <CreateApHoldDefinition />,
            handle: { crumb: () => ({ text: "Thêm lý do mới", value: "/ApHoldDefinition/Create" }) },
          },
          {
            path: "Edit/:id",
            element: <EditApHoldDefinition />,
            handle: { crumb: () => ({ text: "Cập nhật lý do", value: "/ApHoldDefinition/Edit" }) },
          },
          {
            path: "Detail/:id",
            element: <DetailApHoldDefinition />,
            handle: { crumb: () => ({ text: "Chi tiết lý do", value: "/ApHoldDefinition/Detail" }) },
          },
          {
            path: "Delete/:id",
            element: <DeleteApHoldDefinition />,
            handle: { crumb: () => ({ text: "Xóa cấu hình", value: "/ApHoldDefinition/Delete" }) },
          },
        ],
      },
      {
        path: "/ApPayment",
        handle: { crumb: () => ({ text: "Phiếu chi thanh toán", value: "/ApPayment/ApPaymentList" }) },
        children: [
          {
            path: "ApPaymentList",
            element: <ApPaymentList />,
            handle: { crumb: () => ({ text: "Danh sách phiếu chi", value: "/ApPayment/ApPaymentList" }) },
          },
          {
            path: "Create",
            element: <CreateApPayment />,
            handle: { crumb: () => ({ text: "Lập phiếu chi mới", value: "/ApPayment/Create" }) },
          },
          {
            path: "Edit/:id",
            element: <EditApPayment />,
            handle: { crumb: () => ({ text: "Cập nhật phiếu chi", value: "/ApPayment/Edit" }) },
          },
          {
            path: "Detail/:id",
            element: <DetailApPayment />,
            handle: { crumb: () => ({ text: "Chi tiết phiếu chi", value: "/ApPayment/Detail" }) },
          },
          {
            path: "Delete/:id",
            element: <DeleteApPayment />,
            handle: { crumb: () => ({ text: "Xóa phiếu chi", value: "/ApPayment/Delete" }) },
          },
        ],
      },
      {
        path: "/ApPaymentBatch",
        handle: { crumb: () => ({ text: "Lô thanh toán", value: "/ApPaymentBatch/ApPaymentBatchList" }) },
        children: [
          {
            path: "ApPaymentBatchList",
            element: <ApPaymentBatchList />,
            handle: { crumb: () => ({ text: "Danh sách lô thanh toán", value: "/ApPaymentBatch/ApPaymentBatchList" }) },
          },
          {
            path: "Create",
            element: <CreateApPaymentBatch />,
            handle: { crumb: () => ({ text: "Thêm lô thanh toán", value: "/ApPaymentBatch/Create" }) },
          },
          {
            path: "Edit/:id",
            element: <EditApPaymentBatch />,
            handle: { crumb: () => ({ text: "Chỉnh sửa lô", value: "/ApPaymentBatch/Edit" }) },
          },
          {
            path: "Detail/:id",
            element: <DetailApPaymentBatch />,
            handle: { crumb: () => ({ text: "Chi tiết lô", value: "/ApPaymentBatch/Detail" }) },
          },
          {
            path: "Delete/:id",
            element: <DeleteApPaymentBatch />,
            handle: { crumb: () => ({ text: "Xóa lô thanh toán", value: "/ApPaymentBatch/Delete" }) },
          },
        ],
      },
      {
        path: "/ApPaymentSchedule",
        handle: { crumb: () => ({ text: "Lịch trả nợ", value: "/ApPaymentSchedule/ApPaymentScheduleList" }) },
        children: [
          {
            path: "ApPaymentScheduleList",
            element: <ApPaymentScheduleList />,
            handle: { crumb: () => ({ text: "Danh sách lịch trả nợ", value: "/ApPaymentSchedule/ApPaymentScheduleList" }) },
          },
          {
            path: "Create",
            element: <CreateApPaymentSchedule />,
            handle: { crumb: () => ({ text: "Thêm lịch trả nợ", value: "/ApPaymentSchedule/Create" }) },
          },
          {
            path: "Edit/:id",
            element: <EditApPaymentSchedule />,
            handle: { crumb: () => ({ text: "Chỉnh sửa lịch trả nợ", value: "/ApPaymentSchedule/Edit" }) },
          },
          {
            path: "Detail/:id",
            element: <DetailApPaymentSchedule />,
            handle: { crumb: () => ({ text: "Chi tiết lịch trả nợ", value: "/ApPaymentSchedule/Detail" }) },
          },
          {
            path: "Delete/:id",
            element: <DeleteApPaymentSchedule />,
            handle: { crumb: () => ({ text: "Xóa lịch trả nợ", value: "/ApPaymentSchedule/Delete" }) },
          },
        ],
      },
      {
        path: "/ApPaymentTerm",
        handle: { crumb: () => ({ text: "Điều khoản thanh toán", value: "/ApPaymentTerm/ApPaymentTermList" }) },
        children: [
          {
            path: "ApPaymentTermList",
            element: <ApPaymentTermList />,
            handle: { crumb: () => ({ text: "Danh sách điều khoản", value: "/ApPaymentTerm/ApPaymentTermList" }) },
          },
          {
            path: "Create",
            element: <CreateApPaymentTerm />,
            handle: { crumb: () => ({ text: "Thêm điều khoản", value: "/ApPaymentTerm/Create" }) },
          },
          {
            path: "Edit/:id",
            element: <EditApPaymentTerm />,
            handle: { crumb: () => ({ text: "Chỉnh sửa điều khoản", value: "/ApPaymentTerm/Edit" }) },
          },
          {
            path: "Detail/:id",
            element: <DetailApPaymentTerm />,
            handle: { crumb: () => ({ text: "Chi tiết điều khoản", value: "/ApPaymentTerm/Detail" }) },
          },
          {
            path: "Delete/:id",
            element: <DeleteApPaymentTerm />,
            handle: { crumb: () => ({ text: "Xóa điều khoản", value: "/ApPaymentTerm/Delete" }) },
          },
        ],
      },
      {
        path: "/ApPaymentTermLine",
        handle: { crumb: () => ({ text: "Chi tiết dòng điều khoản", value: "/ApPaymentTermLine/ApPaymentTermLineList" }) },
        children: [
          {
            path: "ApPaymentTermLineList",
            element: <ApPaymentTermLineList />,
            handle: { crumb: () => ({ text: "Danh sách dòng điều khoản", value: "/ApPaymentTermLine/ApPaymentTermLineList" }) },
          },
          {
            path: "Create",
            element: <CreateApPaymentTermLine />,
            handle: { crumb: () => ({ text: "Thêm dòng điều khoản", value: "/ApPaymentTermLine/Create" }) },
          },
          {
            path: "Edit/:id",
            element: <EditApPaymentTermLine />,
            handle: { crumb: () => ({ text: "Chỉnh sửa dòng", value: "/ApPaymentTermLine/Edit" }) },
          },
          {
            path: "Detail/:id",
            element: <DetailApPaymentTermLine />,
            handle: { crumb: () => ({ text: "Chi tiết dòng", value: "/ApPaymentTermLine/Detail" }) },
          },
          {
            path: "Delete/:id",
            element: <DeleteApPaymentTermLine />,
            handle: { crumb: () => ({ text: "Xóa dòng điều khoản", value: "/ApPaymentTermLine/Delete" }) },
          },
        ],
      },
      {
        path: "/ApPaymentTermDiscount",
        handle: { crumb: () => ({ text: "Chiết khấu điều khoản", value: "/ApPaymentTermDiscount/ApPaymentTermDiscountList" }) },
        children: [
          {
            path: "ApPaymentTermDiscountList",
            element: <ApPaymentTermDiscountList />,
            handle: { crumb: () => ({ text: "Danh sách chiết khấu", value: "/ApPaymentTermDiscount/ApPaymentTermDiscountList" }) },
          },
          {
            path: "Create",
            element: <CreateApPaymentTermDiscount />,
            handle: { crumb: () => ({ text: "Thêm chiết khấu", value: "/ApPaymentTermDiscount/Create" }) },
          },
          {
            path: "Edit/:id",
            element: <EditApPaymentTermDiscount />,
            handle: { crumb: () => ({ text: "Chỉnh sửa chiết khấu", value: "/ApPaymentTermDiscount/Edit" }) },
          },
          {
            path: "Detail/:id",
            element: <DetailApPaymentTermDiscount />,
            handle: { crumb: () => ({ text: "Chi tiết chiết khấu", value: "/ApPaymentTermDiscount/Detail" }) },
          },
          {
            path: "Delete/:id",
            element: <DeleteApPaymentTermDiscount />,
            handle: { crumb: () => ({ text: "Xóa chiết khấu", value: "/ApPaymentTermDiscount/Delete" }) },
          },
        ],
      },
      {
        path: "/ApInvoicePayment",
        handle: { crumb: () => ({ text: "Phân bổ thanh toán hóa đơn", value: "/ApInvoicePayment/ApInvoicePaymentList" }) },
        children: [
          {
            path: "ApInvoicePaymentList",
            element: <ApInvoicePaymentList />,
            handle: { crumb: () => ({ text: "Danh sách phân bổ", value: "/ApInvoicePayment/ApInvoicePaymentList" }) },
          },
          {
            path: "Create",
            element: <CreateApInvoicePayment />,
            handle: { crumb: () => ({ text: "Thêm phân bổ mới", value: "/ApInvoicePayment/Create" }) },
          },
          {
            path: "Edit/:id",
            element: <EditApInvoicePayment />,
            handle: { crumb: () => ({ text: "Chỉnh sửa phân bổ", value: "/ApInvoicePayment/Edit" }) },
          },
          {
            path: "Detail/:id",
            element: <DetailApInvoicePayment />,
            handle: { crumb: () => ({ text: "Chi tiết phân bổ", value: "/ApInvoicePayment/Detail" }) },
          },
          {
            path: "Delete/:id",
            element: <DeleteApInvoicePayment />,
            handle: { crumb: () => ({ text: "Xóa phân bổ", value: "/ApInvoicePayment/Delete" }) },
          },
        ],
      },
      {
        path: "/ApActEvent/ApActEventList",
        element: <ApActEventList />,
        handle: { crumb: () => ({ text: "Sự kiện hạch toán", value: "/ApActEvent/ApActEventList" }) },
      },
      {
        path: "/ApActEventHeader/ApActEventHeaderList",
        element: <ApActEventHeaderList />,
        handle: { crumb: () => ({ text: "Header bút toán", value: "/ApActEventHeader/ApActEventHeaderList" }) },
      },
      {
        path: "/ApActEventLine/ApActEventLineList",
        element: <ApActEventLineList />,
        handle: { crumb: () => ({ text: "Dòng bút toán", value: "/ApActEventLine/ApActEventLineList" }) },
      },
    ],
  },
  {
    path: "auth",
    element: <LayoutAuth />,
    children: [
      {
        path: "login",
        element: <LayoutLogin />,
        loader: () => (TEMP_HIDE_LOGIN_PAGE ? redirect("/") : null),
      },
      // Thêm route xác thực khác (register, quên mật khẩu...) tại đây.
    ],
  },
]);

export default router;

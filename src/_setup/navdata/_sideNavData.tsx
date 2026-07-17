import {
  IconBook,
  IconBuildingBank,
  IconCoins,
  IconFileInvoice,
  IconHome,
  IconLayoutGrid,
  IconUser,
  IconBuilding,
  IconSitemap,
  IconCreditCard,
  IconUsersGroup,
  IconListDetails,
  IconMapPin,
  IconHistory,
  IconShoppingCart,
  IconFilePlus,
  IconStack2,
  IconAlertCircle,
  IconWallet,
  IconCalendarDue,
  IconLink,
  IconFileText,
  IconReceipt,
  IconLayoutDashboard,
  IconCash,
  IconReportAnalytics,
  IconPlugConnected,
  IconCalculator,
  IconFileAnalytics,
  IconTimeline,
  IconNotebook,
  IconPencil
} from "@tabler/icons-react";

import {
  LayoutDashboard,
  Settings,
  Layers,
  ArrowLeftRight,
  Receipt,
  BookOpen,
  Database,
  FileText,
  ClipboardList,
  History,
  FileOutput,
  CalendarDays,
  FileSpreadsheet,
  Banknote,
  ChartColumn,
  Plug,
  Building2,
  Files,
  CirclePlus,
  Zap,
  Tag,
  Shuffle,
  PencilLine,
  Wallet,
  Calculator,
  Play,
  CircleAlert,
  Trash2,
  ArrowUpRight
} from "lucide-react";

import { LinksGroupProps } from "../../_base/model/_base/LinksGroupProps";

/**
 * Dữ liệu menu điều hướng bên trái.
 *
 * Mỗi phần tử là 1 phân hệ (`LinksGroupProps`) gồm `label` và mảng `links`.
 * Phân hệ cấp 1 chỉ hiển thị chữ — icon chỉ dùng từ cấp 2 trở xuống.
 * `link` phải khớp với `path` khai báo trong `src/_setup/router/routes.tsx`.
 *
 * `links[].links`: mục con lồng cấp (tuỳ chọn) — hiển thị thụt vào kèm đường dọc
 * phân cấp và gập/mở được bằng chevron bên phải.
 */
export const _sideNavData: LinksGroupProps[] = [
   {
    label: "Danh mục chung",
    initiallyOpened: true,
    links: [
      {
        label: "Sổ cái chính",
        link: "/GlSetOfBook/GlSetOfBookList",
        icon: IconLayoutDashboard,
      },
      {
        label: "Đơn vị hoạt động",
        link: "/HrOperatingUnit/HrOperatingUnitList",
        icon: IconSitemap,
      },
    ],
  },
  {
    label: "Quản lý Kho & Vật tư",
    initiallyOpened: false,
    links: [
      {
        label: "Tổng quan kho",
        link: "/inventory/dashboard",
        icon: LayoutDashboard,
      },
      {
        label: "Thiết lập danh mục",
        link: "/inventory/master-data",
        icon: Settings,
        links: [
          {
            label: "Danh mục Vật tư",
            link: "/inventory/item/list",
            icon: ClipboardList,
          },
          {
            label: "Cấu hình Kho con",
            link: "/inventory/subinventory/setup",
            icon: Settings,
          },
        ],
      },
      {
        label: "Quản lý Tồn kho",
        link: "/inventory/availability",
        icon: Layers,
        links: [
          {
            label: "Tồn kho thực tế",
            link: "/inventory/onhand/list",
            icon: Layers,
          },
        ],
      },
      {
        label: "Giao dịch Kho",
        link: "/inventory/transactions",
        icon: ArrowLeftRight,
        links: [
          {
            label: "Lịch sử Giao dịch",
            link: "/inventory/transaction/history",
            icon: History,
          },
          {
            label: "Nhập/Xuất trực tiếp",
            link: "/inventory/transaction/misc",
            icon: ArrowLeftRight,
          },
          {
            label: "Phiếu Chuyển kho",
            link: "/inventory/transaction/transfer",
            icon: FileOutput,
          },
          {
            label: "Lệnh điều chuyển",
            link: "/inventory/move-orders",
            icon: Receipt,
          },
          {
            label: "Yêu cầu điều chuyển",
            link: "/inventory/move-order/list",
            icon: Receipt,
          },
        ],
      },
      {
        label: "Kế toán & Giá vốn",
        link: "/inventory/costing-workspace",
        icon: BookOpen,
        links: [
          {
            label: "Kỳ kế toán Kho",
            link: "/inventory/period/control",
            icon: CalendarDays,
          },
          {
            label: "Bút toán Định khoản",
            link: "/inventory/costing/accounts",
            icon: BookOpen,
          },
        ],
      },
      {
        label: "Báo cáo Kho",
        link: "/inventory/reports",
        icon: FileText,
        links: [
          {
            label: "Nhập - Xuất - Tồn",
            link: "/inventory/report/nxt",
            icon: FileText,
          },
        ],
      },
      {
        label: "Giám sát tích hợp",
        link: "/inventory/interfaces",
        icon: Database,
      },
    ],
  },


  {
    label: "Công nợ phải thu",
    initiallyOpened: true,
    links: [
      {
        label: "Tổng quan",
        link: "/cong-no-phai-thu/tong-quan",
        icon: LayoutDashboard,
      },
      {
        label: "Hóa đơn phải thu",
        link: "/cong-no-phai-thu/cong-no",
        icon: FileSpreadsheet,
      },
      {
        label: "Phiếu thu tiền khách hàng",
        link: "/cong-no-phai-thu/thu-tien",
        icon: Banknote,
      },
      {
        label: "Kế toán & Báo cáo",
        link: "/cong-no-phai-thu/ke-toan-bao-cao",
        icon: ChartColumn,
      },
      {
        label: "Thiết lập & Tích hợp",
        link: "/cong-no-phai-thu/thiet-lap-tich-hop",
        icon: Plug,
      },
    ],
  },

  {
    label: "Quản lý Tài sản cố định",
    initiallyOpened: false,
    links: [
      {
        label: "Tổng quan",
        link: "/fixed-asset/dashboard",
        icon: LayoutDashboard,
      },
      {
        label: "Ghi tăng & Quản lý",
        icon: Building2,
        links: [
          {
            label: "Bàn làm việc tài sản",
            link: "/fixed-asset/asset/list",
            icon: Building2,
          },
          {
            label: "Chuẩn bị ghi tăng hàng loạt",
            link: "/fixed-asset/mass-addition",
            icon: Files,
          },
          {
            label: "Ghi tăng đầu kỳ",
            link: "/fixed-asset/addition/opening",
            icon: CirclePlus,
          },
          {
            label: "Ghi tăng nhanh",
            link: "/fixed-asset/addition/quick",
            icon: Zap,
          },
        ],
      },
      {
        label: "Thay đổi & Điều chuyển",
        icon: Shuffle,
        links: [
          {
            label: "Thay đổi nhóm tài sản",
            link: "/fixed-asset/lifecycle/reclass",
            icon: Tag,
          },
          {
            label: "Điều chuyển bộ phận",
            link: "/fixed-asset/lifecycle/assignment",
            icon: Shuffle,
          },
          {
            label: "Điều chuyển giữa nhóm",
            link: "/fixed-asset/lifecycle/group-transfer",
            icon: ArrowLeftRight,
          },
          {
            label: "Điều chỉnh thông tin sổ",
            link: "/fixed-asset/lifecycle/book",
            icon: PencilLine,
          },
          {
            label: "Bổ sung nguyên giá XDCB",
            link: "/fixed-asset/lifecycle/cip",
            icon: Wallet,
          },
        ],
      },
      {
        label: "Khấu hao & Thanh lý",
        icon: Calculator,
        links: [
          {
            label: "Phương pháp khấu hao",
            link: "/fixed-asset/depreciation/methods",
            icon: Calculator,
          },
          {
            label: "Chạy khấu hao kỳ mở",
            link: "/fixed-asset/depreciation/run",
            icon: Play,
          },
          {
            label: "Khấu hao ngoài KH & Ghi đè",
            link: "/fixed-asset/depreciation/unplanned",
            icon: CircleAlert,
          },
          {
            label: "Thanh lý tài sản",
            link: "/fixed-asset/depreciation/retirement",
            icon: Trash2,
          },
        ],
      },
      {
        label: "Hạch toán phụ lên sổ cái",
        link: "/fixed-asset/depreciation/accounting",
        icon: ArrowUpRight,
      },
    ],
  },
  {
    label: "Ngân hàng nội bộ",
    initiallyOpened: false,
    links: [
      {
        label: "Ngân hàng",
        link: "/CeBank/CeBankList",
        icon: IconBuilding,
      },
      {
        label: "Chi nhánh ngân hàng",
        link: "/CeBankBranch/CeBankBranchList",
        icon: IconSitemap,
      },
      {
        label: "Tài khoản ngân hàng",
        link: "/CeBankAccount/CeBankAccountList",
        icon: IconCreditCard,
      },
    ],
  },
  {
    label: "Quản lý Mua hàng",
    initiallyOpened: false,
    links: [
      {
        label: "Danh sách nhà cung cấp",
        link: "/ApVendor/ApVendorList",
        icon: IconListDetails,
      },
      {
        label: "Chi nhánh nhà cung cấp",
        link: "/ApVendorSite/ApVendorSiteList",
        icon: IconBuilding,
      },
      {
        label: "Tài khoản chi nhánh",
        link: "/ApVendorSiteAccount/ApVendorSiteAccountList",
        icon: IconBuildingBank,
      },
      {
        label: "Địa chỉ nhà cung cấp",
        link: "/ApVendorAddress/ApVendorAddressList",
        icon: IconMapPin,
      },
      {
        label: "Lịch sử gộp nhà cung cấp",
        link: "/ApVendorMergeHistory/ApVendorMergeHistoryList",
        icon: IconHistory,
      },
    ],
  },
  {
    label: "Quản lý Hợp đồng",
    initiallyOpened: false,
    links: [
      {
        label: "Hợp đồng nhà cung cấp",
        link: "/contract/management",
        icon: IconFileText,
      },
    ],
  },
  {
    label: "Công nợ phải trả",
    initiallyOpened: false,
    links: [
      {
        label: "Hóa đơn mua hàng",
        link: "/ApInvoice/ApInvoiceList",
        icon: IconShoppingCart,
        links: [
          {
            label: "Danh sách hóa đơn",
            link: "/ApInvoice/ApInvoiceList",
            icon: IconFileInvoice,
          },
          {
            label: "Tạo hóa đơn mới",
            link: "/ApInvoice/CreateApInvoice",
            icon: IconFilePlus,
          },
          {
            label: "Lô hóa đơn đầu vào",
            link: "/ApInvoiceBatch/ApInvoiceBatchList",
            icon: IconStack2,
          },
          {
            label: "Lý do khóa giữ hóa đơn",
            link: "/ApHoldDefinition/ApHoldDefinitionList",
            icon: IconAlertCircle,
          },
        ],
      },
      {
        label: "Thanh toán chi trả",
        link: "/ApPayment/ApPaymentList",
        icon: IconWallet,
        links: [
          {
            label: "Phiếu chi thanh toán",
            link: "/ApPayment/ApPaymentList",
            icon: IconWallet,
          },
          {
            label: "Lô thanh toán hàng loạt",
            link: "/ApPaymentBatch/ApPaymentBatchList",
            icon: IconStack2,
          },
          {
            label: "Lịch trả nợ dự kiến",
            link: "/ApPaymentSchedule/ApPaymentScheduleList",
            icon: IconCalendarDue,
          },
        ],
      },
      {
        label: "Điều khoản thanh toán",
        link: "/ApPaymentTerm/ApPaymentTermList",
        icon: IconFileText,
        links: [
          {
            label: "Cấu hình điều khoản",
            link: "/ApPaymentTerm/ApPaymentTermList",
            icon: IconFileText,
          },
          {
            label: "Dòng tỷ lệ điều khoản",
            link: "/ApPaymentTermLine/ApPaymentTermLineList",
            icon: IconListDetails,
          },
          {
            label: "Chiết khấu thanh toán sớm",
            link: "/ApPaymentTermDiscount/ApPaymentTermDiscountList",
            icon: IconReceipt,
          },
        ],
      },
      {
        label: "Hạch toán & Đối chiếu",
        link: "/ApInvoicePayment/ApInvoicePaymentList",
        icon: IconCalculator,
        links: [
          {
            label: "Phân bổ đối trừ hóa đơn",
            link: "/ApInvoicePayment/ApInvoicePaymentList",
            icon: IconLink,
          },
          {
            label: "Chi tiết phân bổ hóa đơn",
            link: "/ApInvoiceDistribution/ApInvoiceDistributionList",
            icon: IconFileAnalytics,
          },
          {
            label: "Sự kiện hạch toán",
            link: "/ApActEvent/ApActEventList",
            icon: IconTimeline,
          },
          {
            label: "Header bút toán",
            link: "/ApActEventHeader/ApActEventHeaderList",
            icon: IconNotebook,
          },
          {
            label: "Dòng bút toán",
            link: "/ApActEventLine/ApActEventLineList",
            icon: IconPencil,
          },
        ],
      },
    ],
  },
];

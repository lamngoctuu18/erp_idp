# Kế hoạch chỉnh sửa giao diện module Inventory (INV)

## 1. Căn cứ đối chiếu

- Tài liệu nghiệp vụ/database: `C:\Users\84916\Downloads\Tài liệu mô tả database module ql Kho.pdf`
- Code giao diện hiện tại:
  - `src/views/inventory/**`
  - `src/model/InventoryModel.ts`
  - `src/api/inventory/api.ts`
  - `src/_setup/router/routes.tsx`
  - `src/_setup/navdata/_sideNavData.tsx`

## 2. Phạm vi nghiệp vụ trong tài liệu

Tài liệu mô tả module vật tư theo hướng Oracle Inventory, gồm các nhóm chính:

1. Danh mục và cấu hình:
   - Organization vật tư, kho con, locator.
   - Item master, category, UOM, UOM conversion, revision.
   - Cost group, account alias, kỳ kế toán kho.

2. Tồn kho và giao dịch:
   - Nhập kho Misc.
   - Xuất kho Misc.
   - Chuyển kho nội bộ.
   - Chuyển kho giữa hai organization.
   - Nhập kho từ PO, trả hàng nhà cung cấp.
   - Booked/Release/Ship Sales Order.
   - WIP completion, WIP assembly return, WIP material issue.
   - Cập nhật giá trung bình, FIFO layer.
   - Move Order.
   - PROD-OPM nhập/xuất sản xuất.

3. Interface/import:
   - Import danh mục vật tư qua `MTL_SYSTEM_ITEMS_INTERFACE`.
   - Import gán category qua `MTL_ITEM_CATEGORIES_INTERFACE`.
   - Import kho giới hạn qua `MTL_ITEM_SUB_INVS_INTERFACE`.
   - Import revision qua `MTL_ITEM_REVISIONS_INTERFACE`.
   - Import giao dịch qua `MTL_TRANSACTIONS_INTERFACE` và `MTL_TRANSACTION_LOT_INTERFACE`.

## 3. Hiện trạng giao diện INV

Module hiện tại đã có nền khá tốt cho bản demo nghiệp vụ:

- Danh mục vật tư: list/create/detail, có tab thông tin chung, kiểm soát kho, mua bán, costing.
- Kho con/locator: có màn hình cấu hình kho con và locator.
- Tồn kho: có báo cáo on-hand theo item/kho/locator/lot.
- Giao dịch kho: có nhập/xuất Misc, chuyển kho nội bộ/liên org, lịch sử giao dịch.
- Move Order: có tạo yêu cầu, duyệt, allocate mô phỏng, transact.
- Kế toán kho: có kỳ kế toán, bút toán định khoản, báo cáo NXT.

Điểm mạnh là UI đã bám một phần các bảng lõi như `MTL_MATERIAL_TRANSACTIONS`, `MTL_ONHAND_QUANTITIES_DETAIL`, `MTL_TRANSACTION_ACCOUNTS`, lot/locator và kỳ kế toán.

## 4. Gap chính so với nghiệp vụ chuẩn

### 4.1. Thiếu workspace theo vòng đời nghiệp vụ

Menu hiện tại đang là danh sách màn hình rời. Với module kho, người dùng cần đi theo vòng đời:

`Thiết lập -> Danh mục -> Tồn kho -> Giao dịch -> Interface/import -> Costing/GL -> Báo cáo`

Nên cần gom lại thành các workspace có tab, filter và action thống nhất.

### 4.2. Thiếu Interface Monitor

Tài liệu nhấn mạnh import qua interface table, nhưng UI hiện chưa có màn hình để:

- Theo dõi batch import item/giao dịch.
- Xem `Process_Flag`: Pending, Processed, Error.
- Xem `Transaction_Mode`, `Source_Code`, `Source_Header_ID`, `Source_Line_ID`.
- Xem lỗi xử lý và cho phép sửa/reprocess.
- Xem dữ liệu lot interface cho giao dịch quản lý theo lô.

Đây là gap lớn nhất nếu muốn giao diện chuẩn ERP hơn.

### 4.3. Form giao dịch chưa hiển thị đủ cấu trúc Oracle INV

Các form Misc/Transfer hiện có header + line, nhưng cần chuẩn hóa thêm:

- Header nguồn phát sinh: source code, source header, source type, transaction source.
- Transaction type/action/source type rõ ràng.
- UOM giao dịch và primary quantity tự quy đổi, hiển thị cạnh nhau.
- Account alias/distribution account ở header hoặc line tùy loại giao dịch.
- Lot number + expiration date cho item quản lý lot.
- Locator bắt buộc theo policy item/kho con.
- Kỳ kế toán mở, trạng thái costed, lỗi cost/accounting.
- Preview tác động tồn kho, cost, GL trước khi hoàn tất.

### 4.4. Costing còn đơn giản

UI hiện có bút toán và đơn giá, nhưng chưa có view chuẩn cho:

- Actual cost detail.
- Transaction cost detail.
- Average cost update.
- FIFO layer/cost layer.
- Cost variance khi âm kho hoặc hết lượng còn giá trị.

### 4.5. Các luồng PO/SO/WIP/OPM chưa thành màn hình nghiệp vụ

Tài liệu có các luồng liên phân hệ:

- PO receipt/return liên kết `RCV_TRANSACTIONS`.
- Sales Order booking/release/ship liên kết demand/reservation/source line.
- WIP completion/return/material issue liên kết `WIP_ENTITY_ID`.
- PROD-OPM liên kết batch/material detail.

UI hiện chỉ có Misc, Transfer và Move Order. Cần ít nhất có màn hình placeholder nghiệp vụ hoặc workbench để biểu diễn nguồn phát sinh và drill-down liên kết.

### 4.6. UX chưa đồng nhất giữa các màn hình

Cần chuẩn hóa:

- Header trang: breadcrumb, tiêu đề, mô tả ngắn, action chính.
- Thanh lọc dữ liệu: organization, kỳ, kho con, item, trạng thái.
- Bảng: density gọn, sticky header, pinned action, format số/tiền thống nhất.
- Detail: dùng drawer/tabs thay vì nhiều modal lớn rời rạc.
- Badge trạng thái dùng chung cho item, period, transaction, move order, interface.
- Line grid nhập liệu dùng chung pattern: item, kho, locator, lot, UOM, qty, primary qty, cost, account, reason.

## 5. Đề xuất cấu trúc giao diện chuẩn hơn

### 5.1. Inventory Dashboard

Mục tiêu: vào module là thấy tình trạng vận hành kho, không phải trang marketing.

Thành phần:

- KPI gọn: tổng giá trị tồn, số giao dịch hôm nay, giao dịch lỗi interface, kỳ đang mở.
- Bảng cảnh báo: tồn âm, lot sắp hết hạn, giao dịch chưa costed, move order chờ xử lý.
- Lối tắt thao tác: nhập/xuất Misc, chuyển kho, tạo Move Order.

### 5.2. Setup Workspace

Tabs đề xuất:

- Organizations & Parameters.
- Subinventories.
- Locators.
- UOM & Conversions.
- Account Aliases.
- Transaction Types.

Ưu tiên sửa từ màn hình hiện có: `SubinventorySetup`.

### 5.3. Item Master Workspace

Tabs đề xuất:

- Danh sách vật tư.
- Khai báo/chi tiết vật tư.
- Category Assignment.
- UOM & Revision.
- Item Subinventory Restrictions.
- Costing & Accounts.
- Interface Import.

Các bổ sung quan trọng:

- Hiển thị Master Org và các child org đã assign.
- Có batch import item với `Set_Process_ID`, `Process_Flag`, `Transaction_Type`.
- Có log category/revision/subinventory interface.

### 5.4. On-hand & Availability Workspace

Tabs đề xuất:

- On-hand detail.
- Lot/expiration.
- Reservations.
- Demand/Sales Order.
- Availability/ATT.
- Transaction drill-down.

Các bổ sung quan trọng:

- Tách rõ Physical, Allocated, Reserved, Available To Transact.
- Drill-down từ dòng tồn kho sang lịch sử giao dịch và lot/cost layer.
- Cảnh báo tồn âm hoặc hết hạn lô.

### 5.5. Transaction Workbench

Đây nên là khu vực trọng tâm của INV.

Tabs đề xuất:

- Misc Receipt/Issue.
- Subinventory Transfer.
- Inter-Org Transfer.
- PO Receipt/Return.
- SO Release/Ship.
- WIP/Production Transactions.
- Average/FIFO Cost Update.
- Transaction History.

Pattern chuẩn cho mọi form giao dịch:

- Header: Organization, Transaction Date, Accounting Period, Transaction Type, Source, Document Number, Account Alias, Status.
- Lines: Item, UOM, Quantity, Primary Quantity, From/To Subinventory, From/To Locator, Lot, Lot Expiration, Unit Cost, Distribution Account, Reason.
- Preview: On-hand impact, lot impact, costing impact, GL entries.
- Submit: tạo giao dịch, sau đó mở detail drawer.

### 5.6. Move Order Workspace

Tabs đề xuất:

- Request list.
- Create request.
- Approval queue.
- Allocation/Pick.
- Transact/Close.

Các bổ sung:

- Timeline trạng thái: Incomplete -> Pending Approval -> Approved -> Allocated -> Transacted/Closed.
- Hỗ trợ partial allocation/partial delivery.
- Thể hiện reservation hoặc phân bổ lot/locator rõ ràng.

### 5.7. Costing & Accounting Workspace

Tabs đề xuất:

- Transaction Accounts.
- Actual Cost Details.
- Transaction Cost Details.
- Average Cost Update.
- FIFO Layers.
- Period Control.
- Period Close Checklist.

Các bổ sung:

- Khi đóng kỳ, hiển thị checklist: giao dịch lỗi interface, giao dịch chưa costed, bút toán thiếu, tồn âm.
- Từ transaction detail drill-down được sang accounting/cost details.


### 5.8. Interface Monitor

Màn hình mới nên có hai nhóm:

1. Item Interface:
   - `MTL_SYSTEM_ITEMS_INTERFACE`
   - `MTL_ITEM_CATEGORIES_INTERFACE`
   - `MTL_ITEM_SUB_INVS_INTERFACE`
   - `MTL_ITEM_REVISIONS_INTERFACE`

2. Material Transaction Interface:
   - `MTL_TRANSACTIONS_INTERFACE`
   - `MTL_TRANSACTION_LOT_INTERFACE`

Chức năng:

- Danh sách batch theo `Set_Process_ID`/source.
- Trạng thái pending/processed/error.
- Xem lỗi, sửa nhanh dòng lỗi, reprocess.
- Import file Excel/CSV.
- Export error report.

## 6. Kế hoạch triển khai theo pha

### Pha 1 - Chuẩn hóa khung UI và navigation

Mục tiêu:

- Tạo `InventoryModuleLayout` giống cách tổ chức module AR nhưng gọn và thiên về thao tác ERP.
- Gom menu thành nhóm workspace thay vì danh sách rời.
- Chuẩn hóa page header, filter bar, action bar, status badge.

Kết quả:

- Người dùng vào INV thấy cấu trúc nghiệp vụ rõ.
- Các màn hình list/form dùng chung layout.

Ưu tiên: Cao.

### Pha 2 - Chuẩn hóa Item Master và Setup

Mục tiêu:

- Nâng cấp item create/detail thành item workbench.
- Bổ sung category, UOM conversion, revision, item-subinventory restriction.
- Chuẩn hóa subinventory/locator/account alias.

Kết quả:

- Danh mục vật tư bám đủ phần interface item trong tài liệu.
- Dữ liệu thiết lập đủ để validate giao dịch.

Ưu tiên: Cao.

### Pha 3 - Chuẩn hóa Transaction Workbench

Mục tiêu:

- Chuẩn hóa form Misc và Transfer theo cùng pattern header/line/preview.
- Bổ sung transaction source, primary quantity, lot expiration, account distribution, period validation.
- Detail drawer có tabs: Material, Lot, On-hand, Cost, GL, Interface/Error.

Kết quả:

- Nhập/xuất/chuyển kho minh bạch đúng nghiệp vụ hơn.
- Người dùng thấy giao dịch tác động tới tồn, cost và GL như thế nào.

Ưu tiên: Rất cao.

### Pha 4 - Bổ sung Interface Monitor

Mục tiêu:

- Thêm model/API mock cho item interface và material transaction interface.
- Thêm màn hình batch import, trạng thái xử lý, lỗi, reprocess.
- Kết nối với item/giao dịch hiện tại.

Kết quả:

- Lấp gap lớn nhất với tài liệu Oracle INV.
- Có đường kiểm tra lỗi import và audit rõ ràng.

Ưu tiên: Rất cao.

### Pha 5 - Bổ sung luồng PO/SO/WIP/Production ở mức workbench

Mục tiêu:

- Thêm các tab/màn hình nghiệp vụ cho PO Receipt/Return, SO Release/Ship, WIP Completion/Issue/Return, OPM Production.
- Giai đoạn đầu có thể làm dạng workbench mô phỏng nguồn phát sinh, source id và giao dịch kho sinh ra.

Kết quả:

- UI bao phủ đầy đủ các luồng được nêu trong tài liệu.
- Có nền để tích hợp module PO/SO/WIP sau này.

Ưu tiên: Trung bình đến cao.

### Pha 6 - Nâng cấp Costing, kỳ kế toán và báo cáo

Mục tiêu:

- Thêm cost layer/average cost/FIFO layer.
- Thêm period close checklist.
- Nâng NXT, on-hand, transaction account thành report có drill-down.

Kết quả:

- Module INV có đủ khía cạnh kế toán kho.
- Báo cáo có thể truy ngược tới transaction nguồn.

Ưu tiên: Trung bình.

### Pha 7 - Kiểm thử, dữ liệu mẫu và polish

Mục tiêu:

- Tạo test scenario theo tài liệu: Misc receipt, Misc issue, sub transfer, inter-org transfer, lot item, Move Order, period close.
- Chuẩn hóa format số, tiền, ngày, badge, empty state, loading state.
- Kiểm tra responsive/horizontal scroll cho bảng ERP.

Kết quả:

- Demo nghiệp vụ ổn định, ít lỗi thao tác.
- UI nhìn đồng nhất, gọn, đúng chất phần mềm vận hành.

Ưu tiên: Cao sau khi hoàn tất Pha 1-6.

## 7. Thứ tự ưu tiên đề xuất

1. Pha 1: layout + navigation workspace.
2. Pha 3: transaction workbench cho Misc/Transfer/History.
3. Pha 4: interface monitor.
4. Pha 2: item/setup workbench.
5. Pha 6: costing/period/report.
6. Pha 5: PO/SO/WIP/OPM.
7. Pha 7: test, polish, dữ liệu mẫu.

Lý do: giao dịch và interface là phần khác biệt lớn nhất giữa UI hiện tại và tài liệu nghiệp vụ. Sau khi chuẩn hóa hai vùng này, các phần setup/report/costing sẽ dễ nối vào hơn.

## 8. Tiêu chí nghiệm thu

- Mỗi nghiệp vụ chính trong tài liệu có ít nhất một tab/workbench tương ứng hoặc placeholder có mô tả nguồn dữ liệu.
- Mọi giao dịch kho tạo ra đều xem được:
  - material transaction,
  - lot detail nếu có,
  - on-hand impact,
  - costing impact,
  - accounting entries,
  - interface/error log nếu phát sinh từ import.
- Form giao dịch validate được:
  - kỳ kế toán mở,
  - tồn kho khả dụng,
  - bắt buộc locator theo setup,
  - bắt buộc lot theo item,
  - UOM/primary quantity,
  - account distribution.
- Interface monitor có trạng thái pending/processed/error và thao tác reprocess.
- UI dùng chung layout, filter bar, status badge, table density, format số/tiền/ngày.
- Người dùng có thể drill-down từ báo cáo NXT/on-hand/GL về giao dịch nguồn.

## 9. Rủi ro cần lưu ý

- Nếu chỉ sửa UI mà không mở rộng model/API mock, giao diện sẽ đẹp hơn nhưng vẫn thiếu nghiệp vụ interface/costing.
- PO/SO/WIP/OPM phụ thuộc module khác, nên nên làm theo hướng source workbench trước, tích hợp thật sau.
- Costing FIFO/average phức tạp; nên bắt đầu bằng hiển thị layer và mô phỏng công thức, chưa cần tính đầy đủ như Oracle ngay.
- Cần thống nhất thuật ngữ Việt-Anh: item, subinventory, locator, lot, transaction, costed, interface, account alias.



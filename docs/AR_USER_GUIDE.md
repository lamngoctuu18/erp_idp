# Hướng dẫn sử dụng phân hệ AR demo

Phân hệ AR hiện được tổ chức theo nhóm công việc của người dùng, không theo từng bảng dữ liệu hoặc từng API nhỏ. Sidebar chỉ giữ 5 nhóm chính:

1. Tổng quan
2. Công nợ phải thu
3. Thu tiền & Cấn trừ
4. Kế toán & Báo cáo
5. Thiết lập & Tích hợp

## 1. Tổng quan

Vào `Tổng quan` để xem nhanh tình hình công nợ:

- Tổng công nợ phải thu.
- Công nợ quá hạn.
- Tiền đã thu.
- Phiếu thu chưa cấn trừ.
- Lỗi AutoInvoice.
- Sự kiện kế toán chưa xử lý.

Các thẻ trên Dashboard có thể bấm để đi thẳng đến workspace liên quan. Ví dụ bấm `Công nợ quá hạn` sẽ mở `Công nợ phải thu` với bộ lọc quá hạn.

## 2. Công nợ phải thu

Workspace này gom các nghiệp vụ liên quan đến khoản phải thu:

- `Hóa đơn`: quản lý hóa đơn AR, trạng thái, số tiền đã thu, giảm trừ và còn phải thu.
- `Credit Memo`: quản lý chứng từ giảm trừ.
- `Điều chỉnh`: quản lý adjustment công nợ.

Trong danh sách hóa đơn, thao tác nhanh phụ thuộc trạng thái chứng từ:

- `DRAFT`: sửa, xóa, complete.
- `OPEN`: apply tiền, tạo Credit Memo, tạo Adjustment, void.
- `PAID`: xem chi tiết, xem hạch toán.
- `VOID`: chỉ xem.

Trong chi tiết hóa đơn, dùng các tab:

- `Tổng quan`: thông tin hóa đơn, khách hàng, tổng tiền, đã thu, credit, adjustment, còn phải thu.
- `Dòng hóa đơn`: xem và chỉnh dòng hóa đơn.
- `Lịch thanh toán`: xem từng kỳ hạn và số dư còn lại.
- `Thu tiền & Cấn trừ`: xem phiếu thu đã apply, apply thêm hoặc unapply.
- `Giảm trừ & Điều chỉnh`: tạo hoặc xem Credit Memo và Adjustment.
- `Hạch toán`: tạo draft/final accounting và xem bút toán.
- `Lịch sử`: timeline thao tác trên hóa đơn.

## 3. Thu tiền & Cấn trừ

Workspace này gom phiếu thu và application:

- `Phiếu thu`: danh sách phiếu thu khách hàng.
- `Khoản đã cấn trừ`: các dòng application đã phát sinh.
- `Chưa phân bổ`: các phiếu thu còn unapplied amount.
- `On-account`: tiền thu để treo theo khách hàng.

Chi tiết phiếu thu có 4 tab:

- `Tổng quan`: hiển thị phương trình `Tổng phiếu thu = Đã Apply + Chưa Apply + Unidentified + On-account`.
- `Cấn trừ công nợ`: chọn hóa đơn mở, nhập số tiền và apply ngay bằng drawer.
- `Lịch sử`: xem apply, unapply, reverse và cập nhật trạng thái.
- `Hạch toán`: xem accounting event và journal line của phiếu thu.

Có hai cách apply tiền:

1. Từ phiếu thu: `Thu tiền & Cấn trừ` → chọn phiếu thu → `Cấn trừ công nợ` → chọn hóa đơn → xác nhận apply.
2. Từ hóa đơn: `Công nợ phải thu` → chọn hóa đơn → `Apply tiền` → hệ thống đưa sang danh sách phiếu thu phù hợp.

Khi `Reverse` phiếu thu, màn hình hiển thị trước số application sẽ bị đảo, số hóa đơn bị ảnh hưởng và số tiền công nợ sẽ được mở lại.

## 4. Kế toán & Báo cáo

Workspace này gom báo cáo và xử lý kế toán AR:

- `Số dư khách hàng`: tổng hóa đơn, đã thu, credit, adjustment, còn phải thu và quá hạn.
- `Tuổi nợ`: nhóm công nợ theo bucket chưa đến hạn, 1-30, 31-60, 61-90, trên 90 ngày.
- `Accounting Events`: xem event, trạng thái draft/final, trạng thái transfer.
- `GL Transfer Demo`: mô phỏng batch chuyển GL nội bộ.
- `Đối soát`: so sánh debit, credit, transferred, pending và event lỗi.

Lưu ý: `GL Transfer Demo` chỉ là mô phỏng nội bộ, chưa gửi sang hệ thống GL thật.

## 5. Thiết lập & Tích hợp

Workspace này dành cho cấu hình và chức năng ít dùng:

- `Thiết lập AR`: nguồn giao dịch, loại giao dịch, payment term, receipt method, bank account, receivable activity, distribution set.
- `AutoInvoice`: import, validate, xem lỗi, process và xem hóa đơn kết quả.
- `Khuyến mại`: quản lý chương trình khuyến mại, sản phẩm áp dụng, hiệu lực và mức giảm.
- `Công cụ Demo`: FX Revaluation, Period Closing Validation, Copy Transaction và tạo dữ liệu mẫu.

Các cấu hình liên quan AR/AP Netting đã được loại khỏi menu demo vì phạm vi hiện tại chỉ là AR.

## Luồng demo khuyến nghị

1. Vào `Thiết lập & Tích hợp` để kiểm tra Transaction Source, Transaction Type và Payment Term.
2. Vào `Công nợ phải thu` → `Hóa đơn` → tạo hóa đơn.
3. Thêm dòng hóa đơn, kiểm tra VAT, discount và voucher.
4. Complete hóa đơn.
5. Mở chi tiết hóa đơn và xem `Lịch thanh toán`.
6. Vào `Thu tiền & Cấn trừ` → tạo phiếu thu.
7. Clear phiếu thu nếu cần.
8. Mở chi tiết phiếu thu → tab `Cấn trừ công nợ` → apply vào hóa đơn.
9. Quay lại hóa đơn để xem số dư còn phải thu giảm.
10. Tạo Credit Memo hoặc Adjustment nếu cần.
11. Vào tab `Hạch toán` để tạo Draft Accounting và Final Accounting.
12. Vào `Kế toán & Báo cáo` → `GL Transfer Demo` để mô phỏng chuyển GL.
13. Kiểm tra `Số dư khách hàng`, `Tuổi nợ` và `Đối soát`.


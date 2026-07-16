# IDP React Base

Bộ khung (base / starter) để khởi tạo nhanh các ứng dụng quản trị nội bộ. Đã dựng sẵn:
xác thực (đăng nhập/token), layout + điều hướng, gọi API chuẩn hoá, thông báo, và **một module CRUD mẫu** để copy.

Stack: **React 18 + TypeScript + Create React App**, UI **Mantine 7** (+ `mantine-react-table`),
**Syncfusion** (document editor / pdf / diagram), **axios**, **react-router-dom 6**, **socket.io-client**.

## Chạy dự án

```bash
npm install
cp .env.example .env   # rồi điền REACT_APP_API_URL / REACT_APP_AUTH_API_URL
npm start              # chạy dev tại http://localhost:3000
npm run build          # build production
```

> CRA chỉ nạp biến môi trường có tiền tố `REACT_APP_` và **cần restart** `npm start` sau khi sửa `.env`.

**Tài khoản mẫu** (đăng nhập không cần backend, chỉ để thiết kế/demo): `admin` / `admin@123`
— khai báo tại `src/_base/component/_login/_login.tsx` (`DEMO_ACCOUNT`), xóa khi tích hợp API xác thực thật.

## Cấu trúc thư mục

```
src/
├── _base/                     # Khung tái sử dụng — KHÔNG chứa code nghiệp vụ
│   ├── component/
│   │   ├── _layout/           # Layout1, LayoutAuth, breadcrumb, 401/404, navbar
│   │   ├── _login/ _register/ # Trang đăng nhập / đăng ký
│   │   ├── Core/              # DataTable, ConfigurableTable, ButtonGroup, ContentSearchMenu
│   │   └── socket/            # socket.io client (realtime)
│   ├── helper/                # HttpHelper (Repository/axios), IAuthProvider, FunctionHelper
│   ├── extension/             # NotificationExtension, StringExtension
│   ├── model/                 # Model dùng chung của khung (BaseEntity, LinksGroupProps...)
│   └── _const/_constVar.tsx   # Khởi tạo các Repository theo base URL
├── _setup/
│   ├── router/routes.tsx      # Khai báo route
│   └── navdata/_sideNavData.tsx # Menu điều hướng trái
├── api/                       # Hàm gọi API theo module (vd api/example)
├── model/                     # Interface dữ liệu theo module (vd ExampleModel)
├── views/
│   ├── _example/              # ⭐ Module CRUD mẫu — copy để tạo module mới
│   ├── home/ ProFile/         # View mẫu (demo Syncfusion)
│   └── ...
├── config/                    # Base URL API (đọc từ .env)
└── common/                    # Tiện ích dùng chung (FormatDate...)
```

## Thêm một module mới

Xem hướng dẫn chi tiết: [docs/them-module-moi.md](docs/them-module-moi.md).
Tóm tắt: copy `src/views/_example` → đổi tên, tạo `model` + `api` tương ứng, khai báo route trong
`routes.tsx` và menu trong `_sideNavData.tsx`.

## Nhánh git

- `base` — bộ base này (đang dùng).
- `TuFE` / `erp-full` — bản ERP IDP đầy đủ (nhiều module nghiệp vụ), giữ lại để maintain riêng.

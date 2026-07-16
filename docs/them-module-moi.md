# Hướng dẫn thêm một module mới

Base đi kèm module mẫu tại `src/views/_example` (List / Create / Edit / Detail).
Cách nhanh nhất để tạo module mới là **copy module mẫu rồi đổi tên**.

Giả sử tạo module `Product`:

## 1. Model

Tạo `src/model/ProductModel.tsx`:

```ts
export interface ProductModel {
  id: number;
  code: string;
  name: string;
  price: number;
  isActive: boolean;
  createdDate?: string | Date;
}
```

## 2. API

Tạo `src/api/product/api.ts` (tham khảo `src/api/example/api.ts`):

```ts
import { repository } from "../../_base/_const/_constVar";
import { ProductModel } from "../../model/ProductModel";

const PREFIX = "/api/v1/Product";

export const getProductList = (p: { skip: number; take: number; keySearch?: string }) => {
  let url = `${PREFIX}/get-list?Skip=${p.skip}&Take=${p.take}`;
  if (p.keySearch) url += `&KeySearch=${encodeURIComponent(p.keySearch)}`;
  return repository.get(url);
};
export const getProductById = (id: number | string) => repository.get(`${PREFIX}/detail?id=${id}`);
export const createProduct = (data: Partial<ProductModel>) => repository.post(`${PREFIX}/create`, data);
export const updateProduct = (data: Partial<ProductModel>) => repository.put(`${PREFIX}/update`, data);
export const deleteProduct = (id: number) => repository.post(`${PREFIX}/delete`, { id });
```

> `repository` gọi tới `REACT_APP_API_URL`. Nếu cần backend khác, thêm 1 export URL trong
> `src/config/index.ts` và 1 `Repository` mới trong `src/_base/_const/_constVar.tsx`.

## 3. View

```bash
cp -r src/views/_example src/views/Product
```

Trong 4 file `ExampleList/Create/Edit/Detail.tsx`:
- Đổi import `ExampleModel` → `ProductModel`, `api/example/api` → `api/product/api`.
- Đổi các đường dẫn `"/example/..."` → `"/product/..."`.
- Sửa cột bảng (`columns`) và các field form cho khớp `ProductModel`.

Các thành phần tái sử dụng có sẵn:
- `DataTable` (`src/_base/component/Core/DataTable.tsx`) — khung bảng List chuẩn:
  tự thêm cột STT + "Thao tác", phân trang server-side, localization tiếng Việt.
  Chỉ cần truyền `columns` (cột dữ liệu) + `renderRowActions` (xem `ExampleList.tsx`).
- `ConfigurableTable` (`src/_base/component/Core/ConfigurableTable.tsx`) nếu cần bảng ẩn/hiện & kéo-thả cột.
- `BreadCrumb` (`src/_base/component/_layout/_breadcrumb`) — tự đọc `handle.crumb` của route.
- `NotificationExtension.Success/Fails/Warn` cho thông báo.
- `formatDateTime` (`src/common/FormatDate/FormatDate`) để định dạng ngày.

## 4. Route

Thêm khối vào mảng `children` trong `src/_setup/router/routes.tsx`:

```tsx
{
  path: "/product",
  handle: { crumb: () => ({ text: "Sản phẩm", value: "/product" }) },
  children: [
    { index: true, loader: () => redirect("/product/list") },
    { path: "list",       element: <ProductList />,   handle: { crumb: () => ({ text: "Danh sách",  value: "/product/list" }) } },
    { path: "create",     element: <ProductCreate />, handle: { crumb: () => ({ text: "Thêm mới",   value: "/product/create" }) } },
    { path: "edit/:id",   element: <ProductEdit />,   handle: { crumb: () => ({ text: "Chỉnh sửa",  value: "/product/edit" }) } },
    { path: "detail/:id", element: <ProductDetail />, handle: { crumb: () => ({ text: "Chi tiết",   value: "/product/detail" }) } },
  ],
}
```

Đừng quên `import` 4 component ở đầu file.

## 5. Menu điều hướng

Thêm nhóm vào `src/_setup/navdata/_sideNavData.tsx` (`link` phải khớp `path` ở bước 4):

```tsx
{
  label: "Sản phẩm",
  icon: IconBox,
  initiallyOpened: false,
  links: [
    { label: "Danh sách", link: "/product/list" },
    { label: "Thêm mới",  link: "/product/create" },
  ],
}
```

## 6. Kiểm tra

```bash
npx tsc --noEmit   # không còn lỗi type/import
npm start          # vào /product/list thử luồng List → Create → Edit → Detail → Delete
```

import { BASE_API_URL, BASE_API_AUTH_URL } from "../../config";
import Repository from "../helper/HttpHelper";

// URL dự phòng để app không crash khi dev chưa tạo `.env`.
// Hãy khai báo REACT_APP_API_URL / REACT_APP_AUTH_API_URL trong `.env` (xem `.env.example`).
const FALLBACK_API = "http://localhost:5000/api/v1";

if (!BASE_API_URL || !BASE_API_AUTH_URL) {
  // eslint-disable-next-line no-console
  console.warn(
    `[base] Thiếu REACT_APP_API_URL / REACT_APP_AUTH_API_URL trong .env — đang dùng URL mặc định ${FALLBACK_API}`
  );
}

// Repository cho API nghiệp vụ chính.
export const repository = new Repository(BASE_API_URL || FALLBACK_API);

// Repository cho API xác thực (đăng nhập, phân quyền...).

export const styleTableMantine = {
  padding: "6px 12px",
};

export const repositoryAuth = new Repository(BASE_API_AUTH_URL || "https://auth.idps.cloud/");


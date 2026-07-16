import axios, { AxiosInstance } from "axios";

import { isNullOrEmpty } from "../extension/StringExtension";
import { DelayTask } from "./FunctionHelper";
import { NotificationExtension } from "../extension/NotificationExtension";
import { modals } from "@mantine/modals";
import { IAuthProvider } from "../model/_base/AuthProvider";
import { AuthProvider } from "./IAuthProvider";
import { nprogress } from "@mantine/nprogress";
import { notifications } from "@mantine/notifications";
import { BASE_API_AUTH_URL } from "../../config";

const DEFAULT_REQUEST_TIMEOUT_MS = 15000;
const AUTH_REQUEST_TIMEOUT_MS = 12000;

type RequestOptions = {
  silent?: boolean;
  timeoutMs?: number;
};

class Repository {
  private axiosInstance: AxiosInstance;
  constructor(baseURL?: string) {
    const token = localStorage.getItem("token");
    if (isNullOrEmpty(baseURL)) throw Error("Lỗi base url env !");
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        Authorization: `Bearer ${token?.replace(`"`, "").replace(`"`, "")}`,
      },
      withCredentials: true,
      timeout: DEFAULT_REQUEST_TIMEOUT_MS,
    });

    // Axios Response Interceptor for Silent Refresh Flow
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalConfig = error.config;
        
        // Tránh loop vô tận bằng cách check _retry và không refresh khi gọi chính API auth
        if (
          error.response &&
          error.response.status === 401 &&
          !originalConfig._retry &&
          originalConfig.url &&
          !originalConfig.url.includes("/auth/login") &&
          !originalConfig.url.includes("/auth/verify-login-otp") &&
          !originalConfig.url.includes("/auth/refresh")
        ) {
          originalConfig._retry = true;
          try {
            const authBaseUrl = (BASE_API_AUTH_URL || "https://auth.idps.cloud/").replace(/\/+$/, "");
            const refreshUrl = `${authBaseUrl}/api/v1/auth/refresh`;
            const refreshResponse = await axios.post(
              refreshUrl,
              {},
              { withCredentials: true, timeout: AUTH_REQUEST_TIMEOUT_MS }
            );

            let newAccessToken = "";
            if (refreshResponse.data) {
              if (refreshResponse.data.jwt) {
                newAccessToken = refreshResponse.data.jwt;
              } else if (refreshResponse.data.accessToken) {
                newAccessToken = refreshResponse.data.accessToken;
              } else if (refreshResponse.data.data) {
                newAccessToken =
                  refreshResponse.data.data.jwt ||
                  refreshResponse.data.data.accessToken ||
                  "";
              }
            }

            if (newAccessToken) {
              localStorage.setItem("token", newAccessToken);
              // Cập nhật token cho request retry
              if (originalConfig.headers) {
                originalConfig.headers["Authorization"] = `Bearer ${newAccessToken}`;
              }
              return this.axiosInstance(originalConfig);
            }
          } catch (refreshError) {
            // Refresh thất bại (Refresh Token hết hạn), để trôi lỗi xuống HanderResponse xử lý logout
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );
  }
  public async get<T = any>(url: string, notShowMessenger?: boolean) {
    notifications.clean();
    nprogress.start();
    const token = localStorage.getItem("token");

    try {
      var res = await this.axiosInstance.get<T>(url, {
        headers: {
          Authorization: `Bearer ${token?.replace(`"`, "").replace(`"`, "")}`,
        },
      });
      return res.data;
    } catch (error: any) {
      if (!notShowMessenger) {
        await this.HanderResponse(error);
        // DbExtension.addData<ILogging>(Tables.Logging, {
        //   message: "POST DATA FROM API ERROR !",
        //   router: url,
        //   error: JSON.stringify(error),
        //   errorReponse: JSON.stringify(error.response),
        // });
      }
      //  return null;
    } finally {
      nprogress.complete();
      // DbExtension.addData<ILogging>(Tables.Logging, {
      //   message: "GET DATA FROM API !",
      //   router: url,
      // });
    }
  }

  public async post<T = any>(
    url: string,
    data?: any,
    isPass: boolean = false,
    options?: RequestOptions
  ) {
    if (!options?.silent) {
      notifications.clean();
      nprogress.start();
    }
    const token = localStorage.getItem("token");
    try {
      var res = await this.axiosInstance.post<T>(url, data, {
        headers: {
          Authorization: `Bearer ${token?.replace(`"`, "").replace(`"`, "")}`,
        },
        timeout: options?.timeoutMs ?? DEFAULT_REQUEST_TIMEOUT_MS,
      });
      return res.data;
    } catch (error: any) {
      if (!isPass) await this.HanderResponse(error);
      // DbExtension.addData<ILogging>(Tables.Logging, {
      //   message: "POST DATA FROM API ERROR !",
      //   router: url,
      //   data: JSON.stringify(data),
      //   error: JSON.stringify(error),
      //   errorReponse: JSON.stringify(error.response),
      // });
    } finally {
      if (!options?.silent) nprogress.complete();
      // DbExtension.addData<ILogging>(Tables.Logging, {
      //   message: "POST DATA FROM API !",
      //   router: url,
      //   data: JSON.stringify(data),
      // });
    }
  }

  public async put<T = any>(url: string, data?: any) {
    notifications.clean();
    nprogress.start();
    const token = localStorage.getItem("token");
    try {
      var res = await this.axiosInstance.put<T>(url, data, {
        headers: {
          Authorization: `Bearer ${token?.replace(`"`, "").replace(`"`, "")}`,
        },
      });
      return res.data;
    } catch (error: any) {
      await this.HanderResponse(error);
      // return null;
    } finally {
      nprogress.complete();
    }
  }

  public async delete<T = any>(url: string) {
    notifications.clean();
    nprogress.start();
    const token = localStorage.getItem("token");
    try {
      var res = await this.axiosInstance.delete<T>(url, {
        headers: {
          Authorization: `Bearer ${token?.replace(`"`, "").replace(`"`, "")}`,
        },
      });
      return res.data;
    } catch (error: any) {
      await this.HanderResponse(error);
    } finally {
      nprogress.complete();
    }
  }

  public getBaseURL() {
    return this.axiosInstance.defaults.baseURL;
  }

  private async HanderResponse(res: any) {
    const currentURL = window.location.pathname;
    if (res.code === "ECONNABORTED" || res.code === "ETIMEDOUT") {
      NotificationExtension.Fails("Kết nối quá thời gian, vui lòng thử lại !");
      return;
    }
    if (res.code === "ERR_NETWORK")
      NotificationExtension.Fails("Máy chủ không thể kết nối !");
    switch (res.response?.status) {
      case 401:
        // const _sso =
        //   BASE_SSO + "/" + "?callback=" + window.location.origin + "/";
        // console.log(_sso);
        await AuthProvider.signout();
        NotificationExtension.Fails("Phiên đăng nhập hết hạn !");
        // NotificationExtension.Fails("Phiên đăng nhập hết hạn !");
        await DelayTask(1000);
        window.location.href = "/auth/login?callback=" + currentURL;
        modals.closeAll();
        //  window.location.href = _sso;

        break;
      case 400:
        NotificationExtension.Fails(
          res?.response?.data?.message ?? "Yêu cầu không hợp lệ !"
        );
        break;
      case 404:
        NotificationExtension.Fails(
          res?.response?.data?.message ?? "Api không tồn tại !"
        );
        //  modals.closeAll();
        break;
      // throw new Response("Trang web không tồn tại !", {
      //   status: res.response?.status,
      // });
      case 403:
        NotificationExtension.Fails("Bạn không có quyền !");
        modals.closeAll();
        break;
      case 415:
        NotificationExtension.Fails("Dữ liệu gửi tới máy chủ không phù hợp !");
        //  modals.closeAll();
        break;
      case 500:
        let _message = "Có lỗi xảy ra ở máy chủ, xin vui lòng thử lại!";
        if (
          res?.response?.data.errors &&
          res?.response?.data.errors?.msg?.length > 0
        )
          _message = res?.response?.data.errors?.msg[0];
        else if (res?.response?.data?.message)
          _message = res?.response?.data?.message;
        NotificationExtension.Fails(_message);
        break;
      default:
        break;
    }
  }
}

export default Repository;

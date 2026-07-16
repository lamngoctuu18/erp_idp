import api from "./api";
import TokenService from "./token.service";
import { LoginModel, Register } from "../../model/LoginModel";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import { HanderResponse } from "../../_base/helper/FunctionHelper";
import { isNullOrUndefined } from "../../_base/extension/StringExtension";

const register = (dataRegister: Register): Promise<any> => {
  return api
    .post("/Auth/register", dataRegister)
    .then((response) => {
      if (!isNullOrUndefined(response) && response?.data?.success) {
        NotificationExtension.Success("Bạn đã đăng ký thành công");
        return response.data;
      } else if (response != null)
        NotificationExtension.Fails("Đăng ký thất bại !");
    })
    .catch((error) => {
      // Xử lý lỗi ở đây
      HanderResponse(error);
    });
};

const login = (dataLogin: LoginModel): Promise<any> => {
  return api
    .post("/Auth/login", dataLogin)
    .then((response) => {
      if (!isNullOrUndefined(response) && response?.data?.success) {
        if (response.data?.data?.jwt) {
          TokenService.setUser(response?.data?.data);
        }
        NotificationExtension.Success("Bạn đã đăng nhập thành công");
        return response.data;
      } else if (response != null)
        NotificationExtension.Fails("Đăng nhập thất bại !");
    })
    .catch((error) => {
      // Xử lý lỗi ở đây
      HanderResponse(error);
    });
};

const logout = (): void => {
  TokenService.removeUser();
};

const getCurrentUser = (): any => {
  const userString = localStorage.getItem("user");
  return userString ? JSON.parse(userString) : null;
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default AuthService;

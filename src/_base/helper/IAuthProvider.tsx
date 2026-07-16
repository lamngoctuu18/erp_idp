import {
  LoaderFunctionArgs,
  Route,
  redirect,
  useFetcher,
  useLocation,
  useRouteLoaderData,
} from "react-router-dom";
import { createContext, useContext } from "react";
import { repositoryAuth } from "../_const/_constVar";
import { isNullOrEmpty, isNullOrUndefined } from "../extension/StringExtension";
import { NotificationExtension } from "../extension/NotificationExtension";
import { IAuthProvider } from "../model/_base/AuthProvider";
import { LoginModel } from "../../model/LoginModel";
import { MessageResponse } from "../../model/MessageResponse";
import { UserData } from "../../model/UserData";

export const AuthProvider: IAuthProvider = {
  username: null,
  async signin(
    loginModel: LoginModel
  ): Promise<MessageResponse<UserData> | undefined> {
    let urlCreate = `/api/v1/Auth/login`;
    let callapi = await repositoryAuth.post<MessageResponse<UserData>>(
      urlCreate,
      loginModel
    );

    if (
      !isNullOrUndefined(callapi) &&
      !isNullOrUndefined(callapi?.data) &&
      callapi?.success == true
    ) {
      localStorage.setItem("token", callapi?.data.jwt);
      AuthProvider.username = callapi?.data.user.userName;
      NotificationExtension.Success("Đăng nhập thành công !");
      return callapi;
    }
    if (!isNullOrEmpty(callapi?.message))
      NotificationExtension.Fails(callapi?.message ?? "Đăng nhập thất bại !");
    return undefined;
  },
  async signout(): Promise<boolean> {
    localStorage.removeItem("token");
    AuthProvider.username = "";
    return !localStorage.getItem("token");
  },
  isAuthenticated(): boolean {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    return !!localStorage.getItem("token");
  },
};

export function protectedLoader({ request }: LoaderFunctionArgs) {
  // If the user is not logged in and tries to access `/protected`, we redirect
  // them to `/login` with a `from` parameter that allows login to redirect back
  // to this page upon successful authentication
  if (!AuthProvider.isAuthenticated()) {
    let params = new URLSearchParams();
    params.set("callback", new URL(request.url).pathname);
    return redirect("/auth/login?" + params.toString());
  }
  return null;
}

export const authContext = createContext<boolean>(false);

export function ProvideAuth({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const auth = useProvideAuth();
  const currentURL = window.location.pathname;
  if (!auth) {
    let params = new URLSearchParams();
    params.set("callback", currentURL);
    redirect("/auth/login?" + params.toString());
  }
  return (
    <authContext.Provider value={auth.isAuthenticated}>
      {children}
    </authContext.Provider>
  );
}

export function useAuth() {
  return useContext(authContext);
}

export function useProvideAuth() {
  const isAuthenticated = AuthProvider.isAuthenticated();
  return {
    isAuthenticated,
  };
}

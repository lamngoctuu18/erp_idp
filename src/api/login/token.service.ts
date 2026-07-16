const getLocalRefreshToken = (): string | null => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return user?.refreshToken || null;
};

const getLocalAccessToken = (): string | null => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return user?.accessToken || null;
};

const updateLocalAccessToken = (token: string): void => {
  let user = JSON.parse(localStorage.getItem("user") || "{}");
  user.accessToken = token;
  localStorage.setItem("user", JSON.stringify(user));
};

const getUser = (): any => {
  return JSON.parse(localStorage.getItem("user") || "{}");
};

const setUser = (user: any): void => {
  localStorage.setItem("id", JSON.stringify(user?.id));
  localStorage.setItem("token", JSON.stringify(user?.jwt));
  localStorage.setItem("refreshToken", JSON.stringify(user?.refreshToken));
};

const removeUser = (): void => {
  localStorage.removeItem("id");
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  localStorage.removeItem("userProFile");
};

const TokenService = {
  getLocalRefreshToken,
  getLocalAccessToken,
  updateLocalAccessToken,
  getUser,
  setUser,
  removeUser,
};

export default TokenService;

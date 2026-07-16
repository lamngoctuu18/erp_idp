import api from "./api";

const getPublicContent = (): Promise<any> => {
  return api.get("/test/all");
};

const getUserBoard = (): Promise<any> => {
  return api.get("/test/user");
};

const getModeratorBoard = (): Promise<any> => {
  return api.get("/test/mod");
};

const getAdminBoard = (): Promise<any> => {
  return api.get("/test/admin");
};

const UserService = {
  getPublicContent,
  getUserBoard,
  getModeratorBoard,
  getAdminBoard,
};

export default UserService;

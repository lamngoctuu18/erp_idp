import { LoginModel } from "../../../model/LoginModel";
import { MessageResponse } from "../../../model/MessageResponse";
import { UserData } from "../../../model/UserData";

export interface IAuthProvider {
  //  isAuthenticated: boolean;
  username: null | string;
  signin(login: LoginModel): Promise<MessageResponse<UserData> | undefined>;
  signout(): Promise<boolean>;
  isAuthenticated(): boolean;
}

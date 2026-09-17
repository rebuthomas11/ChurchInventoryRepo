export interface ILoginRequest{
    loginName:string;
    loginPassword:string;
}

export interface ILoginResponse {
  token: string;
  userId: number;
  username: string;
  loginName: string;
  userRole: string;
}
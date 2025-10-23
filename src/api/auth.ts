import { api } from "./client";

export interface LoginReq {
  email: string;
  password: string;
}

export interface LoginRes {
  access_token: string;
  user: { id: string; email: string; name?: string };
}

export async function login(payload: LoginReq): Promise<LoginRes> {
  const { data } = await api.post<LoginRes>("/auth/login", payload);
  return data;
}

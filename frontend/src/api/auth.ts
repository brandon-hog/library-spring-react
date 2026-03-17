import api from "@/api/axiosConfig";

export type MeResponse = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export async function fetchMe() {
  const res = await api.get<MeResponse>("/auth/me");
  return res.data;
}


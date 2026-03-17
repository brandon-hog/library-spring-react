import { redirect } from "react-router-dom";
import { fetchMe, type MeResponse } from "@/api/auth";

function isAuthFailure(error: unknown) {
  const status = (error as any)?.response?.status;
  return status === 401 || status === 403;
}

export type LoaderWithMeResult = {
  me: MeResponse;
};

export async function requireAuthLoader(): Promise<LoaderWithMeResult> {
  try {
    const me = await fetchMe();
    return { me };
  } catch (err) {
    if (isAuthFailure(err)) throw redirect("/login");
    throw err;
  }
}

export async function requireAdminLoader(): Promise<LoaderWithMeResult> {
  const { me } = await requireAuthLoader();
  if (me.role !== "ADMIN") throw redirect("/book");
  return { me };
}


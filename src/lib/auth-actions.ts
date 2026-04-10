"use server";

import { redirect } from "next/navigation";
import { getSession } from "./session";

// ─── Login ────────────────────────────────────────────────────────────────────

export async function loginAction(
  _prevState: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const id = formData.get("id") as string;
  const password = formData.get("password") as string;

  const validId = process.env.ADMIN_ID;
  const validPassword = process.env.ADMIN_PASSWORD;

  if (!validId || !validPassword) {
    return { error: "서버 설정 오류: 인증 정보가 구성되지 않았습니다." };
  }

  if (id !== validId || password !== validPassword) {
    return { error: "ID 또는 비밀번호가 올바르지 않습니다." };
  }

  const session = await getSession();
  session.isLoggedIn = true;
  session.id = id;
  await session.save();

  redirect("/assignments");
}

// ─── Logout ───────────────────────────────────────────────────────────────────

export async function logoutAction(): Promise<void> {
  const session = await getSession();
  session.destroy();
  redirect("/login");
}

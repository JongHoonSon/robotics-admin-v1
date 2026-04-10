import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";

// ─── Session Data Shape ───────────────────────────────────────────────────────

export interface SessionData {
  isLoggedIn: boolean;
  id: string;
}

// ─── Session Options ──────────────────────────────────────────────────────────

const SESSION_SECRET = process.env.SESSION_SECRET;
if (!SESSION_SECRET) {
  throw new Error("SESSION_SECRET environment variable is required.");
}

export const sessionOptions: SessionOptions = {
  password: SESSION_SECRET,
  cookieName: "admin_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 8, // 8 hours
  },
};

// ─── Helper (Server Component / Server Action용) ──────────────────────────────

export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}

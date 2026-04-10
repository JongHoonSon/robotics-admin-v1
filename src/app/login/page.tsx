"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/auth-actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [state, action, isPending] = useActionState(loginAction, {});

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-sm">
        {/* Logo / Title */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Admin Login</h1>
          <p className="text-sm text-muted-foreground">
            Device Assignments 관리 페이지
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-xl border bg-card shadow-sm p-6 space-y-5">
          <form action={action} className="space-y-4">
            {/* ID */}
            <div className="space-y-1.5">
              <Label htmlFor="id">아이디</Label>
              <Input
                id="id"
                name="id"
                type="text"
                placeholder="admin"
                autoComplete="username"
                required
                disabled={isPending}
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                required
                disabled={isPending}
              />
            </div>

            {/* Error */}
            {state?.error && (
              <p className="text-sm text-destructive font-medium rounded-md bg-destructive/10 px-3 py-2">
                {state.error}
              </p>
            )}

            {/* Submit */}
            <Button
              id="login-submit-btn"
              type="submit"
              className="w-full"
              disabled={isPending}
            >
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              로그인
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

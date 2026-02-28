"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setToken } from "@/lib/auth";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      setToken(token);
    }
    router.replace("/");
  }, [token, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground animate-pulse">Signing you in...</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-muted-foreground animate-pulse">Signing you in...</p>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}

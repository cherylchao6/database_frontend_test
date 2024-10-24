"use client";
import React, { useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

export const ProtectedComponents = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    if (status === "loading") return; // 加载时不执行任何操作
    if (session && pathName === "/") {
      router.push("/dashboard"); // 已登入时重定向到 dashboard
    }
    if (!session) {
      router.push("/"); // 未登入时重定向到登入页
    }
  }, [session, status]);

  return <div>{children}</div>;
};

"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = (): void => {
      const access = sessionStorage.getItem("access");

      if (!access || access !== "permitido") {
        router.push("/login");
      }
    };

    checkAuth();

    window.addEventListener("popstate", checkAuth);

    return () => window.removeEventListener("popstate", checkAuth);
  }, [router]);

  return <>{children}</>;
};

export default ProtectedRoute;

"use client";

import { usePathname } from "next/navigation";
import { isProtectedPath } from "./routeProtection";
import { useMemo } from "react";

export function useIsProtectedRoute() {
    const pathname = usePathname() || "/";

    // memo para evitar recalcular en cada render innecesariamente
    const isProtected = useMemo(() => isProtectedPath(pathname), [pathname]);

    return isProtected;
}

export default useIsProtectedRoute;

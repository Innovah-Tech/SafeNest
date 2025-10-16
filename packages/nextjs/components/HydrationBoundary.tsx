"use client";

import { useEffect, useState } from "react";

interface HydrationBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * HydrationBoundary component that handles hydration mismatches gracefully
 * This is specifically designed to handle browser extension interference
 */
export const HydrationBoundary = ({ children, fallback }: HydrationBoundaryProps) => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Small delay to ensure all extensions have finished modifying the DOM
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!isHydrated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

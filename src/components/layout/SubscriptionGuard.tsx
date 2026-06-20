"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { SubscriptionInfo } from "@/lib/subscription";

export function SubscriptionGuard({ 
  subscription, 
  children 
}: { 
  subscription: SubscriptionInfo | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (subscription && (subscription.status === "PAST_DUE" || subscription.status === "CANCELLED")) {
      if (pathname && !pathname.startsWith("/dashboard/billing")) {
        router.push("/dashboard/billing?status=overdue");
      }
    }
  }, [subscription, pathname, router]);

  return <>{children}</>;
}

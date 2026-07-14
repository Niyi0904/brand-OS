"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type NavItemConfig = {
  href: string;
  label: string;
  icon: ReactNode;
  status?: string;
};

export function NavItem({ item }: { item: NavItemConfig }) {
  const pathname = usePathname();

  // Exact match for dashboard, prefix match for sub-routes
  const isActive =
    item.href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(item.href);

  const isDisabled = !!item.status;

  return (
    <Link
      href={isDisabled ? "#" : item.href}
      aria-disabled={isDisabled}
      data-active={isActive}
      className={cn(
        // Base nav item
        "mos-nav-item group",
        // Disabled
        isDisabled && "pointer-events-none",
      )}
      tabIndex={isDisabled ? -1 : undefined}
    >
      {/* Icon */}
      <span
        className={cn(
          "mos-nav-item-icon [&_svg]:h-[15px] [&_svg]:w-[15px]",
          isActive && "text-[var(--accent)]",
          isDisabled && "opacity-35",
        )}
      >
        {item.icon}
      </span>

      {/* Label */}
      <span
        className={cn(
          "min-w-0 flex-1 truncate",
          isDisabled && "opacity-35",
        )}
      >
        {item.label}
      </span>

      {/* Status badge */}
      {item.status && (
        <Badge variant="muted" className="shrink-0 text-[0.625rem]">
          {item.status}
        </Badge>
      )}
    </Link>
  );
}

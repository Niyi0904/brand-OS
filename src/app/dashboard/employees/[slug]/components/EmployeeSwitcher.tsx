"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmployeeAvatar } from "./EmployeeAvatar";
import { useRouter } from "next/navigation";
import {
  EMPLOYEE_COLOR_MAP,
  EMPLOYEE_ICON_MAP,
} from "@/lib/ai-employees/default-employees";

const ALL_EMPLOYEES = [
  { slug: "marketing-director", name: "Marketing Director", title: "Strategic marketing leadership" },
  { slug: "content-director", name: "Content Director", title: "Content strategy & creation" },
  { slug: "seo-director", name: "SEO Director", title: "Search visibility & keyword strategy" },
  { slug: "creative-director", name: "Creative Director", title: "Visual creative direction & design" },
  { slug: "analytics-director", name: "Analytics Director", title: "Data analysis & performance measurement" },
  { slug: "sales-director", name: "Sales Director", title: "Sales strategy & revenue growth" },
];

interface EmployeeSwitcherProps {
  currentEmployeeSlug: string | null;
  currentEmployeeId: string;
  brandId: string;
}

export function EmployeeSwitcher({
  currentEmployeeSlug,
  currentEmployeeId,
  brandId,
}: EmployeeSwitcherProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (slug: string) => {
    setOpen(false);
    router.push(`/dashboard/employees/${slug}?brand=${brandId}`);
  };

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(!open)}
        className="gap-2"
        aria-label="Switch AI employee"
      >
        <MessageSquare className="h-4 w-4" />
        <span className="hidden sm:inline">Switch</span>
        <ChevronDown className="h-3 w-3" />
      </Button>

      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-2 w-72 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-1)] p-2 shadow-lg"
          role="listbox"
          aria-label="Select AI employee"
        >
          <div className="mb-2 px-2 pb-1 pt-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
              AI Employees
            </p>
          </div>
          <div className="space-y-1">
            {ALL_EMPLOYEES.map((emp) => {
              const isActive = emp.slug === currentEmployeeSlug;
              const accent =
                EMPLOYEE_COLOR_MAP[emp.slug] || "var(--brand-accent)";
              const icon = EMPLOYEE_ICON_MAP[emp.slug] || null;

              return (
                <button
                  key={emp.slug}
                  onClick={() => handleSelect(emp.slug)}
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors ${
                    isActive
                      ? "bg-[var(--color-surface-2)]"
                      : "hover:bg-[var(--color-surface-2)]"
                  }`}
                  role="option"
                  aria-selected={isActive}
                >
                  <EmployeeAvatar
                    name={emp.name}
                    icon={icon}
                    accentColor={accent}
                    size={28}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[var(--color-text-primary)]">
                      {emp.name}
                    </p>
                    <p className="text-xs text-[var(--color-text-secondary)]">
                      {emp.title}
                    </p>
                  </div>
                  {isActive && (
                    <Check className="h-4 w-4 shrink-0 text-[var(--brand-accent)]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
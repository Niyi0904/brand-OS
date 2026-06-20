"use client";

import { useEffect, useRef } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmployeeSwitcherProps {
  currentEmployeeId: string;
  onSelect: (employeeId: string) => void;
}

const EMPLOYEE_COLORS: Record<string, string> = {
  "Marketing Director": "#7c6ff7",
  "Content Director": "#34d399",
  "Creative Director": "#f472b6",
  "SEO Director": "#60a5fa",
  "Analytics Director": "#fbbf24",
  "Brand Strategist": "#a78bfa",
  "Sales Director": "#f87171",
  "Customer Success": "#34d399",
  "Image Director": "#fb923c",
  "Video Director": "#e879f9",
};

export function EmployeeSwitcher({ currentEmployeeId, onSelect }: EmployeeSwitcherProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onSelect(currentEmployeeId);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [currentEmployeeId, onSelect]);

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full z-50 mt-2 w-64 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-1)] p-2 shadow-lg"
    >
      <div className="space-y-1">
        {Object.entries(EMPLOYEE_COLORS).map(([name, color]) => (
          <Button
            key={name}
            variant="ghost"
            className="w-full justify-start gap-3"
            onClick={() => onSelect(name.toLowerCase().replace(/\s+/g, "-"))}
          >
            <span
              className="flex h-6 w-6 items-center justify-center rounded-md text-xs font-medium text-white"
              style={{ backgroundColor: color }}
            >
              {name.charAt(0)}
            </span>
            <span className="flex-1 text-left text-sm text-[var(--color-text-primary)]">
              {name}
            </span>
            {currentEmployeeId === name.toLowerCase().replace(/\s+/g, "-") && (
              <Check className="h-4 w-4 text-[var(--color-text-secondary)]" />
            )}
          </Button>
        ))}
      </div>
    </div>
  );
}
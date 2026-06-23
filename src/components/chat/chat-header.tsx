"use client";

import { Bot, ChevronDown, History, MessageSquare } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EmployeeSwitcher } from "@/components/chat/employee-switcher";
import { BrandBrainIndicator } from "@/components/chat/brand-brain-indicator";

interface ChatHeaderProps {
  employee: {
    id: string;
    name: string;
    title: string;
    accentColor: string | null;
  };
  brand: {
    id: string;
    name: string;
  };
  onToggleHistory: () => void;
  onOpenMobileHistory: () => void;
  historyOpen: boolean;
}

export function ChatHeader({
  employee,
  brand,
  onToggleHistory,
  onOpenMobileHistory,
  historyOpen,
}: ChatHeaderProps) {
  const [showSwitcher, setShowSwitcher] = useState(false);

  return (
    <header className="flex h-16 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 px-6 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleHistory}
          className="hidden md:flex"
          aria-label={historyOpen ? "Hide history" : "Show history"}
        >
          <History className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenMobileHistory}
          className="md:hidden"
          aria-label="Open history"
        >
          <History className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg"
            style={{
              backgroundColor: employee.accentColor
                ? `${employee.accentColor}26`
                : "var(--color-surface-2)",
              border: `1px solid ${employee.accentColor ? `${employee.accentColor}40` : "var(--color-border)"}`,
            }}
          >
            <Bot
              className="h-5 w-5"
              style={{ color: employee.accentColor || "var(--color-text-secondary)" }}
            />
          </div>
          <div>
            <h1 className="text-sm font-medium text-[var(--color-text-primary)]">
              {employee.name}
            </h1>
            <p className="text-xs text-[var(--color-text-secondary)]">{employee.title}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <BrandBrainIndicator brandName={brand.name} brandId={brand.id} />
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSwitcher(!showSwitcher)}
            className="gap-2"
            aria-label="Switch AI employee"
          >
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Switch</span>
            <ChevronDown className="h-3 w-3" />
          </Button>
          {showSwitcher && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowSwitcher(false)}
              />
              <EmployeeSwitcher
                currentEmployeeId={employee.id}
                onSelect={() => setShowSwitcher(false)}
              />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
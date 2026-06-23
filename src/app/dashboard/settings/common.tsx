import { AlertCircle, Check } from "lucide-react";

import { type ActionState } from "./actions";

export interface UserData {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}

export interface OrgData {
  id: string;
  name: string;
  slug: string;
}

export interface MemberData {
  id: string;
  name: string;
  role: string;
  email: string;
  isAI?: boolean;
}

export interface SubscriptionData {
  plan: string;
  status: string;
  aiCredits: number;
  aiCreditsUsed: number;
  currentPeriodEnd: string | null;
}

export function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors shrink-0 whitespace-nowrap lg:w-full ${
        active
          ? "bg-[var(--color-surface-2)] text-[var(--color-text-primary)] border border-[var(--color-border)]"
          : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)]/40"
      }`}
    >
      <span
        className={`flex h-4 w-4 items-center justify-center [&_svg]:h-4 [&_svg]:w-4 transition-colors ${
          active ? "text-[var(--brand-accent)]" : "text-[var(--color-text-tertiary)]"
        }`}
      >
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );
}

export function AlertBox({ type, message }: { type: "success" | "error"; message: string }) {
  const isSuccess = type === "success";
  return (
    <div
      className={`flex items-start gap-3 rounded-md px-4 py-3 text-sm ${
        isSuccess
          ? "bg-green-500/10 text-green-400 border border-green-500/20"
          : "bg-red-500/10 text-red-400 border border-red-500/20"
      }`}
    >
      {isSuccess ? <Check className="h-4 w-4 shrink-0 mt-0.5" /> : <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />}
      <span>{message}</span>
    </div>
  );
}

export type SettingsTab = "profile" | "organization" | "billing" | "integrations" | "ai-config";

export function StatusLabel({
  status,
  colorMap,
}: {
  status: string;
  colorMap: Record<string, { bg: string; text: string; border: string }>;
}) {
  const colors = colorMap[status] || { bg: "bg-[var(--color-surface-3)]", text: "text-[var(--color-text-secondary)]", border: "border-[var(--color-border)]" };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${colors.bg} ${colors.text} ${colors.border}`}
    >
      {status}
    </span>
  );
}

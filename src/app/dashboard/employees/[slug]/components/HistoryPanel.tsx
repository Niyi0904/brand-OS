"use client";

import { useState, useRef, useEffect } from "react";
import { format, isToday, isYesterday, subDays } from "date-fns";
import {
  MessageSquare,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmployeeAvatar } from "./EmployeeAvatar";
import { useRouter } from "next/navigation";

interface HistoryPanelProps {
  conversations: Array<{
    id: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
    _count: { messages: number };
  }>;
  activeConversationId?: string;
  employeeSlug: string | null;
  brandId: string;
  employeeName: string;
  employeeIcon: string | null;
  employeeAccent: string | null;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

function groupConversationsByDate(
  conversations: HistoryPanelProps["conversations"]
) {
  const groups: { label: string; conversations: typeof conversations }[] = [];

  const today: typeof conversations = [];
  const yesterday: typeof conversations = [];
  const lastWeek: typeof conversations = [];
  const older: typeof conversations = [];

  const now = new Date();

  conversations.forEach((conv) => {
    const date = new Date(conv.updatedAt);
    if (isToday(date)) {
      today.push(conv);
    } else if (isYesterday(date)) {
      yesterday.push(conv);
    } else if (subDays(now, 7) < date) {
      lastWeek.push(conv);
    } else {
      older.push(conv);
    }
  });

  if (today.length) groups.push({ label: "Today", conversations: today });
  if (yesterday.length)
    groups.push({ label: "Yesterday", conversations: yesterday });
  if (lastWeek.length)
    groups.push({ label: "Previous 7 days", conversations: lastWeek });
  if (older.length) groups.push({ label: "Older", conversations: older });

  return groups;
}

function ConversationRow({
  conversation,
  isActive,
  employeeSlug,
  brandId,
  employeeName,
  employeeIcon,
  employeeAccent,
}: {
  conversation: HistoryPanelProps["conversations"][0];
  isActive: boolean;
  employeeSlug: string | null;
  brandId: string;
  employeeName: string;
  employeeIcon: string | null;
  employeeAccent: string | null;
}) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(conversation.title);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isRenaming]);

  const handleRename = async () => {
    const trimmed = renameValue.trim();
    if (!trimmed || trimmed === conversation.title) {
      setIsRenaming(false);
      return;
    }

    const formData = new FormData();
    formData.append("conversationId", conversation.id);
    formData.append("title", trimmed);

    const { renameConversationAction } = await import("../actions");
    await renameConversationAction({}, formData);
    setIsRenaming(false);
    router.refresh();
  };

  const handleDelete = async () => {
    const formData = new FormData();
    formData.append("conversationId", conversation.id);

    const { deleteConversationAction } = await import("../actions");
    await deleteConversationAction({}, formData);
    setShowDeleteConfirm(false);
    router.refresh();
  };

  const relativeTime = (date: Date) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (isYesterday(d)) return "Yesterday";
    return format(d, "MMM d");
  };

  return (
    <div
      className={`group relative flex items-center gap-2 rounded-md px-3 py-2 transition-colors ${
        isActive
          ? "bg-[var(--color-surface-2)]"
          : "hover:bg-[var(--color-surface-2)]"
      }`}
      style={
        isActive
          ? { borderLeft: `2px solid ${employeeAccent || "var(--brand-accent)"}` }
          : { borderLeft: `2px solid transparent` }
      }
    >
      <EmployeeAvatar
        name={employeeName}
        icon={employeeIcon}
        accentColor={employeeAccent}
        size={24}
      />

      <a
        href={`/dashboard/employees/${employeeSlug}?brand=${brandId}&conversation=${conversation.id}`}
        className="min-w-0 flex-1"
        aria-label={`${conversation.title}, ${employeeName}, ${relativeTime(conversation.updatedAt)}`}
      >
        {isRenaming ? (
          <input
            ref={inputRef}
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRename();
              if (e.key === "Escape") {
                setRenameValue(conversation.title);
                setIsRenaming(false);
              }
            }}
            className="w-full bg-transparent text-sm text-[var(--color-text-primary)] outline-none"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <p
            className="truncate text-sm text-[var(--color-text-primary)]"
            onDoubleClick={(e) => {
              e.preventDefault();
              setIsRenaming(true);
            }}
          >
            {conversation.title || "New conversation"}
          </p>
        )}
        <p className="text-[11px] text-[var(--color-text-tertiary)]">
          {relativeTime(conversation.updatedAt)}
        </p>
      </a>

      {showDeleteConfirm ? (
        <div
          className="absolute right-2 top-1/2 z-10 flex -translate-y-1/2 items-center gap-1 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-1)] p-1 shadow-lg"
          role="dialog"
          aria-modal="true"
        >
          <span className="whitespace-nowrap px-1 text-[11px] text-[var(--color-text-secondary)]">
            Delete? This cannot be undone.
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleDelete}
            aria-label="Confirm delete"
          >
            <Check className="h-3 w-3 text-[var(--color-red)]" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setShowDeleteConfirm(false)}
            aria-label="Cancel delete"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
          aria-label="Delete conversation"
        >
          <Trash2 className="h-3.5 w-3.5 text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-red)]" />
        </button>
      )}
    </div>
  );
}

export function HistoryPanel({
  conversations,
  activeConversationId,
  employeeSlug,
  brandId,
  employeeName,
  employeeIcon,
  employeeAccent,
  collapsed,
  onToggleCollapse,
}: HistoryPanelProps) {
  const router = useRouter();
  const grouped = groupConversationsByDate(conversations);

  const handleNewConversation = async () => {
    const { startNewConversationAction } = await import("../actions");
    const newId = await startNewConversationAction(employeeSlug || "", brandId);
    router.push(
      `/dashboard/employees/${employeeSlug || ""}?brand=${brandId}&conversation=${newId}`
    );
  };

  if (collapsed) {
    return (
      <aside className="flex flex-col items-center border-r border-[var(--color-border)] bg-[var(--color-surface-1)] py-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onToggleCollapse}
          aria-label="Expand history"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <div className="mt-4 flex flex-col items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleNewConversation}
            aria-label="New conversation"
          >
            <Plus className="h-4 w-4" />
          </Button>
          {conversations.slice(0, 5).map((conv) => (
            <a
              key={conv.id}
              href={`/dashboard/employees/${employeeSlug || ""}?brand=${brandId}&conversation=${conv.id}`}
              className="block"
              title={conv.title}
            >
              <EmployeeAvatar
                name={employeeName}
                icon={employeeIcon}
                accentColor={employeeAccent}
                size={24}
              />
            </a>
          ))}
        </div>
      </aside>
    );
  }

  return (
    <aside
      className="flex flex-col border-r border-[var(--color-border)] bg-[var(--color-surface-1)] transition-all duration-200"
      style={{ width: "260px" }}
      role="navigation"
      aria-label="Conversation history"
    >
      <div className="flex items-center justify-between p-4">
        <h2 className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
          History
        </h2>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleNewConversation}
            aria-label="New conversation"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onToggleCollapse}
            aria-label="Collapse history"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {conversations.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-xs text-[var(--color-text-tertiary)]">
              No conversations yet
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {grouped.map((group) => (
              <div key={group.label}>
                <div className="px-2 pb-1 pt-1">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
                    {group.label}
                  </span>
                </div>
                <div className="space-y-1">
                  {group.conversations.map((conv) => (
                    <ConversationRow
                      key={conv.id}
                      conversation={conv}
                      isActive={activeConversationId === conv.id}
                      employeeSlug={employeeSlug}
                      brandId={brandId}
                      employeeName={employeeName}
                      employeeIcon={employeeIcon}
                      employeeAccent={employeeAccent}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
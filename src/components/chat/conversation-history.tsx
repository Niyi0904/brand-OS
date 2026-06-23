"use client";

import { format, isToday, isYesterday, subDays } from "date-fns";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConversationHistoryProps {
  conversations: Array<{
    id: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
    _count: { messages: number };
  }>;
  activeConversationId?: string;
  employeeId: string;
  employeeSlug?: string;
  brandId: string;
}

function groupConversationsByDate(
  conversations: ConversationHistoryProps["conversations"]
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
  if (yesterday.length) groups.push({ label: "Yesterday", conversations: yesterday });
  if (lastWeek.length) groups.push({ label: "Previous 7 days", conversations: lastWeek });
  if (older.length) groups.push({ label: "Older", conversations: older });

  return groups;
}

export function ConversationHistory({
  conversations,
  activeConversationId,
  employeeId,
  employeeSlug,
  brandId,
}: ConversationHistoryProps) {
  const grouped = groupConversationsByDate(conversations);

  return (
    <div className="flex h-full flex-col">
      <div className="p-4">
        <h2 className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
          Conversations
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto px-2">
        {conversations.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-xs text-[var(--color-text-tertiary)]">No conversations yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {grouped.map((group) => (
              <div key={group.label}>
                <div className="px-2 pb-2 pt-1">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
                    {group.label}
                  </span>
                </div>
                <div className="space-y-1">
                  {group.conversations.map((conv) => (
                    <Button
                      key={conv.id}
                      variant="ghost"
                      className={`w-full justify-start gap-2 px-2 py-2 text-left ${
                        activeConversationId === conv.id
                          ? "bg-[var(--color-surface-2)] border-l-2 border-[var(--brand-accent)]"
                          : ""
                      }`}
                      asChild
                    >
                      <a
                        href={`/dashboard/employees/${employeeSlug || employeeId}?brand=${brandId}&conversation=${conv.id}`}
                      >
                        <MessageSquare className="h-3.5 w-3.5 shrink-0 text-[var(--color-text-tertiary)]" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs text-[var(--color-text-secondary)]">
                            {conv.title || "New conversation"}
                          </p>
                          <p className="mt-0.5 text-[11px] text-[var(--color-text-tertiary)]">
                            {format(new Date(conv.updatedAt), "h:mm a")}
                          </p>
                        </div>
                      </a>
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
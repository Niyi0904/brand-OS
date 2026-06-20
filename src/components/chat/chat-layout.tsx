"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { ChatHeader } from "@/components/chat/chat-header";
import { ConversationHistory } from "@/components/chat/conversation-history";
import { MessageThread } from "@/components/chat/message-thread";
import { ChatInput } from "@/components/chat/chat-input";
import { Button } from "@/components/ui/button";
import { useChat } from "@/hooks/use-chat";

interface ChatLayoutProps {
  employee: {
    id: string;
    name: string;
    title: string;
    accentColor: string | null;
    description: string | null;
  };
  brand: {
    id: string;
    name: string;
    slug: string;
  };
  conversations: Array<{
    id: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
    _count: { messages: number };
  }>;
  initialMessages: Array<{
    id: string;
    role: string;
    content: string;
    createdAt: Date;
  }>;
  activeConversationId?: string;
}

export function ChatLayout({
  employee,
  brand,
  conversations,
  initialMessages,
  activeConversationId,
}: ChatLayoutProps) {
  const [historyOpen, setHistoryOpen] = useState(true);
  const [mobileHistoryOpen, setMobileHistoryOpen] = useState(false);

  const { messages, isStreaming, error, sendMessage, retryLast } = useChat({
    employeeId: employee.id,
    brandId: brand.id,
    conversationId: activeConversationId,
  });

  // Use initial messages if no messages in state yet
  const displayMessages = messages.length > 0 ? messages : initialMessages;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[var(--color-bg)]">
      {/* Desktop history panel */}
      <aside
        className={`hidden md:flex flex-col border-r border-[var(--color-border)] bg-[var(--color-surface-1)] transition-all duration-200 ${
          historyOpen ? "w-[260px]" : "w-0"
        }`}
      >
        {historyOpen && (
          <ConversationHistory
            conversations={conversations}
            activeConversationId={activeConversationId}
            employeeId={employee.id}
            brandId={brand.id}
          />
        )}
      </aside>

      {/* Mobile history drawer */}
      {mobileHistoryOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileHistoryOpen(false)}
          />
          <aside className="relative w-[280px] border-r border-[var(--color-border)] bg-[var(--color-surface-1)]">
            <div className="flex items-center justify-between p-4">
              <span className="text-sm font-medium text-[var(--color-text-primary)]">History</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileHistoryOpen(false)}
                aria-label="Close history"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ConversationHistory
              conversations={conversations}
              activeConversationId={activeConversationId}
              employeeId={employee.id}
              brandId={brand.id}
            />
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="flex flex-1 flex-col overflow-hidden">
        <ChatHeader
          employee={employee}
          brand={brand}
          onToggleHistory={() => setHistoryOpen(!historyOpen)}
          onOpenMobileHistory={() => setMobileHistoryOpen(true)}
          historyOpen={historyOpen}
        />
        {error && (
          <div className="mx-6 mt-4 rounded-lg border border-[rgba(255,138,138,0.22)] bg-[rgba(255,138,138,0.06)] p-4">
            <p className="text-sm text-[var(--color-red)]">{error}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={retryLast}
            >
              Try again
            </Button>
          </div>
        )}
        <MessageThread
          messages={displayMessages}
          employee={employee}
          brand={brand}
          isStreaming={isStreaming}
        />
        <ChatInput
          employeeId={employee.id}
          brandId={brand.id}
          conversationId={activeConversationId}
          placeholder={`Message ${employee.name}...`}
          onSend={sendMessage}
          disabled={isStreaming}
        />
      </main>
    </div>
  );
}

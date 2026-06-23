"use client";

import { useState, useCallback } from "react";
import { History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChat } from "../hooks/use-chat";
import { HistoryPanel } from "./HistoryPanel";
import { ContextIndicator } from "./ContextIndicator";
import { SparseBrainWarning } from "./SparseBrainWarning";
import { SuggestedPrompts } from "./SuggestedPrompts";
import { MessageThread } from "./MessageThread";
import { ChatInput } from "./ChatInput";
import { EmployeeAvatar } from "./EmployeeAvatar";
import { EmployeeSwitcher } from "./EmployeeSwitcher";

interface ChatShellProps {
  employee: {
    id: string;
    name: string;
    slug: string | null;
    title: string;
    icon: string | null;
    accentColor: string | null;
    description: string | null;
  };
  brand: {
    id: string;
    name: string;
    slug: string;
    brandBrain?: {
      tagline?: string | null;
      industry?: string | null;
      voiceAdjectives?: string | null;
      primaryAudience?: string | null;
      primaryKeywords?: string | null;
    } | null;
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
  isBrainSparse: boolean;
}

export function ChatShell({
  employee,
  brand,
  conversations,
  initialMessages,
  activeConversationId,
  isBrainSparse,
}: ChatShellProps) {
  const [historyCollapsed, setHistoryCollapsed] = useState(true);
  const [mobileHistoryOpen, setMobileHistoryOpen] = useState(false);

  const { messages, isStreaming, error, sendMessage, stopStreaming, retryLast } =
    useChat({
      employeeSlug: employee.slug,
      employeeId: employee.id,
      brandId: brand.id,
      conversationId: activeConversationId,
    });

  const displayMessages = messages.length > 0 ? messages : initialMessages;

  const handleSend = useCallback(
    (content: string) => {
      sendMessage(content);
    },
    [sendMessage]
  );

  const handleStop = useCallback(() => {
    stopStreaming();
  }, [stopStreaming]);

  const handleRegenerate = useCallback(() => {
    retryLast();
  }, [retryLast]);

  const handleCopy = useCallback(
    (messageId: string, content: string) => {
      // Handled in MessageActions component
    },
    []
  );

  const handleSave = useCallback(
    (messageId: string, content: string) => {
      // Handled in MessageActions component
    },
    []
  );

  const handleFeedback = useCallback(
    (messageId: string) => {
      // Handled in MessageActions component
    },
    []
  );

  const brainSummary = {
    tagline: brand.brandBrain?.tagline,
    industry: brand.brandBrain?.industry,
    voiceAdjectives: brand.brandBrain?.voiceAdjectives,
    primaryAudience: brand.brandBrain?.primaryAudience,
    primaryKeywords: brand.brandBrain?.primaryKeywords,
  };

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-[var(--color-bg)]">
      {/* Desktop history panel */}
      <div className="hidden md:flex">
        <HistoryPanel
          conversations={conversations}
          activeConversationId={activeConversationId}
          employeeSlug={employee.slug}
          brandId={brand.id}
          employeeName={employee.name}
          employeeIcon={employee.icon}
          employeeAccent={employee.accentColor}
          collapsed={historyCollapsed}
          onToggleCollapse={() => setHistoryCollapsed(!historyCollapsed)}
        />
      </div>

      {/* Mobile history drawer */}
      {mobileHistoryOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileHistoryOpen(false)}
          />
          <aside className="relative h-full w-[280px] border-r border-[var(--color-border)] bg-[var(--color-surface-1)]">
            <div className="flex items-center justify-between p-4">
              <span className="text-sm font-medium text-[var(--color-text-primary)]">
                History
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileHistoryOpen(false)}
                aria-label="Close history"
              >
                <History className="h-4 w-4" />
              </Button>
            </div>
            <HistoryPanel
              conversations={conversations}
              activeConversationId={activeConversationId}
              employeeSlug={employee.slug}
              brandId={brand.id}
              employeeName={employee.name}
              employeeIcon={employee.icon}
              employeeAccent={employee.accentColor}
              collapsed={false}
              onToggleCollapse={() => {}}
            />
          </aside>
        </div>
      )}

      {/* Main chat area */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Chat header */}
        <header className="flex h-16 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 px-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setHistoryCollapsed(!historyCollapsed)}
              className="hidden md:flex"
              aria-label={historyCollapsed ? "Show history" : "Hide history"}
            >
              <History className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileHistoryOpen(true)}
              className="md:hidden"
              aria-label="Open history"
            >
              <History className="h-4 w-4" />
            </Button>

            <EmployeeAvatar
              name={employee.name}
              icon={employee.icon}
              accentColor={employee.accentColor}
              size={32}
            />

            <div>
              <h1
                className="text-sm font-medium"
                style={{ color: "var(--color-text-primary)" }}
              >
                {employee.name}
              </h1>
              <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                {employee.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <EmployeeSwitcher
              currentEmployeeSlug={employee.slug}
              currentEmployeeId={employee.id}
              brandId={brand.id}
            />
          </div>
        </header>

        {/* Context indicator */}
        <div className="px-4 pt-2 sm:px-6">
          <ContextIndicator
            brandName={brand.name}
            brandSlug={brand.slug}
            isBrainSparse={isBrainSparse}
            brainSummary={brainSummary}
          />
        </div>

        {/* Error state */}
        {error && (
          <div className="mx-6 mt-4 rounded-lg border border-[var(--color-danger)]/20 bg-[var(--color-danger)]/10 p-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--color-red)]">{error}</span>
              <Button
                variant="outline"
                size="sm"
                className="ml-auto"
                onClick={retryLast}
              >
                Try again
              </Button>
            </div>
          </div>
        )}

        {/* Message thread or suggested prompts */}
        {displayMessages.length === 0 ? (
          <SuggestedPrompts
            employeeSlug={employee.slug}
            employeeName={employee.name}
            employeeIcon={employee.icon}
            employeeAccent={employee.accentColor}
            brandName={brand.name}
            onSelect={handleSend}
          />
        ) : (
          <MessageThread
            messages={displayMessages}
            employeeName={employee.name}
            employeeIcon={employee.icon}
            employeeAccent={employee.accentColor}
            isStreaming={isStreaming}
            onRegenerate={handleRegenerate}
            onCopy={handleCopy}
            onSave={handleSave}
            onFeedback={handleFeedback}
          />
        )}

        {/* Sparse brain warning */}
        <SparseBrainWarning
          brandName={brand.name}
          brandSlug={brand.slug}
          isSparse={isBrainSparse}
        />

        {/* Input area */}
        <ChatInput
          placeholder={`Ask ${employee.name} anything about ${brand.name}...`}
          onSend={handleSend}
          onStop={handleStop}
          disabled={false}
          isStreaming={isStreaming}
        />
      </main>
    </div>
  );
}
"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { History, ArrowDown } from "lucide-react";
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [userScrolledUp, setUserScrolledUp] = useState(false);
  const [showJumpToLatest, setShowJumpToLatest] = useState(false);

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

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current && !userScrolledUp) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [displayMessages, userScrolledUp]);

  // Track scroll position
  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
    setUserScrolledUp(!isAtBottom);
    setShowJumpToLatest(!isAtBottom && isStreaming);
  }, [isStreaming]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      setUserScrolledUp(false);
      setShowJumpToLatest(false);
    }
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
      <main className="flex flex-1 flex-col min-h-0">
        {/* Chat header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 px-4 backdrop-blur-md sm:px-6">
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
        <div className="shrink-0 px-4 pt-2 sm:px-6">
          <ContextIndicator
            brandName={brand.name}
            brandSlug={brand.slug}
            isBrainSparse={isBrainSparse}
            brainSummary={brainSummary}
          />
        </div>

        {/* Error state */}
        {error && (
          <div className="shrink-0 mx-6 mt-4 rounded-lg border border-[var(--color-danger)]/20 bg-[var(--color-danger)]/10 p-4">
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

        {/* Scrollable content area */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="relative flex-1 flex flex-col overflow-y-auto min-h-0"
        >
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
          <SparseBrainWarning
            brandName={brand.name}
            brandSlug={brand.slug}
            isSparse={isBrainSparse}
          />
          {/* Bottom spacer so last message is never hidden behind the docked input */}
          <div ref={messagesEndRef} className="h-6 shrink-0" />

          {/* Jump to latest pill */}
          {showJumpToLatest && (
            <button
              onClick={scrollToBottom}
              className="absolute bottom-4 left-1/2 z-[var(--z-overlay)] flex -translate-x-1/2 items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-1)] px-4 py-2 text-xs text-[var(--color-text-secondary)] shadow-lg transition-all hover:bg-[var(--color-surface-2)]"
              style={{ animation: "fadeInUp 200ms ease-out" }}
            >
              <ArrowDown className="h-3.5 w-3.5" />
              Jump to latest
            </button>
          )}
        </div>

        {/* Docked input area */}
        <div className="shrink-0">
          <ChatInput
            placeholder={`Ask ${employee.name} anything about ${brand.name}...`}
            onSend={handleSend}
            onStop={handleStop}
            disabled={false}
            isStreaming={isStreaming}
          />
        </div>
      </main>
    </div>
  );
}
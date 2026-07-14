"use client";

import { useEffect, useRef, useState } from "react";
import { User } from "lucide-react";
import { EmployeeAvatar } from "./EmployeeAvatar";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { MessageActions } from "./MessageActions";

interface Message {
  id: string;
  role: string;
  content: string;
  createdAt: Date;
}

interface MessageThreadProps {
  messages: Message[];
  employeeName: string;
  employeeIcon: string | null;
  employeeAccent: string | null;
  isStreaming: boolean;
  onRegenerate: () => void;
  onCopy: (messageId: string, content: string) => void;
  onSave: (messageId: string, content: string) => void;
  onFeedback: (messageId: string) => void;
}

export function MessageThread({
  messages,
  employeeName,
  employeeIcon,
  employeeAccent,
  isStreaming,
  onRegenerate,
  onCopy,
  onSave,
  onFeedback,
}: MessageThreadProps) {
  const [ellipsisVisible, setEllipsisVisible] = useState(false);
  const ellipsisTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Ellipsis fallback: show after 2s delay if streaming hasn't produced content
  useEffect(() => {
    if (isStreaming) {
      const lastMessage = messages[messages.length - 1];
      const isAssistantStreaming = lastMessage?.role === "assistant";

      if (!isAssistantStreaming) {
        ellipsisTimerRef.current = setTimeout(() => {
          setEllipsisVisible(true);
        }, 2000);
      } else {
        setEllipsisVisible(false);
      }
    } else {
      setEllipsisVisible(false);
      if (ellipsisTimerRef.current) {
        clearTimeout(ellipsisTimerRef.current);
      }
    }

    return () => {
      if (ellipsisTimerRef.current) {
        clearTimeout(ellipsisTimerRef.current);
      }
    };
  }, [isStreaming, messages]);

  return (
    <div className="mx-auto max-w-[720px] px-6 py-4">
        {messages.map((message, index) => {
          const isUser = message.role === "user";
          const isLastAssistant =
            !isUser && index === messages.length - 1 && isStreaming;

          return (
            <div
              key={message.id}
              className={`flex gap-4 ${
                isUser ? "justify-end" : "justify-start"
              } ${index > 0 ? "mt-6" : ""}`}
              style={
                isUser
                  ? { animation: "fadeInUp 150ms ease-out" }
                  : undefined
              }
            >
              {!isUser && (
                <div className="mt-1 shrink-0">
                  <EmployeeAvatar
                    name={employeeName}
                    icon={employeeIcon}
                    accentColor={employeeAccent}
                    size={32}
                  />
                </div>
              )}

              <div
                className={`group relative ${
                  isUser ? "max-w-[70%]" : "max-w-full flex-1"
                }`}
              >
                {isUser ? (
                  <div className="rounded-2xl bg-[var(--color-surface-2)] px-4 py-3">
                    <p className="text-sm leading-relaxed text-[var(--color-text-primary)]">
                      {message.content}
                    </p>
                  </div>
                ) : (
                  <div>
                    <div
                      className="text-sm leading-relaxed"
                      style={{ lineHeight: "1.7" }}
                    >
                      <MarkdownRenderer content={message.content} />
                      {isLastAssistant && (
                        <span
                          className="ml-0.5 inline-block h-4 w-[2px] animate-pulse"
                          style={{
                            backgroundColor:
                              employeeAccent || "var(--brand-accent)",
                          }}
                        />
                      )}
                    </div>

                    {/* Message actions — only on complete AI messages */}
                    {!isLastAssistant && (
                      <div className="mt-2 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100">
                        <MessageActions
                          messageId={message.id}
                          content={message.content}
                          onCopy={() => onCopy(message.id, message.content)}
                          onSave={() => onSave(message.id, message.content)}
                          onRegenerate={onRegenerate}
                          onFeedback={() => onFeedback(message.id)}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {isUser && (
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-surface-2)]">
                  <User className="h-4 w-4 text-[var(--color-text-secondary)]" />
                </div>
              )}
            </div>
          );
        })}

        {/* Streaming ellipsis placeholder */}
        {ellipsisVisible && (
          <div className="mt-6 flex items-center gap-4">
            <div className="mt-1 shrink-0">
              <EmployeeAvatar
                name={employeeName}
                icon={employeeIcon}
                accentColor={employeeAccent}
                size={32}
              />
            </div>
            <div
              className="flex items-center gap-1"
              aria-label="Generating response..."
              role="status"
            >
              <span
                className="h-2 w-2 animate-bounce rounded-full"
                style={{
                  backgroundColor: employeeAccent || "var(--brand-accent)",
                  animationDelay: "0ms",
                }}
              />
              <span
                className="h-2 w-2 animate-bounce rounded-full"
                style={{
                  backgroundColor: employeeAccent || "var(--brand-accent)",
                  animationDelay: "150ms",
                }}
              />
              <span
                className="h-2 w-2 animate-bounce rounded-full"
                style={{
                  backgroundColor: employeeAccent || "var(--brand-accent)",
                  animationDelay: "300ms",
                }}
              />
            </div>
          </div>
        )}
      </div>
  );
}
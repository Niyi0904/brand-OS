"use client";

import { useEffect, useRef } from "react";
import { User, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Copy, Bookmark, RefreshCw, ThumbsUp, ThumbsDown } from "lucide-react";
import { useState } from "react";

interface MessageThreadProps {
  messages: Array<{
    id: string;
    role: string;
    content: string;
    createdAt: Date;
  }>;
  employee: {
    name: string;
    accentColor: string | null;
  };
  brand: {
    name: string;
  };
  isStreaming?: boolean;
}

export function MessageThread({ messages, employee, brand, isStreaming = false }: MessageThreadProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleCopy = async (content: string, messageId: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(messageId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="max-w-[640px] text-center">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
            {employee.name} is ready to work
          </h2>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Start a conversation about {brand.name}. The more context you provide in your Brand Brain, the better the output.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 py-4" ref={scrollRef}>
      <div className="mx-auto max-w-[860px] space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-4 ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.role === "assistant" && (
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                style={{
                  backgroundColor: employee.accentColor
                    ? `${employee.accentColor}26`
                    : "var(--color-surface-2)",
                }}
              >
                <Bot
                  className="h-4 w-4"
                  style={{ color: employee.accentColor || "var(--color-text-secondary)" }}
                />
              </div>
            )}
            <div
              className={`group relative max-w-[85%] ${
                message.role === "user" ? "max-w-[75%]" : ""
              }`}
            >
              <div
                className={`rounded-lg px-4 py-3 ${
                  message.role === "user"
                    ? "bg-[var(--color-surface-2)]"
                    : ""
                }`}
              >
                <p className="text-sm leading-relaxed text-[var(--color-text-primary)]">
                  {message.content}
                  {isStreaming && message === messages[messages.length - 1] && (
                    <span
                      className="ml-0.5 inline-block h-4 w-[2px] animate-pulse"
                      style={{ backgroundColor: employee.accentColor || "var(--brand-accent)" }}
                    />
                  )}
                </p>
              </div>
              {message.role === "assistant" && (
                <div className="mt-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleCopy(message.content, message.id)}
                    aria-label="Copy message"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Save to library">
                    <Bookmark className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Regenerate">
                    <RefreshCw className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Thumbs up">
                    <ThumbsUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Thumbs down">
                    <ThumbsDown className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
              {copiedId === message.id && (
                <p className="mt-1 text-xs text-[var(--color-green)]">Copied!</p>
              )}
            </div>
            {message.role === "user" && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-surface-2)]">
                <User className="h-4 w-4 text-[var(--color-text-secondary)]" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

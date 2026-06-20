"use client";

import { useState, useCallback } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

interface UseChatOptions {
  employeeId: string;
  brandId: string;
  conversationId?: string;
}

export function useChat({ employeeId, brandId, conversationId }: UseChatOptions) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      setError(null);
      setIsStreaming(true);

      const userMessage: Message = {
        id: `temp-${Date.now()}`,
        role: "user",
        content,
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);

      try {
        const response = await fetch("/api/chat/stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: content,
            employeeId,
            brandId,
            conversationId,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to send message");
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();
        let assistantContent = "";
        let newConversationId = conversationId;
        let assistantMessageId = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const text = decoder.decode(value);
          const lines = text.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));

                if (data.conversationId && !newConversationId) {
                  newConversationId = data.conversationId;
                }

                if (data.messageId && !assistantMessageId) {
                  assistantMessageId = data.messageId;
                }

                if (data.content) {
                  assistantContent += data.content;
                  setMessages((prev) => {
                    const last = prev[prev.length - 1];
                    if (last?.role === "assistant" && last.id === assistantMessageId) {
                      return prev.map((m) =>
                        m.id === assistantMessageId ? { ...m, content: assistantContent } : m
                      );
                    }
                    return [
                      ...prev,
                      {
                        id: assistantMessageId || `temp-assistant-${Date.now()}`,
                        role: "assistant" as const,
                        content: assistantContent,
                        createdAt: new Date(),
                      },
                    ];
                  });
                }

                if (data.done) {
                  setIsStreaming(false);
                }
              } catch {
                // Ignore parse errors for incomplete SSE chunks
              }
            }
          }
        }
      } catch (err) {
        setError("Something went wrong. Try again.");
        setIsStreaming(false);
        // Remove the user message on error
        setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
      }
    },
    [employeeId, brandId, conversationId]
  );

  const retryLast = useCallback(() => {
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
    if (lastUserMessage) {
      // Remove the failed assistant response if any
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.slice(0, -1);
        }
        return prev;
      });
      sendMessage(lastUserMessage.content);
    }
  }, [messages, sendMessage]);

  return {
    messages,
    isStreaming,
    error,
    sendMessage,
    retryLast,
  };
}
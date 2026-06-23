"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, X } from "lucide-react";

import { useChat } from "@/app/dashboard/employees/[slug]/hooks/use-chat";
import { MessageThread } from "@/app/dashboard/employees/[slug]/components/MessageThread";
import { ChatInput } from "@/app/dashboard/employees/[slug]/components/ChatInput";
import { EmployeeAvatar } from "@/app/dashboard/employees/[slug]/components/EmployeeAvatar";
import { completeOnboardingAction } from "@/app/onboarding/actions";

type OnboardingChatProps = {
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
  };
  initialPrompt: string;
  isSparse: boolean;
  brandSlug: string;
};

export function OnboardingChat({
  employee,
  brand,
  initialPrompt,
  isSparse,
  brandSlug,
}: OnboardingChatProps) {
  const router = useRouter();
  const [prompt, setPrompt] = useState(initialPrompt);
  const [activationShown, setActivationShown] = useState(false);
  const [consecutiveErrors, setConsecutiveErrors] = useState(0);
  const [sparseDismissed, setSparseDismissed] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [completing, setCompleting] = useState(false);
  const streamCompletedRef = useRef(false);
  const prevMessagesCountRef = useRef(0);

  const {
    messages,
    isStreaming,
    error,
    sendMessage,
    stopStreaming,
    retryLast,
  } = useChat({
    employeeSlug: employee.slug,
    employeeId: employee.id,
    brandId: brand.id,
  });

  // Track consecutive errors
  useEffect(() => {
    if (error) {
      setConsecutiveErrors((prev) => prev + 1);
    } else {
      setConsecutiveErrors(0);
    }
  }, [error]);

  const handleActivation = useCallback(async () => {
    if (completing) return;
    setCompleting(true);

    // Delay completion message 500ms after stream ends
    setTimeout(() => {
      setActivationShown(true);
      // Fire server action to mark onboarding complete
      completeOnboardingAction().then(() => {
        // Update the session via a page refresh
        router.refresh();
      });
    }, 500);
  }, [completing, router]);

  const handleSend = useCallback(
    (content: string) => {
      setMessageSent(true);
      streamCompletedRef.current = false;
      sendMessage(content);
    },
    [sendMessage]
  );

  const handleRetry = useCallback(() => {
    retryLast();
  }, [retryLast]);

  // Track when streaming completes for activation
  useEffect(() => {
    if (messageSent && prevMessagesCountRef.current > 0 && !isStreaming && !error) {
      const hasAssistantMessage = messages.some(
        (m) => m.role === "assistant"
      );
      if (hasAssistantMessage && !streamCompletedRef.current) {
        streamCompletedRef.current = true;
        handleActivation();
      }
    }
    prevMessagesCountRef.current = messages.length;
  }, [messages, isStreaming, error, messageSent, handleActivation]);

  // Detect agency user from brand description
  const isAgencyUser = false; // Simplified — would check from brand data

  return (
    <div className="flex h-[calc(100vh-3.5rem)] w-full overflow-hidden bg-[var(--color-bg)]">
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Chat header */}
        <header className="flex h-14 items-center gap-3 border-b border-[var(--color-border)] bg-[rgba(8,9,15,0.78)] px-4 backdrop-blur-md sm:px-6">
          <EmployeeAvatar
            name={employee.name}
            icon={employee.icon}
            accentColor={employee.accentColor}
            size={32}
          />

          <div>
            <h1 className="text-sm font-medium text-[var(--color-text-primary)]">
              {employee.name}
            </h1>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {employee.title}
            </p>
          </div>
        </header>

        {/* Onboarding header */}
        <div className="flex items-center gap-2 px-4 pt-3 sm:px-6">
          <div
            className={`h-2 w-2 rounded-full shrink-0 ${
              isSparse ? "bg-[var(--color-amber)]" : "bg-[var(--color-green)]"
            }`}
          />
          <p className="text-[0.8125rem] text-[var(--color-text-secondary)]">
            {isSparse
              ? `${brand.name}'s Brand Brain is just getting started.`
              : `${brand.name}'s Brand Brain is loaded. Your Content Director is ready.`}
          </p>
        </div>

        {/* Sparse brain banner */}
        {isSparse && !sparseDismissed && (
          <div className="mx-4 mt-3 flex items-start gap-2 rounded-lg border border-[rgba(242,195,107,0.22)] bg-[rgba(242,195,107,0.06)] px-3 py-2 sm:mx-6 animate-banner-enter">
            <p className="flex-1 text-xs text-[var(--color-text-secondary)]">
              Your Brand Brain is light right now — the AI will do its best with
              what it has. You can add more context any time.
            </p>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={`/dashboard/brands/${brandSlug}/settings`}
                className="text-xs text-[var(--brand-accent)] hover:underline whitespace-nowrap"
              >
                Add to Brand Brain
              </Link>
              <button
                type="button"
                onClick={() => setSparseDismissed(true)}
                className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
                aria-label="Dismiss"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="mx-4 mt-3 rounded-lg border border-[rgba(255,138,138,0.22)] bg-[rgba(255,138,138,0.06)] p-4 sm:mx-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-[var(--color-red)]" />
              <span className="text-sm text-[var(--color-red)]">
                {consecutiveErrors >= 3
                  ? "We're having trouble connecting. Your brand is saved — come back in a few minutes and we'll be ready."
                  : "Something went wrong on our end. Try again."}
              </span>
            </div>
            <div className="mt-2 flex gap-2">
              {consecutiveErrors < 3 ? (
                <button
                  type="button"
                  onClick={handleRetry}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium"
                  style={{
                    background: "var(--brand-accent)",
                    color: "var(--color-bg)",
                  }}
                >
                  Try again
                </button>
              ) : (
                <Link
                  href="/dashboard"
                  className="text-sm text-[var(--brand-accent)] hover:underline"
                >
                  Go to your dashboard
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Message thread */}
        <div className="flex-1 overflow-y-auto">
          {messages.length > 0 && (
            <MessageThread
              messages={messages as any}
              employeeName={employee.name}
              employeeIcon={employee.icon}
              employeeAccent={employee.accentColor}
              isStreaming={isStreaming}
              onRegenerate={handleRetry}
              onCopy={() => {}}
              onSave={() => {}}
              onFeedback={() => {}}
            />
          )}

          {/* Activation completion message */}
          {activationShown && (
            <div className="px-4 pb-4 sm:px-6 animate-activation-enter">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[var(--color-green)] shrink-0" />
                <p className="text-[0.8125rem] text-[var(--color-text-secondary)]">
                  Your Brand Brain is active. {brand.name}&apos;s AI team is ready.
                </p>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="text-[0.8125rem] text-[var(--brand-accent)] hover:underline"
                >
                  Explore your dashboard
                </Link>
                <span className="text-[var(--color-text-tertiary)]">·</span>
                <Link
                  href={`/dashboard/brands/${brandSlug}/settings`}
                  className="text-[0.8125rem] text-[var(--brand-accent)] hover:underline"
                >
                  Add more to the Brand Brain
                </Link>
                {isAgencyUser && (
                  <>
                    <span className="text-[var(--color-text-tertiary)]">·</span>
                    <Link
                      href="/dashboard/brands/new"
                      className="text-[0.8125rem] text-[var(--brand-accent)] hover:underline"
                    >
                      Add another brand
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Send instruction */}
        {!messageSent && !isStreaming && (
          <div className="px-4 pb-1 sm:px-6">
            <p className="text-xs text-[var(--color-text-tertiary)]">
              Press Enter to send — or edit the prompt first.
            </p>
          </div>
        )}

        {/* Input area */}
        <ChatInput
          placeholder={`Ask ${employee.name} anything about ${brand.name}...`}
          onSend={handleSend}
          onStop={stopStreaming}
          disabled={completing}
          isStreaming={isStreaming}
          value={prompt}
          onValueChange={setPrompt}
        />
      </main>
    </div>
  );
}

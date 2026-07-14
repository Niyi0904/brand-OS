"use client";
import React from "react";
type FieldErrorProps = { messages?: string[] };
export function FieldError({ messages }: FieldErrorProps): React.ReactElement | null {
  if (!messages || messages.length === 0) return null;
  return (
    <ul role="alert" aria-live="polite" data-field-error="" className="mt-1 space-y-0.5">
      {messages.map((message, index) => (
        <li key={index} className="text-xs" style={{ color: "var(--color-danger)" }}>{message}</li>
      ))}
    </ul>
  );
}

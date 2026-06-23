"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

interface MarkdownRendererProps {
  content: string;
}

const components: Components = {
  h1: ({ children, ...props }) => (
    <h1 className="mb-2 mt-4 text-lg font-semibold text-[var(--color-text-primary)]" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className="mb-2 mt-3 text-base font-semibold text-[var(--color-text-primary)]" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="mb-1 mt-3 text-sm font-semibold text-[var(--color-text-primary)]" {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }) => (
    <p className="mb-2 leading-relaxed text-[var(--color-text-primary)]" {...props}>
      {children}
    </p>
  ),
  strong: ({ children, ...props }) => (
    <strong className="font-semibold text-[var(--color-text-primary)]" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }) => (
    <em className="italic text-[var(--color-text-primary)]" {...props}>
      {children}
    </em>
  ),
  ul: ({ children, ...props }) => (
    <ul className="mb-2 list-disc pl-5 text-[var(--color-text-primary)]" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="mb-2 list-decimal pl-5 text-[var(--color-text-primary)]" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="mb-1 leading-relaxed" {...props}>
      {children}
    </li>
  ),
  code: ({ children, className, ...props }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code
          className="rounded bg-[var(--color-surface-3)] px-1.5 py-0.5 text-sm font-mono text-[var(--color-text-primary)]"
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <pre className="mb-3 overflow-x-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-3)] p-4">
        <code className="text-sm font-mono text-[var(--color-text-primary)]" {...props}>
          {children}
        </code>
      </pre>
    );
  },
  pre: ({ children, ...props }) => <>{children}</>,
};

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="markdown-content">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
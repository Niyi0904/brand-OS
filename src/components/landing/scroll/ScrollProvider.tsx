"use client";

import type { ReactNode } from "react";

export function ScrollProvider({ children }: { children: ReactNode }) {
  return <div className="relative">{children}</div>;
}

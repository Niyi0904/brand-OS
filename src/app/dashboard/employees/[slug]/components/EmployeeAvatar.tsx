"use client";

import {
  Bot,
  Briefcase,
  PenLine,
  Search,
  Palette,
  BarChart3,
  TrendingUp,
} from "lucide-react";

interface EmployeeAvatarProps {
  name: string;
  icon: string | null;
  accentColor: string | null;
  size?: number;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  briefcase: <Briefcase className="h-full w-full" />,
  "pen-line": <PenLine className="h-full w-full" />,
  search: <Search className="h-full w-full" />,
  palette: <Palette className="h-full w-full" />,
  "bar-chart-3": <BarChart3 className="h-full w-full" />,
  "trending-up": <TrendingUp className="h-full w-full" />,
};

export function EmployeeAvatar({
  name,
  icon,
  accentColor,
  size = 32,
}: EmployeeAvatarProps) {
  const color = accentColor || "var(--color-text-secondary)";
  const iconSize = Math.round(size * 0.5);
  const borderWidth = size >= 32 ? 1.5 : 1;

  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full"
      style={{
        width: size,
        height: size,
        backgroundColor: `${color}26`,
        border: `${borderWidth}px solid ${color}40`,
      }}
      aria-label={name}
      role="img"
    >
      <div
        className="flex items-center justify-center"
        style={{
          width: iconSize,
          height: iconSize,
          color: color,
        }}
      >
        {icon && ICON_MAP[icon] ? (
          ICON_MAP[icon]
        ) : (
          <Bot className="h-full w-full" />
        )}
      </div>
    </div>
  );
}
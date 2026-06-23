"use client";

import {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Search, Plus, Check, AlertCircle } from "lucide-react";

import { useBrand } from "@/lib/brand-context-provider";
import { BrandAvatar } from "@/components/ui/brand-avatar";

function highlightMatch(text: string, query: string) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span className="font-semibold">{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  );
}

function getRelativeTime(date: Date | string | null | undefined): string | null {
  if (!date) return null;
  const d = typeof date === "string" ? new Date(date) : date;
  const diffMs = Date.now() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffMin < 1440) {
    const diffHrs = Math.floor(diffMin / 60);
    return `${diffHrs}h ago`;
  }
  const diffDays = Math.floor(diffMin / 1440);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[d.getDay()];
}

type BrandSwitcherProps = {
  showName?: boolean;
  align?: "left" | "right";
  asBottomSheet?: boolean;
};

export function BrandSwitcher({
  showName = true,
  align = "left",
  asBottomSheet = false,
}: BrandSwitcherProps) {
  const router = useRouter();
  const { currentBrand, brands, setCurrentBrand } = useBrand();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [previousBrand, setPreviousBrand] = useState<typeof currentBrand>(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [errorVisible, setErrorVisible] = useState(false);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const errorDismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sort brands by lastActiveAt desc, then alphabetically for never-used
  const sortedBrands = useMemo(() => {
    return [...brands].sort((a, b) => {
      const aTime = a.lastActiveAt ? new Date(a.lastActiveAt).getTime() : 0;
      const bTime = b.lastActiveAt ? new Date(b.lastActiveAt).getTime() : 0;
      if (aTime !== bTime) return bTime - aTime;
      return a.name.localeCompare(b.name);
    });
  }, [brands]);

  const filteredBrands = useMemo(() => {
    if (!searchQuery) return sortedBrands;
    const q = searchQuery.toLowerCase();
    return sortedBrands.filter((b) => b.name.toLowerCase().includes(q));
  }, [sortedBrands, searchQuery]);

  const totalItems = filteredBrands.length + 1;
  const filteredBrandsRef = useRef(filteredBrands);
  filteredBrandsRef.current = filteredBrands;

  const handleSwitch = useCallback(
    async (brandId: string) => {
      const brand = brands.find((b) => b.id === brandId);
      if (!brand) return;

      setPreviousBrand(currentBrand);
      setCurrentBrand(brand);
      setOpen(false);
      setSearchQuery("");

      try {
        const res = await fetch("/api/brands/switch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ brandId }),
        });

        if (!res.ok) {
          throw new Error("Failed to switch brand");
        }

        router.refresh();
      } catch {
        if (previousBrand) setCurrentBrand(previousBrand);
        else setCurrentBrand(currentBrand);
        setError("Couldn't switch brands. Try again.");
      }
    },
    [brands, currentBrand, previousBrand, setCurrentBrand, router]
  );

  const handleAddBrand = useCallback(() => {
    setOpen(false);
    setSearchQuery("");
    router.push("/brands/new");
  }, [router]);

  // Focus trap
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setSearchQuery("");
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0));
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1));
      }

      if (e.key === "Enter" && focusedIndex >= 0) {
        e.preventDefault();
        const currentFiltered = filteredBrandsRef.current;
        if (focusedIndex < currentFiltered.length) {
          handleSwitch(currentFiltered[focusedIndex].id);
        } else {
          handleAddBrand();
        }
      }

      if (e.key === "Tab") {
        e.preventDefault();
        if (focusedIndex < totalItems - 1) {
          setFocusedIndex((prev) => prev + 1);
        } else {
          setFocusedIndex(0);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, focusedIndex, totalItems, handleSwitch, handleAddBrand]);

  // Auto-focus search
  useEffect(() => {
    if (open) {
      setFocusedIndex(-1);
      requestAnimationFrame(() => {
        searchInputRef.current?.focus();
      });
    }
  }, [open]);

  // Error dismiss sequence
  useEffect(() => {
    if (error) {
      setErrorVisible(true);
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
      if (errorDismissTimerRef.current) clearTimeout(errorDismissTimerRef.current);
      errorDismissTimerRef.current = setTimeout(() => {
        setErrorVisible(false);
        errorTimerRef.current = setTimeout(() => setError(null), 150);
      }, 4000);
    } else {
      setErrorVisible(false);
    }
    return () => {
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
      if (errorDismissTimerRef.current) clearTimeout(errorDismissTimerRef.current);
    };
  }, [error]);

  // Click outside
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setSearchQuery("");
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleTriggerClick = () => {
    const nextOpen = !open;
    setOpen(nextOpen);
    if (error) {
      setErrorVisible(false);
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
      setTimeout(() => setError(null), 150);
    }
  };

  const handleUserInteraction = useCallback(() => {
    if (error) {
      setErrorVisible(false);
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
      setTimeout(() => setError(null), 150);
    }
  }, [error]);

  if (!currentBrand || brands.length === 0) return null;

  const dropdownContent = (
    <div
      ref={dropdownRef}
      role="listbox"
      aria-label="Select a brand"
      className={`${
        asBottomSheet
          ? "fixed bottom-0 left-0 right-0 z-50 mx-auto w-full rounded-t-xl border border-b-0"
          : "absolute top-full z-50 mt-1 overflow-hidden"
      } bg-[var(--color-surface-1)] border-[var(--color-border-hover)] shadow-lg animate-dropdown-open`}
      style={{
        width: asBottomSheet ? "100%" : align === "right" ? "auto" : "100%",
        minWidth: asBottomSheet ? undefined : "240px",
        maxWidth: asBottomSheet ? undefined : "320px",
        maxHeight: asBottomSheet ? "60vh" : "320px",
        overflowY: "auto",
        borderRadius: asBottomSheet ? "12px 12px 0 0" : "12px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2)",
        right: align === "right" ? "0" : undefined,
      }}
      onMouseDown={handleUserInteraction}
    >
      {/* Search Input */}
      <div
        className="sticky top-0 z-10 border-b border-[var(--color-border)] bg-[var(--color-surface-2)]"
        style={{ borderRadius: asBottomSheet ? "12px 12px 0 0" : "12px 12px 0 0" }}
      >
        <div className="flex h-10 items-center gap-[10px] px-3">
          <Search className="h-3.5 w-3.5 shrink-0 text-[var(--color-text-tertiary)]" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setFocusedIndex(-1);
            }}
            placeholder="Find a brand..."
            className="flex-1 bg-transparent text-[0.9rem] text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-tertiary)]"
            aria-label="Search brands"
            aria-controls="brand-listbox"
          />
        </div>
      </div>

      {/* Brand List */}
      <div id="brand-listbox" className="py-1">
        {filteredBrands.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <span className="text-[0.8125rem] text-[var(--color-text-tertiary)]">No brands found</span>
          </div>
        ) : (
          filteredBrands.map((brand, idx) => {
            const isActive = brand.id === currentBrand.id;
            const isFocused = focusedIndex === idx;

            return (
              <button
                key={brand.id}
                role="option"
                aria-selected={isActive}
                onClick={() => handleSwitch(brand.id)}
                onMouseEnter={() => setFocusedIndex(idx)}
                className={`flex w-full items-center gap-[10px] px-3 py-0 text-left text-sm transition-colors ${
                  isFocused ? "bg-[var(--color-surface-2)]" : "hover:bg-[var(--color-surface-2)]"
                } ${isActive ? "bg-[var(--color-surface-2)]" : ""}`}
                style={{
                  minHeight: "44px",
                  borderLeft: isActive ? "2px solid var(--brand-accent)" : "2px solid transparent",
                  outline: isFocused ? "2px solid var(--accent)" : "none",
                  outlineOffset: "-2px",
                }}
              >
                <BrandAvatar brand={brand} size={24} />

                <div className="flex-1 min-w-0">
                  <span
                    className={`block truncate text-[0.9375rem] font-medium ${
                      isActive ? "text-[var(--brand-accent)]" : "text-[var(--color-text-primary)]"
                    }`}
                    style={{ maxWidth: "140px" }}
                  >
                    {highlightMatch(brand.name, searchQuery)}
                  </span>
                  {brand.organization?.name && (
                    <span className="block truncate text-[0.8125rem] text-[var(--color-text-tertiary)]">
                      {brand.organization.name}
                    </span>
                  )}
                </div>

                <div className="shrink-0 text-right">
                  {isActive ? (
                    <Check
                      className="h-3.5 w-3.5 text-[var(--brand-accent)]"
                      aria-label={`${brand.name} — active`}
                    />
                  ) : (
                    <span className="text-[0.8125rem] text-[var(--color-text-tertiary)] whitespace-nowrap">
                      {getRelativeTime(brand.lastActiveAt)}
                    </span>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Add Brand */}
      {searchQuery === "" && (
        <>
          <div className="border-t border-[var(--color-border)]" />
          <button
            role="option"
            aria-selected={false}
            onClick={() => {
              handleAddBrand();
              handleUserInteraction();
            }}
            onMouseEnter={() => setFocusedIndex(filteredBrands.length)}
            className={`flex w-full items-center gap-[10px] px-3 text-left text-sm transition-colors ${
              focusedIndex === filteredBrands.length
                ? "bg-[var(--color-surface-2)] text-[var(--color-text-primary)]"
                : "hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text-primary)] text-[var(--color-text-secondary)]"
            }`}
            style={{ minHeight: "40px" }}
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-surface-3)]">
              <Plus className="h-3.5 w-3.5 text-[var(--color-text-secondary)]" />
            </div>
            <span className="text-[0.9rem]">Add brand</span>
          </button>
        </>
      )}
    </div>
  );

  return (
    <div className="relative" onClick={handleUserInteraction}>
      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={handleTriggerClick}
        className={`flex w-full items-center gap-[10px] border-b border-[var(--color-border)] px-3 text-left transition-colors hover:bg-[var(--color-surface-2)] ${
          open ? "bg-[var(--color-surface-2)]" : "bg-transparent"
        }`}
        style={{
          height: "48px",
          borderRadius: 0,
          outline: open ? "2px solid var(--brand-accent)" : "none",
          outlineOffset: "-2px",
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Switch brand. Currently active: ${currentBrand.name}`}
      >
        <BrandAvatar brand={currentBrand} size={32} />
        {showName && (
          <span
            className="flex-1 truncate text-[0.9375rem] font-medium text-[var(--color-text-primary)]"
            style={{ maxWidth: "160px" }}
          >
            {currentBrand.name}
          </span>
        )}
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[var(--color-text-tertiary)] transition-transform duration-150 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && dropdownContent}

      {/* Error State */}
      {error && (
        <div
          role="alert"
          aria-live="assertive"
          className={`overflow-hidden ${
            errorVisible ? "animate-error-in" : "animate-error-out"
          }`}
        >
          <div
            className="mx-3 mt-2 flex items-center gap-2 px-3 py-2"
            style={{
              background: "rgba(248,113,113,0.10)",
              border: "1px solid rgba(248,113,113,0.30)",
              borderRadius: "8px",
              color: "var(--color-red, #ff8a8a)",
              fontSize: "0.8125rem",
            }}
          >
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Live region for brand switch announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {open ? "" : `Now working in ${currentBrand.name}`}
      </div>
    </div>
  );
}

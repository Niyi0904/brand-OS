import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50",
      "bg-[rgba(0,0,0,0.72)] backdrop-blur-[4px]",
      "data-[state=open]:animate-[mos-fade-in_200ms_cubic-bezier(0.16,1,0.3,1)]",
      "data-[state=closed]:animate-[mos-fade-out_160ms_cubic-bezier(0.4,0,0.2,1)]",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        // Positioning
        "fixed left-[50%] top-[50%] z-50",
        "w-full max-w-[480px]",
        "translate-x-[-50%] translate-y-[-50%]",
        // Surface
        "relative overflow-hidden",
        "bg-[var(--surface-2)]",
        "border border-[var(--border-strong)]",
        "rounded-[var(--radius-xl)]",
        "shadow-[var(--shadow-float)]",
        "text-[var(--text-primary)]",
        // Highlight edge
        "before:absolute before:inset-0 before:rounded-[inherit]",
        "before:bg-gradient-to-b before:from-white/[0.04] before:to-transparent before:pointer-events-none",
        // Animation
        "data-[state=open]:animate-[mos-scale-in_240ms_cubic-bezier(0.16,1,0.3,1)]",
        "data-[state=closed]:animate-[mos-fade-out_160ms_cubic-bezier(0.4,0,0.2,1)]",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="absolute right-3.5 top-3.5 z-10"
          aria-label="Close dialog"
        >
          <X />
        </Button>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col gap-1.5 px-6 pb-4 pt-6",
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex items-center justify-end gap-2.5",
      "border-t border-[var(--border)] px-6 py-4",
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-[1rem] font-semibold leading-snug tracking-[-0.02em]",
      "text-[var(--text-primary)]",
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn(
      "text-[0.8125rem] leading-[1.5] text-[var(--text-secondary)]",
      className
    )}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

const DialogBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("px-6 py-2", className)} {...props} />
);
DialogBody.displayName = "DialogBody";

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};

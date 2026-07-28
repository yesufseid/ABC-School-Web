import { useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface WideDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  className?: string;
}

export function WideDialog({
  open,
  onOpenChange,
  children,
  className,
}: WideDialogProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div
          className={cn(
            "relative z-50 w-full max-w-[65vw] rounded-2xl border border-border bg-background p-6 shadow-xl max-h-[90vh] overflow-y-auto",
            className,
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

interface WideDialogHeaderProps {
  children: ReactNode;
  className?: string;
}

export function WideDialogHeader({ children, className }: WideDialogHeaderProps) {
  return (
    <div className={cn("flex flex-col space-y-1.5 mb-4", className)}>
      {children}
    </div>
  );
}

interface WideDialogTitleProps {
  children: ReactNode;
  className?: string;
}

export function WideDialogTitle({ children, className }: WideDialogTitleProps) {
  return (
    <h2
      className={cn(
        "text-lg font-semibold leading-none tracking-tight text-foreground",
        className,
      )}
    >
      {children}
    </h2>
  );
}

interface WideDialogFooterProps {
  children: ReactNode;
  className?: string;
}

export function WideDialogFooter({ children, className }: WideDialogFooterProps) {
  return (
    <div
      className={cn("flex justify-end gap-2 mt-6", className)}
    >
      {children}
    </div>
  );
}

interface WideDialogCloseProps {
  onClick: () => void;
  className?: string;
}

export function WideDialogClose({ onClick, className }: WideDialogCloseProps) {
  return (
    <button
      type="button"
      className={cn(
        "absolute right-4 top-4 rounded-xl p-1 text-muted-foreground hover:text-foreground transition-colors",
        className,
      )}
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    </button>
  );
}

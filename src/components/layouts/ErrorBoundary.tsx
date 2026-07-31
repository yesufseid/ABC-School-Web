import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangleIcon } from "lucide-react";

type ErrorBoundaryProps = {
  children: ReactNode;
  fallback?: (error: Error) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
};

type ErrorBoundaryState = {
  error: Error | null;
};

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.error) {
      return (
        this.props.fallback?.(this.state.error) ?? (
          <div className="flex min-h-screen items-center justify-center bg-background p-6">
            <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-2xl border border-border/60 bg-card p-8 text-center">
              <div className="flex size-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                <AlertTriangleIcon className="size-6" />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-semibold text-foreground">
                  Something went wrong
                </p>
                <p className="text-sm text-muted-foreground">
                  An unexpected error occurred. Please reload the page to
                  continue.
                </p>
              </div>
              <Button
                onClick={() => window.location.reload()}
                className="mt-2"
              >
                Reload page
              </Button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

import { Link, useRouteError } from "react-router";
import { AlertTriangleIcon, HomeIcon, RotateCwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RouteErrorBoundary() {
  const error = useRouteError();

  const message =
    error instanceof Error ? error.message : "An unexpected error occurred.";

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-6">
      <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-2xl border border-border/60 bg-card p-8 text-center">
        <div className="flex size-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
          <AlertTriangleIcon className="size-6" />
        </div>
        <div className="space-y-1">
          <p className="text-lg font-semibold text-foreground">
            Something went wrong
          </p>
          <p className="text-sm break-words text-muted-foreground">{message}</p>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RotateCwIcon />
            Reload
          </Button>
          <Button nativeButton={false} render={<Link to="/" />}>
            <HomeIcon />
            Home
          </Button>
        </div>
      </div>
    </div>
  );
}

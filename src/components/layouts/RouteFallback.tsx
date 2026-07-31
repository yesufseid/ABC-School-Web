import { LoaderCircleIcon } from "lucide-react";

export function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <LoaderCircleIcon className="size-8 animate-spin text-muted-foreground" />
    </div>
  );
}

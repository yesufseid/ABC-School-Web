import { SchoolIcon } from "lucide-react";

export function SchoolsPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-border/50 bg-card/50 p-12 text-center shadow-lg shadow-black/10 backdrop-blur-sm">
        <div className="flex size-16 items-center justify-center rounded-xl bg-primary/10">
          <SchoolIcon className="size-8 text-primary" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Schools
          </h1>
          <p className="text-muted-foreground">
            This feature is under development.
          </p>
        </div>
        <p className="text-sm text-muted-foreground/70">Check back soon.</p>
      </div>
    </div>
  );
}

import { useMatches } from "react-router";

type RouteHandle = {
  title?: string;
};

export function ComingSoonPage() {
  const matches = useMatches();
  const handle = matches.at(-1)?.handle as RouteHandle | undefined;
  const title = handle?.title ?? "Page";

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center text-center">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        This section is coming soon. Navigation and role access are already wired
        up.
      </p>
    </div>
  );
}

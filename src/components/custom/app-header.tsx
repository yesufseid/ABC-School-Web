import { BellIcon, LaptopIcon } from "lucide-react";
import { UserMenu } from "@/components/custom/user-menu";
import { Badge } from "@/components/ui/badge";

export function AppHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border/50 bg-background/80 px-6 backdrop-blur-xl">
      <button
        type="button"
        className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label="Toggle sidebar"
      >
        <LaptopIcon className="size-4" />
      </button>

      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-full bg-primary/15 ring-1 ring-primary/30">
          <span className="text-[10px] font-bold tracking-tight text-primary">
            AC
          </span>
        </div>
        <span className="text-sm font-semibold tracking-wide text-foreground">
          Axis Connect
        </span>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          className="relative flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Notifications"
        >
          <BellIcon className="size-4" />
          <Badge className="absolute -top-0.5 -right-0.5 size-4 justify-center rounded-full p-0 text-[9px]">
            3
          </Badge>
        </button>

        <div className="relative">
          <UserMenu />
          <span className="absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-background bg-emerald-500" />
        </div>
      </div>
    </header>
  );
}

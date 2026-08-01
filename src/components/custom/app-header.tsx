import { BellIcon, LaptopIcon } from "lucide-react";
import { UserMenu } from "@/components/custom/user-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type AppHeaderProps = {
  collapsed: boolean;
  onToggleSidebar: () => void;
};

export function AppHeader({ collapsed, onToggleSidebar }: AppHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border/50 bg-background/80 px-6 backdrop-blur-xl">
      <button
        type="button"
        onClick={onToggleSidebar}
        className={cn(
          "flex size-9 items-center justify-center rounded-full transition-colors",
          collapsed
            ? "bg-primary/20 text-primary"
            : "bg-muted text-muted-foreground hover:text-foreground",
        )}
        aria-label="Toggle sidebar"
      >
        <LaptopIcon className="size-4" />
      </button>

      <div className="flex items-center gap-2">
        <img
          src="/logo.png"
          alt="ABC-School logo"
          className="size-8 rounded-full object-cover ring-1 ring-primary/30"
        />
        <span className="text-sm font-semibold tracking-wide text-foreground">
          ABC-School
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

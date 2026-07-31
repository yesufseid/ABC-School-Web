import { useState } from "react";
import { InboxIcon, SendIcon } from "lucide-react";
import { PageHeader } from "@/components/custom/page-header";
import { ContextSelector } from "@/components/custom/context-selector";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/lib/store";
import { useFetchBranches } from "@/features/schools/api/schools.api";
import { InboxComponent } from "../components/inbox.component";
import { SentComponent } from "../components/sent.component";

type MessagesTab = "inbox" | "sent";

const TABS: { id: MessagesTab; label: string; icon: typeof InboxIcon }[] = [
  { id: "inbox", label: "Inbox", icon: InboxIcon },
  { id: "sent", label: "Sent", icon: SendIcon },
];

export function MessagesPage() {
  const { tenantId, role } = useAuthContext();
  const isAdminOrOwner = role === "Admin" || role === "Owner";

  const { data: branchesData } = useFetchBranches(tenantId ?? "");
  const branches = branchesData?.data ?? [];

  const [tab, setTab] = useState<MessagesTab>("inbox");

  return (
    <div className="space-y-6">
      <PageHeader title="Messages" description="Conversations and broadcast history">
        <ContextSelector
          branches={
            isAdminOrOwner
              ? branches.map((b) => ({ id: b.id, name: b.name }))
              : undefined
          }
        />
      </PageHeader>

      <div className="flex w-fit items-center gap-1 rounded-2xl border border-border/50 bg-card/50 p-1">
        {TABS.map((item) => {
          const Icon = item.icon;
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={cn(
                "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </button>
          );
        })}
      </div>

      {tab === "inbox" && <InboxComponent />}
      {tab === "sent" && <SentComponent />}
    </div>
  );
}

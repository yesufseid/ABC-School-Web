import { useState } from "react";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useFetchMessageThreads, useFetchConversation } from "../api/messages.api";
import type { MessageThread } from "../types/message.types";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function InboxComponent() {
  const { data } = useFetchMessageThreads();
  const threads = data ?? [];

  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(
    threads[0]?.id ?? null,
  );

  const { data: conversationData } = useFetchConversation(selectedThreadId ?? "");
  const conversation = conversationData ?? [];

  const selectedThread =
    threads.find((thread) => thread.id === selectedThreadId) ?? null;

  return (
    <Card>
      <CardContent className="grid gap-0 lg:grid-cols-[320px_1fr]">
        <div className="border-b lg:border-b-0 lg:border-r">
          {threads.map((thread) => (
            <ThreadListItem
              key={thread.id}
              thread={thread}
              active={thread.id === selectedThreadId}
              onSelect={() => setSelectedThreadId(thread.id)}
            />
          ))}
        </div>

        <div className="flex min-h-[420px] flex-col">
          {selectedThread ? (
            <>
              <div className="flex items-center gap-3 border-b p-4">
                <Avatar size="lg">
                  <AvatarFallback>{initials(selectedThread.participant)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">
                    {selectedThread.participant}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedThread.participantRole}
                  </p>
                </div>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto p-4">
                {conversation.map((message) => {
                  const mine = message.sender === "You";
                  return (
                    <div
                      key={message.id}
                      className={cn(
                        "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm",
                        mine
                          ? "ml-auto bg-primary text-primary-foreground"
                          : "bg-muted text-foreground",
                      )}
                    >
                      <p className="mb-1 text-xs font-medium opacity-70">
                        {message.sender} · {message.senderRole}
                      </p>
                      <p>{message.body}</p>
                      <p
                        className={cn(
                          "mt-1 text-xs",
                          mine ? "text-primary-foreground/70" : "text-muted-foreground",
                        )}
                      >
                        {format(parseISO(message.sentAt), "MMM d, h:mm a")}
                      </p>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center p-8">
              <p className="text-sm text-muted-foreground">
                Select a conversation to view messages.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ThreadListItem({
  thread,
  active,
  onSelect,
}: {
  thread: MessageThread;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-start gap-3 border-b p-4 text-left transition-colors",
        active ? "bg-muted" : "hover:bg-muted/60",
      )}
    >
      <Avatar>
        <AvatarFallback>{initials(thread.participant)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-medium text-foreground">
            {thread.participant}
          </p>
          <p className="shrink-0 text-xs text-muted-foreground">
            {format(parseISO(thread.lastAt), "MMM d")}
          </p>
        </div>
        <p className="truncate text-sm text-muted-foreground">
          {thread.lastMessage}
        </p>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {thread.participantRole}
          </span>
          {thread.unread > 0 && (
            <Badge className="size-5 justify-center rounded-full px-0">
              {thread.unread}
            </Badge>
          )}
        </div>
      </div>
    </button>
  );
}

import { format, parseISO } from "date-fns";
import { SmartphoneIcon, MailIcon, BellIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CustomTable } from "@/components/custom/custom-table";
import { useFetchSentMessages } from "../api/messages.api";
import type { MessageChannel } from "../types/message.types";

const CHANNEL_ICONS: Record<MessageChannel, typeof SmartphoneIcon> = {
  sms: SmartphoneIcon,
  email: MailIcon,
  push: BellIcon,
};

const STATUS_STYLES: Record<string, "default" | "secondary" | "success" | "destructive"> = {
  delivered: "success",
  pending: "secondary",
  failed: "destructive",
};

export function SentComponent() {
  const { data } = useFetchSentMessages();
  const messages = data ?? [];

  const columns = [
    {
      title: "Subject",
      key: "subject",
      component: (value: (typeof messages)[number][keyof (typeof messages)[number]]) => (
        <span className="font-medium text-foreground">{String(value)}</span>
      ),
    },
    {
      title: "Channel",
      key: "channel",
      component: (value: (typeof messages)[number][keyof (typeof messages)[number]]) => {
        const Icon = CHANNEL_ICONS[value as MessageChannel] ?? SmartphoneIcon;
        return (
          <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <Icon className="size-4" />
            {String(value).toUpperCase()}
          </span>
        );
      },
    },
    {
      title: "Recipients",
      key: "recipientLabel",
      component: (
        _value: (typeof messages)[number][keyof (typeof messages)[number]],
        row: (typeof messages)[number],
      ) => (
        <span className="text-muted-foreground">
          {row.recipientLabel} · {row.deliveredCount}/{row.totalCount}
        </span>
      ),
    },
    {
      title: "Status",
      key: "status",
      component: (value: (typeof messages)[number][keyof (typeof messages)[number]]) => (
        <Badge variant={STATUS_STYLES[String(value)] ?? "secondary"}>
          {String(value)}
        </Badge>
      ),
    },
    {
      title: "Sent",
      key: "sentAt",
      component: (value: (typeof messages)[number][keyof (typeof messages)[number]]) => (
        <span className="text-muted-foreground">
          {value ? format(parseISO(String(value)), "MMM d, yyyy h:mm a") : "-"}
        </span>
      ),
    },
  ];

  return (
    <Card>
      <CardContent>
        <CustomTable
          data={messages}
          columns={columns}
          emptyMessage="No sent messages yet."
        />
      </CardContent>
    </Card>
  );
}

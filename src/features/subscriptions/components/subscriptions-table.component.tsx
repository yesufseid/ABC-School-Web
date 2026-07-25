import { format, parseISO } from "date-fns";
import { useNavigate } from "react-router";
import { CustomTable } from "@/components/custom/custom-table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontalIcon, PencilIcon, TrashIcon } from "lucide-react";
import type { Subscription } from "../types/subscription.types";

interface SubscriptionsTableProps {
  subscriptions: Subscription[];
  onEdit: (subscription: Subscription) => void;
  onDelete: (subscription: Subscription) => void;
}

export function SubscriptionsTable({
  subscriptions,
  onEdit,
  onDelete,
}: SubscriptionsTableProps) {
  const navigate = useNavigate();

  const columns = [
    {
      title: "Name",
      key: "name",
      component: (value: Subscription[keyof Subscription], row: Subscription) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/subscriptions/${row.id}`);
          }}
          className="cursor-pointer text-left font-medium text-foreground hover:underline"
        >
          {value as string}
        </button>
      ),
    },
    {
      title: "Duration",
      key: "months",
      component: (value: Subscription[keyof Subscription]) => (
        <span className="text-foreground">
          {String(value)} {Number(value) === 1 ? "month" : "months"}
        </span>
      ),
    },
    {
      title: "Price",
      key: "price",
      component: (value: Subscription[keyof Subscription]) => (
        <span className="text-foreground">
          {(value as number).toLocaleString()}
        </span>
      ),
    },
    {
      title: "Status",
      key: "active",
      component: (value: Subscription[keyof Subscription]) =>
        value ? (
          <Badge variant="success">Active</Badge>
        ) : (
          <Badge variant="secondary">Inactive</Badge>
        ),
    },
    {
      title: "Features",
      key: "features",
      component: (value: Subscription[keyof Subscription]) => (
        <div className="flex flex-wrap gap-1">
          {Object.entries(value as Record<string, string | number | boolean>).map(
            ([key, val]) => (
              <Badge key={key} variant="outline" className="text-xs">
                {key}: {String(val)}
              </Badge>
            ),
          )}
        </div>
      ),
    },
    {
      title: "Created",
      key: "createdAt",
      component: (value: Subscription[keyof Subscription]) => (
        <span className="text-muted-foreground">
          {format(parseISO(value as string), "MMM d, yyyy")}
        </span>
      ),
    },
    {
      title: "",
      key: "actions",
      className: "w-12",
      component: (_value: Subscription[keyof Subscription], row: Subscription) => (
        <DropdownMenu>
          <DropdownMenuTrigger
            className="inline-flex size-7 cursor-pointer items-center justify-center rounded-xl hover:bg-muted hover:text-foreground"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontalIcon className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(row)}>
              <PencilIcon />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onDelete(row)}
            >
              <TrashIcon />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <CustomTable
      data={subscriptions}
      columns={columns}
      emptyMessage="No subscriptions found."
    />
  );
}

import { format, parseISO } from "date-fns";
import { useNavigate } from "react-router";
import { CustomTable } from "@/components/custom/custom-table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontalIcon,
  PencilIcon,
  TrashIcon,
  CreditCardIcon,
} from "lucide-react";
import type { School } from "../types/school.types";

interface SchoolsTableProps {
  schools: School[];
  onEdit: (school: School) => void;
  onDelete: (school: School) => void;
  onSubscribe: (school: School) => void;
}

export function SchoolsTable({
  schools,
  onEdit,
  onDelete,
  onSubscribe,
}: SchoolsTableProps) {
  const navigate = useNavigate();

  const columns = [
    {
      title: "School",
      key: "name",
      component: (_value: School[keyof School], row: School) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/schools/${row.id}`);
          }}
          className="cursor-pointer text-left hover:underline"
        >
          <p className="font-medium text-foreground">{row.name}</p>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {row.description}
          </p>
        </button>
      ),
    },
    {
      title: "Branch",
      key: "branchCode",
      component: (value: School[keyof School]) => (
        <span className="font-mono text-foreground">{String(value)}</span>
      ),
    },
    {
      title: "Owner",
      key: "owner",
      component: (value: School[keyof School]) => (
        <span className="text-foreground">
          {(value as School["owner"]).name}
        </span>
      ),
    },
    {
      title: "Phone",
      key: "owner",
      component: (value: School[keyof School]) => (
        <span className="text-muted-foreground">
          {(value as School["owner"]).phoneNumber}
        </span>
      ),
    },
    {
      title: "Sub. End Date",
      key: "subscriptionEndDate",
      component: (value: School[keyof School]) => (
        <span className="text-muted-foreground">
          {value
            ? format(parseISO(value as string), "MMM d, yyyy")
            : "-"}
        </span>
      ),
    },
    {
      title: "Created",
      key: "createdAt",
      component: (value: School[keyof School]) => (
        <span className="text-muted-foreground">
          {format(parseISO(value as string), "MMM d, yyyy")}
        </span>
      ),
    },
    {
      title: "",
      key: "actions",
      className: "w-12",
      component: (_value: School[keyof School], row: School) => (
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
            <DropdownMenuItem onClick={() => onSubscribe(row)}>
              <CreditCardIcon />
              Subscribe
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
      data={schools}
      columns={columns}
      emptyMessage="No schools found."
    />
  );
}

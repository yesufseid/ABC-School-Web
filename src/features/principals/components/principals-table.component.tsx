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
import {
  MoreHorizontalIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
} from "lucide-react";
import type { Principal } from "../types/principal.types";

interface PrincipalsTableProps {
  principals: Principal[];
  branchLabel: (branchId: string) => string;
  onEdit: (principal: Principal) => void;
  onDelete: (principal: Principal) => void;
}

export function PrincipalsTable({
  principals,
  branchLabel,
  onEdit,
  onDelete,
}: PrincipalsTableProps) {
  const navigate = useNavigate();

  const columns = [
    {
      title: "Name",
      key: "firstName",
      component: (_value: Principal[keyof Principal], row: Principal) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/principals/${row.id}`);
          }}
          className="cursor-pointer text-left hover:underline"
        >
          <p className="font-medium text-foreground">
            {row.firstName} {row.middleName ? `${row.middleName} ` : ""}
            {row.lastName}
          </p>
          <p className="text-xs text-muted-foreground">{row.phone}</p>
        </button>
      ),
    },
    {
      title: "Role",
      key: "isVicePrincipal",
      component: (value: Principal[keyof Principal]) => (
        <Badge variant={value ? "secondary" : "default"}>
          {value ? "Vice Principal" : "Principal"}
        </Badge>
      ),
    },
    {
      title: "Sex",
      key: "sex",
      component: (value: Principal[keyof Principal]) => (
        <span className="text-muted-foreground">{String(value)}</span>
      ),
    },
    {
      title: "Branch",
      key: "branchId",
      component: (value: Principal[keyof Principal]) => (
        <span className="text-muted-foreground">
          {branchLabel(String(value))}
        </span>
      ),
    },
    {
      title: "Started",
      key: "startingDate",
      component: (value: Principal[keyof Principal]) => (
        <span className="text-muted-foreground">
          {value ? format(parseISO(value as string), "MMM d, yyyy") : "-"}
        </span>
      ),
    },
    {
      title: "",
      key: "actions",
      className: "w-12",
      component: (_value: Principal[keyof Principal], row: Principal) => (
        <DropdownMenu>
          <DropdownMenuTrigger
            className="inline-flex size-7 cursor-pointer items-center justify-center rounded-xl hover:bg-muted hover:text-foreground"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontalIcon className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate(`/principals/${row.id}`)}>
              <EyeIcon />
              View
            </DropdownMenuItem>
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
      data={principals}
      columns={columns}
      emptyMessage="No principals found."
    />
  );
}

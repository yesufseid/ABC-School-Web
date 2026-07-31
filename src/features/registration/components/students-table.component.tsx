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
  RefreshCcwIcon,
  EyeIcon,
} from "lucide-react";
import type { Student } from "../types/registration.types";

interface StudentsTableProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
  onReAdmit: (student: Student) => void;
}

function statusVariant(status: string) {
  const s = status.toUpperCase();
  if (["ACTIVE", "ENROLLED", "ADMITTED"].includes(s)) return "success";
  if (["INACTIVE", "DROPPED", "WITHDRAWN"].includes(s)) return "secondary";
  return "outline";
}

export function StudentsTable({
  students,
  onEdit,
  onDelete,
  onReAdmit,
}: StudentsTableProps) {
  const navigate = useNavigate();

  const columns = [
    {
      title: "Name",
      key: "firstName",
      component: (_value: Student[keyof Student], row: Student) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/students/${row.id}`);
          }}
          className="cursor-pointer text-left hover:underline"
        >
          <p className="font-medium text-foreground">
            {row.firstName} {row.lastName}
          </p>
          {row.middleName && (
            <p className="text-xs text-muted-foreground line-clamp-1">
              {row.middleName}
            </p>
          )}
        </button>
      ),
    },
    {
      title: "Sex",
      key: "sex",
      component: (value: Student[keyof Student]) => (
        <span className="text-muted-foreground">{String(value)}</span>
      ),
    },
    {
      title: "Phone",
      key: "phone",
      component: (value: Student[keyof Student]) => (
        <span className="text-muted-foreground">{value ? String(value) : "-"}</span>
      ),
    },
    {
      title: "Grade",
      key: "startingGrade",
      component: (value: Student[keyof Student]) => (
        <span className="text-foreground">Grade {String(value)}</span>
      ),
    },
    {
      title: "Status",
      key: "status",
      component: (value: Student[keyof Student]) => (
        <Badge variant={statusVariant(String(value))}>{String(value)}</Badge>
      ),
    },
    {
      title: "Enrolled",
      key: "enrollmentDate",
      component: (value: Student[keyof Student]) => (
        <span className="text-muted-foreground">
          {value ? format(parseISO(value as string), "MMM d, yyyy") : "-"}
        </span>
      ),
    },
    {
      title: "",
      key: "actions",
      className: "w-12",
      component: (_value: Student[keyof Student], row: Student) => (
        <DropdownMenu>
          <DropdownMenuTrigger
            className="inline-flex size-7 cursor-pointer items-center justify-center rounded-xl hover:bg-muted hover:text-foreground"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontalIcon className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate(`/students/${row.id}`)}>
              <EyeIcon />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(row)}>
              <PencilIcon />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onReAdmit(row)}>
              <RefreshCcwIcon />
              Re-admit
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
      data={students}
      columns={columns}
      emptyMessage="No students found."
    />
  );
}

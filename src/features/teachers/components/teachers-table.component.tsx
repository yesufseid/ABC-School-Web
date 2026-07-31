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
import type { Teacher } from "../types/teacher.types";

interface TeachersTableProps {
  teachers: Teacher[];
  branchLabel: (branchId: string) => string;
  onEdit: (teacher: Teacher) => void;
  onDelete: (teacher: Teacher) => void;
}

export function TeachersTable({
  teachers,
  branchLabel,
  onEdit,
  onDelete,
}: TeachersTableProps) {
  const navigate = useNavigate();

  const columns = [
    {
      title: "Name",
      key: "firstName",
      component: (_value: Teacher[keyof Teacher], row: Teacher) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/teachers/${row.id}`);
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
      title: "Sex",
      key: "sex",
      component: (value: Teacher[keyof Teacher]) => (
        <span className="text-muted-foreground">{String(value)}</span>
      ),
    },
    {
      title: "Branch",
      key: "branchId",
      component: (value: Teacher[keyof Teacher]) => (
        <span className="text-muted-foreground">
          {branchLabel(String(value))}
        </span>
      ),
    },
    {
      title: "Grades",
      key: "grades",
      component: (_value: Teacher[keyof Teacher], row: Teacher) => (
        <div className="flex flex-wrap gap-1.5">
          {row.grades.map((grade) => (
            <Badge key={grade.gradeId} variant="outline">
              {grade.gradeId.slice(0, 8)}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      title: "Weekly Periods",
      key: "weeklyPeriods",
      component: (value: Teacher[keyof Teacher]) => (
        <span className="text-muted-foreground">{String(value)}</span>
      ),
    },
    {
      title: "Started",
      key: "startingDate",
      component: (value: Teacher[keyof Teacher]) => (
        <span className="text-muted-foreground">
          {value ? format(parseISO(value as string), "MMM d, yyyy") : "-"}
        </span>
      ),
    },
    {
      title: "",
      key: "actions",
      className: "w-12",
      component: (_value: Teacher[keyof Teacher], row: Teacher) => (
        <DropdownMenu>
          <DropdownMenuTrigger
            className="inline-flex size-7 cursor-pointer items-center justify-center rounded-xl hover:bg-muted hover:text-foreground"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontalIcon className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate(`/teachers/${row.id}`)}>
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
      data={teachers}
      columns={columns}
      emptyMessage="No teachers found."
    />
  );
}

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
  BookOpenIcon,
} from "lucide-react";
import type { Grade } from "../types/classes.types";

interface GradesTableProps {
  grades: Grade[];
  onEdit: (grade: Grade) => void;
  onDelete: (grade: Grade) => void;
}

export function GradesTable({ grades, onEdit, onDelete }: GradesTableProps) {
  const columns = [
    {
      title: "Grade",
      key: "grade",
      component: (_value: Grade[keyof Grade], row: Grade) => (
        <p className="font-medium text-foreground">Grade {row.grade}</p>
      ),
    },
    {
      title: "Subjects",
      key: "subjects",
      component: (_value: Grade[keyof Grade], row: Grade) => (
        <div className="flex flex-wrap gap-1.5">
          {row.subjects.map((subject) => (
            <Badge key={subject.id} variant="outline">
              <BookOpenIcon className="size-3" />
              {subject.name}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      title: "Subject Count",
      key: "subjectCount",
      component: (_value: Grade[keyof Grade], row: Grade) => (
        <span className="text-muted-foreground">{row.subjects.length}</span>
      ),
    },
    {
      title: "",
      key: "actions",
      className: "w-12",
      component: (_value: Grade[keyof Grade], row: Grade) => (
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex size-7 cursor-pointer items-center justify-center rounded-xl hover:bg-muted hover:text-foreground">
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
      data={grades}
      columns={columns}
      emptyMessage="No grades found."
    />
  );
}

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
  EyeIcon,
} from "lucide-react";
import type { Section } from "@/features/registration/types/registration.types";

interface ClassesTableProps {
  sections: Section[];
  gradeLabel: (gradeId: string) => string;
  branchLabel: (branchId: string) => string;
  onEdit: (section: Section) => void;
  onDelete: (section: Section) => void;
}

export function ClassesTable({
  sections,
  gradeLabel,
  branchLabel,
  onEdit,
  onDelete,
}: ClassesTableProps) {
  const navigate = useNavigate();

  const columns = [
    {
      title: "Class",
      key: "name",
      component: (_value: Section[keyof Section], row: Section) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/classes/${row.id}`);
          }}
          className="cursor-pointer text-left hover:underline"
        >
          <p className="font-medium text-foreground">
            Grade {gradeLabel(row.gradeId)} · {row.name}
          </p>
          <p className="text-xs text-muted-foreground">{row.id}</p>
        </button>
      ),
    },
    {
      title: "Grade",
      key: "gradeId",
      component: (value: Section[keyof Section]) => (
        <span className="text-foreground">Grade {gradeLabel(String(value))}</span>
      ),
    },
    {
      title: "Year",
      key: "year",
      component: (value: Section[keyof Section]) => (
        <span className="text-muted-foreground">{String(value)}</span>
      ),
    },
    {
      title: "Capacity",
      key: "capacity",
      component: (value: Section[keyof Section]) => (
        <span className="text-muted-foreground">{String(value)}</span>
      ),
    },
    {
      title: "Branch",
      key: "branchId",
      component: (value: Section[keyof Section]) => (
        <span className="text-muted-foreground">
          {branchLabel(String(value))}
        </span>
      ),
    },
    {
      title: "",
      key: "actions",
      className: "w-12",
      component: (_value: Section[keyof Section], row: Section) => (
        <DropdownMenu>
          <DropdownMenuTrigger
            className="inline-flex size-7 cursor-pointer items-center justify-center rounded-xl hover:bg-muted hover:text-foreground"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontalIcon className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate(`/classes/${row.id}`)}>
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
      data={sections}
      columns={columns}
      emptyMessage="No classes found."
    />
  );
}

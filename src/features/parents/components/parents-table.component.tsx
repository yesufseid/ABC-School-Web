import { format, parseISO } from "date-fns";
import { useNavigate } from "react-router";
import { CustomTable } from "@/components/custom/custom-table";
import { Badge } from "@/components/ui/badge";
import type { ParentListItem } from "../types/parent.types";

interface ParentsTableProps {
  parents: ParentListItem[];
}

export function ParentsTable({ parents }: ParentsTableProps) {
  const navigate = useNavigate();

  const columns = [
    {
      title: "Name",
      key: "name",
      component: (
        _value: ParentListItem[keyof ParentListItem],
        row: ParentListItem,
      ) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/parents/${row.id}`);
          }}
          className="cursor-pointer text-left hover:underline"
        >
          <p className="font-medium text-foreground">{row.name}</p>
          <p className="text-xs text-muted-foreground">{row.parentId}</p>
        </button>
      ),
    },
    {
      title: "Sex",
      key: "sex",
      component: (value: ParentListItem[keyof ParentListItem]) => (
        <span className="text-muted-foreground">{String(value)}</span>
      ),
    },
    {
      title: "Phone",
      key: "phone",
      component: (value: ParentListItem[keyof ParentListItem]) => (
        <span className="text-muted-foreground">{String(value)}</span>
      ),
    },
    {
      title: "Children",
      key: "_count",
      component: (
        _value: ParentListItem[keyof ParentListItem],
        row: ParentListItem,
      ) => <Badge variant="outline">{row._count.students}</Badge>,
    },
    {
      title: "Address",
      key: "address",
      component: (value: ParentListItem[keyof ParentListItem]) => (
        <span className="text-muted-foreground">{String(value)}</span>
      ),
    },
    {
      title: "Joined",
      key: "createdAt",
      component: (value: ParentListItem[keyof ParentListItem]) => (
        <span className="text-muted-foreground">
          {value ? format(parseISO(value as string), "MMM d, yyyy") : "-"}
        </span>
      ),
    },
  ];

  return (
    <CustomTable
      data={parents}
      columns={columns}
      emptyMessage="No parents found."
      onRowClick={(row) => navigate(`/parents/${row.id}`)}
    />
  );
}

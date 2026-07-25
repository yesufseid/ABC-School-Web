import type { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Column<T> = {
  title: string;
  key: string;
  component?: (value: T[keyof T], row: T) => ReactNode;
  className?: string;
  headerClassName?: string;
};

type CustomTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
};

export function CustomTable<T>({
  data,
  columns,
  emptyMessage = "No data found.",
  onRowClick,
}: CustomTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-border/50 bg-card/50 p-12 text-center">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead key={col.key} className={col.headerClassName}>
              {col.title}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, i) => (
          <TableRow
            key={i}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
            className={onRowClick ? "cursor-pointer" : undefined}
          >
            {columns.map((col) => {
              const value = row[col.key as keyof T];
              return (
                <TableCell key={col.key} className={col.className}>
                  {col.component
                    ? col.component(value, row)
                    : String(value ?? "")}
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ListWidget } from "../types/dashboard.types";

type ListCardProps = {
  data: ListWidget;
};

export function ListCard({ data }: ListCardProps) {
  return (
    <Card className="border-border/40 bg-card/80">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          {data.title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {data.columns.map((column) => (
                <TableHead
                  key={column.key}
                  className="text-xs uppercase tracking-wider"
                >
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={data.columns.length}
                  className="text-center text-muted-foreground"
                >
                  No records yet
                </TableCell>
              </TableRow>
            ) : (
              data.rows.map((row, index) => (
                <TableRow key={index}>
                  {data.columns.map((column) => (
                    <TableCell key={column.key}>
                      {row[column.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

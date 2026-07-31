import { useState } from "react";
import { format, parseISO } from "date-fns";
import { CheckIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CustomTable } from "@/components/custom/custom-table";
import { ConfirmDialog } from "@/features/schools/components/confirm-dialog.component";
import { useFetchCorrections, useApproveCorrection, useRejectCorrection } from "../api/academics.api";

const STATUS_OPTIONS = ["PENDING", "APPROVED", "REJECTED"] as const;

const STATUS_STYLES: Record<string, "default" | "secondary" | "success" | "destructive" | "warning"> = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "destructive",
};

function ApproveButton({ correctionId }: { correctionId: string }) {
  const approve = useApproveCorrection(correctionId);
  return (
    <Button
      size="sm"
      variant="outline"
      className="text-emerald-600 dark:text-emerald-400"
      onClick={() => approve.mutate(undefined)}
      disabled={approve.isPending}
    >
      <CheckIcon />
      {approve.isPending ? "..." : "Approve"}
    </Button>
  );
}

function RejectButton({ correctionId }: { correctionId: string }) {
  const reject = useRejectCorrection(correctionId);
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        className="text-red-600 dark:text-red-400"
        onClick={() => setOpen(true)}
        disabled={reject.isPending}
      >
        <XIcon />
        {reject.isPending ? "..." : "Reject"}
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Reject Correction"
        description="Are you sure you want to reject this correction request?"
        confirmLabel="Reject"
        onConfirm={() => reject.mutate({ note: "Rejected" })}
        isPending={reject.isPending}
      />
    </>
  );
}

export function CorrectionsComponent() {
  const [status, setStatus] = useState<"PENDING" | "APPROVED" | "REJECTED">("PENDING");

  const { data: correctionsData, isLoading } = useFetchCorrections(status);
  const corrections = correctionsData?.data ?? [];

  const columns = [
    {
      title: "Reason",
      key: "reason",
      component: (value: (typeof corrections)[number][keyof (typeof corrections)[number]]) => (
        <span className="text-muted-foreground">{String(value)}</span>
      ),
    },
    {
      title: "New Score",
      key: "newScore",
      component: (value: (typeof corrections)[number][keyof (typeof corrections)[number]]) => (
        <span className="font-medium text-foreground">{String(value)}</span>
      ),
    },
    {
      title: "Status",
      key: "status",
      component: (value: (typeof corrections)[number][keyof (typeof corrections)[number]]) => (
        <Badge variant={STATUS_STYLES[String(value)] ?? "secondary"}>
          {String(value)}
        </Badge>
      ),
    },
    {
      title: "Created",
      key: "createdAt",
      component: (value: (typeof corrections)[number][keyof (typeof corrections)[number]]) => (
        <span className="text-muted-foreground">
          {value ? format(parseISO(String(value)), "MMM d, yyyy") : "-"}
        </span>
      ),
    },
    {
      title: "",
      key: "actions",
      className: "w-32",
      component: (_value: (typeof corrections)[number][keyof (typeof corrections)[number]], row: (typeof corrections)[number]) =>
        row.status === "PENDING" ? (
          <div className="flex gap-1.5">
            <ApproveButton correctionId={row.id} />
            <RejectButton correctionId={row.id} />
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">-</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <Select
              className="w-44"
              value={status}
              onChange={(e) => setStatus(e.target.value as "PENDING" | "APPROVED" | "REJECTED")}
              aria-label="Correction status"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option.charAt(0) + option.slice(1).toLowerCase()}
                </option>
              ))}
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Correction Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Loading corrections...
            </p>
          ) : (
            <CustomTable
              data={corrections}
              columns={columns}
              emptyMessage="No correction requests found."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

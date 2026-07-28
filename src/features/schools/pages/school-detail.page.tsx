import { useParams, useNavigate } from "react-router";
import { format, parseISO } from "date-fns";
import { ArrowLeftIcon, LoaderCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CustomTable } from "@/components/custom/custom-table";
import { useFetchSchoolDetail } from "../api/schools.api";

export function SchoolDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useFetchSchoolDetail(id ?? "");

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <LoaderCircleIcon className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate("/schools")}>
          <ArrowLeftIcon />
          Back to Schools
        </Button>
        <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center">
          <p className="text-sm text-destructive">
            Failed to load school details.
          </p>
        </div>
      </div>
    );
  }

  const school = data.data;
  const isSubActive = (endDate: string) => new Date(endDate) > new Date();

  const memberColumns = [
    {
      title: "Name",
      key: "name",
      className: "font-medium",
    },
    {
      title: "Phone",
      key: "phoneNumber",
      className: "text-muted-foreground",
    },
    {
      title: "Role",
      key: "type",
      component: (value: unknown) => (
        <Badge variant="outline">{String(value)}</Badge>
      ),
    },
  ];

  const subscriptionColumns = [
    {
      title: "Plan",
      key: "subscription",
      component: (value: unknown) => {
        const sub = value as { name: string };
        return <span className="font-medium">{sub.name}</span>;
      },
    },
    {
      title: "Duration",
      key: "subscription",
      component: (value: unknown) => {
        const sub = value as { months: number };
        return (
          <span>
            {sub.months} {sub.months === 1 ? "month" : "months"}
          </span>
        );
      },
    },
    {
      title: "Price",
      key: "subscription",
      component: (value: unknown) => {
        const sub = value as { price: number };
        return <span>{sub.price.toLocaleString()}</span>;
      },
    },
    {
      title: "Paid",
      key: "paidAmount",
      component: (value: unknown) => (
        <span>{(value as number).toLocaleString()}</span>
      ),
    },
    {
      title: "Start",
      key: "startDate",
      component: (value: unknown) => (
        <span>{format(parseISO(value as string), "MMM d, yyyy")}</span>
      ),
    },
    {
      title: "End",
      key: "endDate",
      component: (value: unknown) => (
        <span>{format(parseISO(value as string), "MMM d, yyyy")}</span>
      ),
    },
    {
      title: "Status",
      key: "endDate",
      component: (value: unknown) =>
        isSubActive(value as string) ? (
          <Badge variant="success">Active</Badge>
        ) : (
          <Badge variant="secondary">Expired</Badge>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/schools")}>
          <ArrowLeftIcon />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {school.name}
          </h1>
          <p className="text-sm text-muted-foreground">{school.description}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Owner</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-xs text-muted-foreground">Name</p>
              <p className="text-sm font-medium">{school.owner.name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="text-sm font-medium">{school.owner.phoneNumber}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Branch Code</p>
              <p className="text-sm font-medium font-mono">{school.branchCode}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Branch Prefix</p>
              <p className="text-sm font-medium font-mono">{school.branchPrefix}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Created</p>
              <p className="text-sm font-medium">
                {format(parseISO(school.createdAt), "MMM d, yyyy 'at' h:mm a")}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Details</CardTitle>
          </CardHeader>
          <CardContent>
            {school.details && Object.keys(school.details).length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {Object.entries(school.details).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-xs text-muted-foreground">{key}</p>
                    <p className="text-sm font-medium">{String(value)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No additional details.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Members ({school.members.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CustomTable
            data={school.members}
            columns={memberColumns}
            emptyMessage="No members."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Subscriptions ({school.tenantSubscriptions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CustomTable
            data={school.tenantSubscriptions}
            columns={subscriptionColumns}
            emptyMessage="No subscriptions."
          />
        </CardContent>
      </Card>
    </div>
  );
}

import { useParams, useNavigate } from "react-router";
import { format, parseISO } from "date-fns";
import { ArrowLeftIcon, LoaderCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CustomTable } from "@/components/custom/custom-table";
import { useFetchSubscriptionDetail } from "../api/subscriptions.api";

export function SubscriptionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useFetchSubscriptionDetail(id ?? "");

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
        <Button variant="ghost" onClick={() => navigate("/subscriptions")}>
          <ArrowLeftIcon />
          Back to Subscriptions
        </Button>
        <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center">
          <p className="text-sm text-destructive">
            Failed to load subscription details.
          </p>
        </div>
      </div>
    );
  }

  const subscription = data.data;
  const isSubActive = (endDate: string) => new Date(endDate) > new Date();

  const schoolColumns = [
    {
      title: "School",
      key: "tenantName",
      className: "font-mono text-xs",
    },
    {
      title: "Paid",
      key: "paidAmount",
      component: (value: unknown) => (
        <span>{(value as number).toLocaleString()}</span>
      ),
    },
    {
      title: "Start Date",
      key: "startDate",
      component: (value: unknown) => (
        <span>{format(parseISO(value as string), "MMM d, yyyy")}</span>
      ),
    },
    {
      title: "End Date",
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
        <Button variant="ghost" onClick={() => navigate("/subscriptions")}>
          <ArrowLeftIcon />
          Back
        </Button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {subscription.name}
            </h1>
            {subscription.active ? (
              <Badge variant="success">Active</Badge>
            ) : (
              <Badge variant="secondary">Inactive</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {subscription.months}{" "}
            {subscription.months === 1 ? "month" : "months"} plan
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-xs text-muted-foreground">Price</p>
              <p className="text-2xl font-bold">
                ${subscription.price.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Per</p>
              <p className="text-sm font-medium">
                {subscription.months}{" "}
                {subscription.months === 1 ? "month" : "months"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Dates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-xs text-muted-foreground">Created</p>
              <p className="text-sm font-medium">
                {format(parseISO(subscription.createdAt), "MMM d, yyyy")}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Last Updated</p>
              <p className="text-sm font-medium">
                {format(parseISO(subscription.updatedAt), "MMM d, yyyy")}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Features</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(subscription.features).length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {Object.entries(subscription.features).map(([key, value]) => (
                  <Badge key={key} variant="outline">
                    {key}: {String(value)}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No features defined.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Schools on this Plan ({subscription.tenantSubscriptions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CustomTable
            data={subscription.tenantSubscriptions}
            columns={schoolColumns}
            emptyMessage="No schools subscribed to this plan."
            onRowClick={(row) => navigate(`/schools/${row.tenantId}`)}
          />
        </CardContent>
      </Card>
    </div>
  );
}

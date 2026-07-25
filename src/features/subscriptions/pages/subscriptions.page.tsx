import { useState } from "react";
import { PlusIcon, RefreshCwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useFetchSubscriptions,
  useCreateSubscription,
  useUpdateSubscription,
  useDeleteSubscription,
} from "../api/subscriptions.api";
import { SubscriptionsTable } from "../components/subscriptions-table.component";
import { SubscriptionForm } from "../components/subscription-form.component";
import { ConfirmDialog } from "@/features/schools/components/confirm-dialog.component";
import type { Subscription } from "../types/subscription.types";
import type { CreateSubscriptionFormValues } from "../schemas/subscription.schema";

export function SubscriptionsPage() {
  const { data, isLoading, refetch } = useFetchSubscriptions();
  const subscriptions = data?.data ?? [];

  const createSubscription = useCreateSubscription();
  const deleteSubscription = useDeleteSubscription();

  const [formOpen, setFormOpen] = useState(false);
  const [editingSubscriptionId, setEditingSubscriptionId] =
    useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingSubscription, setDeletingSubscription] =
    useState<Subscription | null>(null);

  const updateSubscription = useUpdateSubscription(
    editingSubscriptionId ?? "",
  );

  const handleCreate = () => {
    setEditingSubscriptionId(null);
    setFormOpen(true);
  };

  const handleEdit = (subscription: Subscription) => {
    setEditingSubscriptionId(subscription.id);
    setFormOpen(true);
  };

  const handleDelete = (subscription: Subscription) => {
    setDeletingSubscription(subscription);
    setDeleteConfirmOpen(true);
  };

  const handleSubmit = (values: CreateSubscriptionFormValues) => {
    const payload = {
      ...values,
      features: values.features as Record<string, string | number | boolean>,
    };
    if (editingSubscriptionId) {
      updateSubscription.mutate(payload, {
        onSuccess: () => {
          setFormOpen(false);
          setEditingSubscriptionId(null);
        },
      });
    } else {
      createSubscription.mutate(payload, {
        onSuccess: () => {
          setFormOpen(false);
        },
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingSubscription) {
      deleteSubscription.mutate(deletingSubscription.id, {
        onSuccess: () => {
          setDeleteConfirmOpen(false);
          setDeletingSubscription(null);
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Subscriptions
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage subscription plans
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCwIcon />
            Refresh
          </Button>
          <Button onClick={handleCreate}>
            <PlusIcon />
            Add Plan
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-border/50 bg-card/50 p-12 text-center">
          <p className="text-muted-foreground">Loading subscriptions...</p>
        </div>
      ) : (
        <SubscriptionsTable
          subscriptions={subscriptions}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <SubscriptionForm
        open={formOpen}
        onOpenChange={setFormOpen}
        subscriptionId={editingSubscriptionId}
        onSubmit={handleSubmit}
        isPending={createSubscription.isPending || updateSubscription.isPending}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Subscription"
        description={`Are you sure you want to delete "${deletingSubscription?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        isPending={deleteSubscription.isPending}
      />
    </div>
  );
}

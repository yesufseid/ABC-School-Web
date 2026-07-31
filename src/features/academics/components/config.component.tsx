import { useState } from "react";
import { format, parseISO } from "date-fns";
import { PlusIcon, PencilIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomTable } from "@/components/custom/custom-table";
import { ConfirmDialog } from "@/features/schools/components/confirm-dialog.component";
import {
  useFetchSlots,
  useCreateSlot,
  useUpdateSlot,
  useDeleteSlot,
  useFetchGradingRules,
  useCreateGradingRule,
  useUpdateGradingRule,
  useDeleteGradingRule,
} from "../api/academics.api";
import { SlotForm } from "../forms/assessment-slot.form";
import type { SlotFormValues } from "../forms/assessment-slot.form";
import { GradingRuleForm } from "../forms/grading-rule.form";
import type { RuleFormValues } from "../forms/grading-rule.form";
import type { AssessmentSlot, GradingRule } from "../types/academics.types";

const SLOT_TYPE_STYLES: Record<string, "default" | "secondary" | "success" | "warning"> = {
  TEST: "secondary",
  MID_ASSIGNMENT: "warning",
  FINAL: "success",
  ASSESSMENT_COMPONENT: "default",
};

export function ConfigComponent() {
  const { data: slotsData, isLoading: slotsLoading } = useFetchSlots();
  const slots = slotsData?.data ?? [];

  const { data: rulesData, isLoading: rulesLoading } = useFetchGradingRules();
  const rules = rulesData?.data ?? [];

  const createSlot = useCreateSlot();
  const deleteSlot = useDeleteSlot();

  const createRule = useCreateGradingRule();
  const deleteRule = useDeleteGradingRule();

  const [slotFormOpen, setSlotFormOpen] = useState(false);
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
  const [deleteSlotOpen, setDeleteSlotOpen] = useState(false);
  const [deletingSlot, setDeletingSlot] = useState<AssessmentSlot | null>(null);

  const [ruleFormOpen, setRuleFormOpen] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [deleteRuleOpen, setDeleteRuleOpen] = useState(false);
  const [deletingRule, setDeletingRule] = useState<GradingRule | null>(null);

  const updateSlot = useUpdateSlot(editingSlotId ?? "");
  const updateRule = useUpdateGradingRule(editingRuleId ?? "");

  const handleSlotSubmit = (values: SlotFormValues) => {
    if (editingSlotId) {
      updateSlot.mutate(
        values,
        {
          onSuccess: () => {
            setSlotFormOpen(false);
            setEditingSlotId(null);
          },
        },
      );
    } else {
      createSlot.mutate(values, {
        onSuccess: () => {
          setSlotFormOpen(false);
        },
      });
    }
  };

  const handleRuleSubmit = (values: RuleFormValues) => {
    if (editingRuleId) {
      updateRule.mutate(
        values,
        {
          onSuccess: () => {
            setRuleFormOpen(false);
            setEditingRuleId(null);
          },
        },
      );
    } else {
      createRule.mutate(values, {
        onSuccess: () => {
          setRuleFormOpen(false);
        },
      });
    }
  };

  const slotColumns = [
    {
      title: "Name",
      key: "name",
      component: (value: (typeof slots)[number][keyof (typeof slots)[number]]) => (
        <span className="font-medium text-foreground">{String(value)}</span>
      ),
    },
    {
      title: "Type",
      key: "slotType",
      component: (value: (typeof slots)[number][keyof (typeof slots)[number]]) => (
        <Badge variant={SLOT_TYPE_STYLES[String(value)] ?? "secondary"}>
          {String(value)}
        </Badge>
      ),
    },
    {
      title: "Weight",
      key: "weight",
      component: (value: (typeof slots)[number][keyof (typeof slots)[number]]) => (
        <span className="text-muted-foreground">{String(value)}</span>
      ),
    },
    {
      title: "Max Mark",
      key: "maxMark",
      component: (value: (typeof slots)[number][keyof (typeof slots)[number]]) => (
        <span className="text-muted-foreground">{String(value)}</span>
      ),
    },
    {
      title: "Grade Cycle",
      key: "gradeCycle",
      component: (value: (typeof slots)[number][keyof (typeof slots)[number]]) => (
        <span className="text-muted-foreground">{String(value)}</span>
      ),
    },
    {
      title: "",
      key: "actions",
      className: "w-24",
      component: (_value: (typeof slots)[number][keyof (typeof slots)[number]], row: (typeof slots)[number]) => (
        <div className="flex gap-1.5">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setEditingSlotId(row.id);
              setSlotFormOpen(true);
            }}
          >
            <PencilIcon />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-red-600 dark:text-red-400"
            onClick={() => {
              setDeletingSlot(row);
              setDeleteSlotOpen(true);
            }}
          >
            <TrashIcon />
          </Button>
        </div>
      ),
    },
  ];

  const ruleColumns = [
    {
      title: "Grade",
      key: "grade",
      component: (value: (typeof rules)[number][keyof (typeof rules)[number]]) => (
        <span className="font-bold text-foreground">{String(value)}</span>
      ),
    },
    {
      title: "Range",
      key: "minMarks",
      component: (_value: (typeof rules)[number][keyof (typeof rules)[number]], row: (typeof rules)[number]) => (
        <span className="text-muted-foreground">
          {row.minMarks} - {row.maxMarks}
        </span>
      ),
    },
    {
      title: "Points",
      key: "points",
      component: (value: (typeof rules)[number][keyof (typeof rules)[number]]) => (
        <span className="text-muted-foreground">{String(value)}</span>
      ),
    },
    {
      title: "Result",
      key: "isPass",
      component: (value: (typeof rules)[number][keyof (typeof rules)[number]]) => (
        <Badge variant={value ? "success" : "destructive"}>
          {value ? "Pass" : "Fail"}
        </Badge>
      ),
    },
    {
      title: "Created",
      key: "createdAt",
      component: (value: (typeof rules)[number][keyof (typeof rules)[number]]) => (
        <span className="text-muted-foreground">
          {value ? format(parseISO(String(value)), "MMM d, yyyy") : "-"}
        </span>
      ),
    },
    {
      title: "",
      key: "actions",
      className: "w-24",
      component: (_value: (typeof rules)[number][keyof (typeof rules)[number]], row: (typeof rules)[number]) => (
        <div className="flex gap-1.5">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setEditingRuleId(row.id);
              setRuleFormOpen(true);
            }}
          >
            <PencilIcon />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-red-600 dark:text-red-400"
            onClick={() => {
              setDeletingRule(row);
              setDeleteRuleOpen(true);
            }}
          >
            <TrashIcon />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Assessment Slots</CardTitle>
            <Button
              size="sm"
              onClick={() => {
                setEditingSlotId(null);
                setSlotFormOpen(true);
              }}
            >
              <PlusIcon />
              Add Slot
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {slotsLoading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Loading slots...
            </p>
          ) : (
            <CustomTable
              data={slots}
              columns={slotColumns}
              emptyMessage="No assessment slots configured."
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Grading Rules</CardTitle>
            <Button
              size="sm"
              onClick={() => {
                setEditingRuleId(null);
                setRuleFormOpen(true);
              }}
            >
              <PlusIcon />
              Add Rule
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {rulesLoading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Loading grading rules...
            </p>
          ) : (
            <CustomTable
              data={rules}
              columns={ruleColumns}
              emptyMessage="No grading rules configured."
            />
          )}
        </CardContent>
      </Card>

      <SlotForm
        open={slotFormOpen}
        onOpenChange={setSlotFormOpen}
        slotId={editingSlotId}
        onSubmit={handleSlotSubmit}
        isPending={createSlot.isPending || updateSlot.isPending}
      />

      <GradingRuleForm
        open={ruleFormOpen}
        onOpenChange={setRuleFormOpen}
        ruleId={editingRuleId}
        onSubmit={handleRuleSubmit}
        isPending={createRule.isPending || updateRule.isPending}
      />

      <ConfirmDialog
        open={deleteSlotOpen}
        onOpenChange={setDeleteSlotOpen}
        title="Delete Assessment Slot"
        description={`Are you sure you want to delete "${deletingSlot?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={() => {
          if (deletingSlot) {
            deleteSlot.mutate(deletingSlot.id, {
              onSuccess: () => {
                setDeleteSlotOpen(false);
                setDeletingSlot(null);
              },
            });
          }
        }}
        isPending={deleteSlot.isPending}
      />

      <ConfirmDialog
        open={deleteRuleOpen}
        onOpenChange={setDeleteRuleOpen}
        title="Delete Grading Rule"
        description={`Are you sure you want to delete grade "${deletingRule?.grade}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={() => {
          if (deletingRule) {
            deleteRule.mutate(deletingRule.id, {
              onSuccess: () => {
                setDeleteRuleOpen(false);
                setDeletingRule(null);
              },
            });
          }
        }}
        isPending={deleteRule.isPending}
      />
    </div>
  );
}

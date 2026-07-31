import { PlusIcon, TrashIcon } from "lucide-react";
import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { GradeFieldsProps } from "../types";

export function SubjectsFields({
  control,
  errors,
  fields,
  append,
  remove,
}: GradeFieldsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">Subjects</label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ name: "" })}
        >
          <PlusIcon />
          Add Subject
        </Button>
      </div>

      {errors.subjects?.message && (
        <p className="text-sm text-destructive">{errors.subjects.message}</p>
      )}

      {fields.length === 0 && (
        <p className="text-xs text-muted-foreground">
          No subjects added yet.
        </p>
      )}

      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center gap-2">
          <Controller
            control={control}
            name={`subjects.${index}.name`}
            render={({ field: subjectField }) => (
              <Input
                placeholder={`Subject ${index + 1} (e.g. Mathematics)`}
                aria-invalid={!!errors.subjects?.[index]?.name}
                {...subjectField}
              />
            )}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 text-destructive hover:text-destructive"
            onClick={() => remove(index)}
          >
            <TrashIcon className="size-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}

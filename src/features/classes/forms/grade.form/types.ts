import type { Control, FieldErrors } from "react-hook-form";
import type {
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFieldArrayReturn,
} from "react-hook-form";
import type { GradeFormValues } from "./schema";

export interface GradeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gradeId?: string | null;
  onSubmit: (values: GradeFormValues) => void;
  isPending: boolean;
}

export type GradeFieldsProps = {
  control: Control<GradeFormValues>;
  errors: FieldErrors<GradeFormValues>;
  fields: UseFieldArrayReturn<GradeFormValues, "subjects">["fields"];
  append: UseFieldArrayAppend<GradeFormValues, "subjects">;
  remove: UseFieldArrayRemove;
};

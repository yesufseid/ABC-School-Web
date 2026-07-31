import type { Control, FieldErrors } from "react-hook-form";
import type {
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFieldArrayReturn,
} from "react-hook-form";
import type { Grade } from "@/features/classes/types/classes.types";
import type { TeacherFormValues } from "./schema";

export interface TeacherFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacherId?: string | null;
  onSubmit: (values: TeacherFormValues) => void;
  isPending: boolean;
}

export type TeacherInfoFieldsProps = {
  control: Control<TeacherFormValues>;
  errors: FieldErrors<TeacherFormValues>;
};

export type TeacherGradesFieldsProps = {
  control: Control<TeacherFormValues>;
  errors: FieldErrors<TeacherFormValues>;
  fields: UseFieldArrayReturn<TeacherFormValues, "grades">["fields"];
  append: UseFieldArrayAppend<TeacherFormValues, "grades">;
  remove: UseFieldArrayRemove;
  grades: Grade[];
};

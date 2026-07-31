import type {
  Control,
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
} from "react-hook-form";
import type { StudentFormValues } from "./schema";

export type RegisterStudentFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentId?: string | null;
  onSubmit: (values: StudentFormValues) => void;
  isPending: boolean;
};

export type StudentInfoFieldsProps = {
  control: Control<StudentFormValues>;
  errors: FieldErrors<StudentFormValues>;
};

export type ParentsFieldsProps = StudentInfoFieldsProps & {
  fields: FieldArrayWithId<StudentFormValues, "parents", "id">[];
  append: UseFieldArrayAppend<StudentFormValues, "parents">;
  remove: UseFieldArrayRemove;
};

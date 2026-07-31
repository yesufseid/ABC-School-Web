import { Controller } from "react-hook-form";
import { PlusIcon, TrashIcon, CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import type { TeacherGradesFieldsProps } from "../types";

export function TeacherGradesFields({
  control,
  errors,
  fields,
  append,
  remove,
  grades,
}: TeacherGradesFieldsProps) {
  const toggleSubject = (
    current: string[] | undefined,
    subjectId: string,
    onChange: (value: string[]) => void,
  ) => {
    const list = current ?? [];
    onChange(
      list.includes(subjectId)
        ? list.filter((id) => id !== subjectId)
        : [...list, subjectId],
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">
          Assigned Grades
        </label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ gradeId: "", subjectIds: [] })}
        >
          <PlusIcon />
          Add Grade
        </Button>
      </div>

      {errors.grades?.message && (
        <p className="text-sm text-destructive">{errors.grades.message}</p>
      )}

      {fields.length === 0 && (
        <p className="text-xs text-muted-foreground">
          No grades assigned yet.
        </p>
      )}

      {fields.map((field, index) => {
        const selectedGradeId = field.gradeId;
        const selectedGrade = grades.find(
          (grade) => grade.id === selectedGradeId,
        );

        return (
          <div
            key={field.id}
            className="space-y-3 rounded-xl border border-border/50 p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-foreground">
                Grade {index + 1}
              </p>
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

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Grade
              </label>
              <Controller
                control={control}
                name={`grades.${index}.gradeId`}
                render={({ field: gradeField }) => (
                  <Select {...gradeField}>
                    <option value="" disabled>
                      Select grade
                    </option>
                    {grades.map((grade) => (
                      <option key={grade.id} value={grade.id}>
                        Grade {grade.grade}
                      </option>
                    ))}
                  </Select>
                )}
              />
            </div>

            {selectedGrade && selectedGrade.subjects.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Subjects
                </label>
                <Controller
                  control={control}
                  name={`grades.${index}.subjectIds`}
                  render={({ field: subjectField }) => (
                    <div className="flex flex-wrap gap-2">
                      {selectedGrade.subjects.map((subject) => {
                        const isSelected =
                          (subjectField.value ?? []).includes(subject.id);
                        return (
                          <button
                            key={subject.id}
                            type="button"
                            onClick={() =>
                              toggleSubject(
                                subjectField.value,
                                subject.id,
                                subjectField.onChange,
                              )
                            }
                            className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors ${
                              isSelected
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border text-muted-foreground hover:bg-muted"
                            }`}
                          >
                            {isSelected && <CheckIcon className="size-3" />}
                            {subject.name}
                          </button>
                        );
                      })}
                    </div>
                  )}
                />
                {errors.grades?.[index]?.subjectIds && (
                  <p className="text-sm text-destructive">
                    {errors.grades[index].subjectIds.message}
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

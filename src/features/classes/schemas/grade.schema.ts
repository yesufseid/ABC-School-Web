import { z } from "zod";

export const subjectSchema = z.object({
  name: z.string().min(1, "Subject name is required"),
});

export const gradeSchema = z.object({
  grade: z.coerce.number().min(1, "Grade level is required").max(12, "Grade level must be between 1 and 12"),
  subjects: z.array(subjectSchema).min(1, "Add at least one subject"),
});

export type GradeFormValues = z.infer<typeof gradeSchema>;
export type SubjectFormValues = z.infer<typeof subjectSchema>;

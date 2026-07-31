import { z } from "zod";

export const teacherGradeSchema = z.object({
  gradeId: z.string().min(1, "Grade is required"),
  subjectIds: z.array(z.string()).min(1, "Select at least one subject"),
});

export const teacherSchema = z.object({
  branchId: z.string().min(1, "Branch is required"),
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  sex: z.enum(["Male", "Female"]),
  startingDate: z.string().min(1, "Starting date is required"),
  weeklyPeriods: z.coerce
    .number()
    .min(1, "Weekly periods must be at least 1"),
  grades: z.array(teacherGradeSchema).min(1, "Assign at least one grade"),
});

export type TeacherFormValues = z.infer<typeof teacherSchema>;
export type TeacherGradeFormValues = z.infer<typeof teacherGradeSchema>;

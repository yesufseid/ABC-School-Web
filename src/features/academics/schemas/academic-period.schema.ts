import { z } from "zod";

export const academicPeriodSchema = z.object({
  name: z.string().min(1, "Name is required"),
  sequence: z.coerce.number().min(1, "Sequence must be at least 1").max(10, "Sequence must be at most 10"),
  type: z.enum(["SEMESTER", "TERM"]),
  startDate: z.string().date("Start date is required"),
  endDate: z.string().date("End date is required"),
});

export type AcademicPeriodFormValues = z.infer<typeof academicPeriodSchema>;

import { z } from "zod";

export const academicYearSchema = z.object({
  name: z.string().min(1, "Name is required"),
  calendarType: z.enum(["SEMESTER", "TERM"]),
  startDate: z.string().date("Start date is required"),
  endDate: z.string().date("End date is required"),
  status: z.enum(["ACTIVE", "COMPLETED", "CLOSED"]),
  isCurrent: z.boolean(),
});

export type AcademicYearFormValues = z.infer<typeof academicYearSchema>;

import { z } from "zod";

export const sectionSchema = z.object({
  name: z.string().min(1, "Section name is required"),
  year: z.string().min(1, "Year is required"),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
  gradeId: z.string().min(1, "Grade is required"),
  branchId: z.string().min(1, "Branch is required"),
});

export type SectionFormValues = z.infer<typeof sectionSchema>;

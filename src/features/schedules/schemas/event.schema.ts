import { z } from "zod";

export const eventSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    category: z.enum([
      "Academic",
      "Examination",
      "Holiday",
      "Meeting",
      "Sports",
      "Training",
      "Administration",
      "Other",
    ]),
    description: z.string().optional(),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    branchIds: z.array(z.string()).min(1, "Select at least one branch"),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date must be on or after start date",
    path: ["endDate"],
  });

export type EventFormValues = z.infer<typeof eventSchema>;

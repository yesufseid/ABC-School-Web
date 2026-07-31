import { z } from "zod";

export const gradingRuleSchema = z.object({
  minMarks: z.coerce.number().min(0, "Min marks must be at least 0"),
  maxMarks: z.coerce.number().min(1, "Max marks must be at least 1"),
  grade: z.string().min(1, "Grade letter is required"),
  points: z.coerce.number().min(0, "Points must be at least 0"),
  isPass: z.boolean().default(true),
});

export type GradingRuleFormValues = z.infer<typeof gradingRuleSchema>;

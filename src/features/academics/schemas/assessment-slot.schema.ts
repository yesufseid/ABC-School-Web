import { z } from "zod";

export const assessmentSlotSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slotType: z.enum(["TEST", "MID_ASSIGNMENT", "FINAL", "ASSESSMENT_COMPONENT"]),
  weight: z.coerce.number().min(0, "Weight must be at least 0").max(1, "Weight must be at most 1"),
  maxMark: z.coerce.number().min(1, "Max mark must be at least 1"),
  gradeCycle: z.enum(["KG", "LOWER_PRIMARY", "UPPER_PRIMARY", "SECONDARY"]),
});

export type AssessmentSlotFormValues = z.infer<typeof assessmentSlotSchema>;

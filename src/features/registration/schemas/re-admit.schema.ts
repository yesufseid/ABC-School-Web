import { z } from "zod";

export const reAdmitSchema = z.object({
  scenario: z.enum(["GRADE_PROMOTION", "RE_ENROLLMENT", "BRANCH_TRANSFER"]),
  startingGrade: z.coerce.number().optional(),
  branchId: z.string().optional(),
  sectionId: z.string().optional(),
  address: z.string().optional(),
});

export type ReAdmitFormValues = z.infer<typeof reAdmitSchema>;

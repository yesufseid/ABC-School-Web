import { z } from "zod";

export const principalSchema = z.object({
  branchId: z.string().min(1, "Branch is required"),
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  phone: z
    .string()
    .min(1, "Phone is required")
    .transform((val) => {
      const digits = val.replace(/[\s\-()]/g, "");
      const local = digits.replace(/^\+?251/, "");
      const subscriber = local.replace(/^0/, "");
      return `+251${subscriber}`;
    }),
  email: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  sex: z.enum(["Male", "Female"]),
  startingDate: z.string().min(1, "Starting date is required"),
  isVicePrincipal: z.boolean().default(false),
});

export type PrincipalFormValues = z.infer<typeof principalSchema>;

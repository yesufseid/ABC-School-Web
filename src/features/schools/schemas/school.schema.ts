import { z } from "zod";

const phoneRegex = /^\+?251(?:0?[79]|7|9)\d{8}$/;
const localPhoneRegex = /^(?:0?[79]|7|9)\d{8}$/;

export const schoolSchema = z.object({
  ownerPhone: z
    .string()
    .min(1, "Phone number is required")
    .refine(
      (val) => {
        const digits = val.replace(/[\s\-()]/g, "");
        if (/^\+?251/.test(digits)) {
          return phoneRegex.test(digits);
        }
        return localPhoneRegex.test(digits);
      },
      {
        message:
          "Enter a valid Ethiopian phone number (e.g. 0912345678, +251912345678)",
      },
    )
    .transform((val) => {
      const digits = val.replace(/[\s\-()]/g, "");
      const local = digits.replace(/^\+?251/, "");
      const subscriber = local.replace(/^0/, "");
      return `+251${subscriber}`;
    }),
  ownerName: z.string().min(1, "Owner name is required"),
  password: z.string().optional(),
  name: z.string().min(1, "School name is required"),
  description: z.string().min(1, "Description is required"),
  details: z
    .array(
      z.object({
        key: z.string().min(1, "Key is required"),
        value: z.union([
          z.string().min(1, "Value is required"),
          z.number(),
          z.boolean(),
        ]),
      }),
    )
    .optional(),
});

export type SchoolFormValues = z.infer<typeof schoolSchema>;

export const branchSchema = z.object({
  name: z.string().min(1, "Branch name is required"),
  description: z.string().min(1, "Description is required"),
  branchCode: z.string().min(1, "Branch code is required"),
  branchPrefix: z.string().min(1, "Branch prefix is required"),
  details: z
    .array(
      z.object({
        key: z.string().min(1, "Key is required"),
        value: z.union([
          z.string().min(1, "Value is required"),
          z.number(),
          z.boolean(),
        ]),
      }),
    )
    .optional(),
});

export type BranchFormValues = z.infer<typeof branchSchema>;

const initialBranchSchema = branchSchema.partial().refine(
  (val) => {
    const hasAny = val.name || val.description || val.branchCode || val.branchPrefix;
    if (!hasAny) return true;
    return !!val.name && !!val.description && !!val.branchCode && !!val.branchPrefix;
  },
  {
    message: "All branch fields are required when adding an initial branch",
    path: ["name"],
  },
);

export const createSchoolSchema = schoolSchema.extend({
  initialBranch: initialBranchSchema.optional(),
});

export type CreateSchoolFormValues = z.infer<typeof createSchoolSchema>;

export const subscribeSchoolSchema = z.object({
  subscriptionId: z.string().min(1, "Subscription is required"),
  startDate: z.string().min(1, "Start date is required"),
  paidAmount: z
    .number({ error: "Paid amount must be a number" })
    .positive("Paid amount must be positive"),
});

export type SubscribeSchoolFormValues = z.infer<typeof subscribeSchoolSchema>;

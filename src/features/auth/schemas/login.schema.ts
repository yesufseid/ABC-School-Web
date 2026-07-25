import { z } from "zod";

export const loginSchema = z
  .object({
    phoneNumber: z
      .string()
      .min(1, "Phone number is required")
      .refine(
        (val) => {
          const digits = val.replace(/[\s\-()]/g, "");
          if (/^\+?251/.test(digits)) {
            return /^\+?251(?:0?[79]|7|9)\d{8}$/.test(digits);
          }
          return /^(?:0?[79]|7|9)\d{8}$/.test(digits);
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
    password: z.string().min(1, "Password is required"),
  });

export type LoginFormValues = z.infer<typeof loginSchema>;

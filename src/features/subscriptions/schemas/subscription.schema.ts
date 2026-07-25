import { z } from "zod";

export const createSubscriptionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  months: z
    .number()
    .int()
    .min(1, "Must be at least 1 month"),
  price: z
    .number()
    .min(0, "Price must be non-negative"),
  active: z.boolean().default(true),
  features: z
    .record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
    .default({}),
});

export type CreateSubscriptionFormValues = z.infer<
  typeof createSubscriptionSchema
>;

export const updateSubscriptionSchema = createSubscriptionSchema.partial();

export type UpdateSubscriptionFormValues = z.infer<
  typeof updateSubscriptionSchema
>;

import { z } from "zod";

export const parentSchema = z.object({
  phoneNumber: z.string().min(1, "Phone number is required"),
  name: z.string().min(1, "Parent name is required"),
  sex: z.enum(["Male", "Female"]),
  address: z.string().min(1, "Address is required"),
  nationality: z.string().min(1, "Nationality is required"),
  relation: z
    .enum(["Father", "Mother", "Guardian", "Other"])
    .default("Guardian"),
  isPrimary: z.boolean().default(true),
});

const baseStudentSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().min(1, "Middle name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  startingGrade: z.coerce.number().min(1, "Starting grade is required"),
  enrollmentDate: z.string().min(1, "Enrollment date is required"),
  admissionDate: z.string().min(1, "Admission date is required"),
  sex: z.enum(["Male", "Female"]),
  address: z.string().min(1, "Address is required"),
  nationality: z.string().min(1, "Nationality is required"),
  previousSchool: z.string().optional(),
  languagePreference: z.string().optional(),
  phone: z.string().optional(),
});

export const studentSchema = baseStudentSchema.extend({
  parents: z.array(parentSchema).optional(),
});

export type StudentFormValues = z.infer<typeof studentSchema>;
export type ParentFormValues = z.infer<typeof parentSchema>;

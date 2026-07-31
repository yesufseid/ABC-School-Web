import type { ReactNode } from "react";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { StudentInfoFieldsProps } from "../types";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

export function StudentInfoFields({ control, errors }: StudentInfoFieldsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Controller
        control={control}
        name="firstName"
        render={({ field }) => (
          <Field label="First Name" error={errors.firstName?.message}>
            <Input
              placeholder="e.g. Abebe"
              aria-invalid={!!errors.firstName}
              {...field}
            />
          </Field>
        )}
      />

      <Controller
        control={control}
        name="middleName"
        render={({ field }) => (
          <Field label="Middle Name" error={errors.middleName?.message}>
            <Input
              placeholder="e.g. Kebede"
              aria-invalid={!!errors.middleName}
              {...field}
            />
          </Field>
        )}
      />

      <Controller
        control={control}
        name="lastName"
        render={({ field }) => (
          <Field label="Last Name" error={errors.lastName?.message}>
            <Input
              placeholder="e.g. Lemma"
              aria-invalid={!!errors.lastName}
              {...field}
            />
          </Field>
        )}
      />

      <Controller
        control={control}
        name="dateOfBirth"
        render={({ field }) => (
          <Field label="Date of Birth" error={errors.dateOfBirth?.message}>
            <Input
              type="date"
              aria-invalid={!!errors.dateOfBirth}
              {...field}
            />
          </Field>
        )}
      />

      <Controller
        control={control}
        name="sex"
        render={({ field }) => (
          <Field label="Sex" error={errors.sex?.message}>
            <Select aria-invalid={!!errors.sex} {...field}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </Select>
          </Field>
        )}
      />

      <Controller
        control={control}
        name="startingGrade"
        render={({ field }) => (
          <Field label="Starting Grade" error={errors.startingGrade?.message}>
            <Select aria-invalid={!!errors.startingGrade} {...field}>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((grade) => (
                <option key={grade} value={grade}>
                  Grade {grade}
                </option>
              ))}
            </Select>
          </Field>
        )}
      />

      <Controller
        control={control}
        name="enrollmentDate"
        render={({ field }) => (
          <Field label="Enrollment Date" error={errors.enrollmentDate?.message}>
            <Input
              type="date"
              aria-invalid={!!errors.enrollmentDate}
              {...field}
            />
          </Field>
        )}
      />

      <Controller
        control={control}
        name="admissionDate"
        render={({ field }) => (
          <Field label="Admission Date" error={errors.admissionDate?.message}>
            <Input
              type="date"
              aria-invalid={!!errors.admissionDate}
              {...field}
            />
          </Field>
        )}
      />

      <Controller
        control={control}
        name="address"
        render={({ field }) => (
          <Field label="Address" error={errors.address?.message}>
            <Input
              placeholder="e.g. Addis Ababa"
              aria-invalid={!!errors.address}
              {...field}
            />
          </Field>
        )}
      />

      <Controller
        control={control}
        name="nationality"
        render={({ field }) => (
          <Field label="Nationality" error={errors.nationality?.message}>
            <Input
              placeholder="e.g. Ethiopian"
              aria-invalid={!!errors.nationality}
              {...field}
            />
          </Field>
        )}
      />

      <Controller
        control={control}
        name="previousSchool"
        render={({ field }) => (
          <Field label="Previous School (optional)">
            <Input placeholder="e.g. Sunshine Elementary" {...field} />
          </Field>
        )}
      />

      <Controller
        control={control}
        name="languagePreference"
        render={({ field }) => (
          <Field label="Language Preference (optional)">
            <Select {...field}>
              <option value="English">English</option>
              <option value="Amharic">Amharic</option>
              <option value="Oromo">Oromo</option>
            </Select>
          </Field>
        )}
      />

      <Controller
        control={control}
        name="phone"
        render={({ field }) => (
          <Field label="Phone (optional)">
            <Input type="tel" placeholder="e.g. 0912345678" {...field} />
          </Field>
        )}
      />
    </div>
  );
}

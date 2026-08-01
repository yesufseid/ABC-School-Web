import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { PhoneInput } from "@/components/custom/phone-input";
import type { TeacherInfoFieldsProps } from "../types";

export function TeacherInfoFields({
  control,
  errors,
}: TeacherInfoFieldsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">First Name</label>
        <Controller
          control={control}
          name="firstName"
          render={({ field }) => (
            <Input
              placeholder="e.g. Abebe"
              aria-invalid={!!errors.firstName}
              {...field}
            />
          )}
        />
        {errors.firstName && (
          <p className="text-sm text-destructive">{errors.firstName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Middle Name</label>
        <Controller
          control={control}
          name="middleName"
          render={({ field }) => (
            <Input placeholder="e.g. Kebede" {...field} />
          )}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Last Name</label>
        <Controller
          control={control}
          name="lastName"
          render={({ field }) => (
            <Input
              placeholder="e.g. Lemma"
              aria-invalid={!!errors.lastName}
              {...field}
            />
          )}
        />
        {errors.lastName && (
          <p className="text-sm text-destructive">{errors.lastName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Phone</label>
        <Controller
          control={control}
          name="phone"
          render={({ field }) => (
            <PhoneInput
              placeholder="e.g. +251911223344"
              aria-invalid={!!errors.phone}
              {...field}
            />
          )}
        />
        {errors.phone && (
          <p className="text-sm text-destructive">{errors.phone.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Email</label>
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <Input
              type="email"
              placeholder="e.g. abebe@school.com"
              {...field}
            />
          )}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Sex</label>
        <Controller
          control={control}
          name="sex"
          render={({ field }) => (
            <Select {...field}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </Select>
          )}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Address</label>
        <Controller
          control={control}
          name="address"
          render={({ field }) => (
            <Input
              placeholder="e.g. Bole Subcity, Addis Ababa"
              aria-invalid={!!errors.address}
              {...field}
            />
          )}
        />
        {errors.address && (
          <p className="text-sm text-destructive">{errors.address.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Starting Date
        </label>
        <Controller
          control={control}
          name="startingDate"
          render={({ field }) => (
            <Input
              type="date"
              aria-invalid={!!errors.startingDate}
              {...field}
            />
          )}
        />
        {errors.startingDate && (
          <p className="text-sm text-destructive">
            {errors.startingDate.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Weekly Periods
        </label>
        <Controller
          control={control}
          name="weeklyPeriods"
          render={({ field }) => (
            <Input
              type="number"
              min={1}
              placeholder="e.g. 24"
              aria-invalid={!!errors.weeklyPeriods}
              {...field}
            />
          )}
        />
        {errors.weeklyPeriods && (
          <p className="text-sm text-destructive">
            {errors.weeklyPeriods.message}
          </p>
        )}
      </div>
    </div>
  );
}

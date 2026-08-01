import type { UserRole } from "@/features/auth/types/user.types";

export const ALL_ROLES: readonly UserRole[] = [
  "Admin",
  "Owner",
  "Principal",
  "VicePrincipal",
  "Registrar",
  "HR",
  "Counselor",
  "Staff",
  "Parent",
  "Teacher",
  "Student",
];

export const ROUTE_ACCESS: Record<string, readonly UserRole[]> = {
  "/": ALL_ROLES,
  "/students": ["Owner", "Registrar", "Teacher"],
  "/parents": ["Owner", "Principal", "Registrar"],
  "/teachers": ["Owner", "Registrar", "Teacher"],
  "/principals": ["Owner", "Principal"],
  "/materials": ["Owner", "Principal", "Teacher", "Student"],
  "/schedules": ["Owner", "Registrar", "Teacher"],
  "/academics": ["Owner", "Principal", "VicePrincipal", "Teacher"],
  "/attendance": [
    "Owner",
    "Principal",
    "VicePrincipal",
    "Registrar",
    "Teacher",
    "HR",
  ],
  "/classes": ["Owner", "Principal", "VicePrincipal", "Registrar", "Teacher"],
  "/messages": [
    "Owner",
    "Principal",
    "VicePrincipal",
    "Registrar",
    "Teacher",
    "Student",
    "Staff",
  ],
  "/schools": ["Admin"],
  "/subscriptions": ["Admin"],
};

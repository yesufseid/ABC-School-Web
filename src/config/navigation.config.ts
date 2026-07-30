import {
  LayoutDashboardIcon,
  GraduationCapIcon,
  UsersIcon,
  UserCircleIcon,
  ShieldIcon,
  BookOpenIcon,
  CalendarIcon,
  LibraryIcon,
  ClipboardCheckIcon,
  SchoolIcon,
  MessageSquareIcon,
} from "lucide-react";
import type { UserRole } from "@/features/auth/types/user.types";

export type NavItem = {
  label: string;
  to: string;
  icon: typeof LayoutDashboardIcon;
  roles: readonly UserRole[];
  end?: boolean;
};

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    to: "/",
    icon: LayoutDashboardIcon,
    roles: ["Admin", "Owner", "Principal", "Teacher", "Student"],
    end: true,
  },
  {
    label: "Students",
    to: "/students",
    icon: GraduationCapIcon,
    roles: ["Admin", "Owner", "Principal", "Teacher"],
  },
  {
    label: "Parents",
    to: "/parents",
    icon: UsersIcon,
    roles: ["Admin", "Owner", "Principal"],
  },
  {
    label: "Teachers",
    to: "/teachers",
    icon: UserCircleIcon,
    roles: ["Admin", "Owner", "Principal"],
  },
  {
    label: "Principals",
    to: "/principals",
    icon: ShieldIcon,
    roles: ["Admin", "Owner"],
  },
  {
    label: "Materials",
    to: "/materials",
    icon: BookOpenIcon,
    roles: ["Admin", "Owner", "Principal", "Teacher", "Student"],
  },
  {
    label: "Schedules",
    to: "/schedules",
    icon: CalendarIcon,
    roles: ["Admin", "Owner", "Principal", "Teacher", "Student"],
  },
  {
    label: "Academics",
    to: "/academics",
    icon: LibraryIcon,
    roles: ["Admin", "Owner", "Principal", "Teacher", "Student"],
  },
  {
    label: "Attendance",
    to: "/attendance",
    icon: ClipboardCheckIcon,
    roles: ["Admin", "Owner", "Principal", "Teacher"],
  },
  {
    label: "Classes",
    to: "/classes",
    icon: SchoolIcon,
    roles: ["Admin", "Owner", "Principal", "Teacher"],
  },
  {
    label: "Messages",
    to: "/messages",
    icon: MessageSquareIcon,
    roles: ["Admin", "Owner", "Principal", "Teacher", "Student"],
  },
];

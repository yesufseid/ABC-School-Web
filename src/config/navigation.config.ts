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
  Building2Icon,
  CreditCardIcon,
} from "lucide-react";
import { ROUTE_ACCESS } from "@/config/route-access.config";
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
    roles: ROUTE_ACCESS["/"],
    end: true,
  },
  {
    label: "Students",
    to: "/students",
    icon: GraduationCapIcon,
    roles: ROUTE_ACCESS["/students"],
  },
  {
    label: "Parents",
    to: "/parents",
    icon: UsersIcon,
    roles: ROUTE_ACCESS["/parents"],
  },
  {
    label: "Teachers",
    to: "/teachers",
    icon: UserCircleIcon,
    roles: ROUTE_ACCESS["/teachers"],
  },
  {
    label: "Principals",
    to: "/principals",
    icon: ShieldIcon,
    roles: ROUTE_ACCESS["/principals"],
  },
  {
    label: "Materials",
    to: "/materials",
    icon: BookOpenIcon,
    roles: ROUTE_ACCESS["/materials"],
  },
  {
    label: "Schedules",
    to: "/schedules",
    icon: CalendarIcon,
    roles: ROUTE_ACCESS["/schedules"],
  },
  {
    label: "Academics",
    to: "/academics",
    icon: LibraryIcon,
    roles: ROUTE_ACCESS["/academics"],
  },
  {
    label: "Attendance",
    to: "/attendance",
    icon: ClipboardCheckIcon,
    roles: ROUTE_ACCESS["/attendance"],
  },
  {
    label: "Classes",
    to: "/classes",
    icon: SchoolIcon,
    roles: ROUTE_ACCESS["/classes"],
  },
  {
    label: "Messages",
    to: "/messages",
    icon: MessageSquareIcon,
    roles: ROUTE_ACCESS["/messages"],
  },
  {
    label: "Schools",
    to: "/schools",
    icon: Building2Icon,
    roles: ROUTE_ACCESS["/schools"],
  },
  {
    label: "Subscriptions",
    to: "/subscriptions",
    icon: CreditCardIcon,
    roles: ROUTE_ACCESS["/subscriptions"],
  },
];

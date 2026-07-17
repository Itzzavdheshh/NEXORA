import {
  Bell,
  CalendarClock,
  Gauge,
  LayoutDashboard,
  ShieldCheck,
  SlidersHorizontal,
  UserRound,
  UsersRound,
  Compass,
} from "lucide-react";

export const mainNavigation = {
  student: [
    { label: "Dashboard", path: "/student/dashboard", icon: LayoutDashboard },
    { label: "Explore Mentors", path: "/student/explore", icon: Compass },
    { label: "Profile", path: "/student/profile", icon: UserRound },
    { label: "Bookings", path: "/student/bookings", icon: CalendarClock },
    { label: "Notifications", path: "/student/notifications", icon: Bell },
  ],
  mentor: [
    { label: "Dashboard", path: "/mentor/dashboard", icon: Gauge },
    { label: "Availability", path: "/mentor/availability", icon: SlidersHorizontal },
    { label: "Bookings", path: "/mentor/bookings", icon: CalendarClock },
    { label: "Profile", path: "/mentor/profile", icon: UserRound },
    { label: "Notifications", path: "/mentor/notifications", icon: Bell },
  ],
  admin: [
    { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Verify Mentors", path: "/admin/verify-mentors", icon: ShieldCheck },
    { label: "Notifications", path: "/admin/notifications", icon: Bell },
    { label: "Users", path: "/admin/users", icon: UsersRound },
  ],
};

export const sharedNavigation = [
  { label: "Settings", path: "/settings", icon: SlidersHorizontal },
];

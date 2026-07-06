export const APP_NAME = import.meta.env.VITE_APP_NAME || "Nexora";

export const USER_ROLES = {
  STUDENT: "student",
  MENTOR: "mentor",
  ADMIN: "admin",
};

export const DEFAULT_AUTH_REDIRECT = "/login";

export const ROLE_HOME = {
  [USER_ROLES.STUDENT]: "/student/dashboard",
  [USER_ROLES.MENTOR]: "/mentor/dashboard",
  [USER_ROLES.ADMIN]: "/admin/dashboard",
};

import { UserRoles } from "@/enums";
import { User } from "./auth";

type Role = keyof typeof ROLES;
type Permission = (typeof ROLES)[Role][number];

const ROLES = {
  [UserRoles.Administrator]: ["view:dashboard"],
  [UserRoles.User]: [],
} as const;

export function hasPermission(user: User, permission: Permission): boolean {
  const role = user.role as UserRoles;

  return (ROLES[role] as readonly Permission[]).includes(permission);
}

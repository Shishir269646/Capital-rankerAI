// src/lib/auth/permissions.ts

import { User } from '@/types/auth.types';

export enum UserRole {
  ADMIN = 'admin',
  INVESTOR = 'investor',
  ANALYST = 'analyst',
}

/**
 * Checks if a user has a specific role.
 * @param user The user object.
 * @param role The role to check against.
 * @returns {boolean} True if the user has the role, false otherwise.
 */
export const hasRole = (user: User | null | undefined, role: UserRole): boolean => {
  return user?.role === role;
};

/**
 * Checks if a user has at least one of the specified roles.
 * @param user The user object.
 * @param roles An array of roles to check against.
 * @returns {boolean} True if the user has any of the roles, false otherwise.
 */
export const hasAnyRole = (user: User | null | undefined, roles: UserRole[]): boolean => {
  return user ? roles.includes(user.role as UserRole) : false;
};

/**
 * Checks if a user can perform an action based on their role.
 * This is a simplified example; real-world scenarios might involve more granular permissions.
 * @param user The user object.
 * @param requiredRoles The roles required to perform the action.
 * @returns {boolean} True if the user has the necessary permissions, false otherwise.
 */
export const canAccess = (user: User | null | undefined, requiredRoles: UserRole[]): boolean => {
  if (!user) return false;
  return requiredRoles.includes(user.role as UserRole);
};

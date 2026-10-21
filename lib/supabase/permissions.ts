import type { UserRole } from "./types";

/**
 * Role Permission Matrix for R.P. MEMORIAL PUBLIC SCHOOL
 */
export const ROLE_PERMISSIONS = {
  admin: {
    canAccessAdmin: true,
    canManageUsers: true,
    canPromoteToAdmin: true,
    canDeactivateUsers: true,
    canEditSchoolProfile: true,
    canViewAuditLogs: true,
    canManageRelationships: true,
    canManageAcademicStructure: true,
  },
  principal: {
    canAccessAdmin: true,
    canManageUsers: true,
    canPromoteToAdmin: false, // Strict: Principal cannot promote or create another admin
    canDeactivateUsers: true,
    canEditSchoolProfile: false, // School profile requires admin authorization
    canViewAuditLogs: true,
    canManageRelationships: true,
    canManageAcademicStructure: true,
  },
  teacher: {
    canAccessAdmin: false,
    canManageUsers: false,
    canPromoteToAdmin: false,
    canDeactivateUsers: false,
    canEditSchoolProfile: false,
    canViewAuditLogs: false,
    canManageRelationships: false,
    canManageAcademicStructure: false,
  },
  staff: {
    canAccessAdmin: false,
    canManageUsers: false,
    canPromoteToAdmin: false,
    canDeactivateUsers: false,
    canEditSchoolProfile: false,
    canViewAuditLogs: false,
    canManageRelationships: false,
    canManageAcademicStructure: false,
  },
  student: {
    canAccessAdmin: false,
    canManageUsers: false,
    canPromoteToAdmin: false,
    canDeactivateUsers: false,
    canEditSchoolProfile: false,
    canViewAuditLogs: false,
    canManageRelationships: false,
    canManageAcademicStructure: false,
  },
  parent: {
    canAccessAdmin: false,
    canManageUsers: false,
    canPromoteToAdmin: false,
    canDeactivateUsers: false,
    canEditSchoolProfile: false,
    canViewAuditLogs: false,
    canManageRelationships: false,
    canManageAcademicStructure: false,
  },
  accountant: {
    canAccessAdmin: false,
    canManageUsers: false,
    canPromoteToAdmin: false,
    canDeactivateUsers: false,
    canEditSchoolProfile: false,
    canViewAuditLogs: false,
    canManageRelationships: false,
    canManageAcademicStructure: false,
  },
  librarian: {
    canAccessAdmin: false,
    canManageUsers: false,
    canPromoteToAdmin: false,
    canDeactivateUsers: false,
    canEditSchoolProfile: false,
    canViewAuditLogs: false,
    canManageRelationships: false,
    canManageAcademicStructure: false,
  },
  transport_manager: {
    canAccessAdmin: false,
    canManageUsers: false,
    canPromoteToAdmin: false,
    canDeactivateUsers: false,
    canEditSchoolProfile: false,
    canViewAuditLogs: false,
    canManageRelationships: false,
    canManageAcademicStructure: false,
  },
} as const;

export function canAccessAdmin(role?: string | null): boolean {
  if (!role) return false;
  return role === "admin" || role === "principal";
}

export function canManageAdmins(role?: string | null): boolean {
  return role === "admin";
}

export function canEditSchoolProfile(role?: string | null): boolean {
  return role === "admin";
}

export function canManageAcademicStructure(role?: string | null): boolean {
  if (!role) return false;
  return role === "admin" || role === "principal";
}

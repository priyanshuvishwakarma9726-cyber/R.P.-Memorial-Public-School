-- =====================================================================
-- Migration: 20261012_01_user_integrity_constraints.sql
-- Description: ADMIN-03 User Integrity Constraints & Partial Unique Indexes
-- R.P. Memorial Public School (CBSE Affiliated • Code 2134039)
-- =====================================================================

-- 1. TEACHER EMPLOYEE CODE UNIQUENESS (School-scoped, case-insensitive, non-empty)
-- Guarantees that within any given school, no two teachers can share the same employee code.
-- Ignores NULL or whitespace-only values during initial onboarding.
CREATE UNIQUE INDEX IF NOT EXISTS idx_teachers_school_employee_code_unique
ON public.teachers(school_id, LOWER(TRIM(employee_code)))
WHERE (employee_code IS NOT NULL AND TRIM(employee_code) <> '');

-- 2. PROFILE EMAIL UNIQUENESS (Case-insensitive, table-level enforcement)
-- Guarantees that at the PostgreSQL table level, no two profiles can have conflicting normalized emails.
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_email_unique
ON public.profiles(LOWER(TRIM(email)));

-- 3. ONE PRIMARY PARENT PER STUDENT (Partial unique index where is_primary = true)
-- Guarantees that a student can have at most one parent designated as primary contact.
CREATE UNIQUE INDEX IF NOT EXISTS idx_student_parents_one_primary
ON public.student_parents(student_id)
WHERE (is_primary = true);

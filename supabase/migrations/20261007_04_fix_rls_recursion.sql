-- =====================================================================
-- R.P. MEMORIAL PUBLIC SCHOOL — RLS RECURSION RESOLUTION PATCH
-- Migration: 20261007_04_fix_rls_recursion.sql
-- Fixes PostgreSQL Error 42P17 (infinite recursion between students and student_parents)
-- using SECURITY DEFINER helper functions.
-- =====================================================================

-- 1. SECURITY DEFINER HELPERS (Bypass mutual RLS evaluation)

CREATE OR REPLACE FUNCTION public.is_parent_of_student(p_student_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.student_parents sp
        JOIN public.parents p ON p.id = sp.parent_id
        WHERE sp.student_id = p_student_id
          AND p.profile_id = auth.uid()
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.is_student_user(p_student_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.students s
        WHERE s.id = p_student_id
          AND s.profile_id = auth.uid()
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.is_parent_user(p_parent_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.parents p
        WHERE p.id = p_parent_id
          AND p.profile_id = auth.uid()
    );
END;
$$;

-- 2. RE-APPLY NON-RECURSIVE POLICIES

-- Drop existing circular policies
DROP POLICY IF EXISTS "Students: view own or linked child" ON public.students;
DROP POLICY IF EXISTS "StudentParents: view own linkage" ON public.student_parents;
DROP POLICY IF EXISTS "Enrollments: student or parent read" ON public.enrollments;

-- Non-recursive Students policy
CREATE POLICY "Students: view own or linked child"
ON public.students FOR SELECT
USING (
    profile_id = auth.uid()
    OR public.is_parent_of_student(id)
    OR (
        public.is_school_staff_or_teacher()
        AND school_id = public.current_user_school_id()
    )
);

-- Non-recursive Student-Parents policy
CREATE POLICY "StudentParents: view own linkage"
ON public.student_parents FOR SELECT
USING (
    public.is_student_user(student_id)
    OR public.is_parent_user(parent_id)
    OR public.is_school_staff_or_teacher()
);

-- Non-recursive Enrollments policy
CREATE POLICY "Enrollments: student or parent read"
ON public.enrollments FOR SELECT
USING (
    public.is_student_user(student_id)
    OR public.is_parent_of_student(student_id)
    OR public.is_school_staff_or_teacher()
);

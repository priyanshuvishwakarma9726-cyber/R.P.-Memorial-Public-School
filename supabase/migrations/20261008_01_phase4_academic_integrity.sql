-- =====================================================================
-- Migration: 20261008_01_phase4_academic_integrity.sql
-- Description: Phase 4 Academic Integrity, Unique Constraints & Atomic Switching
-- =====================================================================

-- 1. DATABASE-LEVEL RULE: Maximum one current academic year per school
-- Unique partial index guarantees at DB engine level that no two rows can have is_current = true for the same school.
CREATE UNIQUE INDEX IF NOT EXISTS idx_academic_years_one_current 
ON public.academic_years(school_id) 
WHERE (is_current = true);

-- 2. DATABASE-LEVEL RULE: Case-insensitive unique active section name within same class
-- Prevents duplicate active sections like 'A' and 'a' or multiple 'A's in the same class.
CREATE UNIQUE INDEX IF NOT EXISTS idx_sections_class_name_active_unique 
ON public.sections(class_id, LOWER(name)) 
WHERE (is_active = true);

-- 3. DATABASE-LEVEL RULE: Case-insensitive unique class name per school
CREATE UNIQUE INDEX IF NOT EXISTS idx_classes_school_name_unique 
ON public.classes(school_id, LOWER(name));

-- 4. DATABASE-LEVEL RULE: Unique subject code per school (when code is non-empty)
CREATE UNIQUE INDEX IF NOT EXISTS idx_subjects_school_code_unique 
ON public.subjects(school_id, LOWER(code)) 
WHERE (code IS NOT NULL AND TRIM(code) <> '');

-- 5. DATABASE-LEVEL RULE: Student cannot be enrolled twice in the same academic year
-- If table constraint enrollments_student_id_academic_year_id_key is already present, avoid creating duplicate index.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'enrollments_student_id_academic_year_id_key'
    ) AND NOT EXISTS (
        SELECT 1 FROM pg_indexes WHERE indexname = 'idx_enrollments_student_academic_year'
    ) THEN
        CREATE UNIQUE INDEX idx_enrollments_student_academic_year 
        ON public.enrollments(student_id, academic_year_id);
    END IF;
END $$;

-- 6. ATOMIC CURRENT ACADEMIC YEAR SWITCH FUNCTION
-- Secure function to atomically deactivate current year and activate the requested one
CREATE OR REPLACE FUNCTION public.set_current_academic_year(p_academic_year_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_caller_school_id UUID;
    v_target_school_id UUID;
    v_target_name TEXT;
    v_old_current_id UUID;
    v_old_current_name TEXT;
BEGIN
    -- Authorization check: caller must be active admin or principal
    IF NOT public.is_admin_or_principal() THEN
        RAISE EXCEPTION 'Access denied. Insufficient administrative privileges.';
    END IF;

    v_caller_school_id := public.current_user_school_id();
    IF v_caller_school_id IS NULL THEN
        RAISE EXCEPTION 'Caller is not linked to any valid institutional school.';
    END IF;

    -- Lock target row to prevent concurrent race conditions
    SELECT school_id, name INTO v_target_school_id, v_target_name
    FROM public.academic_years
    WHERE id = p_academic_year_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Academic year not found.';
    END IF;

    -- Tenant isolation: target must belong to caller school
    IF v_target_school_id <> v_caller_school_id THEN
        RAISE EXCEPTION 'Cross-school academic modification denied.';
    END IF;

    -- Identify existing current academic year
    SELECT id, name INTO v_old_current_id, v_old_current_name
    FROM public.academic_years
    WHERE school_id = v_caller_school_id AND is_current = true AND id <> p_academic_year_id
    FOR UPDATE;

    -- Atomically reset existing current year(s)
    UPDATE public.academic_years
    SET is_current = false, updated_at = now()
    WHERE school_id = v_caller_school_id AND is_current = true;

    -- Set target year as current
    UPDATE public.academic_years
    SET is_current = true, updated_at = now()
    WHERE id = p_academic_year_id;

    RETURN jsonb_build_object(
        'success', true,
        'academic_year_id', p_academic_year_id,
        'name', v_target_name,
        'previous_current_id', v_old_current_id,
        'previous_current_name', v_old_current_name
    );
END;
$$;

-- Secure grants for atomic switch function
REVOKE EXECUTE ON FUNCTION public.set_current_academic_year(UUID) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.set_current_academic_year(UUID) FROM anon;
GRANT EXECUTE ON FUNCTION public.set_current_academic_year(UUID) TO authenticated;

-- 7. ENHANCED TENANT ISOLATION ON ENROLLMENTS RLS
DROP POLICY IF EXISTS "Enrollments: admin manage" ON public.enrollments;
CREATE POLICY "Enrollments: admin manage" ON public.enrollments FOR ALL USING (
    public.is_admin_or_principal() AND (
        EXISTS (
            SELECT 1 FROM public.classes c
            WHERE c.id = enrollments.class_id AND c.school_id = public.current_user_school_id()
        )
    )
);
